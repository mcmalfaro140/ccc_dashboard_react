import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class NightlyTask extends Component {
    render() {
        return(
            <Col style={{ margin:'1%'}}>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'120%'}}>Nightly Script Execution</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'green', fontSize:'370%', margin:'2%'}}><i class="mdi mdi-file-document"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'120%'}}>Successful</Row>
                
            </Col>
        )
    }
}

export default NightlyTask;