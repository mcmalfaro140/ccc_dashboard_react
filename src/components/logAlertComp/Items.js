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
        this.props.alerts.map((element, i) => {
            let key_str = "";
            element.Keywords.forEach(e => {
                console.log(e);
                key_str += e + ' ';
            });
            let str_key = "."
            if(element.KeywordRelationship != null){
                str_key = `, and if they contain ${element.KeywordRelationship} of the keywords.`
            }
            let desc_srt = `The user will be notify when logs are " ${element.Comparison}  ${element.LogLevel} " ${str_key}`
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
                        <Col xs="3">
                            <Row>{element.AlarmName}</Row>
                            <Row className="pointer" onClick={() => this.handleInfoClick(i)} ><i className="mdi mdi-menu-right"></i> See More Details</Row>
                        </Col>
                        <Col>
                            <Row>Filter Pattern:</Row>
                            <Row>Logs {element.Comparison} {element.LogLevel}</Row>
                        </Col>
                        <Col>
                            <Row>Keywords:</Row>
                            <Row>{key_str}</Row>
                        </Col>
                        <Col xs="2">
                            {element.isSubscribe ? 
                                <Button color="danger" block onClick={() => this.props.handleUnubscribe(element.LogAlarmId)}><i class="far fa-bell-slash"></i>Unsubscribe</Button>
                                :
                                <Button color="primary" block onClick={() => this.props.handleSubscribe(element.LogAlarmId)}><i class="far fa-bell"></i>Subscribe</Button>}
                            
                        </Col>
                        <Col xs='1'>
                            <i class="mdi mdi-delete-variant"></i>
                        </Col>
                    </Row>
                    <Collapse id={alarm_id} isOpen={false}>
                        <Row>
                            <Col>
                                <h3>Alarm Description:</h3>
                                <p>{desc_srt}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3>Log Group Names Attached:</h3>
                                <ul>
                                    {this.createLogGroupName(element.LogGroups)}
                                </ul>
                            </Col>
                            <Col>
                                <h3>SNS Topic Attached:</h3>
                                <ul>
                                    {this.createSns(element.SNSTopics)}
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