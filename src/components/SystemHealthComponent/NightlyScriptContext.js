import React, {useContext} from 'react'
import { Row, Col} from 'reactstrap';
import {LogContext} from './SystemHealthContext.js'

const NightlyScriptContext = () => {
    return(

        <div style={{ marginLeft:'10%'}}>
        <Col style={{ margin:'0%'}}>
            <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif'}}>Nightly Script Execution</Row>
            <Row style={{display: 'flex',  justifyContent:'center',color:'green', fontSize:'390%' , marginTop:'-7%' }}><i className="mdi mdi-file-document"></i></Row>
            <Row style={{display: 'flex',  justifyContent:'center', color:'green', fontSize:'100%', marginTop:'-7%', fontFamily : 'sans-Serif'}}>Successful</Row>
            
        </Col>
        </div>
    )
}
export default NightlyScriptContext