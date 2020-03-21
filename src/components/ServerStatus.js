import React, { Component } from 'react';
import AWS from 'aws-sdk';
import ReactDOM from 'react-dom';
import mykey from '../keys.json';
import { Row, Col, Popover,PopoverBody,PopoverHeader , UncontrolledCollapse, ListGroup ,
     ListGroupItem, ListGroupItemHeading} from 'reactstrap';
import {Table , TableCell, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var ec2 = new AWS.EC2();

class ServerStatus extends Component {

    constructor (props){
        super(props);
        this.state = {
            id: 0,
            isOpen : false,
            loading: true,
            logGroupNames : [],
            statusResult : "",
            noResults: false,
            params : {
                limit : '50'
            },
            results: [],
            resultCount:0
        }
        this.getEC2InstanceStatus = this.getEC2InstanceStatus.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    componentDidMount() {
        this.getEC2InstanceStatus();
    }
    toggle = () => {

        this.setState({
           isOpen : !this.state.isOpen
       })
       
       }
       handleClick(id){
           let element = document.getElementById(id);
           let rowid = "rowServer" + id;
           let iconid = "iconServer" + id;
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
       
    getEC2InstanceStatus () {
        var params = {
            
           IncludeAllInstances: true,
            // InstanceIds:[ 
            //   'i-01e27ec0da2c4d296'
            
            // ]
          
          };
          ec2.describeInstanceStatus(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                
                this.setState({results : data.InstanceStatuses , statusResult : data.InstanceStatuses[0].InstanceStatus.Status})

            }
          }.bind(this));

    }
 

    render() {


        // console.log(this.state.results)
        const cell = this.state.results.map((item, i) => {
        
          let strid = "rowServer" + i;
          let iconid = "iconServer" + i;
       
            return(
                <TableBody class="tablesaw tablesaw-stack">
                    <TableRow  id={strid} hover onClick={() => this.handleClick(i)} className="table_logs_cell">
                    <TableCell style={{align : 'right',  color:'black', fontSize:'100%', fontWeight:'200', fontFamily : 'sans-Serif'}}>
                    <i id={iconid} class="mdi mdi-menu-right"></i> {item.InstanceId}</TableCell>
                  
                    </TableRow>
                    <TableRow id={i} style={{visibility:'collapse'}}>
                        <TableCell>
                            <TableBody>
                    
                                <TableRow>
                                    <TableCell className="hid_cell" style={{color:'black', fontSize:'100%', fontWeight:'200' , fontFamily : 'sans-Serif'}}>
                                        {item.InstanceState.Name}
                                    </TableCell>
                                
                                </TableRow>

                            </TableBody>
                        </TableCell>
                    </TableRow>
                </TableBody>
                
        
            )
        })

        return(
            
    <div style={{ marginLeft:'10%'}}>
            <Col style={{ margin:'0%'}} id = "toggler">
                <Row style={{display: 'flex',  justifyContent:'center', color:'black', fontSize:'140%', fontWeight:'500' , fontFamily : 'sans-Serif' }}>EC2 Status</Row>
                <Row style={{display: 'flex',  justifyContent:'center',color:'gold', fontSize:'350%', marginTop:'-7%'}}> <span style={{paddingRight:'2%' , marginTop:'-3%'}}>1</span> <i class="mdi mdi-server"></i></Row>
                <Row style={{display: 'flex',  justifyContent:'center', color:'gold', fontSize:'100%', marginTop:'-7%'}}>Server is {this.state.statusResult}</Row>
                
            </Col>

        <Popover placement="left" isOpen={this.state.isOpen} target= "toggler" toggle={this.toggle}>


                <Table className="table_logs_header" aria-label="spanning table" > 

                    <TableHead>
                        <TableRow>
                            <TableCell style = {{ fontFamily : 'sans-Serif' }}> EC2 status </TableCell>
                        </TableRow>
                    </TableHead>

                            {cell}

                </Table>
             
        </Popover>

         
        
     </div>
        )
    }
}

export default ServerStatus;