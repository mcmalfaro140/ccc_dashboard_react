import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import TableForm from './TableForm.js';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();



function LogEventsGetter (props) {


   var logGroupData =  cloudwatchlogs.filterLogEvents(props.filterLogParams, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else{
          props.LogEventsCallBack(data);
           
         
         }    
                   // successful response
       });
      


       return (
           <div>

           </div>
       )
  
};

export default LogEventsGetter;