import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Bar,Line,Pie} from 'react-chartjs-2';

/**
 * Renders the preloader
 */


var optionToSkip =  {  
    scales: {
      xAxes: [{
        ticks: {
            maxRotation: 0,
            minRotation: 0,
           fontSize: 10
      },
      gridLines: {
        display: false ,
       // color: "black  "
      },
          afterTickToLabelConversion: function(data){
  
  
             var xLabels = data.ticks;
  
              xLabels.forEach(function (labels, i) {
                  if (i % 2 === 1){
                      xLabels[i] = '';
                  }
              });
          } ,
         
      }] , 
      yAxes: [{
        ticks: {
            beginAtZero:true,
          //  fontColor: 'black   '
        },
        gridLines: {
          display: true ,
         // color: "black  "
        },
    }], 
}}
class LineGraph extends Component {
    constructor(){
        super();
        this.state = {
            data:[],
            label:[],
            holder:[],
            uniqueData:[],
            uniqueLabel:[]

        }

    }

      getgraph3 = () =>{
        var params = {
            EndTime: this.props.location.state.endTime, /* required */
            MetricName: this.props.location.state.metricName, /* required */
            Namespace: this.props.location.state.nameSpace, /* required */
            Period: '120', /* required */
           // StartTime: new Date('2019','09','24','10','30','00','0'), /* required **********************************Always change it to a new start time */ 
           StartTime: this.props.location.state.startTime, 
           Dimensions: [
              {
                Name: 'InstanceId', /* required */
                // Value: 'i-031339fed44b9fac8' /* required */
                Value: this.props.location.state.instanceId
              },
              /* more items */
            ],
            Statistics: [
              'Average',
              /* more items */
            ],
          }
        // AWS.config.update({"accessKeyId": "AKIAJQMWSS22MPHT5D2A", "secretAccessKey": "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", "region": "us-east-1" });
        // AWS.config.logger = console; 
        // let cloudwatch = new AWS.CloudWatch();
        AWS.config.update({"accessKeyId": this.props.location.state.accessKeyId, "secretAccessKey": this.props.location.state.secretAccessKey, "region": this.props.location.state.region });
        AWS.config.logger = console; 
        let cloudwatch3 = new AWS.CloudWatch();
        cloudwatch3.getMetricStatistics(params, function(err, data) {
         // console.log("inside function")
          if (err) console.log(err, err.stack); // an error occurred
          else {
           console.log(data)
           this.setState({holder:data.Datapoints})
            
             for (var i = 0; i < this.state.holder.length; i+=2) {
                this.setState(prevState => ({
                    label : [...prevState.label, this.state.holder[i].Timestamp.getHours()+":"+this.state.holder[i].Timestamp.getMinutes()]
                  }));
                  this.setState(prevState => ({
                    data : [...prevState.data, this.state.holder[i].Average]
                  }));
              }
           
            
            //  uniqueData =  Array.from(new Set(data));
            //  uniqueLabel =  Array.from(new Set(label));
    
              //this.intervalID3 = setTimeout(this.getgraph3.bind(this), this.state.refreshRate3);
    
           //   console.log("Graph4's data size is now " + this.state.dataTemp3.length);
             
          };          
         
        }.bind(this));
      }
      componentDidMount() {
        this.getgraph3();
      }

    render() {
       


       const lineGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.location.state.metricName,
            data: this.state.data,
            fill: true,         
            borderColor: 'lightblue', // Line color
           // backgroundColor: "black"
           responsive: true,
          }
        ]
      }
     //console.log(this.state.data.length + " and " + this.state.data[0])
      
        return (
            
            

             <Line data={lineGraphData}
             options = {optionToSkip}
             width = {40}
             height = {20}>

             </Line>
             
            
            
        );
    }
}

export default LineGraph;