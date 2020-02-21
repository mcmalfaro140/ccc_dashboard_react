import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Modal } from 'reactstrap';

import ReactTable from 'react-table';
import LineGraph from '../components/LineGraph'
import LogWarn from '../components/LogWarn'
import NightlyTasks from '../components/NightlyTask'
import ServerStatus from '../components/ServerStatus'

import BarGraph from '../components/BarGraph';
import MixGraph from '../components/MixGraph';
import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import { Button } from 'react-bootstrap';
import GridLayout from 'react-grid-layout';
//import SimpleTable from '../components/MaterialTable.js'
import Tables from './Tables.js'

import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import Table from './Tables'
import LogReport from '../components/logRepotComp'
import GraphForm from '../components/graphForm';

//import css needed for reac-grid-layout
import '../assets/react-grid/styles.css';
import '../assets/react-grid/styles1.css';

var currentDate = new Date();
class DefaultDashboard extends Component {
   
    constructor(props) {
        
        super(props);
        this.state = {
            user: getLoggedInUser(),
            userDashboard: [
                {
                    objectType:"graph", // options: graph or table
                    id:0,
                    graphSettings: {
                            type:"line", //options: line, pie, or bar
                            realTime:true, //options: true or false
                            metricName:"CPUCreditUsage", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test 1",
                            typeOfDimension: 'InstanceId',
                            idValue:"i-01e27ec0da2c4d296",
                            refreshRate:2000,
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date(), //if needed
                            colorSelected:"#a3d9f3",
                        },
                    coordinates: {
                        x: (0 %3)*8 ,
                        y: 0,
                        w: 8,
                        h: 2,
                        minW: 8,
                        minH: 2
                    }
                },
                {
                    objectType:"graph", // options: graph or table
                    id:1,
                    graphSettings: {
                            type:"bar", //options: line, pie, or bar
                            realTime:true, //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"TestBar 2",
                            typeOfDimension: 'InstanceId',
                            idValue:"i-01e27ec0da2c4d296",
                            refreshRate:10000,
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date(), //if needed
                            colorSelected:"#a6e22e"
                        },
                        coordinates: {
                            x: ((1 %3)*8),
                            y: 0,
                            w: 8,
                            h: 2,
                            minW: 8,
                            minH: 2
                        }
                },
                {
                    objectType:"graph", // options: graph or table
                    id:2,
                    graphSettings: {
                            type:"line", //options: line, pie, or bar
                            realTime:true, //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test 3",
                            typeOfDimension:'InstanceId',
                            idValue:"i-01e27ec0da2c4d296",
                            refreshRate:2000,
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date(), //if needed
                            colorSelected:"#800000"
                        },
                    coordinates: {
                        x: ((2 %3)*8),
                        y: 0,
                        w: 8,
                        h: 2,
                        minW: 8,
                        minH: 2
                    }
                },
                {
                    objectType:"graph", // options: graph or table
                    id:3,
                    graphSettings: {
                            type:"line", //options: line, pie, or bar
                            realTime:false, //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test 4",
                            typeOfDimension:'InstanceId',
                            idValue:"i-01e27ec0da2c4d296",
                            refreshRate:2000,
                            period:180,
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date(), //if needed
                            colorSelected:"#a3d9f3"
                        },
                    coordinates: {
                        x: ((0 %3)*8),
                        y: 6,
                        w: 8,
                        h: 2,
                        minW: 8,
                        minH: 2
                    }
                },
            ],
            showOptions: false,
            systemHealth: false,
            isModify : false,
            stickyFormData :{},
            selectedGraphId:"",

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
            this.setState({isModify :true});
            this.setState({selectedGraphId : childData});
            const newDashboard = this.state.userDashboard;
            for(let i = newDashboard.length-1; i>=0;--i){
                if(newDashboard[i].id === childData){
                    this.setState({stickyFormData : newDashboard[i].graphSettings});
                }
            }           
    }
    
    toggleForm = () =>{
        this.setState({isModify : !this.state.isModify});
    }

    componentWillReceiveProps(nextProps){
            let temp = this.state.userDashboard
            if(nextProps.location.state){
                //only activate adds to the array if the props are the specify ones
                if(nextProps.location.state.newGraph){
                    if(this.state.isModify === false){
                        let newName = nextProps.location.state.newGraph.graphSettings.chartName;
                        let preName = this.state.newUpcomingPropsName;
                        if(newName !== preName && !temp.includes(nextProps.location.state.newGraph.graphSettings)){
                            nextProps.location.state.newGraph["id"] = this.state.userDashboard.length;
                            temp.push(nextProps.location.state.newGraph);
                            this.setState({
                                userDashboard: temp,
                                newUpcomingPropsName: newName
                            })
                        }
                    }else{
                        let newName = nextProps.location.state.newGraph.graphSettings.chartName;
                        let preName = this.state.newUpcomingPropsName;
                        if(newName !== preName && !temp.includes(nextProps.location.state.newGraph.graphSettings)){
                            const id = this.state.selectedGraphId;
                            const newDashboard = this.state.userDashboard;   
                            for(let i = newDashboard.length-1; i>=0; i--){     
                                if(newDashboard[i].id === id){
                                    newDashboard[i].graphSettings.metricName = nextProps.location.state.newGraph.graphSettings.metricName;
                                    newDashboard[i].graphSettings.nameSpace = nextProps.location.state.newGraph.graphSettings.nameSpace;
                                    newDashboard[i].graphSettings.realTime = nextProps.location.state.newGraph.graphSettings.realTime;
                                    newDashboard[i].graphSettings.chartName = nextProps.location.state.newGraph.graphSettings.chartName;
                                    newDashboard[i].graphSettings.typeOfDimension = nextProps.location.state.newGraph.graphSettings.typeOfDimension;
                                    newDashboard[i].graphSettings.idValue = nextProps.location.state.newGraph.graphSettings.idValue;
                                    newDashboard[i].graphSettings.realTime = nextProps.location.state.newGraph.graphSettings.realTime;
                                    if(nextProps.location.state.newGraph.graphSettings.realTime === true){
                                        newDashboard[i].graphSettings.refreshRate = nextProps.location.state.newGraph.graphSettings.refreshRate;
                                    }
                                    newDashboard[i].graphSettings.startTime = nextProps.location.state.newGraph.graphSettings.startTime;
                                    newDashboard[i].graphSettings.endTime = nextProps.location.state.newGraph.graphSettings.endTime;
                                    newDashboard[i].graphSettings.colorSelected = nextProps.location.state.newGraph.graphSettings.colorSelected;
                                    newDashboard[i].graphSettings.period = nextProps.location.state.newGraph.graphSettings.period;
                                }
                            }
                            this.setState({userDashboard : newDashboard});
                            this.setState({isModify : false, newUpcomingPropsName: newName});
                        }
                    }
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
        if(this.props.screenSize > 1200){ //will only save big screen dashboard not mobile or table
            let temp = this.state.userDashboard
            let updatedIndex = [];
            let chart;
            newLayout.forEach((element, i) => {
                // let chart = temp[parseInt(element.i)];
                temp.some((a) => {
                    chart = a;
                    return a.id === parseInt(element.i)
                })
                chart.coordinates.y = element.y
                chart.coordinates.x = element.x
                updatedIndex.push(chart)
            });
            this.setState({
                userDashboard: updatedIndex
            })
        }
        
    }

    render() {
        const items = this.state.userDashboard.map((item, i) => {
            if(item.objectType === "table"){
                return (
                <Card className="card-box" key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}} > 
                    <div style={{width:'100%'}}>
                <h2 className="float-left" >{item.tableSettings.chartName}</h2>
                        <div  className="dropdown float-right show" onClick={this.showOptions}>
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
                            <Tables {...item}/>
                    </CardBody>
                                        
                </Card>);
            //This part will render the Graph
            }else if(item.objectType === "graph"){
                if(item.graphSettings.type === "line"){
                    return (   
                       <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <LineGraph {...item} parentCallback = {this.deleteFunction} callback = {this.modifyFunction}></LineGraph>
                            </CardBody>
                        </Card>
                       );
                }else if(item.graphSettings.type === "bar"){
                    return (
                        <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <BarGraph {...item} parentCallback = {this.deleteFunction} callback = {this.modifyFunction}></BarGraph>
                            </CardBody>                                  
                        </Card>);
                }else if(item.graphSettings.type === "pie"){
                    return (
                        <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody>
                                
                            </CardBody>
                                                
                        </Card>);
                }
                else if(item.graphSettings.type === "mix"){
                    return (
                        <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <MixGraph {...item}></MixGraph>
                            </CardBody>
                                                
                        </Card>);
                }
            }
        });
        return (
            
            <React.Fragment>
                 <Modal isOpen={this.state.isModify} toggle = {this.toggleForm} > 
                     <GraphForm whatever={this.props.location.typeOfGraph} toggleForm = {this.toggleForm} graphInfor = {this.state.stickyFormData} 
                    />
                </Modal>
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

                    <ResponsiveGridLayout className="layout" 
                        breakpoints={{lg: 1200, md: 996, sm: 768}}
                        cols={{lg: 24, md: 12, sm: 8}}
                        width={this.props.screenSize} 
                        onLayoutChange={(layout) => this.recordCoordinateChange(layout)} 
                        style={{margin:0}}>
                            
                        {items}
                    </ResponsiveGridLayout>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);