import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardBody, Modal } from 'reactstrap';
import LineGraph from '../components/LineGraph'
import LogWarn from '../components/LogWarn'
import NightlyTasks from '../components/NightlyTask'
import ServerStatus from '../components/ServerStatus'

import BarGraph from '../components/BarGraph';
import MixGraph from '../components/MixGraph';
import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import SimpleTable from '../components/MaterialTable.js'

import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import LogReport from '../components/logRepotComp'



import GraphForm from '../components/graphForm';



//import css needed for reac-grid-layout
import '../assets/react-grid/styles.css';
import '../assets/react-grid/styles1.css';
import { Button } from 'react-bootstrap';




var currentDate = new Date()


class DefaultDashboard extends Component {
   
    constructor(props) {
        
        super(props);
        this.state = {
            user: getLoggedInUser(),
            userDashboard: [
                // {
                //     objectType:"graph", // options: graph or table
                //     id:0,
                //     graphSettings: {
                //             type:"line", //options: line, pie, or bar
                //             realTime:true, //options: true or false
                //             metricName:"CPUCreditUsage", 
                //             nameSpace:"AWS/EC2",
                //             chartName:"Test 1",
                //             typeOfDimension: 'InstanceId',
                //             idValue:"i-01e27ec0da2c4d296",
                //             refreshRate:"2000",
                //             period:180,
                //             startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                //             endTime:new Date(), //if needed
                //             colorSelected:"#a3d9f3",
                //         },
                //     coordinates: {
                //         x: (0 %3)*8 ,
                //         y: 0,
                //         w: 8,
                //         h: 3,
                //         minW: 8,
                //         minH: 3
                //     }
                // },
                // {
                //     objectType:"graph", // options: graph or table
                //     id:1,
                //     graphSettings: {
                //             type:"bar", //options: line, pie, or bar
                //             realTime:true, //options: true or false
                //             metricName:"CPUUtilization", 
                //             nameSpace:"AWS/EC2",
                //             chartName:"TestBar 2",
                //             typeOfDimension: 'InstanceId',
                //             idValue:"i-01e27ec0da2c4d296",
                //             refreshRate:"2000",
                //             period:180,
                //             startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                //             endTime:new Date(), //if needed
                //             colorSelected:"#a6e22e"
                //         },
                //         coordinates: {
                //             x: ((1 %3)*8),
                //             y: 0,
                //             w: 8,
                //             h: 3,
                //             minW: 8,
                //             minH: 3
                //         }
                // },
                // {
                //     objectType:"graph", // options: graph or table
                //     id:2,
                //     graphSettings: {
                //             type:"line", //options: line, pie, or bar
                //             realTime:true, //options: true or false
                //             metricName:"CPUUtilization", 
                //             nameSpace:"AWS/EC2",
                //             chartName:"Test 3",
                //             typeOfDimension:'InstanceId',
                //             idValue:"i-01e27ec0da2c4d296",
                //             refreshRate:"2000",
                //             period:180,
                //             startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                //             endTime:new Date(), //if needed
                //             colorSelected:"#800000"
                //         },
                //     coordinates: {
                //         x: 0,
                //         y: 6,
                //         w: 12,
                //         h: 3,
                //         minW: 8,
                //         minH: 3
                //     }
                // },
                // {
                //     objectType:"graph", // options: graph or table
                //     id:3,
                //     graphSettings: {
                //             type:"line", //options: line, pie, or bar
                //             realTime:false, //options: true or false
                //             metricName:"CPUUtilization", 
                //             nameSpace:"AWS/EC2",
                //             chartName:"Test 4",
                //             typeOfDimension:'InstanceId',
                //             idValue:"i-01e27ec0da2c4d296",
                //             refreshRate:"2000",
                //             period:180,
                //             startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                //             endTime:new Date(), //if needed
                //             colorSelected:"#a3d9f3"
                //         },
                //     coordinates: {
                //         x: 12,
                //         y: 6,
                //         w: 12,
                //         h: 3,
                //         minW: 8,
                //         minH: 3
                //     }
                // },
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
        this.test = this.test.bind(this);
    }

    componentDidMount(){
        // let savedDashboard = JSON.parse(this.state.user.dashboard)
        // this.setState({userDashboard: savedDashboard})
    }

    test(id){
        // let ob = JSON.parse(this.state.user.dashboard)
        // let str = JSON.stringify(this.state.dashboard)
        // // console.log(ob);
        // console.log(this.state.user)
        // console.log(this.state.userDashboard)
        // console.log(id)

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
                    if(this.state.isModify === false){
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
                        //console.log(this.state.userDashboard);
                        
                    }else{
                        const id = this.state.selectedGraphId;
                        const newDashboard = this.state.userDashboard;   
                        for(let i = newDashboard.length-1; i>=0; i--){     
                            if(newDashboard[i].id === id){
                                newDashboard[i].graphSettings.metricName = nextProps.location.state.newGraph.graphSettings.metricName;
                                newDashboard[i].graphSettings.nameSpace = nextProps.location.state.newGraph.graphSettings.nameSpace;
                                newDashboard[i].graphSettings.realTime = nextProps.location.state.newGraph.graphSettings.realTime;
                                newDashboard[i].graphSettings.chartName = nextProps.location.state.newGraph.graphSettings.chartName;
                                newDashboard[i].graphSettings.typeOfDimension= nextProps.location.state.newGraph.graphSettings.typeOfDimension;
                                newDashboard[i].graphSettings.idValue= nextProps.location.state.newGraph.graphSettings.idValue;
                                newDashboard[i].graphSettings.realTime= nextProps.location.state.newGraph.graphSettings.realTime;
                                if(nextProps.location.state.newGraph.graphSettings.realTime === true){
                                    newDashboard[i].graphSettings.refreshRate= nextProps.location.state.newGraph.graphSettings.refreshRate;
                                }
                                newDashboard[i].graphSettings.startTime = nextProps.location.state.newGraph.graphSettings.startTime;
                                newDashboard[i].graphSettings.endTime = nextProps.location.state.newGraph.graphSettings.endTime;
                                newDashboard[i].graphSettings.colorSelected= nextProps.location.state.newGraph.graphSettings.colorSelected;
                                newDashboard[i].graphSettings.period= nextProps.location.state.newGraph.graphSettings.period;
                            }
                        }
                        this.setState({userDashboard : newDashboard});
                        this.setState({isModify : false});

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
    recordCoordinateChange(newLayout, allLayouts){
        let temp = this.state.userDashboard
        let updatedDash = [];
        if(allLayouts.lg.length > 0){
            allLayouts.lg.map((chart) => {
                let newGraph = temp.find(temp => temp.id === parseInt(chart.i))
                newGraph.coordinates.x = chart.y
                newGraph.coordinates.x = chart.x
                newGraph.coordinates.w = chart.w
                newGraph.coordinates.h = chart.h

                updatedDash.push(newGraph);
            })
            this.setState({
                userDashboard: updatedDash
            })
        }else{
            newLayout.map((chart) => {
                let newGraph = temp.find(temp => temp.id === parseInt(chart.i))
                newGraph.coordinates.x = chart.y
                newGraph.coordinates.x = chart.x
                newGraph.coordinates.w = chart.w
                newGraph.coordinates.h = chart.h

                updatedDash.push(newGraph);
            })
            this.setState({
                userDashboard: updatedDash
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
                            <SimpleTable {...item}/>
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
                                <BarGraph {...item}></BarGraph>
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
                {/* <Button onClick={this.test}>test</Button> */}
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
                            {/* { this.state.systemHealth? (
                            <div className="dropdown-menu dropdown-menu-right show" x-placement="bottom-end">
                            <a href="" class="dropdown-item">Last 24 Hours</a>
                            <a href="" class="dropdown-item">Last 48 Hours</a>
                            <a href="" class="dropdown-item">Last 72 Hours</a>
                            </div>
                            ): null } */}
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
                        breakpoints={{lg: 1040, md: 996, sm: 768}}
                        cols={{lg: 24, md: 12, sm: 8}}
                        width={this.props.screenSize} 
                        onLayoutChange={(layout,allLayouts) => this.recordCoordinateChange(layout, allLayouts)} 
                        onResizeStop={(placeholder) => this.test(placeholder)}
                        style={{margin:0}}>
                        {items}
                    </ResponsiveGridLayout>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);