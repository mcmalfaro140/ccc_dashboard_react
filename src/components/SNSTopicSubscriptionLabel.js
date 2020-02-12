import React, { Component } from 'react';
import AWS from 'aws-sdk';


class SNSTopicSubscriptionLabel extends Component {
    constructor(props) {
        super(props);
    }

    removeSubscription() {

    }

    render() {
        const stylesheet = {
            margin: '2%',
            padding: '2%'
        };
        const divStylesheet = {
            display: 'inline-block'
        };
        const deleteStylesheet = {
            color: 'red',
            marginTop: '1%',
            marginBottom: '1%',
            cursor: 'pointer'
        };
        const smallTextStylesheet = {
            marginTop: '1%',
            marginBottom: '1%'
        }

        return (
            <div className="border" style={stylesheet}>
                <div style={divStylesheet}>
                    <h5 style={smallTextStylesheet}>
                        {`${this.props.level} Log Alerts`}
                    </h5>

                    <p style={smallTextStylesheet}>
                        {this.props.endpoint}
                    </p>

                    <p style={deleteStylesheet} onClick={(event) => this.removeSubscription()}>
                        Delete
                    </p>
                </div>

                <input className="fa-pull-right" type="checkbox" />
            </div>
        );
    }
}


export default SNSTopicSubscriptionLabel;
