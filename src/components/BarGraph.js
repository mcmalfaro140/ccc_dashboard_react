import React, { Component } from 'react';
import AWS from 'aws-sdk';
import myKeys from '../keys.json';
import {Bar,} from 'react-chartjs-2';
import 'chartjs-plugin-zoom';
import { Link } from 'react-router-dom';
/**
 * Renders the preloader
 */


  
class BarGraph extends Component {
  constructor(){
        super();
        this.state = {
            graphColor:"red",
            data:[],
            label:[],
            holder:[],
            uniqueData:[],
            uniqueLabel:[],
            showOptions: false,
            isModify:false,
            graphSetting:{},
            RTHolder:[],
            RTData:[]

          };
        this.showOptions = this.showOptions.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
      
    }
oldDataForRealTime(){
      let cloudwatch = new AWS.CloudWatch();
      let typeOfD = this.props.graphSettings.typeOfDimension;
      let idVal = this.props.graphSettings.idValue;
      if(typeOfD == null){typeOfD = "InstanceId"}
      if(idVal == null){idVal = "i-01e27ec0da2c4d296"}
      let params = {
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
      cloudwatch.getMetricStatistics(params, function(err, data){
        let temp = [];
        if (err) console.log(err, err.stack); // an error occurred
        else {
          let sortedData =  data.Datapoints.sort(function(a, b) {
          let dateA = new Date(a.Timestamp), dateB = new Date(b.Timestamp);
          return dateA - dateB;
            });
          this.setState({RTHolder: sortedData});
          for(let i = 0; i < this.state.RTHolder.length; i++){
              temp.push({x: new Date(this.state.RTHolder[i].Timestamp), y:this.state.RTHolder[i].Average})
          }
          this.setState({RTData:temp});
          }
      }.bind(this))
  
};
onRefresh(chart){
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
        StartTime:  new Date(this.props.graphSettings.startTime), /* required */
        ScanBy: 'TimestampDescending'
       // MaxDatapoints: 2,
      }
      
        chart.data.datasets.forEach(function(dataset) {
         let cloudwatch = new AWS.CloudWatch();
         let newData;
         let temp;
         let timeStamp;
         let newTimestamp;
         cloudwatch.getMetricData(RTParams, function(err, data) {
           if (err) console.log(err, err.stack); // an error occurred
           else  {   
             temp = data.MetricDataResults[0].Values[0];
             timeStamp = data.MetricDataResults[0].Timestamps[0]
             if(newData !== temp)  {
               newData = temp;  
             }
             if(newTimestamp !== timeStamp){
               newTimestamp = timeStamp;
             }
               }       // successful response
               dataset.data.push({                               
                 x: new Date(),
                 y: newData
             });
            // console.log(dataset.data)
         });                             
        });
        
        if(this.state.unit === "Percent" || this.props.graphSettings.metricName==="CPUUtilization"){
          chart.options.scales.yAxes[0].ticks = {
            min: 0,
           callback: function (value) {
             return (value * 100).toFixed(1) + '%'; 
           },
          }
         
          
        }
    }
getgraph = () =>{
       
        console.log(this.props.graphSettings.realTime)
        console.log("id is "+this.props.graphSettings.idValue);
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
          if (err) console.log(err, err.stack); // an error occurred
          else {
            let sortedData =  data.Datapoints.sort(function(a, b) {
              var dateA = new Date(a.Timestamp), dateB = new Date(b.Timestamp);
              return dateA - dateB;
          });
           this.setState({holder:sortedData})
             for (var i = 0; i < this.state.holder.length; i++) {
              let newTimestamp = this.state.holder[i].Timestamp.getFullYear() + "/" + this.state.holder[i].Timestamp.getMonth()+1 + "/"+ this.state.holder[i].Timestamp.getDay() + " - "+this.state.holder[i].Timestamp.getHours() +":"+ this.state.holder[i].Timestamp.getMinutes() ;
              console.log(this.state.label.includes(newTimestamp))
              if(!this.state.label.includes(newTimestamp)){
               this.setState({label: [...this.state.label,newTimestamp]});
               this.setState(prevState => ({
                 data : [...prevState.data, this.state.holder[i].Average]
               }));
              }else{
             
              }
            }
             
          };          
         
        }.bind(this));
      }
compareObj(obj1, obj2) {
        //Loop through properties in object 1
        for (let p in obj1) {
          //Check property exists on both objects
          if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
       
          switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
              if (!this.compareObj(obj1[p], obj2[p])) return false;
              break;
            //Compare function code
            case 'function':
              if (typeof (obj2[p]) == 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
              break;
            //Compare values
            default:
              if (obj1[p] !== obj2[p]) return false;
          }
        }
       
        //Check object 2 for any extra properties
        for (let p in obj2) {
          if (typeof (obj1[p]) == 'undefined') return false;
        }
        return true;
      };
componentDidMount() {
  if(this.props.graphSettings.realTime === false){
    this.getgraph();
  }
  else{
    this.oldDataForRealTime();
  }
  if(this.props.graphSettings.colorSelected != null){
    this.setState({graphColor:this.props.graphSettings.colorSelected})
  }
}
componentWillReceiveProps(nextProp){
  const isEqual = this.compareObj(this.state.graphSetting, nextProp.graphSettings)    
  if(nextProp.graphSettings.realTime === false){
    if(this.state.isModify === true && isEqual === false){
      if(this.state.holder.length > 0){
        this.setState({holder:[]});
        this.setState({label:[]});
        this.setState({data:[]});
      }
      this.getgraph();
      this.setState({isModify:false});
            }
      }else{
        this.oldDataForRealTime();
      }
    
      }
sendDeletionData = () => {
        this.props.parentCallback(this.props.id);
   }
sendModifyData = () => {
        this.setState({isModify:true});
        this.props.callback(this.props.id);
      }
showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
      }
render() {
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
              fontSize: 7,
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
            fontSize: 7,
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
            //  max: 1,// Your absolute max value
              callback: function (value) {
                return (value * 100).toFixed(1)+ '%'; // convert it to percentage
              },
                //  fontColor: 'black   '
            },
            // scaleLabel:{
            //   display:true,
            //   labelString:"Percentage"
            // },
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
       
       const barGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.graphSettings.metricName,
            data: this.state.data,
            fill: true,         
           // borderColor: 'lightblue', // Line color
            backgroundColor: this.props.graphSettings.colorSelected,
            maintainAspectRatio : false,
            responsive:true
          }
        ]
      }

      let graph;
     // let currentDate = new Date();
      if(this.props.graphSettings.realTime === true){
       graph = <Bar
       data={{
           datasets: [{
               label: this.props.graphSettings.metricName,
               fill:true,
               strokeColor: "rgba(220,220,220,0.8)",
               backgroundColor:this.props.graphSettings.colorSelected,
               data:this.state.RTData
               }
           ]
       }}
       options={{
           scales: {
               xAxes: [{
                   type: 'realtime',
                   realtime: {
                       duration: this.props.graphSettings.xAxisRange!=null?this.props.graphSettings.xAxisRange:900000,    // this would be the length of the graph in this case it display 15 mins
                       refresh: this.props.graphSettings.refreshRate,      // onRefresh callback will be called every 1000 ms *** 
                       delay: 2000,        // delay of 1000 ms, so upcoming values are known before plotting a line
                       pause: false,       // chart is not paused
                       ttl: undefined,     // data will be automatically deleted as it disappears off the chart
                       onRefresh: this.onRefresh,
                      
                   },
               }],
               yAxes:[{
                //  ticks:{
                //   min: 0,
                // }
              }
               ],           
           },
         
       }}/>
      }
      else{
       graph = <Bar data={barGraphData} options = {optionToSkip}
       />
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
                     <Link to={{typeOfGraph : 'line' ,pathname:'/dashboard'}} onClick = {this.sendModifyData} class="dropdown-item">
                       Modify
                      </Link >
                      <Link to={{pathname:'/dashboard'}} onClick = {this.sendDeletionData} class="dropdown-item">
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

export default BarGraph;