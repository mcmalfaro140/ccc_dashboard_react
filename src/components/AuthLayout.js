import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Form} from 'react-bootstrap';
import profilePic from '../assets/images/users/user-1.jpg';
import { SketchPicker } from 'react-color'

//TODO: Make sure to change instanceis for other valuse like ES Takes different parameters

var currentDate = new Date();
var value = [];
// code splitting and lazy loading
const Topbar = React.lazy(() => import("./Topbar"));
const Sidebar = React.lazy(() => import("./Sidebar"));
const RightSidebar = React.lazy(() => import("./RightSidebar"));
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
        this.changeScreenSize = this.changeScreenSize.bind(this);
        this.handleExitFull = this.handleExitFull.bind(this);
        this.toggleMixForm = this.toggleMixForm.bind(this);
        this.mixUpdate = this.mixUpdate.bind(this);
        this.readMixedSelection1 = this.readMixedSelection1.bind(this);
        this.readMixedSelection2 = this.readMixedSelection2.bind(this);
        this.readMixTimeSelection1 = this.readMixTimeSelection1.bind(this);
        this.handleMixChangeComplete1 = this.handleMixChangeComplete1.bind(this);
        this.handleMixChangeComplete2 = this.handleMixChangeComplete2.bind(this);

        this.state = {
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
                chartName1:"",
                typeOfDimension1 : "InstanceId",
                idValue1:"",
                startTime1:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                period1:120,
                endTime1:new Date(),
                colorSelected1:"" 
            },
            showMenu: false,
            screenWidth: 0,
            whichNamespace: "",
            colorSelected:"",
            namespaceNotSelected : true,
            isCondensed: false,
            isFullScreen: false,
            modal0pem: false,
            mixModalOpen: false,
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

    //toggle form
    toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen})
        // this.setState({whichNamespace : ""})
        this.setState({namespaceNotSelected : true})

};
    toggleMixForm = () =>{
        this.setState({mixModalOpen : !this.state.mixModalOpen})
    }

    signOut(e) {
        e.preventDefault();
        this.props.history.push("/login");
    }

    //toggleMenu
    toggleMenu = (e) => {
        e.preventDefault();
        this.setState({ showMenu: !this.state.showMenu});
        this.setState({ isCondensed: !this.state.isCondensed});
        // this.changeScreenSize(this.state.isCondensed)
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

    handleChangeComplete = (color) =>{
        this.setState({colorSelected : color.hex})
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
    readMixTimeSelection1(e){
        if(e.target.value === "Last Hour"){
            this.setState(prevState => {
                let mixGraph = Object.assign({}, prevState.mixGraph);  
                mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())
                mixGraph.period = 60;
                return { mixGraph };                                
              })
        }
        if(e.target.value === "Last Day"){
            this.setState(prevState => {
                let mixGraph = Object.assign({}, prevState.mixGraph);  
                mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())
                mixGraph.period = 120;
                return { mixGraph };                                
              })
        
        }
        if(e.target.value === "Last Week"){

            this.setState(prevState => {
                let mixGraph = Object.assign({}, prevState.mixGraph);  
                mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes())
                mixGraph.period = 600;
                return { mixGraph };                                
              })
        
        
        }
        if(e.target.value === "Last Month"){
            this.setState(prevState => {
                let mixGraph = Object.assign({}, prevState.mixGraph);  
                mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes())
                mixGraph.period = 2400;
                return { mixGraph };                                
              })
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

    //add event listener for screen resize. It is need it to set the right size for react grid
    componentDidMount() {
        window.addEventListener('fullscreenchange', this.handleExitFull.bind(this));
        window.addEventListener("resize", this.changeScreenSize.bind(this));
        this.setState({screenWidth: (window.innerWidth - 40)});
    }

    handleExitFull(){
        this.setState({isFullScreen: false})
    }
    //updates react-grid size when resize
    changeScreenSize(){
        if(this.state.isFullScreen){
            this.setState({screenWidth: (window.innerWidth)})
        }else{
            this.setState({screenWidth: (window.innerWidth - 40)})
        }       
    }

    //toggle fullscreen
    goFullScreen(){
        let div = document.getElementById("dashboard")
        this.setState({isCondensed : true, isFullScreen: !this.state.isFullScreen})
        div.requestFullscreen()
    }
  

    render() {
        // gets the child view which we would like to render
        // const children = this.props.children || null;
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              screenSize: this.state.screenWidth,
              isCondensed: this.state.isCondensed
            });
          }) || null;
  
        return (
            <div className="app">
                <div id="wrapper">
                    <Suspense fallback={loading()}>
                        <Topbar rightSidebarToggle={this.toggleRightSidebar} menuToggle={this.toggleMenu} {...this.props} isCondensed={this.state.isCondensed}/>
                        <Sidebar goFullScreen={this.goFullScreen} rightSidebarToggle={this.toggleRightSidebar} menuToggle={this.toggleMenu} toggleForm={this.toggleForm} toggleMixForm = {this.toggleMixForm} isCondensed={this.state.isCondensed} {...this.props} showMenu={this.state.showMenu} />
                    </Suspense>
                    
                    <div className="content-page">
                            <div className="content">
                                <div>
                                    <Container fluid>
                                        <Suspense fallback={loading()} >
                                            {children}
                                        </Suspense>
                                    </Container>
                                </div>
                            </div>
                        
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
                                    <Button color="primary" onClick={this.toggleForm}>Create graph</Button>
                                </Link>
                                <Button color="secondary" onClick={this.toggleForm}>Cancel</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.mixModalOpen} toggle={this.toggleMixForm} >
                            <ModalHeader toggle={this.toggleMixForm}>New Mix Chart Form</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a mix chart.
                                <form>
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
                                                type:this.props.location.typeOfGraph, //options: line, pie, or bar
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
                                                period:this.state.mixGraph.period,
                                                period1:this.state.mixGraph.period1,
                                                startTime:this.state.mixGraph.startTime, //if needed
                                                endTime:new Date() //if needed
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
                                    <Button color="primary" onClick={this.toggleMixForm}>Create graph</Button>
                                </Link>
                                <Button color="secondary" onClick={this.toggleMixForm}>Cancel</Button>
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
