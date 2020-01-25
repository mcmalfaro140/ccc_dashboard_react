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
class graphForm extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.submit = this.submit.bind(this);
        this.readSelection = this.readSelection.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
      
        this.state = { 
            newGraph:{
              mixGraph:{
                typeOfGraph:"",
                metricName:"", 
                nameSpace:"",
                chartName:"",
                typeOfDimension : "InstanceId",
                idValue:"",
                startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                period:120,
                endTime:new Date(),
                colorSelected:"",
    
                typeOfGraph1:"",
                metricName1:"", 
                nameSpace1:"",
                typeOfDimension1 : "InstanceId",
                idValue1:"",
                startTime1:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                endTime1:new Date(),
                colorSelected1:"" 
            },
            showMenu: false,
            isRealTime: false,
            screenWidth: 0,
            whichNamespace: "",
            colorSelected:"",
            namespaceNotSelected : true,
            isCondensed: false,
            isFullScreen: false,
            modalOpen: false,
            mixModalOpen: false,
            metricName:"", 
            nameSpace:"",
            chartName:"",
            typeOfDimension : "InstanceId",
            idValue:"",
          //  startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
          startTime:new Date(), 
          period:120,
            endTime:new Date() //if needed
              ,
       
           
        

        }
    
    
    }}
    toggleSwitch = () =>{
        this.setState({isRealTime: !this.state.isRealTime})
    }
    toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen})
        // this.setState({whichNamespace : ""})
        this.setState({namespaceNotSelected : true})

};
    //Dropdown helper
    readSelection(e){
      if(e.target.value === "Last Hour"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())})
          this.setState({period : 60})
      }
      if(e.target.value === "Last Day"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())})
          this.setState({period : 120})
      }
      if(e.target.value === "Last Week"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes())})
          this.setState({period : 600})
      }
      if(e.target.value === "Last Month"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes())})
          this.setState({period : 2400})
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
    
      // this.setState({metricName : value[0]})
      // this.setState({nameSpace : value[1]});
      this.setState({nameSpace : value[0]});
      this.setState({chartName : value[1]});
      this.setState({metricName : value[2]});
      this.setState({typeOfDimension : value[3]});
      this.setState({idValue : value[4]});
  }


   
    submit(e){
  
      
        e.preventDefault();
       
        this.props.history.push({
           // pathname: str,
            pathname: "/Dashboard",
            state: {
                newGraph : this.state.newGraph,
                // metricName: this.state.metricName,
                // nameSpace : this.state.nameSpace,
                // chartName : this.state.chartName,
                // // accessKeyId : this.state.accessKeyId,
                // // secretAccessKey : this.state.secretAccessKey,
                // instanceId : this.state.instanceId,
                // //region : this.state.region,
                // // startTime : this.state.startTime,
                // // endTime : this.state.endTime


            
            }  
        })
        
       
    }

 
    // handleChangeForStart = date => {
    //     this.setState({
    //       startTime: date
    //     });
    //     console.log(this.state.startTime)
    //   };
      // handleChangeForEnd = date => {
      //   this.setState({
      //     endTime: date
      //   });
      //   console.log(this.state.endTime)
      // };


    

    render() {
  

      // console.log("the str is " + str);
      
        return (

         
                        <div>
                        <ModalHeader toggle={this.props.toggleForm}>New Chart Form</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a chart.
                                <form>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Name Space: </Form.Label>
                                         <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,0)}/>
                                        <Form.Text className="text-muted">
                                        specify the name space ...
                                        </Form.Text>
                                    </Form.Group>

                                <Form.Group>
                                    <label>
                                        <span>Real Time</span>
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
                                        width={60}
                                        className="react-switch"
                                        id="material-switch"
                                    />
                                         <span>Historic</span>

                                    </label>
                                </Form.Group>

                                    <fieldset disabled={this.state.namespaceNotSelected}>
                                    <Form.Group controlId="chartName">
                                        <Form.Label>Chart Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,1)}/>
                                        <Form.Text className="text-muted">
                                        specify the chart name that you want...
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="metricName">
                                        <Form.Label>Metric Name: </Form.Label> 
                                         <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,2)}/>
                                        <Form.Text className="text-muted">
                                        specify the metric name that you want...
                                        </Form.Text> 
                                     </Form.Group> 
                                    
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the dimension name" onChange = {(e) => this.update(e,3)} />
                                            <Form.Text className="text-muted">
                                            Enter the dimension 
                                            Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the value" onChange = {(e) => this.update(e,4)} />
                                            <Form.Text className="text-muted">
                                            Enter the value
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Form>
                                    
                                    <Row>
                                        <Col>
                                             <Form.Label>Start Time</Form.Label>
                                                <DateTimePicker 
                                                    value={this.state.startTime}
                                                    onChange = {this.changeStartDate} />
                                        </Col>
                                        <Col>
                                                <Form.Label>End Time</Form.Label>
                                                        <DateTimePicker 
                                                            value={this.state.endTime}
                                                            onChange = {this.changeEndDate} />
                                        </Col>
                                    </Row>

                                    

                                    </Form>
                                    <Form.Group controlId="exampleForm.ControlSelect2">
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
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Graph Color</Form.Label>
                                       <SketchPicker
                                       color = {this.state.colorSelected}
                                       onChange = {this.handleChangeComplete}
                                       />
                                    </Form.Group>

                                    



                                    </fieldset>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newGraph:{
                                            objectType:"graph", // options: graph or table
                                            graphSettings: {
                                                type:this.props.whatever, //options: line, pie, or bar
                                                realTime:this.state.isRealTime, //options: true or false
                                                metricName:this.state.metricName, 
                                                nameSpace:this.state.nameSpace,
                                                chartName:this.state.chartName,
                                                typeOfDimension : this.state.typeOfDimension,
                                                idValue:this.state.idValue,
                                                refreshRate:"",
                                                colorSelected:this.state.colorSelected,
                                                period:this.state.period,
                                                startTime:this.state.startTime, //if needed
                                                endTime:new Date() //if needed
                                            },
                                            coordinates: {
                                                x: 0,
                                                y: 0,
                                                w: 10,
                                                h: 9,
                                                minW: 6,
                                                minH: 9
                                            },
                                          
                                        }
                                    }
                                }}>
                                    <Button color="primary" onClick={this.props.toggleForm}>Create graph</Button>
                                </Link>
                                <Button color="secondary" onClick={this.props.toggleForm}>Cancel</Button>
                            </ModalFooter>
                           
                            </div>
               
    
        )
    }
}


export default connect()(graphForm);
