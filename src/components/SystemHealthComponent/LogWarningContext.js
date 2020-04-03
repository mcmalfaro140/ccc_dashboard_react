import React, {useContext} from 'react'
import { Row, Col} from 'reactstrap';
import {LogContext} from './SystemHealthContext.js'

const LogWarningContext = (props) => {

 //Get the context from system Health context
 const {WarningCount} = useContext(LogContext)
 const [ WarnResultCount , setWarnResultCount]  = WarningCount

 return (

    <div style={{ marginLeft:'10%'}} onClick = {props.onClick}>
    
     
     <Col style={{ margin:'0%'}}>
        
        <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif'}}>Log Warnings</Row>
        <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'250%' }}> <span style={{padding:'-1%'}}>{WarnResultCount}</span> <i style={{padding:'1%'}} className="fas fa-exclamation-triangle"></i></Row>
        <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'97%', fontFamily : 'sans-Serif', marginTop:'-7%'}}>Warnings Found</Row>
                        
     </Col>
     
 </div>

 );


}

export default LogWarningContext