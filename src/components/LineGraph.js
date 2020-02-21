import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Line} from 'react-chartjs-2';
import myKeys from '../keys.json';
import '../assets/react-grid/styles.css'
import 'chartjs-plugin-zoom';
import 'chartjs-plugin-streaming';
import { Link } from 'react-router-dom';



/**
 * Renders the preloader
 */
//hello




class LineGraph extends Component {
  intervalID;
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
        options : "",
        prevValues: [],
        unit:""
    };
    this.showOptions = this.showOptions.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    
    
  }
    

      getgraph = () =>{
        
      //  console.log(this.props.graphSettings);
       var typeOfD = this.props.graphSettings.typeOfDimension;
       var idVal = this.props.graphSettings.idValue;
       if(typeOfD == null){typeOfD = "InstanceId"}
       if(idVal == null){idVal = "i-01e27ec0da2c4d296"}

        var params = {
            EndTime: new Date(this.props.graphSettings.endTime), /* required */
            MetricName: this.props.graphSettings.metricName, /* required */
            Namespace: this.props.graphSettings.nameSpace, /* required */
            Period: this.props.graphSettings.period, /* required */
            StartTime: new Date(this.props.graphSettings.startTime), /* required **********************************Always change it to a new start time */ 
         
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
          // console.log(data);
          //  console.log(this.state.holder)
         
             for (var i = 0; i < this.state.holder.length; i++) {
              let newTimestamp = this.state.holder[i].Timestamp.getFullYear() + "/" + this.state.holder[i].Timestamp.getMonth()+1 + "/"+ this.state.holder[i].Timestamp.getDay() + " - "+this.state.holder[i].Timestamp.getHours() +":"+ this.state.holder[i].Timestamp.getMinutes() ;
              //  console.log(this.state.label.includes(newTimestamp))
              //console.log(this.state.label.includes(this.state.holder[i].Timestamp))            
               if(!this.state.label.includes(newTimestamp)){
                this.setState({label: [...this.state.label,newTimestamp]});
                this.setState(prevState => ({
                  data : [...prevState.data, this.state.holder[i].Average]
                }));
                 this.setState({unit: this.state.holder[i].Unit})
               }else{
              
               }
              
             
             
          //     if(this.state.holder[i].Timestamp.getHours()<12){
          //       if(this.state.holder[i].Timestamp.getMinutes()<10){
          //         this.setState(prevState => ({
          //           label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':0' + this.state.holder[i].Timestamp.getMinutes() + " AM"]
          //         }));
          //       }
          //       else{
          //     this.setState(prevState => ({
          //       label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':' + this.state.holder[i].Timestamp.getMinutes() + " AM"]
          //     }));
          //   }
          // }
          //   else{
          //     if(this.state.holder[i].Timestamp.getMinutes()<10){
          //       this.setState(prevState => ({
          //         label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':0' + this.state.holder[i].Timestamp.getMinutes() + " PM"]
          //       }));
          //     }else{
          //     this.setState(prevState => ({
          //       label : [...prevState.label,  this.state.holder[i].Timestamp.getHours() + ':' + this.state.holder[i].Timestamp.getMinutes() + " PM"]
          //     }));
          //   }
          // }
                         
               }
          };     

         // console.log(this.state.unit + " unit ");
         
        }.bind(this));
      }

      onRefresh(chart){
       // console.log(this.props.id + "... " + this.props.objectType);
        var typeOfD = this.props.graphSettings.typeOfDimension;
        var idVal = this.props.graphSettings.idValue;
        if(typeOfD == null){typeOfD = "InstanceId"}
        if(idVal == null){idVal = "i-01e27ec0da2c4d296"}
        var RTParams = {
          EndTime: new Date(), /* required */
          MetricDataQueries: [ /* required */
            {
              Id: 'realTimeData', /* required */
              MetricStat: {
                Metric: { /* required */
                  Dimensions: [
                    {
                      Name: typeOfD, /* required */
                      Value: idVal /* required */
                    },
                    /* more items */
                  ],
                  MetricName: this.props.graphSettings.metricName,
                  Namespace: this.props.graphSettings.nameSpace
                },
                Period: this.props.graphSettings.period, /* required */
                Stat: 'Average', /* required */
              },
             // Period: this.props.graphSettings.period,
             // ReturnData: true 
            },
            /* more items */
          ],
          StartTime:  this.props.graphSettings.startTime, /* required */
          ScanBy: 'TimestampDescending'
         // MaxDatapoints: 2,
        }
        
          chart.data.datasets.forEach(function(dataset) {
           let cloudwatch = new AWS.CloudWatch();
           let newData;
           let temp;
           cloudwatch.getMetricData(RTParams, function(err, data) {
             if (err) console.log(err, err.stack); // an error occurred
             else  {   
              // console.log(data);  
               temp = data.MetricDataResults[0].Values[0];
               if(newData !== temp)  {
                 newData = temp;
                
               }
              // console.log(newData)
                 }       // successful response
                 dataset.data.push({                               
                   x: new Date(),
                   y: newData
               });
           });                             
          });
          
          if(this.state.unit === "Percent" || this.props.graphSettings.metricName==="CPUUtilization"){
            chart.options.scales.yAxes[0].ticks = {
              // stepSize: 0.2,
              // fontSize: 10,
               min: 0,
               max: 1,// Your absolute max value
              callback: function (value) {
                return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
              },
            }
           
            
          }else{
            chart.options.scales.yAxes[0].ticks = {
                min: 0, 
            }
          }
      }
      
      componentDidMount() {
        // console.log(this.props.graphSettings.realTime);
        console.log("component update")
        if(this.props.graphSettings.realTime === false){
             this.getgraph();
        }
        if(this.props.graphSettings.colorSelected != null){
         this.setState({graphColor:this.props.graphSettings.colorSelected})
        }
        this.setState({ prevValues: this.state.holder}) // set values at the begining
        
      }
      componentWillUnmount(){
        // console.log(this.state.holder.length);
        if(this.state.holder.length !== 0){
          this.setState({holder:[]});
          this.setState({data: []});
          this.setState({label:[]});
          this.setState({unit:""});
        }
      }
      
      sendDeletionData = () => {
        this.props.parentCallback(this.props.id);
   }
      sendModifyData = () => {
        this.props.callback(this.props.id);
      }
    

      showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
      }

    
    render() {
  //     if(this.props.graphSettings.realTime === false){
  //       this.getgraph();
  //  }
    // console.log(this.props.graphSettings);
    let optionToSkip;
    if(this.state.unit !== "Percent" || this.props.graphSettings.metricName!=="CPUUtilization"){
        optionToSkip =  {  
          elements: {
            point:{
                radius: 0,  
            },
          }, 
          scales: {
            xAxes: [{  
              ticks: {
                // maxRotation: 0,
                // minRotation: 0,
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
      },
      pan: {
        enabled: true,
        mode: 'x',
       
      },
      
      zoom: {
        // Boolean to enable zooming
        enabled: true,
        mode: 'x',
      
      }

    }
  }else{
    optionToSkip =  { 
      elements: {
        point:{
            radius: 0,  
        },
      }, 
      scales: {
        xAxes: [{
          ticks: {
              // maxRotation: 0,
              // minRotation: 0,
          fontSize: 10,
          //autoSkip: true,
          maxTicksLimit: 10
          },
          gridLines: {
            display: false ,
          // color: "black  "
          },
        }], 
        yAxes: [{
          //stacked: true,
          ticks: {
            stepSize: 0.2,
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
      },
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          enabled: true,
          mode: 'x',
        }
    }
  }
      let Color = require('color');
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
            borderWidth:1
           
          }
        ]
      }
    
 
      let graph;
      if(this.props.graphSettings.realTime === true){
       graph = <Line
       data={{
           datasets: [{
               label: this.props.graphSettings.metricName,
               borderColor: 'rgb(54, 162, 235)',
               backgroundColor: 'rgba(54, 162, 235, 0.5)',
               
              // borderDash: [8, 4]
               }
           ]
       }}
       options={{
        elements: {
          point:{
              radius: 0,  
          },
        }, 
           scales: {
               xAxes: [{
                   type: 'realtime',
                   realtime: {
                       duration: 120000,    // this would be the length of the graph in this case it display 15 mins
                       refresh: 10000,      // onRefresh callback will be called every 1000 ms *** 
                       delay: 1000,        // delay of 1000 ms, so upcoming values are known before plotting a line
                       pause: false,       // chart is not paused
                       ttl: undefined,     // data will be automatically deleted as it disappears off the chart

                       // a callback to update datasets
                       //move callback function outside
                       onRefresh: this.onRefresh,
                      
                   }
               }],
               yAxes:[{
                
              }
               ],           
           },
        
       }}/>
      }
      else{
       graph = <Line height = "100px" width = "100px" data={lineGraphData} options = {optionToSkip} ></Line>
      }
    
    
      
   
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
                      <Link to={{typeOfGraph : 'line' ,pathname:'/dashboard'}} onClick = {this.sendModifyData}>
                       Modify
                      </Link >
                      <Link to={{pathname:'/dashboard'}} onClick = {this.sendDeletionData} >
                       Delete
                      </Link>
                    </div>
                  ): null }
                </div>
              </div>
           
             
               {graph}
              
              
            </div>
        );
    }
}

export default LineGraph;