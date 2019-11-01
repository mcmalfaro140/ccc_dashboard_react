import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import LineGraph from '../components/LineGraph'

import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';

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
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        }
                    ,
                },{
                    objectType:"", // options: graph or table
                    graphSettings: [
                        {
                            type:"null", //options: line, pie, or bar
                            realTime:"null", //options: true or false
                            metricName:"null", 
                            nameSpace:"null",
                            chartName:"null",
                            instanceId:"null",
                            refreshRate:"",
                            startTime:"", //if needed
                            endTime:"" //if needed
                        }
                    ]       
                },{...this.props.location.state.newGraph}
            ]
        };
    }

    render() {

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
                                    <Card>
                                        <CardBody>
                                            <LineGraph {...this.state.userDashboard[0]}></LineGraph>
                                        </CardBody>
                                        <CardBody>
                                        Test... Here you have to add your new graph or table inside this card body.
                                        </CardBody>
                                    </Card>
                                </Col>
                            
                            </Row>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);