import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import { Row, Card, Col, Button, Collapse } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleInfoClick = this.handleInfoClick.bind(this)
    }

    handleInfoClick(id){
        let build_strid = "alarm-id-" + id
        let element = document.getElementById(build_strid);
        let react_ele = ReactDOM.findDOMNode(element);
        if(react_ele.classList.contains("show")){
            react_ele.classList.remove("show")
        }else{
            react_ele.classList.add("show")
        }
       
    }
    createSns = (snsArr) => {
        let sns = [] 
        snsArr.map((e,i) => {
            sns.push(
                <li>{e}</li>
            )
        })
        return sns
    }

    createLogGroupName = (logNamesArr) => {
        let logName = [] 
        logNamesArr.map((e,i) => {
            logName.push(
                <li>{e}</li>
            )
        })
        return logName
    }

    createAlarms = () => {
        let alarm = []
        this.props.alarms.map((element, i) => {
            let alarm_id = "alarm-id-" + i;
            alarm.push(
                <div key={i}>
                    <Row>
                        <Col xs="1">
                            {element.isSubscribe ?
                            <i className="mdi mdi-checkbox-marked-circle"></i>
                            :
                            <i className="mdi mdi-alarm-check alarm_off"></i>}
                        </Col>
                        <Col xs="4">
                            <Row>{element.name}</Row>
                            <Row className="pointer" onClick={() => this.handleInfoClick(i)} ><i className="mdi mdi-menu-right"></i> See More Details</Row>
                        </Col>
                        <Col>
                            <Row>Filter Pattern:</Row>
                            <Row>{element.filter}</Row>
                        </Col>
                        <Col>
                            <Row>Filter Pattern:</Row>
                            <Row>{element.sns_topic[0]}</Row>
                        </Col>
                        <Col xs="2">
                            {element.isSubscribe ? 
                                <Button color="danger" block><i class="far fa-bell-slash"></i>Unsubscribe</Button>
                                :
                                <Button color="primary" block><i class="far fa-bell"></i>Subscribe</Button>}
                            
                        </Col>
                    </Row>
                    <Collapse id={alarm_id} isOpen={false}>
                        <Row>
                            <Col>
                                <h3>Log Group Names Attached:</h3>
                                <ul>
                                    {this.createLogGroupName(element.log_groups)}
                                </ul>
                            </Col>
                            <Col>
                                <h3>SNS Topic Attached:</h3>
                                <ul>
                                    {this.createSns(element.sns_topic)}
                                </ul>
                            </Col>
                        </Row>
                    </Collapse>

                    
                </div>
            )
            
        });
        return alarm
    }

    render() {
        return (
            <Card className="my_alarms">
                {this.createAlarms()}
            </Card>
        )
    }
}

export default Items;