import React , {useState , useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody } from 'reactstrap'
import {LogContext} from './SystemHealthContext.js'
import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow} from '@material-ui/core';




const EC2SystemHealth = () => {
    
    const {EC2Status} = useContext (LogContext)
    const [EC2InstanceStatus , setEC2InstanceStatus]= EC2Status

    const handleClick = (id) => {
        let element = document.getElementById(id);
        let rowid = "row" + id;
        let iconid = "icon" + id;
        let row = document.getElementById(rowid);
        let icon = document.getElementById(iconid);
        if(ReactDOM.findDOMNode(element).style.visibility === "collapse"){
            ReactDOM.findDOMNode(row).classList.add("color")
            ReactDOM.findDOMNode(element).classList.add("color")
            ReactDOM.findDOMNode(element).style.visibility = "visible"
            ReactDOM.findDOMNode(icon).classList.add("down")
        }else{
            ReactDOM.findDOMNode(element).style.visibility = "collapse"
            ReactDOM.findDOMNode(row).classList.remove("color")
            ReactDOM.findDOMNode(icon).classList.remove("down")
        }
    }

    

    const cell = EC2InstanceStatus.map((item, i) => {
       
             let strid = "row" + i;
             let iconid = "icon" + i;
          
            return(
               
                <TableBody className = "tablesaw tablesaw-stack">
                <TableRow id={strid} hover onClick={() => handleClick(i)} className = "table_logs_cell">
    
                <TableCell className="time_col" 
                style = {{ color :'black', paddingRight:'-5%', fontSize : '100%', fontWeight : '100', fontFamily : 'sans-Serif'}}><i id={iconid} className="mdi mdi-menu-right"></i>
                {Object.keys(item)}</TableCell>
                <TableCell className="hid_cell" >
                        { Object.values(item)}
                </TableCell>
                
                </TableRow>
                <TableRow id={i} style={{visibility:'collapse'}}>
                   
                        <TableBody >
                            
                            {/* {Object.values(item).map((logItem, index) => {
                                       
                                    return (
                                        <TableRow key = {index}>
                                            <TableCell className="hid_cell" >
                                                { logItem.InstanceId}
                                            </TableCell>
                                             <TableCell className="hid_cell" >
                                                {Object.values(logItem.InstanceStatus).Status}
                                            </TableCell> */}
                                            {/* <TableCell className="hid_cell" >
                                                {logItem.message}
                                            </TableCell>  */}
                                        {/* </TableRow>
                                    );
                            })}  */}
                         </TableBody> 
                      
                </TableRow>
            </TableBody>
            )
        })
    

useEffect(() => {



}, [])
        return(
            <div>
                <Card className="card-box"> 

                    <CardBody>
                        <TableContainer >
                            <Table aria-label="spanning table"  className="table_logs_header" >
                                    <TableRow>
                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            EC2 Instance</TableCell>
                                    </TableRow>
                                {cell}
                            </Table>
                        </TableContainer>
                    </CardBody>

                </Card>
            </div>
            
        )
    
}

export default EC2SystemHealth;