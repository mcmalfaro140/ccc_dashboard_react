import React, { Component } from 'react';
import AWS from 'aws-sdk';
import myKeys from '../keys.json';
import {Bar} from 'react-chartjs-2';
import 'chartjs-plugin-zoom';

var currentDate = new Date();

class MixGraph extends Component {
    constructor(){
        super();
      
        this.state = {
            graphColor:"red",
            data:[],
            data1:[],
            label:[],
            label1:[],
            holder:[],
            holder1:[],
            uniqueData:[],
            uniqueData1:[],
            uniqueLabel:[],
            uniqueLabel1:[],
            showOptions: false,

          };

        this.showOptions = this.showOptions.bind(this);

    }
      
      getgraph = () =>{

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
            StartTime: this.props.graphSettings.startTime, /* required **********************************Always change it to a new start time */ 
          //  StartTime: currentDate.setDate(currentDate.getDate()-5).toISOString(), 
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

        
        console.log("id is "+this.props.graphSettings.idValue1);
        var typeOfD1 = this.props.graphSettings.typeOfDimension1;
        var idVal1 = this.props.graphSettings.idValue1;
        if(typeOfD1 == null){typeOfD1 = "InstanceId"}
        if(idVal1 == null){idVal1 = "i-01e27ec0da2c4d296"}
         var params1 = {
             EndTime: currentDate, /* required */
             MetricName: this.props.graphSettings.metricName1, /* required */
             Namespace: this.props.graphSettings.nameSpace1, /* required */
             Period: this.props.graphSettings.period, /* required */
             StartTime: this.props.graphSettings.startTime, /* required **********************************Always change it to a new start time */ 
           //  StartTime: currentDate.setDate(currentDate.getDate()-5).toISOString(), 
            Dimensions: [
               {
                 Name: typeOfD1, /* required */
                 // Value: 'i-031339fed44b9fac8' /* required */
                 Value: idVal1
               },
               /* more items */
             ],
             Statistics: [
               'Average',
               /* more items */
             ],
           }
        
         cloudwatch3.getMetricStatistics(params1, function(err, data) {
          // console.log("inside function")
           if (err) console.log(err, err.stack); // an error occurred
           else {
             let sortedData =  data.Datapoints.sort(function(a, b) {
               var dateA = new Date(a.Timestamp), dateB = new Date(b.Timestamp);
               return dateA - dateB;
           });
            this.setState({holder1:sortedData})
            console.log(this.state.holder1);
              for (var i = 0; i < this.state.holder1.length; i++) {
              
                  
                   this.setState(prevState => ({
                     data1 : [...prevState.data1, this.state.holder1[i].Average]
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
        if(this.props.graphSettings.colorSelected != null){
          this.setState({ graphColor : this.props.graphSettings.colorSelected })
        }
      }

      showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
      }

    //   showOptions(e){
    //     e.preventDefault();
    //     this.setState({ showOptions: !this.state.showOptions});
    //   }

    render() {
      
       
     
      
       //console.log(this.props.graphSettings.colorSelected + "hey")

       const data = {
        labels: this.state.label,
        datasets: [{
            label: this.props.graphSettings.metricName,
            type: this.props.graphSettings.typeOfGraph,
            data: this.state.data,
            fill: false,
            borderColor: '#EC932F',
            backgroundColor: '#EC932F',
            pointBorderColor: '#EC932F',
            pointBackgroundColor: '#EC932F',
            pointHoverBackgroundColor: '#EC932F',
            pointHoverBorderColor: '#EC932F',
           
          },{
            type: this.props.graphSettings.typeOfGraph1,
            label: this.props.graphSettings.metricName1,
            data: this.state.data1,
            fill: false,
            backgroundColor: '#71B37C',
            borderColor: '#71B37C',
            hoverBackgroundColor: '#71B37C',
            hoverBorderColor: '#71B37C',
           
          }]
      };

   
       
    //    const lineGraphData = {
    //     labels: this.state.label,
    //     datasets: [
    //       {
    //         label: this.props.graphSettings.metricName,
    //         data: this.state.data,
    //         fill: true,         
    //        // borderColor: 'lightblue', // Line color
    //         backgroundColor: this.state.graphColor,
    //         maintainAspectRatio : false,
    //         responsive:true
    //       }
    //     ]
    //   }
    
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
             
              <Bar height = "100px" data={data} 
              />
           
            </div>
            
        );
    }
}

export default MixGraph;