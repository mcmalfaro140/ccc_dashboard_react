import React , {useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody } from 'reactstrap'
import {LogContext} from './SystemHealthContext.js'
import {Table , TableCell, TableBody, TableContainer, TableRow} from '@material-ui/core';



const LogWarningSystemHealth = () => {
    
    const {WarningReport} = useContext (LogContext)
    const [LogReportWarn] = WarningReport

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

    

    const cell = LogReportWarn.map((item, i) => {
       
             let strid = "row" + i;
             let iconid = "icon" + i;
          
            return(
               
                <TableBody className = "tablesaw tablesaw-stack">
                <TableRow id={strid} hover onClick={() => handleClick(i)} className = "table_logs_cell">
    
                <TableCell className="time_col" 
                style = {{ color :'black', fontSize : '100%', fontWeight : '100', fontFamily : 'sans-Serif'}}><i id={iconid} className="mdi mdi-menu-right"></i>
                {Object.keys(item)}</TableCell>

                
                </TableRow>
                <TableRow id={i} style={{visibility:'collapse'}}>
                   
                        <TableBody >
                            <TableRow key = {i}>
                                        <TableCell className="hid_cell" style = {{ backgroundColor :'lightblue'}}>
                                            Time Stamp
                                        </TableCell>
                                        <TableCell className="hid_cell" style = {{ backgroundColor :'lightblue'}}>
                                           Log Stream Name
                                        </TableCell>
                                        <TableCell className="hid_cell" style = {{ backgroundColor :'lightblue'}}>
                                           Log Message
                                        </TableCell>
                            </TableRow>

                            {item[Object.keys(item)].map((logItem, index) => {
                                       
                                    return (
                                        <TableRow key = {index}>
                                            <TableCell className="hid_cell" >
                                                { new Date(parseInt(logItem.timestamp)).toGMTString()+ ":"}
                                            </TableCell>
                                            <TableCell className="hid_cell" >
                                                {logItem.logStreamName}
                                            </TableCell>
                                            <TableCell className="hid_cell" >
                                                {logItem.message}
                                            </TableCell>
                                        </TableRow>
                                    );
                            })} 
                         </TableBody> 
                      
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
                        <TableContainer >
                            <Table aria-label="spanning table"  className="table_logs_header" >
                                    <TableRow>
                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Log Group Names with Warnings</TableCell>
                                    </TableRow>
                                {cell}
                            </Table>
                        </TableContainer>
                    </CardBody>

                </Card>
            </div>
            
        )
    
}

export default LogWarningSystemHealth;