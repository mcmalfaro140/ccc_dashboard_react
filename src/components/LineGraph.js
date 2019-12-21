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
            graphColor:"blue",
            data:[],
            label:[],
            holder:[],
            uniqueData:[],
            uniqueLabel:[],
            showOptions: false,

        };
        this.showOptions = this.showOptions.bind(this);
        

    }
    

      getgraph3 = () =>{
       console.log("id is "+this.props.graphSettings.idValue);
       var typeOfD = this.props.graphSettings.typeOfDimension;
       var idVal = this.props.graphSettings.idValue;
       if(typeOfD == null){typeOfD = "InstanceId"}
       if(idVal == null){idVal = "i-01e27ec0da2c4d296"}

         
        var params = {
            EndTime: currentDate, /* required */
            MetricName: this.props.graphSettings.metricName, /* required */
            Namespace: this.props.graphSettings.nameSpace, /* required */
            Period: this.props.graphSettings.period, /* required */
            StartTime:  this.props.graphSettings.startTime, /* required **********************************Always change it to a new start time */ 
         
           Dimensions: [
              {
                Name: typeOfD, /* required */
                // Value: 'i-031339fed44b9fac8' /* required */
                Value: idVal
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
              
           
            
            //  uniqueData =  Array.from(new Set(data));
            //  uniqueLabel =  Array.from(new Set(label));
    
              //this.intervalID3 = setTimeout(this.getgraph3.bind(this), this.state.refreshRate3);
    
           //   console.log("Graph4's data size is now " + this.state.dataTemp3.length);
             
          };          
         
        }.bind(this));
      }
      componentDidMount() {
        this.getgraph3();
        if(this.props.graphSettings.colorSelected != null){
         this.setState({graphColor:this.props.graphSettings.colorSelected})
        }
        
      }

      showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
      }

    render() {
    
      if(this.props.graphSettings.metricName!=="CPUUtilization"){
        optionToSkip =  {  
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
      
      }
      
      
     
      var Color = require('color');
       const lineGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.graphSettings.metricName,
            data: this.state.data,
            fill: true,         
            borderColor: this.state.graphColor, // Line color
            backgroundColor:Color(this.state.graphColor).alpha(0.5),
            responsive: true,
          }
        ]
      }
      console.log(this.state.graphColor+"the color");
     //console.log(this.state.data.length + " and " + this.state.data[0])
      
        return (
            
            <div>
              <div >
                <h2 className="float-left" >{this.props.graphSettings.chartName}</h2>
                <div style={{paddingTop:'23px'}} className="dropdown float-right show" onClick={this.showOptions}>
                  <a className="dropdown-toggle arrow-none card-drop" data-toggle="dropdown" aria-expanded="true">
                    <i style={{fontSize:'130%'}}className="mdi mdi-dots-vertical"></i>
                  </a>
                  { this.state.showOptions? (
                    <div className="dropdown-menu dropdown-menu-right show" x-placement="bottom-end">
                      <a href="" class="dropdown-item">Modify</a>
                      <a href="" class="dropdown-item">Delete</a>
                    </div>
                  ): null }
                </div>
              </div>
              <Line data={lineGraphData} options = {optionToSkip}></Line>
            </div>
        );
    }
}

export default LineGraph;