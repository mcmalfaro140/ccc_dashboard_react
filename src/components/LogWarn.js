import React from 'react';
import AWS from 'aws-sdk';
import ReactDOM from 'react-dom';
import mykey from '../keys.json';
import { Row, Col, Popover,PopoverBody,PopoverHeader,Card} from 'reactstrap';
import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow} from '@material-ui/core';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();

class LogWarn extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            id: 0,
            isOpen : false,
            logErrorOpener:true,
            loading: true,
            showLogTable: false,
            keyword : "",
            logGroupNames : [],
            noResults: false,
            params : {
                limit : '50'
            },
            results: [],
            resultCount:0
        }
        this.getLogGroupName = this.getLogGroupName.bind(this);
        this.searchByLogGroupName = this.searchByLogGroupName.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.defaultIcon = this.defaultIcon.bind(this);
    }

    componentDidMount() {
        this.setState({results: [], loading: true, noResults: false})
        this.getLogGroupName();
    }

 //Funtion to get all the log group names from AWS
 getLogGroupName(){
    cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
        if (err){
            console.log(err, err.stack); // an error occurred
        }else  {
            let temp = data.logGroups;
            for (var i = 0; i < temp.length; i++) {
                this.setState(prevState => ({
                    logGroupNames : [...prevState.logGroupNames, temp[i].logGroupName]
                }));
            }
            for (var i = 0; i < temp.length; i++) {
                this.searchByLogGroupName(this.state.logGroupNames[i]);
            }
        }
    }.bind(this))
}

//Funtion to search on a specific log group name base on the keyword input by the user
searchByLogGroupName(logName){

        var params = {
            logGroupName: logName, /* required */
            filterPattern: 'WARN', /*keyword passed by the user */
        }
      
    cloudwatchlogs.filterLogEvents(params, function(err, data) {
        if(err){
            console.log(err, err.stack); // an error occurred
        }else{ 
            if(data.events.length > 0){

                let resultData = {
                    logGroupName: "",
                    events: []
                }

                var new_data = Object.create(resultData);  
                new_data.logGroupName = logName;
                new_data.events = data.events

                this.setState({
                    resultCount : this.state.resultCount + new_data.events.length
                })

                this.setState(prevState => ({
                    results : [...prevState.results, new_data]
                }));

                
            }                
        }  
        setTimeout(() => 
        {if(this.state.results.length === 0){
            this.setState({ loading: false, noResults: true })
        }else{
            this.setState({ loading: false})
        }}, 1000); 
    }.bind(this));
}

toggle = () => {

 this.setState({
    isOpen : !this.state.isOpen
})

}
handleClick(id){
    let element = document.getElementById(id);
    let rowid = "rowwarn" + id;
    let iconid = "iconwarn" + id;
    let row = document.getElementById(rowid);
    let icon = document.getElementById(iconid);
}

defaultIcon = () => {

    return (
        <Col style={{ margin:'0%'}} id = "popoverCardSecond" onClick = {() => this.setState({logErrorOpener: !this.state.logErrorOpener})}>
        <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif'}}>Log Warnings</Row>
        <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'300%' }}> <span style={{paddingRight:'-1%' }}>{this.state.resultCount}</span> <i style={{padding:'1%'}} class="fas fa-exclamation-triangle"></i></Row>
        <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'100%', fontFamily : 'sans-Serif'}}>Warnings Found</Row>
        
    </Col>
    )

}

    render() {

        const cell = this.state.results.map((item, i) => {
            let objKeys = Object.keys(item.events)
            let objValues = Object.values(item.events)

          let strid = "rowwarn" + i;
          let iconid = "iconwarn" + i;
       
            return(
                <TableBody className="tablesaw tablesaw-stack">
                    <TableRow  id={strid} hover onClick={() => this.handleClick(i)} className="table_logs_cell">

                        <TableCell style={{color:'black', fontSize:'120%', fontWeight:'300', fontFamily : 'sans-Serif'}}>
                        <i id={iconid} class="mdi mdi-menu-right"></i>{item.logGroupName}</TableCell>

                        <TableCell style={{color:'black', fontSize:'100%', fontWeight:'100' , fontFamily : 'sans-Serif'}}>
                                                    {this.state.results[i].events.length}
                        </TableCell>

                    </TableRow>
                </TableBody>
            )
        })

        return(
            <div style={{ marginLeft:'10%'}}>


            { this.state.logErrorOpener ? (

                this.defaultIcon()

            ):  (

                    
                <div style={{ marginLeft:'-10%'}}>
                    <div style={{ marginLeft:'0%'}} >

                    <Col style={{ marginLeft:'-10%'}} id = "popoverCardSecond" onClick = {() => this.setState({logErrorOpener: !this.state.logErrorOpener})}>
                        <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif'}}>Log Warnings</Row>
                        <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'300%' }}> <span style={{padding:'-1%'}}>{this.state.resultCount}</span> <i style={{padding:'1%'}} class="fas fa-exclamation-triangle"></i></Row>
                        <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'100%', fontFamily : 'sans-Serif' ,paddindTop : '-1%'}}>Warnings Found</Row>
                        
                    </Col>
                    </div>

                    <div style={{ marginLeft:'-10%'}}>
                        <Card>
                        <Table className="table_logs_header" aria-label="spanning table" > 
                        <TableHead onClick = {() => this.setState({logErrorOpener : !this.state.logErrorOpener})}>
                        <TableRow>
                                <TableCell style = {{fontFamily : 'sans-Serif'}}>Log Group Names With Warnings</TableCell>
                                <TableCell></TableCell>

                        </TableRow>
                        </TableHead>
                                    {cell}
                        </Table>
                        </Card>
                    </div>
               </div>
                )
            }
            </div>
        )
    }
}

export default LogWarn;