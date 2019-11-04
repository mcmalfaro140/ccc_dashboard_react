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
            maxRotation: 0,
            minRotation: 0,
        fontSize: 10,
        //autoSkip: true,
        maxTicksLimit: 10
      },
      gridLines: {
        display: false ,
       // color: "black  "
      },
          // afterTickToLabelConversion: function(data){
  
  
          //    var xLabels = data.ticks;
  
          //     xLabels.forEach(function (labels, i) {
          //         if (i % 2 === 1){
          //             xLabels[i] = '';
          //         }
          //     });
          // } ,
         
     }] , 
      yAxes: [{
       //stacked: true,
        ticks: {
          fontSize: 10,
          min: 0,
          max: 1,// Your absolute max value
          callback: function (value) {
            return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
          },
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
            Period: '180', /* required */
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
            Unit:"Percent",
           
          }
        
          AWS.config.update({secretAccessKey: myKeys.secretAccessKey, accessKeyId: myKeys.accessKeyId, region: myKeys.region});
          AWS.config.logger = console; 
        let cloudwatch3 = new AWS.CloudWatch();
        cloudwatch3.getMetricStatistics(params, function(err, data) {
         // console.log("inside function")
          if (err) console.log(err, err.stack); // an error occurred
          else {
          
           let sortedData =  data.Datapoints.sort(function(a, b) {
              var dateA = new Date(a.Timestamp), dateB = new Date(b.Timestamp);
              return dateA - dateB;
          });
           this.setState({holder:sortedData})
           console.log(this.state.holder);
             for (var i = 0; i < this.state.holder.length; i++) {
              if(this.state.holder[i].Timestamp.getHours()<12){
                if(this.state.holder[i].Timestamp.getMinutes()<10){
                  this.setState(prevState => ({
                    label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':0' + this.state.holder[i].Timestamp.getMinutes() + " AM"]
                  }));
                }
                else{
              this.setState(prevState => ({
                label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':' + this.state.holder[i].Timestamp.getMinutes() + " AM"]
              }));
            }
          }
            else{
              if(this.state.holder[i].Timestamp.getMinutes()<10){
                this.setState(prevState => ({
                  label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':0' + this.state.holder[i].Timestamp.getMinutes() + " PM"]
                }));
              }else{
              this.setState(prevState => ({
                label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':' + this.state.holder[i].Timestamp.getMinutes() + " PM"]
              }));
            }
          }
                  this.setState(prevState => ({
                    data : [...prevState.data, this.state.holder[i].Average]
                  }));
              }
              for(var i = 0;i<this.state.label.length;i++){

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
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
             <h3>{this.props.graphSettings.chartName}</h3>
            </div>
            <Line data={lineGraphData}
             options = {optionToSkip}
             >

             </Line>
            </div>

             
             
            
            
        );
    }
}

export default LineGraph;