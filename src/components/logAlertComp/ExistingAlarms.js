import React, { Component } from 'react';
import Items from '../logAlertComp/Items'
import 'react-perfect-scrollbar/dist/css/styles.css';
import page from '../../assets/images/no_alarms.png'

class ExistingAlarms extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <>
                {this.props.alerts.length > 0 ? (<Items handleDelete={this.props.handleDelete} handleSubscribe={this.props.handleSubscribe} handleUnubscribe={this.props.handleUnubscribe} alerts={this.props.alerts}/>) : (
                    <div className="no_alarms">
                        <img src={page}></img>
                        <div>No Alarms found.</div>
                    </div>
                )}
            </>
        )
    }
}

export default ExistingAlarms;