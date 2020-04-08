import React, { Component } from 'react';
import MetricAlarmDisplay from '../metricAlarmComp/MetricAlarmDisplay';
import {Card} from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';

class MyMetricAlarms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const item = this.props.alarms.map((item,i) =>{
            return(
                <MetricAlarmDisplay key = {i} updateState = {this.props.updateState} {...item}></MetricAlarmDisplay>
            )
        }
    )
        return (
        <Card className = 'my_alarms'>
            {item}
        </Card> 
          
        )
    }
}

export default MyMetricAlarms;