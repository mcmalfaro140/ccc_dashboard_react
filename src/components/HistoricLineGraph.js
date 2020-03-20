import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Line} from 'react-chartjs-2';
import myKeys from '../keys.json';


var currentDate = new Date();
var startT = "";
var period = "";
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
class HistoricLineGraph extends Component {
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
            EndTime: currentDate, /* required */
            MetricName: this.props.location.state.metricName, /* required */
            Namespace: this.props.location.state.nameSpace, /* required */
            Period: period, /* required */
            StartTime: startT, /* required **********************************Always change it to a new start time */ 
         
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
        
          AWS.config.update({secretAccessKey: myKeys.secretAccessKey, accessKeyId: myKeys.accessKeyId, region: myKeys.region});
          // AWS.config.logger = console; 
        let cloudwatch3 = new AWS.CloudWatch();
        cloudwatch3.getMetricStatistics(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
           this.setState({holder:data.Datapoints})
            
             for (var i = 0; i < this.state.holder.length; i++) {
                this.setState(prevState => ({
                    label : [...prevState.label,  (this.state.holder[i].Timestamp.getMonth()+1) + '/'+this.state.holder[i].Timestamp.getDate() + '-' +this.state.holder[i].Timestamp.getHours() + ':' + this.state.holder[i].Timestamp.getMinutes() ]
                  }));
                  this.setState(prevState => ({
                    data : [...prevState.data, this.state.holder[i].Average]
                  }));
              }
           
         
          };          
         
        }.bind(this));
      }
      componentDidMount() {
        this.getgraph3();
      }

    render() {
       if(this.props.location.state.timeRange === "Last Hour"){
           startT = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes());
           period = 60;
       }
       else if(this.props.location.state.timeRange === "Last Day"){
        startT = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes());
        period = 120;
       }
       else if(this.props.location.state.timeRange === "Last Week"){
        startT = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes());
        period = 2400;
       }
       else if(this.props.location.state.timeRange === "Last Month"){
        startT = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes());
        period = 4800;
       }


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
            
            
              <div>
                <div>
                  <h3>{this.props.location.state.chartName}</h3>
                </div>
         

             <Line data={lineGraphData}
             options = {optionToSkip}
           />

            </div>
             
            
            
        );
    }
}

export default HistoricLineGraph;