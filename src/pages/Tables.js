import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import Table from '../components/Table.js';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
AWS.config.logger = console;
var cloudwatchlogs = new AWS.CloudWatchLogs();


class Tables extends React.Component {

  constructor (){
    super();

    this.state = {
      params : {
        logGroupName: 'App1', /* required */
        logStreamName: 'logs-for-ec2app1', /* required */
        endTime: '1568663351444',
        limit: '30',
        startTime: '1551035385'
     },

      temp: [],
      value: "",

      dataTemp: [],

      //Array of objects to hold the data
      tableData:[{
          timeStamp: [],
          level:[],
          logger:[],
          message:[]
      }]
    }
 
  }


componentWillMount(){
      this.getdata();
}
    getdata = () => {

      cloudwatchlogs.getLogEvents(this.state.params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else  {
          // console.log(data);
          this.setState({temp : data.events});
          // console.log(this.state.temp);


      for (var i = 0; i < this.state.temp.length; i++) {

          this.setState(prevState => ({
            dataTemp : [...prevState.dataTemp, this.state.temp[i].message]
          }));
      }

          var timeStampArr =[];
          var levelArr =[];
          var loggerArr =[];
          var messageArr =[];

      for(var i = 0 ; i < this.state.dataTemp.length ; i++){
          var singleSentence = this.state.dataTemp[Math.floor(Math.random()*this.state.dataTemp.length)];
          var splitSentence = singleSentence.split(/(--+)/);
          levelArr.push(splitSentence[0]);
          timeStampArr.push(splitSentence[2]);
          loggerArr.push(splitSentence[4]);
          messageArr.push(splitSentence[6]);

          //Set the tableData with the array values
            this.setState({tableData:[{
                timeStamp:timeStampArr,
                level:levelArr,
                logger:loggerArr,
                message:messageArr
            }]});

      }

        };        // successful response
      }.bind(this));

  }

render() {

  return (

      <Table timeStamp = {this.state.tableData[0].timeStamp}
             level = {this.state.tableData[0].level}
             logger = {this.state.tableData[0].logger}
             message = {this.state.tableData[0].message}/>

  );
  }
}

export default Tables;
