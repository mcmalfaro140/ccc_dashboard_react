import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Form} from 'react-bootstrap';
import profilePic from '../assets/images/users/user-1.jpg';
import Fullscreen from "react-full-screen";
import { SketchPicker } from 'react-color'

//TODO: Make sure to change instanceis for other valuse like ES Takes different parameters

var currentDate = new Date();
var value = [];
// code splitting and lazy loading
const Topbar = React.lazy(() => import("./Topbar"));
const Sidebar = React.lazy(() => import("./Sidebar"));
const RightSidebar = React.lazy(() => import("./RightSidebar"));
const Footer = React.lazy(() => import("./Footer"));
const loading = () => <div className="text-center"></div>;

const RightSidebarContent = (props) => {
    return <div className="user-box">
        <div className="user-img">
            <img src={profilePic} alt="user-img" title="Nik Patel"
                className="rounded-circle img-fluid" />
            <a href="/" className="user-edit"><i className="mdi mdi-pencil"></i></a>
        </div>

        <h5>{props.user && <a href="/">{props.user.username}</a>}</h5>
        <p className="text-muted mb-0"><small>Founder</small></p>
    </div>
}


class AuthLayout extends Component {

    constructor(props) {
        super(props);

        this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.readSelection = this.readSelection.bind(this);
        this.goFullScreen = this.goFullScreen.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.state = {
            whichNamespace: "",
            colorSelected:"",
            namespaceNotSelected : true,
            isCondensed: false,
            isFull: false,
            modal0pem: false,
            metricName:"", 
            nameSpace:"",
            chartName:"",
            typeOfDimension : "InstanceId",
            idValue:"",
            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
            period:120,
            endTime:new Date() //if needed
           // new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())
        }
    }

    //toggle fullscreen
    goFullScreen = () => this.setState({isFull : !this.state.isFull})

    //toggle form
    toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen})
        this.setState({whichNamespace : ""})
        this.setState({namespaceNotSelected : true})
};

    signOut(e) {
        e.preventDefault();
        this.props.history.push("/login");
    }

    //toggleMenu
    toggleMenu = (e) => {
        e.preventDefault();
        this.setState({ isCondensed: !this.state.isCondensed });
    }

    //toggle right side bar
    toggleRightSidebar = () => {
        document.body.classList.toggle("right-bar-enabled");
    }

    //Form update
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

    handleChangeComplete = (color) =>{
        this.setState({colorSelected : color.hex})
    }

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
  
    

    render() {
        // gets the child view which we would like to render
        const children = this.props.children || null;
  
        return (
            <div className="app">
                <div id="wrapper">
                    <Suspense fallback={loading()}>
                        <Topbar rightSidebarToggle={this.toggleRightSidebar} menuToggle={this.toggleMenu} {...this.props} />
                        <Sidebar goFullScreen={this.goFullScreen} rightSidebarToggle={this.toggleRightSidebar} toggleForm={this.toggleForm} isCondensed={this.state.isCondensed} {...this.props} />
                    </Suspense>
                    
                    <div className="content-page">
                        <Fullscreen enabled={this.state.isFull}>
                            <div className="content">
                                <div>
                                    <Container fluid>
                                        <Suspense fallback={loading()}>
                                            {children}
                                        </Suspense>
                                    </Container>
                                </div>
                            </div>
                        </Fullscreen>
                        
                        <Modal isOpen={this.state.modalOpen} toggle={this.toggleForm} >
                            <ModalHeader toggle={this.toggleForm}>New Chart Form</ModalHeader>
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
                                                type:this.props.location.typeOfGraph, //options: line, pie, or bar
                                                realTime:"false", //options: true or false
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
                                            }
                                        }
                                    }
                                }}>
                                    <Button color="primary" onClick={this.toggleForm}>Create graph</Button>
                                </Link>
                                <Button color="secondary" onClick={this.toggleForm}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>

                <RightSidebar title={"Settings"}>
                    <RightSidebarContent user={this.props.user} />
                </RightSidebar>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.Auth.user
    }
}


// var ec2Form = React.createClass({
//     render:function(){
//         return(<h3>hey</h3>)
//     }
// })
export default connect(mapStateToProps, null)(AuthLayout);
