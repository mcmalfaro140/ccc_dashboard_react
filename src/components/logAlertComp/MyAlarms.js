import React, { Component } from 'react';
import Items from '../logAlertComp/Items'
import 'react-perfect-scrollbar/dist/css/styles.css';
import page from '../../assets/images/no_alarms.png'

class MyAlarms extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <>
                {this.props.alerts.length > 0  ? (<Items handleSubscribe={this.props.handleSubscribe} handleUnubscribe={this.props.handleUnubscribe} alerts={this.props.alerts}/>) : (
                    <div className="no_alarms">
                        <img src={page}></img>
                        <div>No Alarms found under your name.</div>
                    </div>
                )}
            </>
        )
    }
}

export default MyAlarms;