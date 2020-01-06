
import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import NewTable from './NewTable.js';


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();
var currentDate = new Date();

class TableForm extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      params :{
          limit: '50',

      },
      queryparams : {
        endTime: 1574985600,
        queryString: "fields @timestamp, @message | filter @message like /(?i)error/",
        startTime: 1574812800 ,
        limit:1000,
      logGroupNames:props.logGroupNames
      },
      params_Query:{
        queryId:props.queryId
      },
      //Misael's new variables
      test: this.test.bind(this),
      filterLog:this.filterLog.bind(this),
      helper: this.helper.bind(this),
      setIds: this.setIds.bind(this),
      getID: this.getID.bind(this),
      stopQuery: this.stopQuery.bind(this),
      idArray:[],

      /*--------------------------- */
      getResults: this.getResults.bind(this),
      setQueryResults: this.setQueryResults.bind(this),
      resultHelper: this.resultHelper.bind(this),
      arr:[],

      timer:"",
      temp: [],
      dataTemp: [],
      recordTempArray:[],
      tableData:[{
              loggroupname: [],
              recordsMatched:[],
              recordsScanned:[],
              errorPercentage:[]
          }]

      };
      //constructor calls to get the log group names
      this.getLogGroupName();
    }


getLogGroupName =  () => {

  cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
                //console.log(data);
                this.setState({temp : data.logGroups});


                for (var i = 0; i < this.state.temp.length; i++) {

                    this.setState(prevState => ({
                      dataTemp : [...prevState.dataTemp, this.state.temp[i].logGroupName]
                    }));
                  }
                  console.log(this.state.dataTemp);


                    this.setState({
                      queryparams: {
                          logGroupNames: this.state.dataTemp,
                          queryString:this.state.queryparams.queryString,
                          endTime:this.state.queryparams.endTime,
                          startTime:this.state.queryparams.startTime
                    }})


                };
  }.bind(this));


};



test = () =>{

  let count = 0

//Get four group names and four query setIds
//store them in a varibale to get the results innerWidth
//Getquery results

this.state.dataTemp.forEach(element => {

setTimeout(async() => {

//Filter log groups with filter pattern api
  let filterd = await this.state.filterLog(element)
  console.log(filterd)

   this.setState(prevState => ({
        recordTempArray : [...prevState.recordTempArray, filterd.events.length]
    }));
    console.log(this.state.recordTempArray)

},count * 700);

  count++
}
);



}

//Filter log Events function searches for a specific pattern in a log logStream
//That belongs to a required and specific log group name

filterLog = (name) => {

  return new Promise((resolve, reject) => {

  var params = {
   logGroupName: name, /* required */
   filterPattern: 'error',
   limit: 1000
  };
  cloudwatchlogs.filterLogEvents(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else{

      return resolve(data) 
    
    }    
              // successful response
  });

})

}

helper = () => {
    let count = 0

    this.state.dataTemp.forEach(element => {
        setTimeout(async() => {
          let temp = await this.state.getID(element)

          await this.state.setIds(temp.queryId)
          this.state.stopQuery(temp.queryId)


          let res = await this.getResults(temp.queryId);
          console.log(res)
          await this.state.setQueryResults(res)

        },count * 250);


        count++
      }
    );

    return count;
}

resultHelper = (num) => {
  let count = 0
  let tempResult = []
  num.forEach( element => {
    setTimeout(async() => {
      tempResult = await this.state.getResults(element)

    },count * 350);

    count++
  });

  return count;
}

getResults = (queryIdNum) => {
  return new Promise((resolve, reject) => {
    var queryid = {
       queryId:queryIdNum
    };

    cloudwatchlogs.getQueryResults(queryid, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
        return reject(err)
      }else{
        return resolve(data)       // successful response
        }
    });

  })

}

setQueryResults (queryRes){
  this.setState(prevState => ({
    arr: [...prevState.arr, queryRes]
  }))
}

getResults = (queryIdNum) => {
  return new Promise((resolve, reject) => {
    var queryid = {
       queryId:queryIdNum
    };

    cloudwatchlogs.getQueryResults(queryid, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
        return reject(err)
      }else{
        return resolve(data)       // successful response
        }
    });

  })

}

setQueryResults (queryRes){
  this.setState(prevState => ({
    arr: [...prevState.arr, queryRes]
  }))

}
setIds(id){
  this.setState(prevState => ({
    idArray: [...prevState.idArray, id]
  }))
}
getID = (name) => {
  return new Promise((resolve, reject) => {
    var params = {
      endTime: Math.round((new Date()).getTime() / 1000), /* required */
      queryString: "fields @timeStamp, @message | filter @message like /(?i)error/", /* required /*/
      startTime: Math.round((new Date('2019-10-20')).getTime() / 1000), /* required */
      limit: 1000,
      logGroupName: name
    };

    cloudwatchlogs.startQuery(params, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
      }else{
        return resolve(data)       // successful response
        }
    });

  })
}

stopQuery = (id) => {
  return new Promise((resolve, reject) => {
    var params = {
      queryId: id /* required */
    };

    cloudwatchlogs.stopQuery(params, function(err, data) {
      if (err){
         console.log(err, err.stack); // an error occurred
      }else {
        resolve("stopped") // successful response
      }
    })
  })
}
render () {
    return (
      <div>

            {<NewTable loggroupnames = {this.state.dataTemp}
                        recordsmatched = {this.state.recordTempArray}

            ></NewTable> }

            <button onClick={this.state.test}>Click me to test</button>
      </div>


    );
  }

}

export default TableForm;


// this.state.dataTemp.forEach(element => {
//   if (count === 4){
//     return count;
//   }
//   else{
//     setTimeout(async() => {
//       let temp = await this.state.getID(element)
//
//       await this.state.setIds(temp.queryId)
//
//               console.log("Log group name used for this result is " + element)
//               console.log("id used for this result is " + temp.queryId)
//
//       let res = await this.state.getResults(temp.queryId);
//       console.log(res)
//       await this.state.setQueryResults(res)
//
// //Filter log groups with filter pattern api
//   let filterd = await this.state.filterLog(element)
//   console.log(filterd.message)
//
// },count * 700);
//
//
//     count++
//   }//end of else
//
// }//end of for each
