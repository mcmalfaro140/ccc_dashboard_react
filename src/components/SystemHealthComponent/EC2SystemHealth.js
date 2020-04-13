import React , {useState , useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody , Button} from 'reactstrap'
import {LogContext} from './SystemHealthContext.js'
import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow} from '@material-ui/core';


const EC2SystemHealth = () => {
    
    const {EC2Status} = useContext (LogContext)
    const {EC2InstanceTag} = useContext (LogContext)
    const [EC2InstanceStatus , setEC2InstanceStatus]= EC2Status
    const [EC2InstanceTags , setEC2InstanceTags] = EC2InstanceTag


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
       
             const expandableData = Object.entries(Object.values(item))[0][1]
            const tagItem  = EC2InstanceTags.filter((element) => element.id == Object.keys(item) )
             let strid = "row" + i;
             let iconid = "icon" + i;
             
            return(
               
            <TableBody className = "tablesaw tablesaw-stack">
    
                <TableRow id={strid} className = "table_logs_cell">
                    {/* Displays the instance id */}

                    <TableCell className="time_col"  style = {{ color :'black' , fontSize : '100%', fontWeight : '120', fontFamily : 'sans-Serif'}}>
                        <i id={iconid} className="mdi mdi-menu-right"></i> 
                        { Object.values(tagItem[0])[0] }
                        
                    </TableCell>

                    {/* Displays the availability zone, instance state and instance status */}
                    { Object.keys(expandableData).map((itemkey, index) => {
                            
                            return (
    
                                    <TableCell className="time_col" key = {index} style = {{ color :'black', fontSize : '100%', fontWeight : '120', fontFamily : 'sans-Serif'}}> 
                                        
                                        { expandableData[itemkey]}
                                    
                                    </TableCell>
                                                    
                                );           
                        })
                    }  
                
                    {/* Dipslays the button for tags */}
                    <TableCell  className="time_col">
                            
                        <Button color="primary" hover onClick={() => handleClick(i)}>Show Tags</Button>
                    
                    </TableCell>
                  

                </TableRow>

                

                
                <TableRow id={i} style={{visibility:'collapse' }} >
                    <TableContainer>
                             <TableRow > 
                                        <TableCell className="hid_cell" style = {{  backgroundColor :'lightblue'}}>
                                            Key
                                        </TableCell>
                                        <TableCell  className="hid_cell" style = {{  backgroundColor :'lightblue'}}>
                                           Value
                                        </TableCell>
                                        
                             </TableRow> 

                           {Object.values(tagItem[0])[1].map((tag, index) => {
                                       
                                    return (
                                        <TableRow key = {index}>

                                            <TableCell className="hid_cell">
                                                {tag.Key}
                                            </TableCell >
                                            <TableCell  className="hid_cell">
                                                {tag.Value}
                                            </TableCell>
                                            
                                        </TableRow>
                                    );
                            })}  
                       </TableContainer>
                    </TableRow>
        </TableBody>
            )
        })
    
        return(
            <div >
                <Card  style = {{overflow: 'hidden', display: 'flex'}}> 

                    <CardBody>
                        <TableContainer className="my_table" >
                            <Table aria-label="spanning table"  className="table_logs_header" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            EC2 Instance</TableCell>

                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Instance state</TableCell>
        
                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Availability zone
                                        </TableCell>

                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Instance status
                                        </TableCell>

                                        <TableCell align="left" style = {{ color :'black', fontSize : '140%', fontWeight : '500', fontFamily : 'sans-Serif'}}>
                                            Tags
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