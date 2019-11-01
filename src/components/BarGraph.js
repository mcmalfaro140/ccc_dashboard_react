import React, { Component } from 'react';
import AWS from 'aws-sdk';
import myKeys from '../keys.json';
import {Bar} from 'react-chartjs-2';

/**
 * Renders the preloader
 */

var currentDate = new Date();
var optionToSkip =  {  
    scales: {
      xAxes: [{
        ticks: {
            maxRotation: 30,
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
class BarGraph extends Component {
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

      getgraph = () =>{
        var params = {
            EndTime: currentDate, /* required */
            MetricName: this.props.location.state.metricName, /* required */
            Namespace: this.props.location.state.nameSpace, /* required */
            Period: '120', /* required */
            StartTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2), /* required **********************************Always change it to a new start time */ 
          //  StartTime: currentDate.setDate(currentDate.getDate()-5).toISOString(), 
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
        AWS.config.logger = console; 
        let cloudwatch3 = new AWS.CloudWatch();
        cloudwatch3.getMetricStatistics(params, function(err, data) {
         // console.log("inside function")
          if (err) console.log(err, err.stack); // an error occurred
          else {
           console.log(data)
           this.setState({holder:data.Datapoints})
            
             for (var i = 0; i < this.state.holder.length; i++) {
              this.setState(prevState => ({
                label : [...prevState.label,  (this.state.holder[i].Timestamp.getMonth()+1) + '-'+this.state.holder[i].Timestamp.getDate() + '-' +this.state.holder[i].Timestamp.getHours() + ':' + this.state.holder[i].Timestamp.getMinutes() ]
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
        this.getgraph();
      }

    render() {
       


       const lineGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.location.state.metricName,
            data: this.state.data,
            fill: true,         
           // borderColor: 'lightblue', // Line color
            backgroundColor: "lightblue",
           responsive: true,
          }
        ]
      }
     //console.log(this.state.data.length + " and " + this.state.data[0])
      
        return (
            
            

             <Bar data={lineGraphData}
             options = {optionToSkip}/>
            

            
             
            
            
        );
    }
}

export default BarGraph;