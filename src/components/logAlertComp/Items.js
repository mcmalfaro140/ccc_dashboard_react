import React, { Component } from 'react';
import { Row, Card, Col, Button } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    createAlarms = () => {
        let alarm = []
        this.props.alarms.forEach(element => {
            alarm.push(
                <div>
                    <Row>
                        <Col xs="1">
                            {element.isSubscribe ?
                            <i className="mdi mdi-checkbox-marked-circle"></i>
                            :
                            <i className="mdi mdi-alarm-check alarm_off"></i>}
                        </Col>
                        <Col xs="4">
                            <Row>{element.name}</Row>
                            <Row>> See More Details</Row>
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
                                <Button color="danger" block>Unsubscribe</Button>
                                :
                                <Button color="primary" block>Subscribe</Button>}
                            
                        </Col>
                    </Row>
                    <Row style={{display:'none'}}>

                    </Row>

                    
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