import React, {useContext} from 'react'
import { Row, Col} from 'reactstrap';
import {LogContext} from './SystemHealthContext.js'

const ServerStatusContext = () => {
    //Get the context from system Health context
    const {EC2StatusAlert} = useContext(LogContext)

    //const [EC2InstanceStatus , setEC2InstanceStatus] = EC2Status
    const [EC2InstanceStatusAlert] = EC2StatusAlert

   
    return (

    <div style={{ marginLeft:'10%'}}>
       
       { EC2InstanceStatusAlert === 0 ?
        <Col  style={{ margin:'0%'}} >
            <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif' }}>EC2 Status</Row>
            <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'280%'}}> <span style={{ color: 'green', marginTop:'1%'}}>{EC2InstanceStatusAlert}</span> <i style={{padding:'1%' , color: 'green'}} className="mdi mdi-server"></i></Row>
            <Row style={{display: 'flex',  justifyContent:'center', fontSize:'100%', marginTop:'-7%', color: 'green'}}>Server is down</Row>
                
        </Col>
        
        :
        <Col  style={{ margin:'0%'}} >
            <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif' }}>EC2 Status</Row>
            <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'280%'}}> <span style={{ color: 'red', marginTop:'1%'}}>{EC2InstanceStatusAlert}</span> <i style={{padding:'1%' , color: 'red'}} className="mdi mdi-server"></i></Row>
            <Row style={{display: 'flex',  justifyContent:'center', fontSize:'100%', marginTop:'-7%', color: 'red'}}>Server is down</Row>
                
        </Col>

        }
    </div>

    );

}
export default ServerStatusContext