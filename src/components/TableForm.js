
import React, { useState } from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import NewTable from '../pages/Tables.js';
import Button from 'react-bootstrap/Button';
import { Form, Checkbox, Modal, Col, Row ,Card} from 'react-bootstrap';
import LogGroupNameGetter from './LogGroupNameGetter.js';
import LogTableForm from './LogTableForm.js';
import LogEventsGetter from './LogEventsGetter';



AWS.config.update({ secretAccessKey: mykey.secretAccessKey, accessKeyId: mykey.accessKeyId, region: mykey.region });
var cloudwatchlogs = new AWS.CloudWatchLogs();
var currentDate = new Date();

class TableForm extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

      //Passed to LogGroupNameGetter to get the name of the log groups
      params: {
        limit: '50'
      },

      filterLogParams: {
        logGroupName: 'App1', /* required */
        filterPattern: 'error',
        limit: 1000
      },

      timer: "",
      temp: [],
      dataTemp: [],

      recordArray: [

      ],

      filterd: [],

      value: 'Coconut'

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  shouldComponentUpdate(instance, nextProps, nextState) {


    console.log(nextProps.dataTemp)
    console.log(this.state.dataTemp)

    return false
  }


  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }




  LogGroupNameCallback = (dataFromChild) => {
    // [...we will use the dataFromChild here...]

    console.log(dataFromChild)
    console.log(this.state.dataTemp);

    var allItems = JSON.parse(JSON.stringify(dataFromChild));
    console.log(allItems)
    this.setState({ dataTemp: allItems });
  };

  LogEventsGetterCallBack = (dataFromLogEventGetter) => {

    console.log(dataFromLogEventGetter)

  };


  render() {

    return (

      <div>
      
        <LogGroupNameGetter params={this.state.params}
          callBackFromParent={this.LogGroupNameCallback}
        />

        <LogEventsGetter filterLogParams = {this.state.filterLogParams} 
                          LogEventsCallBack = {this.LogEventsGetterCallBack}/>

        <button onClick={this.state.test}>Click me to test</button>


      </div>


    );
  }

}



export default TableForm;


 // params :{
      //     limit: '50',

      // },
      // queryparams : {
      //   endTime: 1574985600,
      //   queryString: "fields @timestamp, @message | filter @message like /(?i)error/",
      //   startTime: 1574812800 ,
      //   limit:1000,
      // logGroupNames:props.loggroupnames
      // },
      // params_Query:{
      //   queryId:props.queryId
      // },



      //helper: this.helper.bind(this),
      //setIds: this.setIds.bind(this),
      //getID: this.getID.bind(this),
      //stopQuery: this.stopQuery.bind(this),
      //idArray:[],

/*--------------------------- */
      //getResults: this.getResults.bind(this),
      //setQueryResults: this.setQueryResults.bind(this),
      //resultHelper: this.resultHelper.bind(this),
      //arr:[],




      //getLogGroupName =  () => {

        //   cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
        //           if (err) console.log(err, err.stack); // an error occurred
        //           else  {
        //                 //console.log(data);
        //                 this.setState({temp : data.logGroups});


        //                 for (var i = 0; i < this.state.temp.length; i++) {

        //                     this.setState(prevState => ({
        //                       dataTemp : [...prevState.dataTemp, this.state.temp[i].logGroupName],
        //                       recordArray : [...prevState.recordArray, {logGroupName : this.state.temp[i].logGroupName}]
        //                     }));
        //                 }
        //                   console.log(this.state.dataTemp);

        //                   console.log(this.state.recordArray);

        //                     this.setState({
        //                       queryparams: {
        //                           logGroupNames: this.state.dataTemp,
        //                           queryString:this.state.queryparams.queryString,
        //                           endTime:this.state.queryparams.endTime,
        //                           startTime:this.state.queryparams.startTime
        //                     }

        //                   })


        //                 };
        //   }.bind(this));


        // };




// //Filter log Events function searches for a specific pattern in a log logStream
// //That belongs to a required and specific log group name

// filterLog = (name) => {

//   return new Promise((resolve, reject) => {

//   var params = {
//    logGroupName: name, /* required */
//    filterPattern: 'error',
//    limit: 1000
//   };
//   cloudwatchlogs.filterLogEvents(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else{

//       console.log(data)
//       return resolve(data) 

//     }    
//               // successful response
//   });

// })

// }





// test = () =>{

//   let count = 0

// this.state.recordArray.forEach(element => {

// setTimeout(async() => {

// //Filter log groups with filter pattern api
//   let resultArray = await this.state.filterLog(element.logGroupName)

//   this.setState(prevState => ({
//     filterd : [...prevState.filterd , resultArray]}));

//   console.log(this.state.filterd)

//   this.setState(prevState => ({
//     recordArray : [...prevState.recordArray, { numberOfRecordsFound : resultArray.events.length
//       }]
//     }));
//   console.log(this.state.recordArray)

//     },count * 300);

//   count++   
// }

// );


// }//End of Test




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




//   console.log(this.state.dataTemp)
//   const recordItems = this.state.recordArray.map((i) =>{
//     return ( <div>
//       {i.numberOfRecordsFound}
//       </div>)
//  });
//  const scannedLogStreamsItems = this.state.recordArray.map((i) =>{
// //   console.log(i.scannedLogStreams)
//   return ( <div>
//     {i}
//     </div>)
// });





// helper = () => {
//     let count = 0

//     this.state.dataTemp.forEach(element => {
//         setTimeout(async() => {
//           let temp = await this.state.getID(element)

//           await this.state.setIds(temp.queryId)
//           this.state.stopQuery(temp.queryId)


//           let res = await this.getResults(temp.queryId);
//           console.log(res)
//           await this.state.setQueryResults(res)

//         },count * 250);


//         count++
//       }
//     );

//     return count;
// }

// resultHelper = (num) => {
//   let count = 0
//   let tempResult = []
//   num.forEach( element => {
//     setTimeout(async() => {
//       tempResult = await this.state.getResults(element)

//     },count * 350);

//     count++
//   });

//   return count;
// }

// getResults = (queryIdNum) => {
//   return new Promise((resolve, reject) => {
//     var queryid = {
//        queryId:queryIdNum
//     };

//     cloudwatchlogs.getQueryResults(queryid, function(err, data) {
//       if (err){
//         console.log(err, err.stack); // an error occurred
//         return reject(err)
//       }else{
//         return resolve(data)       // successful response
//         }
//     });

//   })

// }

// setQueryResults (queryRes){
//   this.setState(prevState => ({
//     arr: [...prevState.arr, queryRes]
//   }))
// }

// getResults = (queryIdNum) => {
//   return new Promise((resolve, reject) => {
//     var queryid = {
//        queryId:queryIdNum
//     };

//     cloudwatchlogs.getQueryResults(queryid, function(err, data) {
//       if (err){
//         console.log(err, err.stack); // an error occurred
//         return reject(err)
//       }else{
//         return resolve(data)       // successful response
//         }
//     });

//   })

// }

// setQueryResults (queryRes){
//   this.setState(prevState => ({
//     arr: [...prevState.arr, queryRes]
//   }))

// }
// setIds(id){
//   this.setState(prevState => ({
//     idArray: [...prevState.idArray, id]
//   }))
// }
// getID = (name) => {
//   return new Promise((resolve, reject) => {
//     var params = {
//       endTime: Math.round((new Date()).getTime() / 1000), /* required */
//       queryString: "fields @timeStamp, @message | filter @message like /(?i)error/", /* required /*/
//       startTime: Math.round((new Date('2019-10-20')).getTime() / 1000), /* required */
//       limit: 1000,
//       logGroupName: name
//     };

//     cloudwatchlogs.startQuery(params, function(err, data) {
//       if (err){
//         console.log(err, err.stack); // an error occurred
//       }else{
//         return resolve(data)       // successful response
//         }
//     });

//   })
// }

// stopQuery = (id) => {
//   return new Promise((resolve, reject) => {
//     var params = {
//       queryId: id /* required */
//     };

//     cloudwatchlogs.stopQuery(params, function(err, data) {
//       if (err){
//          console.log(err, err.stack); // an error occurred
//       }else {
//         resolve("stopped") // successful response
//       }
//     })
//   })
// }






//----------------- If Else statement for state updatate ---------------------//


// if(this.state.filterd.events.length > 0){

//   this.setState(prevState => ({

//     recordArray : [...prevState.recordArray , 
//                  { numberOfRecordsFound : [...prevState.numberOfRecordsFound , this.state.filterd.events.length ]}
//                   //  scannedLogStreams : this.state.filterd.searchedLogStreams.logStreamName

//     ]
//       }));
//   // this.setState(prevState => ({

//   //   tempNumberOfRecordsArray : [...prevState.tempNumberOfRecordsArray , this.state.filterd.events.length ]

//   //     }));


// // for (var i = 0 ; i < this.state.filterd.searchedLogStreams.length ; i++) {
// //         this.setState(prevState => ({

// //     recordArray : [...prevState.recordArray , 

// //       {scannedLogStreams : this.state.filterd.searchedLogStreams[i].logStreamName}]

// //       }));

// // }

// for (var i = 0 ; i < this.state.filterd.searchedLogStreams.length ; i++) {
//   this.setState(prevState => ({

//       tempScannedLogStreamsArray: [...prevState.tempScannedLogStreamsArray , this.state.filterd.searchedLogStreams[i].logStreamName]

//   }));



// }



// }
// else {
// this.setState(prevState => ({

//   recordArray : [...prevState.recordArray , 
//                  {numberOfRecordsFound :[ ...prevState.numberOfRecordsFound , this.state.filterd.events.length ], 
//                   recordMessage : "No Result found"}]
//                  // scannedLogStreams : this.state.filterd.searchedLogStreams.logStreamName}]

// }));


// for (var i = 0 ; i < this.state.filterd.searchedLogStreams.length ; i++) {
//     this.setState(prevState => ({

//         tempScannedLogStreamsArray: [...prevState.tempScannedLogStreamsArray , this.state.filterd.searchedLogStreams[i].logStreamName]

//   }));

// }


//}