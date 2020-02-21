import React, { Component } from 'react';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col, CardBody } from 'reactstrap';
import { SketchPicker } from 'react-color'
import Switch from "react-switch";
import '../assets/react-grid/styles.css'
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css' // Default Style


// import DateTimePicker from 'react-datetime-picker';


/**
 * Renders the preloader
 */

 var value = [];
 var currentDate = new Date();
class graphForm extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.readSelection = this.readSelection.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        // this.handleChangeForStart = this.handleChangeForStart.bind(this);
        // this.handleChangeForEnd = this.handleChangeForEnd.bind(this);
        this.refreshGraph = this.refreshGraph.bind(this);
        this.onDateRangeSelection = this.onDateRangeSelection.bind(this);
   
      
        this.state = { 
            
            showMenu: false,
            isRealTime: false,
            refreshRate:10000,
            screenWidth: 0,
            whichNamespace: "",
            colorSelected:"",
           // namespaceNotSelected : true,
            isCondensed: false,
            isFullScreen: false,
            modalOpen: false,
            mixModalOpen: false,
            metricName:null, 
            nameSpace:null,
            chartName:null,
            typeOfDimension : null,
            idValue:null,
          //  startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
            startTime:"", 
            period:120,
            endTime:"", //if needed ,
            xAxisRange:120000,
            xAxisSelection:"",
            refreshRateSelection:""
    }}
    componentWillReceiveProps(nextProps){
        console.log(nextProps.graphInfor);
        if(nextProps.graphInfor != null){
            this.setState({isRealTime : nextProps.graphInfor.realTime})
        }
    }
    componentDidMount(){
        console.log(this.props.graphInfor);
        if(this.props.graphInfor != null){
            this.setState({isRealTime : this.props.graphInfor.realTime});
            if(this.props.graphInfor.realTime === false){
                this.setState({startTime : new Date(this.props.graphInfor.startTime).getTime()});
                this.setState({endTime : new Date(this.props.graphInfor.endTime).getTime()})
            } else{
                this.setState({startTime : new Date(this.props.graphInfor.startTime)});
                this.setState({endTime : new Date(this.props.graphInfor.endTime)})
            }      
            this.setState({colorSelected : this.props.graphInfor.colorSelected});
        }
    }
    refreshGraph(e){
       if(e.target.value === "Three Seconds"){
           this.setState({refreshRate : 3000, refreshRateSelection : 'Three Seconds'});
       }
       if(e.target.value === "Ten Seconds"){
           this.setState({refreshRate : 10000,refreshRateSelection : 'Ten Seconds' });
       }
       if(e.target.value === "One minute"){
           this.setState({refreshRate : 60000,refreshRateSelection: 'One minute' });
       }
       if(e.target.value === "Ten minutes"){
           this.setState({refreshRate : 600000, refreshRateSelection:'Ten minutes'});
       }
    }

    toggleSwitch (isRealTime){
        console.log("is it real ? " + isRealTime)
        this.setState({isRealTime})
    }
    toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen})
        // this.setState({whichNamespace : ""})
        this.setState({namespaceNotSelected : true})

};
    //Dropdown helper
    readSelection(e){
      this.setState({endTime : new Date()})
      if(e.target.value === "Last 15 Minutes"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes()-15),
                        period : 60,
                        xAxisRange: 900000,
                        xAxisSelection: 'Last 15 Minutes'});
      }
      if(e.target.value === "Last Hour"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes()),
                         period : 120,
                         xAxisSelection : 'Last Hour',
                         xAxisRange: 3600000});
        
      }
      if(e.target.value === "Last Two Hours"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-2,currentDate.getMinutes()),
                         period : 120,
                         xAxisSelection : 'Last Two Hours',
                         xAxisRange: 7200000})
      }
      if(e.target.value === "Last Day"){
          this.setState({})
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()),
                         period : 120,
                         xAxisSelection : 'Last Day',
                         xAxisRange: 86400000})
      }
  }

  handleChangeComplete = (color) =>{
    this.setState({colorSelected : color.hex})

}

  update(e,i){
      e.preventDefault();
      this.setState({namespaceNotSelected:false})
      value[i] = e.target.value;
      if(value.length > 5){
          value = [];
      }
      this.setState({nameSpace : value[0]});
      this.setState({chartName : value[1]});
      this.setState({metricName : value[2]});
      this.setState({typeOfDimension : value[3]});
      this.setState({idValue : value[4]});

      
  }

 onDateRangeSelection = (startTime, endTime) => {
        console.log(startTime + ' - ' + endTime)
        this.setState({startTime , endTime})
    
         //   console.log(startTime + " - " + endTime)
            let start, end;
            if(startTime != null){
                start = new Date(startTime);
            }
            if(endTime != null){
                end = new Date(endTime);
            }
            if(start!=null && end!=null){
            let dateDiff = end.getTime() - start.getTime();
            let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
            if(days<1){
                this.setState({period:60});
            }
            if(days === 1){
                this.setState({period:120});
            }
            if(days >1 && days <5){
                this.setState({period: 600});
            }
            if(days > 5 && days < 25){
                this.setState({period: 1800});
            }
            if(days > 25 ){
                this.setState({period: 3600})
            }
        }
        
    }
 
    
    
    

    render() {
        let timeSelection;
        if(this.state.isRealTime === true ){
            timeSelection = 
             <div>            
            <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>X Axis Time Range</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.readSelection(e)}
            defaultValue = {this.props.graphInfor==null?null:this.props.graphInfor.xAxisSelection}
            >
                {this.props.graphInfor==null?
                    <option disabled selected>Make Selection</option>
                    :null
                }
            <option value = "Last 15 Minutes">Last 15 Minutes</option>
            <option value = "Last Hour">Last Hour</option>
            <option value = "Last Two Hours">Last Two Hours</option>
            <option value = "Last Day">Last Day</option>
            </Form.Control>
            <Form.Text className="text-muted">
                Select the time
            </Form.Text>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect10">
            <Form.Label>Refresh Rate</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.refreshGraph(e)}
            defaultValue = {this.props.graphInfor==null?null:this.props.graphInfor.refreshRateSelection}>
            {this.props.graphInfor==null?
                    <option disabled selected>Make Selection</option>
                    :null
                }
            <option value = "Three Seconds">Three Seconds</option>
            <option value = "Ten Seconds">Ten Seconds</option>
            <option value = "One minute">One minute</option>
            <option value = "Ten minutes">Ten minutes</option>
            
            </Form.Control>
            <Form.Text className="text-muted">
                Select the refresh rate
                </Form.Text>
            </Form.Group>
         </div>    
        }
        else if(this.state.isRealTime === false){
            console.log(this.state.isRealTime)
            timeSelection = 
            <div>
            <Form.Group>
                <ReactLightCalendar startDate={this.state.startTime} endDate={this.state.endTime} onChange={this.onDateRangeSelection} range displayTime />
            </Form.Group>
           
            </div>
        }
  
        return (  
                        <div>
                        <ModalHeader toggle={this.props.toggleForm}>New Chart Form</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a chart.
                                <form>
                                
                                {/* {this.props.graphInfor == null && ( */}
                                {this.props.graphInfor == null ?
                                <Form.Group>
                                <label className="center">
                                <h5>Real Time</h5>
                                <Switch
                                    checked={this.state.isRealTime}
                                    onChange={this.toggleSwitch}
                                    onColor="#86d3ff"
                                    onHandleColor="#2693e6"
                                    handleDiameter={20}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={15}
                                    width={40}
                                    className="react-switch"
                                    id="material-switch"
                                />
                                </label>
                            </Form.Group> : null}
                            {/* )} */}
                            {this.props.graphInfor == null?
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Name Space: </Form.Label>
                                         <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,0)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.nameSpace:"" }/>
                                        <Form.Text className="text-muted">
                                        specify the name space ...
                                        </Form.Text>
                                    </Form.Group> : null}

                            
                                    <Form.Group controlId="chartName">
                                        <Form.Label>Chart Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,1)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.chartName:""}/>
                                        <Form.Text className="text-muted">
                                        specify the chart name that you want...
                                        </Form.Text>
                                    </Form.Group>

                                    {this.props.graphInfor == null?
                                    <Form.Group controlId="metricName">
                                        <Form.Label>Metric Name: </Form.Label> 
                                         <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,2)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.metricName:""}/>
                                        <Form.Text className="text-muted">
                                        specify the metric name that you want...
                                        </Form.Text> 
                                     </Form.Group>:null} 
                                    
                                     {this.props.graphInfor == null?
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the dimension name" onChange = {(e) => this.update(e,3)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.typeOfDimension:""}/>
                                            <Form.Text className="text-muted">
                                            Enter the dimension 
                                            Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the value" onChange = {(e) => this.update(e,4)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.idValue:""}/>
                                            <Form.Text className="text-muted">
                                            Enter the value
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form> : null}

                                    {timeSelection}
                                   
                                    <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Graph Color</Form.Label>
                                       <SketchPicker
                                       color = {this.state.colorSelected}
                                       onChange = {this.handleChangeComplete}
                                       />
                                    </Form.Group>
                              
                                </form>
                            </ModalBody>
                            <ModalFooter>                             
                                <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newGraph:{
                                            id:this.props.selectedGraphId!=null?this.props.selectedGraphId:"",
                                            objectType:"graph", // options: graph or table
                                            graphSettings: {
                                                type:this.props.whatever, //options: line, pie, or bar
                                                realTime:this.state.isRealTime, //options: true or false
                                                metricName : this.state.metricName!=null ? this.state.metricName: (this.props.graphInfor!=null?this.props.graphInfor.metricName:""),
                                                nameSpace:this.state.nameSpace!=null ? this.state.nameSpace: (this.props.graphInfor!=null?this.props.graphInfor.nameSpace:""),
                                                chartName:this.state.chartName!=null? this.state.chartName: (this.props.graphInfor!=null?this.props.graphInfor.chartName:""),
                                                typeOfDimension:this.state.typeOfDimension!=null? this.state.typeOfDimension: (this.props.graphInfor!=null?this.props.graphInfor.typeOfDimension:""),
                                                idValue:this.state.idValue!=null? this.state.idValue: (this.props.graphInfor!=null?this.props.graphInfor.idValue:""),
                                                refreshRate: this.state.refreshRate,
                                                colorSelected:this.state.colorSelected,
                                                period:this.state.period,
                                                startTime:this.state.startTime, //if needed
                                                endTime:this.state.endTime, //if needed
                                                xAxisRange : this.state.xAxisRange,
                                                xAxisSelection: this.state.xAxisSelection,
                                                refreshRateSelection : this.state.refreshRateSelection                                        
                                            },
                                            coordinates: {
                                                x: 0,
                                                y: 0,
                                                w: 8,
                                                h: 2,
                                                minW: 8,
                                                minH: 2
                                            },
                                          
                                        },
                                    }
                                   
                                }
                                }
                               
                              
                                >
                                    
                                   <Button color="primary" onClick={this.props.toggleForm}>{this.props.graphInfor == null ? "Create Graph" : "Modify Graph"}</Button>
                                  
                                </Link>
                                <Button color="secondary" onClick={this.props.toggleForm}>Cancel</Button>
                            </ModalFooter>
                           
                            </div>
               
    
        )
    }
}


export default connect()(graphForm);
