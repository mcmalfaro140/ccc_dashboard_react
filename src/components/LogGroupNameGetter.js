import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import LogTableForm from './LogTableForm';


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();


function LogGroupNameGetter (props){

 var logs =   cloudwatchlogs.describeLogGroups(props.params, function(err, data) {

                    if (err) console.log(err, err.stack); // an error occurred
                    else  {
                    
                        props.callBackFromParent(data.logGroups)
                };
                return data.logGroups

            });
    return (
            <div>
            </div>
    )
};


export default LogGroupNameGetter;
