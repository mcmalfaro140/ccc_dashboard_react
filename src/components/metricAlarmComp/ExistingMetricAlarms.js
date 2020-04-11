import React, { Component } from 'react';
import MetricAlarmDisplay from '../metricAlarmComp/MetricAlarmDisplay'
import {Card} from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import page from '../../assets/images/no_alarms.png'


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
        <>
            {
                this.props.alarms.length > 0?(
                    <Card className = 'my_alarms'>
                        {item}
                    </Card> 
                ):(
                    <div className = "no_alarms">
                        <img src={page} alt="no_metric_alarm"></img>
                        <div>No Alarms found.</div>
                    </div>

                )
            }
            
        </>
        
          
        )
    }
}

export default ExistingMetricAlarms;