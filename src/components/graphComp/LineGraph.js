import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Line} from 'react-chartjs-2';
import myKeys from '../../keys.json';
import '../../assets/react-grid/styles.css'
import 'chartjs-plugin-zoom';
import 'chartjs-plugin-streaming';
import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
let currentDate = new Date();
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
        options : "",
        prevValues: [],
        unit:"",
        oldGraphSetting:"",
        isModify: false,
        fillChecked:false,
        RTData:[],
        RTHolder:[]
    };
    this.showOptions = this.showOptions.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.sendFillData = this.sendFillData.bind(this);

  }
getgraph = () =>{
       var typeOfD = this.props.graphSettings.typeOfDimension;
       var idVal = this.props.graphSettings.idValue;
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
                Value: idVal
              },
            ],
            Statistics: [
              'Average',
            ], 
          }
        
          AWS.config.update({secretAccessKey: myKeys.secretAccessKey, accessKeyId: myKeys.accessKeyId, region: myKeys.region});
          AWS.config.logger = console; 
          let cloudwatch3 = new AWS.CloudWatch();
          let labelTemp =[], dataTemp = [];
          cloudwatch3.getMetricStatistics(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
              let sortedData =  data.Datapoints.sort(function(a, b) {
              let dateA = new Date(a.Timestamp), dateB = new Date(b.Timestamp);
              return dateA - dateB;
                });
              this.setState({holder:sortedData})
              for (var i = 0; i < this.state.holder.length; i++) {
                let newTimestamp = (this.state.holder[i].Timestamp.getMonth()+1) + "/"+ this.state.holder[i].Timestamp.getDate() + " - "+this.state.holder[i].Timestamp.getHours() +":"+ this.state.holder[i].Timestamp.getMinutes() ;        
                if(!this.state.label.includes(newTimestamp)){
                  labelTemp.push(newTimestamp);
                  dataTemp.push(this.state.holder[i].Average)
                  this.setState({unit : this.state.holder[i].Unit});
                }                     
                      }

               this.setState({label:labelTemp, data:dataTemp});
                  };     
                }.bind(this));
};
onRefresh(chart){
  let typeOfD = this.props.graphSettings.typeOfDimension;
  let idVal = this.props.graphSettings.idValue;
  if(typeOfD == null){typeOfD = "InstanceId"}
  if(idVal == null){idVal = "i-01e27ec0da2c4d296"}
  let RTParams = {
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
                ],
            MetricName: this.props.graphSettings.metricName,
            Namespace: this.props.graphSettings.nameSpace
          },
          Period: this.props.graphSettings.period, /* required */
          Stat: 'Average', /* required */
      },
         },
          ],
      StartTime:  new Date(this.props.graphSettings.startTime), /* required */
      ScanBy: 'TimestampDescending'
   }
    chart.data.datasets.forEach(function(dataset) {
      let cloudwatch = new AWS.CloudWatch();
      let newData;
      let temp;
      cloudwatch.getMetricData(RTParams, function(err, data) {
        if (err) console.log(err, err.stack); 
        else  {   
          temp = data.MetricDataResults[0].Values[0];
          if(newData !== temp)  {
            newData = temp;             
           }      
             }      
          dataset.data.push({                               
            x: new Date(),
            y: newData
             });
           });                             
          });
          if(this.state.unit === "Percent" || this.props.graphSettings.metricName==="CPUUtilization"){
            chart.options.scales.yAxes[0].ticks = {
               min: 0,
               maxTicksLimit:10,
              callback: function (value) {
               
                  return (value * 100).toFixed(0) + '%'; 
                
              },
            }
          }else{
            chart.options.scales.yAxes[0].ticks = {
                min: 0, 
            }
          }
};
oldDataForRealTime(){
  let cloudwatch = new AWS.CloudWatch();
  let typeOfD = this.props.graphSettings.typeOfDimension;
  let idVal = this.props.graphSettings.idValue;
  if(typeOfD == null){typeOfD = "InstanceId"}
  if(idVal == null){idVal = "i-01e27ec0da2c4d296"}
  let params = {
    EndTime: new Date(), /* required */
    MetricName: this.props.graphSettings.metricName, /* required */
    Namespace: this.props.graphSettings.nameSpace, /* required */
    Period: this.props.graphSettings.period, /* required */
    StartTime: new Date(currentDate.getTime() - this.props.graphSettings.xAxisRange), /* required **********************************Always change it to a new start time */ 
 
   Dimensions: [
      {
        Name: typeOfD, /* required */
        Value: idVal
      },
    ],
    Statistics: [
      'Average',
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
       this.setState({RTData: temp});
      
      }
  }.bind(this))
}; 


componentDidMount() {
        if(this.props.graphSettings.realTime === false){
          this.getgraph();
          this.setState({
            newUpcomingPropsStartTime: this.props.graphSettings.startTime,
            newUpcomingPropsEndTime : this.props.graphSettings.endTime});
        }else{
          this.oldDataForRealTime();
        }
        if(this.props.graphSettings.colorSelected != null){
         this.setState({graphColor:this.props.graphSettings.colorSelected});
        }
        if(this.props.graphSettings.isFill != null){
          this.setState({fillChecked:this.props.graphSettings.isFill});
         }
       
};
componentWillReceiveProps(nextProp){
        let newStartTime = nextProp.graphSettings.startTime;
        let oldStartTime = this.state.newUpcomingPropsStartTime; 
        let newEndTime = nextProp.graphSettings.endTime;
        let oldEndTime = this.state.newUpcomingPropsEndTime;
        if(nextProp.graphSettings.realTime === false){
          if(this.state.isModify === true && (newStartTime !== oldStartTime || newEndTime !== oldEndTime)){
              if(this.state.holder.length > 0){
                  this.setState({holder:[]});
                  this.setState({label:[]});
                  this.setState({data:[]});
                }
                this.getgraph();
                this.setState({isModify:false});
                this.setState({newUpcomingPropsStartTime: nextProp.graphSettings.startTime,
                               newUpcomingPropsEndTime : nextProp.graphSettings.endTime});

            }
  }else{
    this.oldDataForRealTime();

  }
};
sendDeletionData = () => {
        this.props.parentCallback(this.props.id);
};
sendModifyData = () => {
        this.setState({isModify:true});
        this.props.callback(this.props.id);
};
sendFillData = () =>{
        this.setState({fillChecked : !this.state.fillChecked});
        let holder = [!this.state.fillChecked,this.props.id];
        this.props.fillCallback(holder);
}
showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
};  
convertHex(hex,opacity){
        hex = hex.replace('#','');
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);

        let result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
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
                 fontSize: 7,
                 maxTicksLimit: 10
          },
            gridLines: {
              display: false ,
            },
            }] , 
            yAxes: [{
              ticks: {
                  beginAtZero:true,
              },
              gridLines: {
                display: true ,
              },
          }], 
      },
      pan: {
        enabled: true,
        mode: 'x',
      },   
      zoom: {
        enabled: true,
        mode: 'x',
      
      },
    

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
            fontSize: 7,
            maxTicksLimit: 10
          },
          gridLines: {
            display: false , 
          },
        }], 
        yAxes: [{
          ticks: {
            stepSize: 0.2,
            fontSize: 10,
            min: 0,
            maxTicksLimit:10,
            callback: function (value) {
              return (value * 100).toFixed(0) + '%'; 
            },
          },
          gridLines: {
            display: true ,
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
        },
      
    }
  }
       const lineGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.graphSettings.metricName,
            data: this.state.data,
            fill: this.state.fillChecked,       
            borderColor: this.props.graphSettings.colorSelected,
            backgroundColor:this.convertHex(this.props.graphSettings.colorSelected,50),
            responsive: true,
            borderWidth:1,
          }
        ]
      }
      // random 
      let graph;
      if(this.props.graphSettings.realTime === true){ 
          graph = <Line
          data={{
              datasets: [{
                  label: this.props.graphSettings.metricName,
                  borderColor: this.props.graphSettings.colorSelected,
                  backgroundColor: this.convertHex(this.props.graphSettings.colorSelected,50),
                  fill: this.state.fillChecked,
                  data: this.state.RTData
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
                          duration: this.props.graphSettings.xAxisRange!=null?this.props.graphSettings.xAxisRange:900000,    // this would be the length of the graph in this case it display 15 mins
                          refresh: this.props.graphSettings.refreshRate,      // onRefresh callback will be called every 1000 ms *** 
                          delay: 1000,        // delay of 1000 ms, so upcoming values are known before plotting a line
                          pause: false,       // chart is not paused
                          ttl: undefined,     // data will be automatically deleted as it disappears off the chart
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
       graph = <Line data={lineGraphData} options = {optionToSkip} ></Line>
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
               <FormControlLabel
                control={
                  <Checkbox color = 'primary'
                            checked={this.state.fillChecked}
                            onChange={this.sendFillData}
                            value="checkedF"
                  >
                     <Link to={{pathname:'/dashboard'}} onClick ={this.sendFillData}></Link>
                    </Checkbox>
                          }
                label = 'Fill'
               />
               
                  
                
              
              
            </div>
        );
  }
}

export default LineGraph;