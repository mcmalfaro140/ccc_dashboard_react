import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class NightlyTask extends Component {
    render() {
        return(
            <Col style={{ margin:'0%'}}>
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500'}}>Nightly Script Execution</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'green', fontSize:'390%', margin:'0%'}}><i class="mdi mdi-file-document"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'green', fontSize:'100%', marginTop:'-1%'}}>Successful</Row>
                
            </Col>
        )
    }
}

export default NightlyTask;