import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Line} from 'react-chartjs-2';
import myKeys from '../keys.json';


/**
 * Renders the preloader
 */
//hello
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
            EndTime: currentDate, /* required */
            MetricName: this.props.graphSettings.metricName, /* required */
            Namespace: this.props.graphSettings.nameSpace, /* required */
            Period: this.props.graphSettings.period, /* required */
            StartTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-6,currentDate.getMinutes()), /* required **********************************Always change it to a new start time */ 
         
           Dimensions: [
              {
                Name: 'InstanceId', /* required */
                // Value: 'i-031339fed44b9fac8' /* required */
                Value: this.props.graphSettings.instanceId
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
        this.getgraph3();
      }

    render() {
       


       const lineGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.graphSettings.metricName,
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
            <Line data={lineGraphData}
             options = {optionToSkip}
             >

             </Line>
            </div>

             
             
            
            
        );
    }
}

export default LineGraph;