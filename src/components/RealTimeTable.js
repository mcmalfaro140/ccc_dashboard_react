import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
AWS.config.logger = console;
var cloudwatchlogs = new AWS.CloudWatchLogs();

function RealTimeTable (props) {
   var queryparams = {
        endTime: props.endtime,
        queryString: props.querystring, 
        startTime: props.starttime , 
        limit:1000,
        logGroupNames :props.loggroupnames 
    }
 

// var namesList = queryparams.logGroupNames.map(function(logGroupName, index){
//         return <li key={ index }>{logGroupName}</li>;
//       });
var queryid = [];

function getQueryId () {

    cloudwatchlogs.startQuery(queryparams, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
            console.log(data);
        }
      
    });
      
};
function getMultipleQueryId () {

  queryparams.logGroupNames.forEach(element => {
            queryparams.logGroupName = element;
            getQueryId();
    });
}
function getQueryRes () {

  
        setTimeout(()=> cloudwatchlogs.getQueryResults(this.state.params_Query, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
            
            console.log(data); 
          }
          },1000));
        
    };


return (
    <div>
        {getQueryId()}
    </div>
    )
}

export default RealTimeTable;