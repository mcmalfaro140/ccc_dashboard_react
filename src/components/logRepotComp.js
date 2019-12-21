import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class logReportComp extends Component {
    render() {
        return(
            <Col style={{ margin:'1%'}}>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'120%'}}>Error Logs Report</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'red', fontSize:'350%', margin:'7%'}}><i class="fas fa-exclamation-triangle"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'120%'}}>5 Error Logs</Row>
                
            </Col>
        )
    }
}

export default logReportComp;