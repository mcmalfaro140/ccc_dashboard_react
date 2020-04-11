import React, { Component, Suspense } from "react";
import { Container} from 'reactstrap';
import { connect } from 'react-redux';
import { Modal} from 'reactstrap';
import GraphForm from '../components/graphComp/graphForm';
import { getLoggedInUser } from '../helpers/authUtils';
import MixGraphForm from '../components/graphComp/MixGraphForm';
import mykey from '../keys.json';

import AdvSearchModal from '../components/searchComp/AdvSearchModal'

var currentDate = new Date();
var value = [];
const axios = require('axios').default;
// code splitting and lazy loading
const Topbar = React.lazy(() => import("./Topbar"));
const Sidebar = React.lazy(() => import("./Sidebar"));
const RightSidebar = React.lazy(() => import("./RightSidebar"));
const loading = () => <div className="text-center"></div>;


class AuthLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: getLoggedInUser(),
            my_dashboard:[],
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
            screenWidth: 0,
            whichNamespace: "",
            colorSelected:"",
            namespaceNotSelected : true,
            isCondensed: false,
            isFullScreen: false,
            modal0pem: false,
            modalSearch: false,
            modalTableOpen: false,
            mixModalOpen: false,
            count: 0,
            metricName:"", 
            nameSpace:"",
            chartName:"",
            typeOfDimension : "InstanceId",
            idValue:"",
            startTime:new Date(), 
            period:120,
            endTime:new Date() //if needed
                }
        this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.readSelection = this.readSelection.bind(this);
        this.goFullScreen = this.goFullScreen.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.changeScreenSize = this.changeScreenSize.bind(this);
        this.handleExitFull = this.handleExitFull.bind(this);
        this.toggleMixForm = this.toggleMixForm.bind(this);
        this.changeStartDate = this.changeStartDate.bind(this);
        this.changeEndDate = this.changeEndDate.bind(this);
        this.toggleSearchModal = this.toggleSearchModal.bind(this);
        this.saveDashboard = this.saveDashboard.bind(this);
        this.updateDashboard  = this.updateDashboard.bind(this);
        this.logOut = this.logOut.bind(this) 
    }

    saveDashboard(dash_to_save){
        axios({
            method: 'post',
            url: `${mykey.backend}/update`,
            headers: {
                'Authorization': this.props.user.token,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: {
                'dashboard': JSON.stringify(dash_to_save)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
    updateDashboard(dash_to_update){
        this.setState({my_dashboard: dash_to_update})
    }

    changeStartDate = startTime =>{
        this.setState({startTime})
    }
    changeEndDate = endTime =>{
        this.setState({endTime})
    }

    //toggle form
    toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen, isCondensed: false, showMenu: false})
    }

    toggleMixForm = () =>{
        this.setState({mixModalOpen : !this.state.mixModalOpen, isCondensed: false, showMenu: false})
    }


    toggleSearchModal = () =>{
        this.setState({modalSearch : !this.state.modalSearch, isCondensed: false, showMenu: false})
    }

    logOut() {
        this.saveDashboard(this.state.my_dashboard);
        this.props.history.push("/logout");
    }

    //toggleMenu
    toggleMenu = (e) => {
        e.preventDefault();
        this.setState({ showMenu: !this.state.showMenu});
        this.setState({ isCondensed: !this.state.isCondensed});
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
    

    //add event listener for screen resize. It is need it to set the right size for react grid
    componentDidMount() {
        window.addEventListener('fullscreenchange', this.handleExitFull.bind(this));
        window.addEventListener("resize", this.changeScreenSize.bind(this));
        this.setState({screenWidth: (window.innerWidth - 40)});
    }

    handleExitFull(){
        if(this.state.count === 1){
            this.setState({ isFullScreen: false, count: 0})
            this.changeScreenSize()
        }else{
            this.setState({count: 1})
        }
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
        let div = document.getElementById("graphs_layout")
        this.setState({isCondensed : true, isFullScreen: true})
        div.requestFullscreen()
    }
  

    render() {
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              screenSize: this.state.screenWidth,
              isCondensed: this.state.isCondensed,
              saveDashboard: this.saveDashboard,
              updateDashboard: this.updateDashboard
            });
          }) || null;
  
        return (
            <div className="app">
                <div id="wrapper">
                    <Suspense fallback={loading()}>
                        <Topbar rightSidebarToggle={this.toggleRightSidebar} menuToggle={this.toggleMenu} {...this.props} isCondensed={this.state.isCondensed}/>
                        <Sidebar goFullScreen={this.goFullScreen} rightSidebarToggle={this.toggleRightSidebar} menuToggle={this.toggleMenu} toggleForm={this.toggleForm} toggleMixForm = {this.toggleMixForm} toggleSearchModal = {this.toggleSearchModal} isCondensed={this.state.isCondensed} {...this.props} showMenu={this.state.showMenu}  logOut={this.logOut}/>

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
                            <GraphForm whatever={this.props.location.typeOfGraph} toggleForm = {this.toggleForm}/>                            
                        </Modal>

                        <Modal isOpen={this.state.modalSearch} toggle={this.toggleSearchModal} >
                            <AdvSearchModal toggle={this.toggleSearchModal}/>                           
                        </Modal>

                        <Modal isOpen={this.state.mixModalOpen} toggle={this.toggleMixForm} >
                            <MixGraphForm whatever = {this.props.location.typeOfGraph} toggleMixForm = {this.toggleMixForm}/>                            
                        </Modal>
                    </div>
                </div>
                <RightSidebar title={"Settings"}>
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
