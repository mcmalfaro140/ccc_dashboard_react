import React, { Component } from 'react';
import MetricAlarmDisplay from '../metricAlarmComp/MetricAlarmDisplay'
import {Card} from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';

class ExistingMetricAlarms extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const item = this.props.alarms.map((item,i) =>{
            return(
                <MetricAlarmDisplay updateState = {this.props.updateState} {...item}></MetricAlarmDisplay>
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

export default ExistingMetricAlarms;