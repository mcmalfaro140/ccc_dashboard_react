import React, {useState, createContext, useEffect} from 'react';
import AWS from 'aws-sdk';
import mykey from '../../keys.json';

export const LogContext = createContext({});

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();
var ec2 = new AWS.EC2();

const SystemHealthContext = (props) => {
    const [LogGroupNames , setLogGroupNames] = useState([])
    const [LogReportError , setLogReportError] = useState([])
    const [LogReportWarn , setLogReportWarn] = useState([])
    const [ErrorResultCount , setErrorResultCount] = useState(0)
    const [WarnResultCount , setWarnResultCount] = useState(0)
    const [EC2InstanceStatus , setEC2InstanceStatus] = useState([])
    const [EC2InstanceTags , setEC2InstanceTags] = useState([])
    const [EC2InstanceStatusAlert , setEC2InstanceStatusAlert] = useState(0)

const getLogGroupName = () => {
    var params = {
        limit : '50'
    };

    cloudwatchlogs.describeLogGroups(params, function(err, data) {
        if (err){
            console.log(err, err.stack); // an error occurred
        }else  {
            let temp = data.logGroups;
            //Get all the log group names and set it to the state
            setLogGroupNames(
                temp.map((LogGroupName) => (
                      LogGroupName.logGroupName
            )))

       
                temp.map((LogGroupName , index) => (
                    setTimeout(() => {
                        searchByLogGroupName(LogGroupName.logGroupName , 'ERROR')
                        searchByLogGroupName(LogGroupName.logGroupName , 'WARN')
                    },1000 * index)
                ))        
        }
    })

 
}

//Funtion to search on a specific log group name base on the keyword input by the user
const searchByLogGroupName =  (logName , filterPattern) => {
    let my_time = new Date();
    my_time.setDate(my_time.getDate() - 1)
    var params = {
        logGroupName: logName, /* required */
        endTime: new Date().getTime() ,
        filterPattern: filterPattern, 
        startTime: my_time.getTime()
    }  
     cloudwatchlogs.filterLogEvents(params, function(err, data) {
            if(err){
                console.log(err, err.stack); // an error occurred
            }else{ 
                // console.log(data)
                //Checks for error logs in the log group name
                if(data.events.length > 0 && filterPattern === 'ERROR'){

                    setErrorResultCount ( prevCount => 
                        prevCount + data.events.length
                    )                
                    setLogReportError(prevState => 
                        [
                            ...prevState , 
                            { [logName] : data.events }
                        ]
                     )
                } 
                //checks for warning logs in the log group name
                else if (data.events.length > 0 && filterPattern === 'WARN') {
                    
                    setWarnResultCount(prevCount => 
                            prevCount + data.events.length
                        )
                        setLogReportWarn(prevState => 
                            [
                                ...prevState , 
                                { [logName] : data.events }
                            ]
                            )
                }              
            }  
        });
  }

 const getEC2InstanceStatus =  ()  => {
    var params = {
 
        
       IncludeAllInstances: true
      
      };

    
      ec2.describeInstanceStatus(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
        let id = []

        data.InstanceStatuses.forEach(element => {
            
            id.push(element.InstanceId)
            
        });
        id.forEach(element => {

            const tagParams = {
          
                Filters :[    {
                   Name: "resource-id", 
                   Values: [
                      element
                   ]
               }
             ]
          
             }
   
           ec2.describeTags(tagParams, function(err, dataForTag) {
               if (err) console.log(err, err.stack); // an error occurred
               else {
                setEC2InstanceTags(prevState => [
                    ...prevState , 
                        {
                            id : `${element}` ,
                            tags : dataForTag.Tags
                        }
                        
                ])

               }
               
              });
        });
         
              data.InstanceStatuses.forEach((element) => {

                setEC2InstanceStatus(prevState => 
                    [
                        ...prevState , 
                         {
                              [element.InstanceId] : {
                                "InstanceState" : element.InstanceState.Name,
                                "AvailabilityZone" : element.AvailabilityZone , 
                                "InstanceStatus" : element.InstanceStatus.Status
                             }
                         }
                    ]
                    )
                
                if(element.InstanceStatus.Status !== "ok") {
                    setEC2InstanceStatusAlert(prevState => prevState + 1)
                }
              });
            
                                
        }
      });

    
}


    const timerInterval = () =>{
        setInterval(() => {
            //reseting state before runinning update
            setErrorResultCount ( prevCount => 0)                
            setLogReportError(prevState => [])
            setWarnResultCount(prevCount => 0)
            setLogReportWarn(prevState => [])
            setEC2InstanceStatus(prevState => [])
            //Run update every 2 mins
            getLogGroupName()
            getEC2InstanceStatus()
        },120000)
    }

  useEffect (() => {
    getLogGroupName()
    getEC2InstanceStatus()
    timerInterval()
    },[])
    return(
        <div>
        <LogContext.Provider value = {{ ErrorCount : [ ErrorResultCount, setErrorResultCount],
                                       WarningCount : [ WarnResultCount , setWarnResultCount],
                                      WarningReport: [LogReportWarn , setLogReportWarn], 
                                      ErrorReport : [LogReportError , setLogReportError], 
                                      LogGroups :  [LogGroupNames , setLogGroupNames],
                                     EC2Status : [EC2InstanceStatus , setEC2InstanceStatus],
                                     EC2StatusAlert : [EC2InstanceStatusAlert , setEC2InstanceStatusAlert],
                                     EC2InstanceTag : [EC2InstanceTags , setEC2InstanceTags]
                                     }}>
            {props.children}
        </LogContext.Provider>
        </div>
    );
}


export default SystemHealthContext