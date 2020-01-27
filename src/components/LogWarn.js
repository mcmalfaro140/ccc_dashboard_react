import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class LogWarn extends Component {
    render() {
        return(
            <Col style={{ margin:'0%'}}>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500'}}>Log Warnings</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'350%', margin:'4%'}}> <span style={{paddingRight:'2%'}}>9</span> <i style={{padding:'2%'}} class="fas fa-exclamation-triangle"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'100%', marginTop:'-5%'}}>Warnings Found</Row>
                
            </Col>
        )
    }
}

export default LogWarn;