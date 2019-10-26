import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';

import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';


class DefaultDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: getLoggedInUser(),
            graph :[
                {
                    type:"",

                },
                {
                    type:""
                }
            ]
          
        };
    }

    render() {

        return (
            <React.Fragment>
                <div className="">
                    { /* preloader */}
                    {this.props.loading && <Loader />}

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>

                                    This card will have the default dashboard health.
                                </CardBody>
                                
                            </Card>
                            <Card>
                                <CardBody>
                                Test... Here you have to add your new graph or table inside this card body.
                                </CardBody>
                            </Card>
                        </Col>
                       
                    </Row>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);