import React, { Component } from 'react';
import Items from '../logAlertComp/Items'
import 'react-perfect-scrollbar/dist/css/styles.css';

class ExistingAlarms extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <Items alarms={this.props.alarms}/>
        )
    }
}

export default ExistingAlarms;