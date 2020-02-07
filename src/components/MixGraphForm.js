import React, { Component } from 'react';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col, CardBody } from 'reactstrap';
import { SketchPicker } from 'react-color'
import DateTimePicker from 'react-datetime-picker';
import Switch from "react-switch";
import '../assets/react-grid/styles.css'

// import DateTimePicker from 'react-datetime-picker';


/**
 * Renders the preloader
 */

 var value = [];
 var str= "";
 var currentDate = new Date();
class MixGraphForm extends Component {

    constructor(props) {
        super(props);
        
        
        
        this.handleChangeForStart = this.handleChangeForStart.bind(this);
        this.handleChangeForEnd = this.handleChangeForEnd.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.refreshGraph = this.refreshGraph.bind(this);
        this.mixUpdate = this.mixUpdate.bind(this);
        this.readMixedSelection1 = this.readMixedSelection1.bind(this);
        this.readMixedSelection2 = this.readMixedSelection2.bind(this);
        this.readMixTimeSelection1 = this.readMixTimeSelection1.bind(this);
        this.handleMixChangeComplete1 = this.handleMixChangeComplete1.bind(this);
        this.handleMixChangeComplete2 = this.handleMixChangeComplete2.bind(this);
   
      
        this.state = { 
            isRealTime: false,
            refreshRate:"",
           
              mixGraph:{
                typeOfGraph:"",
                metricName:"", 
                nameSpace:"",
                chartName:"",
                typeOfDimension : "InstanceId",
                idValue:"",
                colorSelected:"",
    
                typeOfGraph1:"",
                metricName1:"", 
                nameSpace1:"",
                typeOfDimension1 : "InstanceId",
                idValue1:"",
                colorSelected1:"" 
            },
                startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                period:120,
                endTime:new Date(),

        
    
    
    }}

   //Mix form update
   mixUpdate(e,i){
    e.preventDefault();
    value[i] = e.target.value;
    if(value.length >9){
        value = []
    }
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.nameSpace = value[0];   
        mixGraph.nameSpace1 = value[1];  
        mixGraph.chartName = value[2];
        mixGraph.metricName = value[3]; 
        mixGraph.metricName1 = value[4]; 
        mixGraph.typeOfDimension = value[5]; 
        mixGraph.typeOfDimension1 = value[6]; 
        mixGraph.idValue = value[7];
        mixGraph.idValue1 = value[8];
        return { mixGraph };                                
      })
  
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
handleChangeForStart = date => {
    this.setState({
      startTime: date
    });
   
  };
  handleChangeForEnd = date => {
    this.setState({
      endTime: date
    });
  };
  
  readMixTimeSelection1(e){
    if(e.target.value === "Last Hour"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())})
        this.setState({period : 60})
        // this.setState(prevState => {
        //     let mixGraph = Object.assign({}, prevState.mixGraph);  
        //     mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())
        //     mixGraph.period = 60;
        //     return { mixGraph };                                
        //   })
    }
    if(e.target.value === "Last Day"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())})
        this.setState({period : 120})
        // this.setState(prevState => {
        //     let mixGraph = Object.assign({}, prevState.mixGraph);  
        //     mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())
        //     mixGraph.period = 120;
        //     return { mixGraph };                                
        //   })
    
    }
    if(e.target.value === "Last Week"){

        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes())})
        this.setState({period : 600})
        // this.setState(prevState => {
        //     let mixGraph = Object.assign({}, prevState.mixGraph);  
        //     mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes())
        //     mixGraph.period = 600;
        //     return { mixGraph };                                
        //   })
    
    
    }
    if(e.target.value === "Last Month"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes())})
        this.setState({period : 2400})
        // this.setState(prevState => {
        //     let mixGraph = Object.assign({}, prevState.mixGraph);  
        //     mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes())
        //     mixGraph.period = 2400;
        //     return { mixGraph };                                
        //   })
    }
}
refreshGraph(e){
    if(e.target.value === "Thirty Seconds"){
        this.setState({refreshRate : 30000})
    }
    if(e.target.value === "One minute"){
        this.setState({refreshRate : 60000 })
    }
    if(e.target.value === "Ten minutes"){
        this.setState({refreshRate : 600000})
    }
    if(e.target.value === "Half an hour"){
        this.setState({refreshRate : 1800000})
    }
 }
readMixedSelection1(e){
    console.log(e.target.value);
    var type = e.target.value;
    this.setState(prevState => ({
        mixGraph: {                   // object that we want to update
            ...prevState.mixGraph,    // keep all other key-value pairs
            typeOfGraph:type    // update the value of specific key
        }
    }))
}
readMixedSelection2(e){
    console.log(e.target.value);
    var type = e.target.value;
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.typeOfGraph1 = type;                                     
        return { mixGraph };                               
      })
}
  

handleMixChangeComplete1 = (color) =>{
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.colorSelected = color.hex
        return { mixGraph };                                
      })
}
handleMixChangeComplete2 = (color) =>{
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.colorSelected1 = color.hex
        return { mixGraph };                                
      })
}


   


    
    
    

    render() {

        
        var timeSelection;
        if(this.state.isRealTime === true){
            timeSelection = 
         <div>
             
             <Form.Group controlId="exampleForm.ControlSelect2">
                 <Form.Label>Time Range</Form.Label>
                  <Form.Control as="select"  
                 onChange={(e) => this.readMixTimeSelection1(e)}>
                    <option disabled selected>Make Selection</option>
                     <option value = "Last Hour">Last Hour</option>
                     <option value = "Last Day">Last Day</option>
                     <option value = "Last Week">Last Week</option>
                     <option value = "Last Month">Last Month</option>
                        </Form.Control>
                         <Form.Text className="text-muted">
                             Select the time
                         </Form.Text>
                    </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect10">
            <Form.Label>Refresh Rate</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.refreshGraph(e)}>
            <option disabled selected>Make Selection</option>
            <option value = "Thirty Seconds">Thirty Seconds</option>
            <option value = "One minute">One minute</option>
            <option value = "Ten minutes">Ten minutes</option>
            <option value = "Half an hour">Half an hour</option>
            
            </Form.Control>
            <Form.Text className="text-muted">
                Select the refresh rate
                </Form.Text>
            </Form.Group>
         </div>
           
            
        }
        else{
            timeSelection = 
            <div>
            <Form>                        
            <Row>
                <Col>
                     <Form.Label>Start Time</Form.Label>
                        <DateTimePicker 
                            value={this.state.startTime}
                            onChange = {this.handleChangeForStart} />
                </Col>
                <Col>
                        <Form.Label>End Time</Form.Label>
                                <DateTimePicker 
                                    value={this.state.endTime}
                                    onChange = { this.handleChangeForEnd} />
                </Col>
            </Row>
            </Form>
           
            </div>
        }

      // console.log("the str is " + str);
      
        return (

         
                        <div>
                        <ModalHeader toggle={this.props.toggleMixForm}>New Mix Chart Form</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a mix chart.
                                <form>
                                < Form.Group>
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
                                </Form.Group>
                                <Form>
                                    <Row>
                                        <Col>
                                         <Form.Label>Graph 1</Form.Label>
                                        </Col>
                                        <Col>
                                         <Form.Label>Graph 2</Form.Label>
                                        </Col>
                                    </Row>
                                </Form>
                               
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                        <Row>
                                            <Col>
                                            <Form.Label>Type of graph: </Form.Label>
                                            <Form.Control as="select"  
                                        onChange={(e) => this.readMixedSelection1(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "line">Line Graph</option>
                                        <option value = "bar">Bar Graph</option>
                                        </Form.Control>                                         
                                           <Form.Text className="text-muted">
                                            Select the type
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Type of graph: </Form.Label>
                                            <Form.Control as="select"  
                                        onChange={(e) => this.readMixedSelection2(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "line">Line Graph</option>
                                        <option value = "bar">Bar Graph</option>
                                        </Form.Control>                                         
                                           <Form.Text className="text-muted">
                                            Select the type
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Name Space: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the name space" onChange = {(e) => this.mixUpdate(e,0)} />
                                            <Form.Text className="text-muted">
                                            specify the name space ...
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Name Space: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the name space" onChange = {(e) => this.mixUpdate(e,1)} />
                                            <Form.Text className="text-muted">
                                            specify the name space ...
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>

                                    <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>Chart name: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the chart name" onChange = {(e) => this.mixUpdate(e,2)} />
                                            <Form.Text className="text-muted">
                                            specify the chart name that you want...                                            
                                            </Form.Text>  
                                   </Form.Group>


                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Metric name: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the metric name" onChange = {(e) => this.mixUpdate(e,3)} />
                                            <Form.Text className="text-muted">
                                            specify the metric name that you want...                                        
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Metric name: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the metric name" onChange = {(e) => this.mixUpdate(e,4)} />
                                            <Form.Text className="text-muted">
                                            specify the metric name that you want...                                        
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>

                                {/* <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Name Space: </Form.Label>
                                         <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,0)}/>
                                        <Form.Text className="text-muted">
                                        specify the name space ...
                                        </Form.Text>
                                    </Form.Group> */}

                                    {/* <fieldset disabled={this.state.namespaceNotSelected}>
                                    <Form.Group controlId="chartName">
                                        <Form.Label>Chart Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,1)}/>
                                        <Form.Text className="text-muted">
                                        specify the chart name that you want...
                                        </Form.Text>
                                    </Form.Group> */}

                                    {/* <Form.Group controlId="metricName">
                                        <Form.Label>Metric Name: </Form.Label> 
                                         <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,2)}/>
                                        <Form.Text className="text-muted">
                                        specify the metric name that you want...
                                        </Form.Text> 
                                     </Form.Group>  */}
                                    
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the dimension name" onChange = {(e) => this.mixUpdate(e,5)} />
                                            <Form.Text className="text-muted">
                                            Enter the dimension 
                                            Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Dimension: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the value" onChange = {(e) => this.mixUpdate(e,6)} />
                                            <Form.Text className="text-muted">
                                            Enter the dimension 
                                            Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>

                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the dimension name" onChange = {(e) => this.mixUpdate(e,7)} />
                                            <Form.Text className="text-muted">
                                            Enter the value
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the value" onChange = {(e) => this.mixUpdate(e,8)} />
                                            <Form.Text className="text-muted">
                                            Enter the value
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>

                                    {/* <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>Time Range</Form.Label>
                                        <Form.Control as="select"  
                                        onChange={(e) => this.readMixTimeSelection1(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "Last Hour">Last Hour</option>
                                        <option value = "Last Day">Last Day</option>
                                        <option value = "Last Week">Last Week</option>
                                        <option value = "Last Month">Last Month</option>
                                        </Form.Control>
                                        <Form.Text className="text-muted">
                                            Select the time
                                            </Form.Text>
                                     </Form.Group> */}
                                     {timeSelection}

                                    {/* <Form.Group controlId="exampleForm.ControlSelect2">
                                        <Form.Label>Time Range</Form.Label>
                                        <Form.Control as="select"  
                                        onChange={(e) => this.readSelection(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "Last Hour">Last Hour</option>
                                        <option value = "Last Day">Last Day</option>
                                        <option value = "Last Week">Last Week</option>
                                        <option value = "Last Month">Last Month</option>
                                        </Form.Control>
                                        <Form.Text className="text-muted">
                                            Select the time
                                            </Form.Text>
                                    </Form.Group> */}

                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Graph Color</Form.Label>
                                                <SketchPicker
                                                color = {this.state.mixGraph.colorSelected}
                                                onChange = {this.handleMixChangeComplete1}
                                                />
                                            </Col>
                                            <Col>
                                            <Form.Label>Graph Color</Form.Label>
                                                <SketchPicker
                                                color = {this.state.mixGraph.colorSelected1}
                                                onChange = {this.handleMixChangeComplete2}
                                                />
                                             </Col>
                                        </Row>
                                    </Form>

                                    {/* <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Graph Color</Form.Label>
                                       <SketchPicker
                                       color = {this.state.colorSelected}
                                       onChange = {this.handleChangeComplete}
                                       />
                                    </Form.Group> */}
                                   
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newGraph:{
                                            objectType:"graph", // options: graph or table
                                            graphSettings: {
                                                type:this.props.whatever, //options: line, pie, or bar
                                                typeOfGraph: this.state.mixGraph.typeOfGraph,
                                                typeOfGraph1 : this.state.mixGraph.typeOfGraph1,
                                                realTime:"false", //options: true or false
                                                metricName:this.state.mixGraph.metricName, 
                                                metricName1:this.state.mixGraph.metricName1,
                                                nameSpace:this.state.mixGraph.nameSpace,
                                                nameSpace1:this.state.mixGraph.nameSpace1,
                                                chartName:this.state.mixGraph.chartName,
                                                typeOfDimension : this.state.mixGraph.typeOfDimension,
                                                typeOfDimension1 : this.state.mixGraph.typeOfDimension1,
                                                idValue:this.state.mixGraph.idValue,
                                                idValue1:this.state.mixGraph.idValue1,
                                                refreshRate:"",
                                                colorSelected:this.state.mixGraph.colorSelected,
                                                colorSelected1:this.state.mixGraph.colorSelected1,
                                                period:this.state.period,
                                                startTime:this.state.startTime, //if needed
                                                endTime:this.state.endTime //if needed
                                            },
                                            coordinates: {
                                                x: 0,
                                                y: 0,
                                                w: 6,
                                                h: 4,
                                                minW: 6,
                                                minH: 9
                                            },
                                          
                                        }
                                    }
                                }}>
                                    <Button color="primary" onClick={this.props.toggleMixForm}>Create graph</Button>
                                </Link>
                                <Button color="secondary" onClick={this.props.toggleMixForm}>Cancel</Button>
                            </ModalFooter>
                           
                            </div>
               
    
        )
    }
}


export default connect()(MixGraphForm);
