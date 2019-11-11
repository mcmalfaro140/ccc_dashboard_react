import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import LineGraph from '../components/LineGraph'
import BarGraph from '../components/BarGraph'
import Table from './Tables'

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
                
            ]
        };
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
    

    render() {
    
        const items = this.state.userDashboard.map((item, i) => {
           //This part will render the table
            if(item.objectType == "table"){
                return (
                    //min for table w:4 h:9
                <Card key={i} data-grid={{x: 0, y: i, w: 12, h: 9, minW: 4, minH:9}}> 
                    <CardBody>
                        <Table/>
                    </CardBody>
                                        
                </Card>);
            //This part will render the Graph
            }else if(item.objectType === "graph"){
                if(item.graphSettings.type === "line"){
                    return (
                        //min for chart w:4 h:7
                        <Card key={i} data-grid={{x: 0, y: i, w: 4, h: 7, minW: 4, minH:7}}>
                            <CardBody>
                                <LineGraph {...item}></LineGraph>
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type === "bar"){
                    return (
                        <Card key={i} data-grid={{x: 0, y: i, w: 4, h: 7, minW: 4, minH:7}}>
                            <CardBody>
                                <BarGraph {...item}></BarGraph>
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type === "pie"){
                    return (
                        <Card key={i} data-grid={{x: 0, y: i, w: 4, h: 7, minW: 4, minH:7}}>
                            <CardBody>
        
                                This is gonna be a Pie graph
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
                        <CardBody>
                            This card will have the default dashboard health.
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