import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import LineGraph from '../components/LineGraph'
import Table from './Tables'

import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import { Button } from 'react-bootstrap';

var currentDate = new Date()


class DefaultDashboard extends Component {

    constructor(props) {
        super(props);
        this.test = this.test.bind(this);
        this.test2 = this.test2.bind(this);
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
                },
                {
                    objectType:"table", // options: graph or table
                    tableSettings:{
                        master:"true",

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
                            type:"pie", //options: line, pie, or bar
                            realTime:"false", //options: true or false
                            metricName:"CPUUtilization", 
                            nameSpace:"AWS/EC2",
                            chartName:"Test",
                            instanceId:"i-0e84c5d781008a00e",
                            refreshRate:"",
                            startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                            endTime:new Date() //if needed
                        }
                },
            ]
        };
    }

    // componentWillMount(){
    //     this.setState({ userDashboard: [...this.state.userDashboard, this.props.location.state.newGraph]})
    //     console.log(this.state.userDashboard)
    // }

    // componentWillMount(){
    //     this.test();
    //     console.log("Misael hello")
    //     // if(nextProps.someValue!==this.props.someValue){
    //     //   //Perform some operation
    //     //   this.setState({someState: someValue });
    //     //   this.classMethod();
    //     // }
    //   }

    // componentDidUpdate(){
    //     console.log("Hello new props receive")
    // }

    // static getDerivedStateFromProps(props, state){
    //     console.log("Hello new props receive")
    // }

    componentWillReceiveProps(nextProps){
        console.log("the prop function was activated")
        let temp = this.state.userDashboard
        if(nextProps.location.state){
            if(nextProps.location.state.newGraph){
                console.log("This is a new prop graph")
            }else if(nextProps.location.state.newMasterTable){
                temp.push(this.props.location.state.newMasterTable);
                this.setState({
                    userDashboard: temp
                })
                //console.log("This is a new prop table")
                
            }
        }
    }

    test2(){
          console.log(this.state.userDashboard)
    }
    test(){
       let temp = this.state.userDashboard
        // console.log(this.props)
        temp.push(this.props.location.state.newGraph);
        // console.log(this.props.location.state.newGraph)

        this.setState({
            userDashboard: temp
        })
      
        console.log(this.state.userDashboard);

        
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
            }else if(item.objectType == "graph"){
                if(item.graphSettings.type == "line"){
                    return (
                        <Card>
                            <CardBody>
                                <LineGraph {...item}></LineGraph>
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type == "bar"){
                    return (
                        <Card>
                            <CardBody>
        
                                This is gonna be a BAR graph
                            </CardBody>
                                                
                        </Card>);
                }else if(item.graphSettings.type == "pie"){
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

                                    <Button onClick={this.test}>Test</Button>
                                </Col>

                            
                            </Row>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);