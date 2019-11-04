import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Form} from 'react-bootstrap';


import profilePic from '../assets/images/users/user-1.jpg';

var currentDate = new Date();
var value = [];
// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
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
        this.state = {
            isCondensed: false,
            modal0pem: false,
            realTime:"false", //options: true or false
            metricName:"CPUCreditUsage", 
            nameSpace:"AWS/EC2",
            chartName:"TestBar",
            instanceId:"i-0e84c5d781008a00e",
            refreshRate:"",
            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
            endTime:new Date() //if needed
        }
    }

    toggleForm = () => this.setState({modalOpen : !this.state.modalOpen});

    signOut(e) {
        e.preventDefault();
        this.props.history.push("/login");
    }

    /**
     * toggle Menu
     */
    toggleMenu = (e) => {
        e.preventDefault();
        this.setState({ isCondensed: !this.state.isCondensed });
    }

    /**
     * Toggle right side bar
     */
    toggleRightSidebar = () => {
        document.body.classList.toggle("right-bar-enabled");
    }
    update(e,i){
        e.preventDefault();
       // console.log(e.target.value);
       
        value[i] = e.target.value;
        if(value.length > 4){
            value = [];
        }
        // var newGraph = {...this.state.newGraph};
        // newGraph["metricName"] = value[0];
        // newGraph["nameSpace"] = value[1];
        // newGraph["chartName"] = value[2];
        // newGraph["instanceId"] = value[3];
        // this.setState({newGraph : newGraph});
        this.setState(prevState => ({
          newGraph: {
            ...prevState.newGraph,           
            graphSettings: {                     
              ...prevState.newGraph.pizza,   
              metricName : value[0],
              nameSpace : value[1],
              chartName : value[2],
              instanceId : value[3]         
            }
          }
        }))
        // this.setState({nameSpace : value[1]});
        // this.setState({chartName : value[2]});
        // this.setState({accessKeyId : value[3]});
        // this.setState({secretAccessKey : value[4]});
        // this.setState({instanceId : value[3]});
        //this.setState({region : value[6]});
        // this.setState({startTime : value[7]});
        // this.setState({endTime : value[8]});

      

    }

    render() {
        // get the child view which we would like to render
        const children = this.props.children || null;
        
        return (
            <div className="app">
                <div id="wrapper">
                    <Suspense fallback={loading()}>
                        <Topbar rightSidebarToggle={this.toggleRightSidebar} menuToggle={this.toggleMenu} {...this.props} />
                        <Sidebar rightSidebarToggle={this.toggleRightSidebar} toggleForm={this.toggleForm} isCondensed={this.state.isCondensed} {...this.props} />
                    </Suspense>
                    <div className="content-page">
                        <div className="content">
                            <div>
                            <Container fluid>
                                        <Suspense fallback={loading()}>
                                            {children}
                                        </Suspense>
                            </Container>
                            </div>
                        </div>
                        
                        <Modal isOpen={this.state.modalOpen} toggle={this.toggleForm} >
                            <ModalHeader toggle={this.toggleForm}>Modal title</ModalHeader>
                            <ModalBody>
                            If you click done it will add a new graph. This is gonna be the form.

                            <form>
 
 <Form.Group controlId="metricName">
     <Form.Label>Metric Name: </Form.Label>
     <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,0)}/>
     <Form.Text className="text-muted">
       specify the metric name that you want...
     </Form.Text>
 </Form.Group>
 {/* <LineGraph mName = {this.state.metricName}/> */}
        
        
     <Form.Group controlId="nameSpace">
         <Form.Label>Name Space: </Form.Label>
         <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,1)}/>
          <Form.Text className="text-muted">
         specify the name space ...
         </Form.Text>
     </Form.Group>
     {/* <LineGraph nSpace = {this.state.nameSpace}/> */}
       
      

 <Form.Group controlId="chartName">
     <Form.Label>Chart Name: </Form.Label>
     <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,2)}/>
     <Form.Text className="text-muted">
       specify the chart name that you want...
     </Form.Text>
 </Form.Group>
 {/* <LineGraph cName = {this.state.chartName}/> */}
   
         {/* <p>Refresh Rate: </p>
         <input
           type='text'
           // onMouseDown={this.stopPropagation}
           // onTouchStart={this.stopPropagation}
           name = "refreshRate"
           // onChange = {(e) => this.update(e,3)}
           // id = {this.state.ElementId}
         /> */}
   
        
  {/* <Form.Group controlId="accessKeyId">
         <Form.Label>Access Key ID: </Form.Label>
          <Form.Control type="text" placeholder="Enter access key id" onChange = {(e) => this.update(e,3)}/>
         <Form.Text className="text-muted">
           Enter your access key id
      </Form.Text>
 </Form.Group> */}
 {/* <LineGraph aId = {this.state.accessKeyId}/> */}
   
        
 {/* <Form.Group controlId="secretAccessKey">
         <Form.Label>Secret Access Key: </Form.Label>
          <Form.Control type="text" placeholder="Enter secret access key" onChange = {(e) => this.update(e,4)}/>
         <Form.Text className="text-muted">
           Enter your secret access key 
      </Form.Text>
 </Form.Group> */}
 {/* <LineGraph sKey = {this.state.secretAccessKey}/> */}
   
        
 <Form.Group controlId="instanceId">
         <Form.Label>Instance ID: </Form.Label>
          <Form.Control type="text" placeholder="Enter instance id" onChange = {(e) => this.update(e,3)} />
         <Form.Text className="text-muted">
           Enter your instance id
      </Form.Text>
 </Form.Group>
 {/* <LineGraph iId = {this.state.instanceId}/> */}
   
        

 {/* <Form.Group controlId="region">
         <Form.Label>Region </Form.Label>
          <Form.Control type="text" placeholder="Enter region" onChange = {(e) => this.update(e,6)}/>
         <Form.Text className="text-muted">
           Enter the region of your instance
      </Form.Text>
 </Form.Group> */}
 {/* <LineGraph region = {this.state.region}/> */}

 {/* <Form.Group controlId="startTime">
         <Form.Label>Start Time:  </Form.Label>
         <DateTimePicker
   onChange = {this.handleChangeForStart}
   value = {this.state.startTime}
 />
 </Form.Group>

 <Form.Group controlId="endTime">
         <Form.Label>End Time:  </Form.Label>
         <DateTimePicker
   onChange = {this.handleChangeForEnd}
   value = {this.state.endTime}
 />
 </Form.Group>         */}

       <Form.Group controlId="exampleForm.ControlSelect1">
             <Form.Label>Time Range</Form.Label>
             <Form.Control as="select" 
              placeholder="select" 
              onChange={this.readSelection}>
             <option value = "6 hour">Last Hour</option>
             <option value = "Last Day">Last Day</option>
             <option value = "Last Week">Last Week</option>
             <option value = "Last Month">Last Month</option>
             </Form.Control>
         </Form.Group>
   
           {/* <Button variant = "primary" type="submit"  
         
          ></Button> */}
          

          
               
         </form> 


                            </ModalBody>
                            <ModalFooter>
                            <Link to={{pathname:'/dashboard', state:{ 
                                                newGraph:{
                                                    objectType:"graph", // options: graph or table
                                                    graphSettings: {
                                                            type:this.props.location.typeOfGraph, //options: line, pie, or bar
                                                            realTime:"false", //options: true or false
                                                            metricName:"CPUCreditUsage", 
                                                            nameSpace:"AWS/EC2",
                                                            chartName:"TestBar",
                                                            instanceId:"i-0e84c5d781008a00e",
                                                            refreshRate:"",
                                                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                                                            endTime:new Date() //if needed
                                                    }
                                                }
                                                }}}>
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
