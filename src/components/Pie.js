import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';



AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();
var currentDate = new Date();

class Pie extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            retreivedLogGroupNames : props.logs
        };
        
    }

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

render () {
    return (
      <div>
            {console.log(this.state.retreivedLogGroupNames)}
      </div>


    );
  }

}

export default Pie;

