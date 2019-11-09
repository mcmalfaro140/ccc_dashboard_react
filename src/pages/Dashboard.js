import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import LineGraph from '../components/LineGraph'
import BarGraph from '../components/BarGraph'
import Table from './Tables'

import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import { Button } from 'react-bootstrap';

var currentDate = new Date()


class DefaultDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: getLoggedInUser(),
            userDashboard: [
                {
                    objectType:"graph", // options: graph or table
                    graphSettings: {
                            type:"line", //options: line, pie, or bar
                            realTime:"false", //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test",
                            instanceId:"i-0e84c5d781008a00e",
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
                            instanceId:"i-0e84c5d781008a00e",
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
                            instanceId:"i-0e84c5d781008a00e",
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
                <Card>
                    <CardBody>
                        <Table/>
                    </CardBody>
                                        
                </Card>);
            //This part will render the Graph
            }else if(item.objectType === "graph"){
                if(item.graphSettings.type === "line"){
                    return (
                        <Card>
                            <CardBody>
                                <LineGraph {...item}></LineGraph>
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type === "bar"){
                    return (
                        <Card>
                            <CardBody>
                                <BarGraph {...item}></BarGraph>
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type === "pie"){
                    return (
                        <Card>
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
                    <Row>
                                <Col lg={12}>
                                    <Card>
                                        <CardBody>

                                            This card will have the default dashboard health.
                                             
                                        </CardBody>
                                        
                                    </Card>

                                    {items}
                                </Col>

                            
                            </Row>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);