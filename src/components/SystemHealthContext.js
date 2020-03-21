import React, {useState, createContext, useEffect} from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';

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
    const [EC2InstanceStatusAlert , setEC2InstanceStatusAlert] = useState(0)


    
const date = new Date();

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
                temp.map((LogGroupName , index) => (
                      LogGroupName.logGroupName
            )))

            temp.map((LogGroupName , index) => (
                searchByLogGroupName(LogGroupName.logGroupName , 'ERROR'),
                searchByLogGroupName(LogGroupName.logGroupName , 'WARN')
                ))
        }
    }.bind(this))


}

//Funtion to search on a specific log group name base on the keyword input by the user
const searchByLogGroupName =  (logName , filterPattern) => {

    var params = {
        logGroupName: logName, /* required */
       // endTime: date.getTime() - 86400,
        filterPattern: filterPattern, 
        //startTime: date.getTime()

    }
  
     cloudwatchlogs.filterLogEvents(params, function(err, data) {
            if(err){
                console.log(err, err.stack); // an error occurred
            }else{ 

                //Checks for error logs in the log group name
                if(data.events.length > 0 && filterPattern === 'ERROR'){

                    setErrorResultCount ( prevCount => 
                        prevCount + data.events.length
                    )                

                    // data.events.forEach(event => {
                    

                    //         // setErrorObject(prevState => ({
                    //         //     ...prevState , 
                    //         //     [logName] : { ...prevState[logName] , 
        
                    //         //         [event.logStreamName] : [  event.message]

                    //         //     }
                    //         // }))

                    //     setErrorObject (prevState => {

                            
                    //     })
                    // });
                                            

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
         
        }.bind(this));
  }

 const getEC2InstanceStatus =  ()  => {
    var params = {
        
       IncludeAllInstances: true,
      
      };
      ec2.describeInstanceStatus(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            
           
              data.InstanceStatuses.forEach((element) => {
                setEC2InstanceStatus(prevState => 
                    [
                        ...prevState , 
                         {
                             [element.InstanceId] : element.InstanceStatus.Status
                         }
                    ]
                    )
                if(element.InstanceStatus.Status !== "ok") {
                    setEC2InstanceStatusAlert(prevState => prevState + 1)
                }
              });
            
                                
        }
      }.bind(this));

}



  useEffect (() => {

     getLogGroupName()
     getEC2InstanceStatus()

    },[])

    return(

        
        <div>

        <LogContext.Provider value = {{ ErrorCount : [ ErrorResultCount, setErrorResultCount],
                                       WarningCount : [ WarnResultCount , setWarnResultCount],
                                      WarningReport: [LogReportWarn , setLogReportWarn], 
                                      ErrorReport : [LogReportError , setLogReportError], 
                                      LogGroups :  [LogGroupNames , setLogGroupNames],
                                     EC2Status : [EC2InstanceStatus , setEC2InstanceStatus],
                                     EC2StatusAlert : [EC2InstanceStatusAlert , setEC2InstanceStatusAlert]
                                     }}>
           
            {props.children}

        </LogContext.Provider>

        </div>
    );
}


export default SystemHealthContext