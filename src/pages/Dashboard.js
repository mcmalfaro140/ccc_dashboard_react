import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';

import LineGraph from '../components/LineGraph';
import LogWarn from '../components/LogWarn';
import NightlyTasks from '../components/NightlyTask';
import ServerStatus from '../components/ServerStatus';
import BarGraph from '../components/BarGraph';
import MixGraph from '../components/MixGraph';
import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import { Button } from 'react-bootstrap';
import GridLayout from 'react-grid-layout';
import Table from './Tables';
import LogReport from '../components/logRepotComp';


import GraphForm from '../components/graphForm';



//import css needed for reac-grid-layout
import '../assets/react-grid/styles.css';
import '../assets/react-grid/styles1.css';


var currentDate = new Date()


class DefaultDashboard extends Component {
   
    constructor(props) {
        
        super(props);
        this.state = {
            user: getLoggedInUser(),
            isModify : false,
            stickyFormData :{},
            userDashboard: [
                {
                    objectType:"graph", // options: graph or table
                    id:0,
                    graphSettings: {
                            type:"line", //options: line, pie, or bar
                            realTime:true, //options: true or false
                            metricName:"CPUCreditUsage", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test",
                            instanceId:"i-01e27ec0da2c4d296",
                            refreshRate:"2000",
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        },
                    coordinates: {
                        x: 0,
                        y: 1,
                        w: 20,
                        h: 19,
                        minW: 6,
                        minH: 9,
                        maxH: 18
                    }
                },
                {
                    objectType:"table", // options: graph or table
                    id:1,
                    tableSettings:{
                        master:"true",
                    },
                    coordinates: {
                        x: 0,
                        y: 2,
                        w: 20,
                        h: 11,
                        minW: 4,
                        minH: 11
                    }
                    
                },
                {
                    objectType:"graph", // options: graph or table
                    id:2,
                    graphSettings: {
                            type:"bar", //options: line, pie, or bar
                            realTime:true, //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"TestBar",
                            instanceId:"i-01e27ec0da2c4d296",
                            refreshRate:"2000",
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        },
                    coordinates: {
                        x: 0,
                        y: 3,
                        w: 10,
                        h: 10,
                        minW: 6,
                        minH: 9
                    }
                },
                {
                    objectType:"graph", // options: graph or table
                    id:3,
                    graphSettings: {
                            type:"pie", //options: line, pie, or bar
                            realTime:"false", //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test",
                            instanceId:"i-01e27ec0da2c4d296",
                            refreshRate:"",
                            period:"",
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        },
                    coordinates: {
                        x: 10,
                        y: 3,
                        w: 10,
                        h: 10,
                        minW: 6,
                        minH: 9
                    }
                },               
            ],
            showOptions: false,
            systemHealth: false

        };
        this.showOptions = this.showOptions.bind(this);
        this.systemHealth = this.systemHealth.bind(this);
        this.recordCoordinateChange = this.recordCoordinateChange.bind(this);
    }

    deleteFunction = (childData) => {
           let newDashboard = this.state.userDashboard;
            for(let i = newDashboard.length -1; i>=0;--i){
                if(newDashboard[i].id === childData){
                    newDashboard.splice(i,1);
                    this.setState({userDashboard : newDashboard});
                }   
        }
  }

    modifyFunction = (childData) => {
            let newDashboard = this.state.userDashboard;
            this.setState({isModify: !this.state.isModify});
            for(let i = newDashboard.length-1; i>=0;--i){
                if(newDashboard[i].id === childData){
                    this.setState({stickyFormData : newDashboard[i]});
                }
            }
    }
    

    componentWillReceiveProps(nextProps){
        let temp = this.state.userDashboard
        if(nextProps.location.state){
            //only activate adds to the array if the props are the specify ones
            if(nextProps.location.state.newMasterTable){
                let newName = nextProps.location.state.newMasterTable.chartName;
                let preName = this.state.newUpcomingPropsName;
                if(newName !== preName){
                    nextProps.location.state.newMasterTable["id"] = this.state.userDashboard.length;
                    temp.push(nextProps.location.state.newMasterTable);
                    this.setState({
                        userDashboard: temp,
                        newUpcomingPropsName: newName
                    })
                }
            }else if(nextProps.location.state.newGraph){
                let newName = nextProps.location.state.newGraph.graphSettings.chartName;
                let preName = this.state.newUpcomingPropsName;
                if(newName !== preName){
                  //  nextProps.location.state.newGraph.id = this.state.userDashboard.length
                  nextProps.location.state.newGraph["id"] = this.state.userDashboard.length;
                    temp.push(nextProps.location.state.newGraph);
                    this.setState({
                        userDashboard: temp,
                        newUpcomingPropsName: newName
                    })
                }
                console.log(this.state.userDashboard);
                
            }
          
        }       
        
    }
    showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
    }
    systemHealth(e){
        e.preventDefault();
        this.setState({ systemHealth: !this.state.systemHealth});
    }

    //Gets call when the user resize the dashboard. Saves the new coordinates
    recordCoordinateChange(newLayout){
        let temp = this.state.userDashboard
        newLayout.forEach(element => {
            let chart = temp[parseInt(element.i)]
            chart.coordinates.x = element.x
            chart.coordinates.y = element.y
            chart.coordinates.w = element.w
            chart.coordinates.h = element.h
        });
        this.setState({
            userDashboard: temp
        })
        
    }
    
 
    

    render() {
        console.log(this.props)
        const items = this.state.userDashboard.map((item, i) => {
            let actualHeight = item.coordinates.h 
            if(this.props.isCondensed){
                actualHeight = actualHeight + 10
            }
            //this.props.isCondensed ? actualHeight = actualHeight : actualHeight = actualHeight + 10;
            // console.log(actualHeight)
            // console.log(this.props.isCondensed)
           //This part will render the table
            if(item.objectType === "table"){
                return (
                    //min for table w:4 h:11
                <Card className="card-box" key={i} data-grid={{x: item.coordinates.x, y: item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH:item.coordinates.minH}}> 
                    <div style={{width:'100%'}}>
                        <h2 className="float-left" >Logs Table</h2>
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
                    <CardBody>
                        <Table/>
                    </CardBody>
                                        
                </Card>);
            //This part will render the Graph
            }else if(item.objectType === "graph"){
                if(item.graphSettings.type === "line"){
                    return (
                        //min for chart w:4 h:7
                        //Perfect size for line chart w = 12 and H = 16
                        <Card key={i} data-grid={{x: item.coordinates.x, y: item.coordinates.y, w: item.coordinates.w, h: actualHeight, minW: item.coordinates.minW, minH:item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <LineGraph {...item} parentCallback = {this.deleteFunction} callback = {this.modifyFunction}></LineGraph>
                            </CardBody>
                        </Card>);
                }else if(item.graphSettings.type === "bar"){
                    return (
                        <Card key={i} data-grid={{x: item.coordinates.x, y: item.coordinates.y, w: item.coordinates.w, h: actualHeight, minW: item.coordinates.minW, minH:item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <BarGraph {...item}></BarGraph>
                            </CardBody>                                  
                        </Card>);
                }else if(item.graphSettings.type === "pie"){
                    return (
                        <Card key={i} data-grid={{x: item.coordinates.x, y: item.coordinates.y, w: item.coordinates.w, h: actualHeight, minW: item.coordinates.minW, minH:item.coordinates.minH}}>
                            <CardBody>
                                
                            </CardBody>
                                                
                        </Card>);
                }
                else if(item.graphSettings.type === "mix"){
                    return (
                        <Card key={i} data-grid={{x: item.coordinates.x, y: item.coordinates.y, w: item.coordinates.w, h: actualHeight, minW: item.coordinates.minW, minH:item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <MixGraph {...item}></MixGraph>
                            </CardBody>
                                                
                        </Card>);
                }
            }
        });
        return (
            <React.Fragment>
                <div id="dashboard" style={{paddingTop:'1%'}}>
                    { /* preloader */}
                    {this.props.loading && <Loader />}
                    <Card style={{boxShadow: '0 0 15px 0 rgba(30,144,255, 0.486)'}}>
                        <div style={{paddingBottom:'1%'}}className="card-body">
                        <h3 className="float-left" >System Health Bar</h3>
                            <div style={{paddingTop:'20px'}} className="dropdown float-right show" onClick={this.systemHealth}>
                            <div style={{paddingTop:'-15px'}} className="float-left">Last 24 Hours</div>
                            { this.state.systemHealth? (
                            <div className="dropdown-menu dropdown-menu-right show" x-placement="bottom-end">
                            <a href="" class="dropdown-item">Last 24 Hours</a>
                            <a href="" class="dropdown-item">Last 48 Hours</a>
                            <a href="" class="dropdown-item">Last 72 Hours</a>
                            </div>
                            ): null }
                        </div>
                        </div>
                        <CardBody style={{paddingTop:'0%', margin: '0%'}}>
                            <Row>
                                <LogReport/>
                                <LogWarn/>
                                <NightlyTasks/>
                                <ServerStatus/>
                            </Row>
                        </CardBody>
                    </Card>

                    <GridLayout className="layout" cols={20} rowHeight={30} width={this.props.screenSize} onLayoutChange={(layout) => this.recordCoordinateChange(layout)} style={{margin:0}}>
                        {items}
                    </GridLayout>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);