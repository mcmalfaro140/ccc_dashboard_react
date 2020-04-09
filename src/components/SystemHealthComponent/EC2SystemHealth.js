import React , {useState , useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody } from 'reactstrap'
import {LogContext} from './SystemHealthContext.js'
import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow} from '@material-ui/core';


const EC2SystemHealth = () => {
    
    const {EC2Status} = useContext (LogContext)
    const [EC2InstanceStatus , setEC2InstanceStatus]= EC2Status


    const cell = EC2InstanceStatus.map((item, i) => {
       
             const expandableData = Object.entries(Object.values(item))[0][1]

             
            return(
               
                <TableBody className = "tablesaw tablesaw-stack" key ={i}>
                <TableRow id={i} hover  className = "table_logs_cell">
    
                <TableCell style = {{ color :'black', paddingRight:'-5%', fontSize : '100%', fontWeight : '100', fontFamily : 'sans-Serif'}}>
                
                    {Object.keys(item)}
                
                </TableCell>

                { Object.keys(expandableData).map((itemkey, index) => {
                                       
                        return (
   
                            <TableCell className="hid_cell" key = {index} style = {{ color :'black', fontSize : '120%', fontWeight : '500', fontFamily : 'sans-Serif'}}> 
                                
                                { expandableData[itemkey]}
                            
                             </TableCell>
                                                
                        );
                })}  
                

            
                </TableRow>
               
            </TableBody>
            )
        })
    

useEffect(() => {



}, [])
        return(
            <div>
                <Card style = {{overflow: 'hidden', display: 'flex'}}> 

                    <CardBody>
                        <TableContainer className="my_table" >
                            <Table aria-label="spanning table"  className="table_logs_header" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            EC2 Instance</TableCell>

                                            <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Instance state
                                        </TableCell>

                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Availability zone
                                        </TableCell>

                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Instance status
                                        </TableCell>

                                    </TableRow>
                                </TableHead>
                                {cell}
                            </Table>
                        </TableContainer>
                    </CardBody>

                </Card>
            </div>
            
        )
    
}

export default EC2SystemHealth;