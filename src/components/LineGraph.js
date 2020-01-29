import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Line} from 'react-chartjs-2';
import myKeys from '../keys.json';
import '../assets/react-grid/styles.css'
import 'chartjs-plugin-zoom';
import 'chartjs-plugin-streaming';


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
        prevValues: []
    };
    this.showOptions = this.showOptions.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.optionToSkip =  { 
      animation: {
        duration: 2000
      },
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
    

      getgraph = () =>{

        if(this.props.graphSettings.realTime === true){
          // this.setState({data:[]})
          // this.setState({label:[]})
          this.intervalID = setTimeout(this.getgraph, this.props.graphSettings.refreshRate);
      
        }

      //   console.log(this.props.graphSettings.startTime + "start timmmmmm")
      //   console.log(this.props.graphSettings.endTime + " end timmmmmm")
      //   console.log(this.props.graphSettings.realTime)
      //  console.log("id is "+this.props.graphSettings.idValue);
       var typeOfD = this.props.graphSettings.typeOfDimension;
       var idVal = this.props.graphSettings.idValue;
       if(typeOfD == null){typeOfD = "InstanceId"}
       if(idVal == null){idVal = "i-01e27ec0da2c4d296"}

         
        var params = {
            EndTime: this.props.graphSettings.endTime, /* required */
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

           console.log(this.state.holder)
         
            //  for (var i = 0; i < this.state.holder.length; i++) {
            //   let newTimestamp = this.state.holder[i].Timestamp.getFullYear() + "/" + this.state.holder[i].Timestamp.getMonth()+1 + "/"+ this.state.holder[i].Timestamp.getDay() + " - "+this.state.holder[i].Timestamp.getHours() +":"+ this.state.holder[i].Timestamp.getMinutes() ;
            //    console.log(this.state.label.includes(newTimestamp))
            //   //console.log(this.state.label.includes(this.state.holder[i].Timestamp))            
            //    if(!this.state.label.includes(newTimestamp)){
            //     this.setState({label: [...this.state.label,newTimestamp]});
            //     this.setState(prevState => ({
            //       data : [...prevState.data, this.state.holder[i].Average]
            //     }));
            //    }else{
              
            //    }
              
             
             
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
                 

              
              // }

              // console.log(this.state.label + " hey i m label")
              
           
            
            
           
           
            
    
         
             
          };     
         
          // console.log(this.state.data)
          // console.log(this.state.label)  
          // this.setState({prevValues : this.state.holder})
         
        }.bind(this));
        return [this.state.data, this.state.label];
      }

      componentWillMount() {
        /*
          stop getData() from continuing to run even
          after unmounting this component. Notice we are calling
          'clearTimeout()` here rather than `clearInterval()` as
          in the previous example.
        */
      
    //    if(this.props.graphSettings.realTime === true){
    //      console.log(this.props)
    //     this.setState({options : {scales: {
    //      xAxes: [
    //        {
    //          type: "realtime",
    //          realtime: {
    //            //refresh: this.props.graphSettings.refreshRate,
    //            onRefresh: function(){
    //              this.getgraph3()
    //            }
    //          }
    //        }
    //      ]
    //  }}})
    //  }else{
    //     this.getgraph3();
    //  }
      }
      componentDidMount() {
        this.getgraph();
        if(this.props.graphSettings.colorSelected != null){
         this.setState({graphColor:this.props.graphSettings.colorSelected})
        }
        this.setState({ prevValues: this.state.holder}) // set values at the begining
        
      }

      showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
      }

    
    render() {
      
      if(this.props.graphSettings.metricName!=="CPUUtilization"){
        this.optionToSkip =  {  
          animation: {
            duration: 2000
          },
          scales: {
           elements: {
              point:{
                  radius: 0,  
              },
      
    }, 
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
        // Boolean to enable panning
        enabled: true,
      
        // Panning directions. Remove the appropriate direction to disable 
        // Eg. 'y' would only allow panning in the y direction
        mode: 'x',
       
      },
      
      // Container for zoom options
      zoom: {
        // Boolean to enable zooming
        enabled: true,
      
        // Zooming directions. Remove the appropriate direction to disable 
        // Eg. 'y' would only allow zooming in the y direction
        mode: 'x',
      
      }

    }
      
      }
      
      
     
      var Color = require('color');
       const lineGraphData = {
        labels: this.state.label,
        datasets: [
          {
            label: this.props.graphSettings.metricName,
            data: [],
            fill: true,         
            borderColor: this.state.graphColor, // Line color
            backgroundColor:Color(this.state.graphColor).alpha(0.5),
            responsive: true,
            borderWidth:1
           
          }
        ]
      }
      let newData = this.getgraph()[0]
      let newLabel = this.getgraph()[1]
      console.log(newData )
      console.log(newLabel)
      const RToptions = {
        scales: {
          xAxes: [
            {
              type: "realtime",
              realtime: {
                onRefresh: function(chart) {
                  // lineGraphData.datasets.data = newData
                  // lineGraphData.labels = newLabel
                  chart.lineGraphData.datasets.forEach(function(dataset) {

                    dataset.data.push({

                      x: Date.now(),

                      y: Math.random()*100

                    });

                  });

              
                },
                
              }
            }
          ]
        }
      };
      var graph;
      if(this.props.graphSettings.realTime === true){
       graph = <Line height = "100px" data={lineGraphData} options = {RToptions} ></Line>
      }
      else{
       graph = <Line height = "100px" width = "100px" data={lineGraphData} options = {this.optionToSkip} ></Line>
      }
      //console.log(this.state.graphColor+"the color");
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
           
             
               {graph}
              
              
            </div>
        );
    }
}

export default LineGraph;