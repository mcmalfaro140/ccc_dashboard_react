import React from 'react';
import AWS from 'aws-sdk';
import ReactDOM from 'react-dom';
import mykey from '../keys.json';
import { Row, Col, Popover,PopoverBody,PopoverHeader} from 'reactstrap';
import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow} from '@material-ui/core';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();

class LogWarn extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            id: 0,
            isOpen : false,
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

    }

    componentDidMount() {
        this.setState({results: [], loading: true, noResults: false})
        this.getLogGroupName();
    }

 //Funtion to get all the log group names from AWS
 getLogGroupName(){
    // console.log("init search")
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
           // endTime: Math.round(new Date().getTime()/1000) - 86400,
            filterPattern: 'WARN', /*keyword passed by the user */
            //startTime: Math.round(new Date().getTime()/1000)
            // limit: 1000, 
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
        // console.log(this.state.results)

        const cell = this.state.results.map((item, i) => {
            let objKeys = Object.keys(item.events)
            let objValues = Object.values(item.events)

          let strid = "rowwarn" + i;
          let iconid = "iconwarn" + i;
       
            return(
                <TableBody className="tablesaw tablesaw-stack">
                    <TableRow  id={strid} hover onClick={() => this.handleClick(i)} className="table_logs_cell">
                    <TableCell style={{color:'black', fontSize:'120%', fontWeight:'300', fontFamily : 'sans-Serif'}}>
                    <i id={iconid} className="mdi mdi-menu-right"></i>{item.logGroupName}</TableCell>
                    </TableRow>
                    <TableRow id={i} style={{visibility:'collapse'}}>
                        <TableCell>
                            <TableBody >
                                {/* {this.state.results[i].events.map((name, i) => {
                                    return ( */}
                                        <TableRow>
                                            <TableCell className="hid_cell" style={{color:'black', fontSize:'100%', fontWeight:'100' , fontFamily : 'sans-Serif'}}>
                                                {this.state.results[i].events.length}
                                            </TableCell>
                                        </TableRow>
                                    {/* );
                                })} */}
                            </TableBody>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        })

        return(

            <div style={{ marginLeft:'10%'}}>

            <Col style={{ margin:'0%'}} id = "popoverCardSecond" >
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif'}}>Log Warnings</Row>
        <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'300%' , marginTop:'-7%'}}> <span style={{paddingRight:'1%' , marginTop:'-3%'}}>{this.state.resultCount}</span> <i style={{padding:'2%'}} className="fas fa-exclamation-triangle"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'100%', marginTop:'-7%', fontFamily : 'sans-Serif' }}>Warnings Found</Row>
                
            </Col>
            <Popover placement="right" isOpen={this.state.isOpen} target="popoverCardSecond" toggle={this.toggle}>

            <Table className="table_logs_header" aria-label="spanning table" > 
            <TableHead>
               <TableRow>
                    <TableCell style = {{fontFamily : 'sans-Serif'}}>Log Group Names With Warnings</TableCell>
               </TableRow>
            </TableHead>
                        {cell}
             </Table>
            
            </Popover>
        </div>

        )
    }
}

export default LogWarn;