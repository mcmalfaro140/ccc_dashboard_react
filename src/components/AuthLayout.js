import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Form} from 'react-bootstrap';
import profilePic from '../assets/images/users/user-1.jpg';
import Fullscreen from "react-full-screen";

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
        this.state = {
            isCondensed: false,
            isFull: false,
            modal0pem: false,
            metricName:"", 
            nameSpace:"",
            chartName:"",
            instanceId:"i-0e84c5d781008a00e",
            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
            period:120,
            endTime:new Date() //if needed
           // new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())
        }
    }

    //toggle fullscreen
    goFullScreen = () => this.setState({isFull : !this.state.isFull})

    //toggle form
    toggleForm = () => this.setState({modalOpen : !this.state.modalOpen});

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
       
        value[i] = e.target.value;
        if(value.length > 4){
            value = [];
        }
      
        this.setState({metricName : value[0]})
        this.setState({nameSpace : value[1]});
        this.setState({chartName : value[2]});
        this.setState({instanceId : value[3]});
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
                                     <Form.Group controlId="metricName">
                                        <Form.Label>Metric Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,0)}/>
                                        <Form.Text className="text-muted">
                                        specify the metric name that you want...
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="nameSpace">
                                        <Form.Label>Name Space: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,1)}/>
                                        <Form.Text className="text-muted">
                                        specify the name space ...
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="chartName">
                                        <Form.Label>Chart Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,2)}/>
                                        <Form.Text className="text-muted">
                                        specify the chart name that you want...
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="instanceId">
                                            <Form.Label>Instance ID: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter instance id" onChange = {(e) => this.update(e,3)} />
                                            <Form.Text className="text-muted">
                                            Enter your instance id
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Time Range</Form.Label>
                                        <Form.Control as="select"  
                                        onChange={(e) => this.readSelection(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "Last Hour">Last Hour</option>
                                        <option value = "Last Day">Last Day</option>
                                        <option value = "Last Week">Last Week</option>
                                        <option value = "Last Month">Last Month</option>
                                        </Form.Control>
                                    </Form.Group>
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
                                                instanceId:this.state.instanceId,
                                                refreshRate:"",
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
export default connect(mapStateToProps, null)(AuthLayout);
