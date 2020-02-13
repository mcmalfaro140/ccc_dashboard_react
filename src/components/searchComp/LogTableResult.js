import React from 'react';
import ReactDOM from 'react-dom';
import { Card, CardBody } from 'reactstrap'

import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow} from '@material-ui/core';

class LogTableResult extends React.Component {
    constructor (props){
        super(props);
        this.state = {
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id){
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

    render() {
        const cell = this.props.results.events.map((item, i) => {
            let objKeys = Object.keys(item)
            let objValues = Object.values(item)
            let tempStr = item.message.replace(/(\r\n|\n|\r)/gm,"  ");
            item.message = tempStr;
            let strid = "row" + i;
            let iconid = "icon" + i;
            var t = new Date(parseInt(item.timestamp));
            let time = t.toGMTString();
            return(
                <TableBody class="tablesaw tablesaw-stack">
                    <TableRow id={strid} hover onClick={() => this.handleClick(i)} className="table_logs_cell">
                        <TableCell><i id={iconid} class="mdi mdi-menu-right"></i></TableCell>
                        <TableCell className="time_col">{time}</TableCell>
                        <TableCell>{item.message}</TableCell>
                    </TableRow>
                    <TableRow id={i} style={{visibility:'collapse'}}>
                        <TableCell colSpan={3}>
                            <TableBody >
                                {objKeys.map((name, i) => {
                                    return (
                                        <TableRow>
                                            <TableCell className="hid_cell" >
                                                {objKeys[i]+":"}
                                            </TableCell>
                                            <TableCell className="hid_cell" >
                                                {objValues[i]}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        })
        return(
            <div>
                <Card className="card-box"> 
                    <div style={{display:"flex"}}>
                        <i style={{color:'red', marginRight:'2%', fontSize:'250%'}} onClick={this.props.showToggle} class="mdi mdi-arrow-left-bold-circle"></i>
                        <h2> {this.props.results.logGroupName}</h2>
                    </div>
                    <CardBody>
                        <TableContainer >
                            <Table aria-label="spanning table"  className="table_logs_header">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell align="left">Time (UTC +00:00)</TableCell>
                                        <TableCell align="left">Message</TableCell>
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
}

export default LogTableResult;