import React, {useContext} from 'react'
import { Row, Col} from 'reactstrap';
import {LogContext} from './SystemHealthContext.js'

 const LogErrorReport = () => {

    //Get the context from system Health context
    const {ErrorCount} = useContext(LogContext)
    const [ErrorResultCount] = ErrorCount

    return (
     
        <div style={{ marginLeft:'10%'}}>
         
                <Col style={{ margin:'0%'}}>

                    <Row  style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight: '500', fontFamily : 'sans-Serif' }}>Log Errors</Row>
                    <Row style={{display: 'flex',  justifyContent:'center',color:'red', fontSize:'250%' }}> <span style={{padding:'-1%' }}>{ErrorResultCount}</span> <i style={{padding:'1%'}} className="fas fa-exclamation-triangle"></i></Row>
                    <Row style={{display: 'flex',  justifyContent:'center', color:'red', fontSize:'100%', marginTop : '-7%'}}>Errors Found</Row>
                </Col>
  
         </div>

    );
}

export default LogErrorReport
