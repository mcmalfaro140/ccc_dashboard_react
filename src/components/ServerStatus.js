import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class ServerStatus extends Component {
    render() {
        return(
            <Col style={{ margin:'0%'}}>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500'}}>Resources Status</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'350%', margin:'2%'}}> <span style={{paddingRight:'2%'}}>1</span> <i class="mdi mdi-server"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'100%', marginTop:'-3%'}}>Server Down</Row>
                
            </Col>
        )
    }
}

export default ServerStatus;