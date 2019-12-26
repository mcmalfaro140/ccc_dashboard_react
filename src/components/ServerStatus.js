import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class ServerStatus extends Component {
    render() {
        return(
            <Col style={{ margin:'1%'}}>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'120%'}}>Resources Status</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'350%', margin:'2%'}}><i class="mdi mdi-server"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'120%'}}>1 Server is down</Row>
                
            </Col>
        )
    }
}

export default ServerStatus;