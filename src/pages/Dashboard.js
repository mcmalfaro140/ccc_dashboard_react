import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import LineGraph from '../components/LineGraph'
import BarGraph from '../components/BarGraph'
import Table from './Tables'
import LogReport from '../components/logRepotComp'
import NightlyTasks from '../components/NightlyTask'
import ServerStatus from '../components/ServerStatus'
import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import { Button } from 'react-bootstrap';
import GridLayout from 'react-grid-layout';

//import css needed for reac-grid-layout
import '../assets/react-grid/styles.css'
import '../assets/react-grid/styles1.css'


var currentDate = new Date()


class DefaultDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: getLoggedInUser(),
            screenWidth: (window.innerWidth - 280), //TODO: MAKE RESIZE CHANGE WHEN IN FULL SCREEN
            userDashboard: [
                {
                    objectType:"graph", // options: graph or table
                    graphSettings: {
                            type:"line", //options: line, pie, or bar
                            realTime:"false", //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test",
                            instanceId:"i-01e27ec0da2c4d296",
                            refreshRate:"",
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        }
                },
                {
                    objectType:"table", // options: graph or table
                    tableSettings:{
                        master:"true",
                    }
                },
                {
                    objectType:"graph", // options: graph or table
                    graphSettings: {
                            type:"bar", //options: line, pie, or bar
                            realTime:"false", //options: true or false
                            metricName:"CPUCreditUsage", 
                            nameSpace:"AWS/EC2",
                            chartName:"TestBar",
                            instanceId:"i-01e27ec0da2c4d296",
                            refreshRate:"",
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        }
                },
                {
                    objectType:"graph", // options: graph or table
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
                        }
                },
                
            ],
            showOptions: false,
            systemHealth: false

        };
        this.showOptions = this.showOptions.bind(this);
        this.systemHealth = this.systemHealth.bind(this);
    }

    componentWillReceiveProps(nextProps){
        let temp = this.state.userDashboard
        if(nextProps.location.state){
            //only activate adds to the array if the props are the specify ones
            if(nextProps.location.state.newMasterTable){
                temp.push(nextProps.location.state.newMasterTable);
                this.setState({
                    userDashboard: temp
                })
            }else if(nextProps.location.state.newGraph){
                temp.push(nextProps.location.state.newGraph);
                this.setState({
                    userDashboard: temp
                })
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
    

    render() {
    
        const items = this.state.userDashboard.map((item, i) => {
           //This part will render the table
            if(item.objectType == "table"){
                return (
                    //min for table w:4 h:11
                <Card className="card-box" key={i} data-grid={{x: 0, y: i, w: 12, h: 11, minW: 4, minH:11}}> 
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
                        <Card key={i} data-grid={{x: 0, y: i, w: 12, h: 16, minW: 6, minH:9}}>
                            <CardBody>
                                <LineGraph {...item}></LineGraph>
                            </CardBody>
                        </Card>);
                }else if(item.graphSettings.type === "bar"){
                    return (
                        <Card key={i} data-grid={{x: 0, y: i, w: 6, h: 9, minW: 6, minH:9}}>
                            <CardBody>
                                <BarGraph {...item}></BarGraph>
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type === "pie"){
                    return (
                        <Card key={i} data-grid={{x: 6, y: i-1, w: 6, h: 9, minW: 6, minH:9}}>
                            <CardBody>
                                
                            </CardBody>
                                                
                        </Card>);
                }
            }
        });
        return (
            <React.Fragment>
                <div className="">
                    { /* preloader */}
                    {this.props.loading && <Loader />}
                    <Card>
                        <div style={{paddingBottom:'1%'}}className="card-body">
                        <h3 className="float-left" >System Health</h3>
                            <div style={{paddingTop:'20px'}} className="dropdown float-right show" onClick={this.systemHealth}>
                            <div style={{paddingTop:'-10px'}} className="float-left">Last 24 Hours</div>
                            { this.state.systemHealth? (
                            <div className="dropdown-menu dropdown-menu-right show" x-placement="bottom-end">
                            <a href="" class="dropdown-item">Last 24 Hours</a>
                            <a href="" class="dropdown-item">Last 48 Hours</a>
                            <a href="" class="dropdown-item">Last 72 Hours</a>
                            </div>
                            ): null }
                        </div>
                        </div>
                        <CardBody style={{paddingTop:'0%'}}>
                            <Row>
                                <LogReport/>
                                <NightlyTasks/>
                                <ServerStatus/>
                            </Row>
                        </CardBody>
                    </Card>

                    <GridLayout className="layout" cols={12} rowHeight={30} width={this.state.screenWidth}>
                        {items}
                    </GridLayout>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);