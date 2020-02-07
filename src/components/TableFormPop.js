import React, { Component } from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,CustomInput,Label,Input,ButtonGroup } from 'reactstrap';
import { Row, Col, CardBody } from 'reactstrap';
import { SketchPicker } from 'react-color'
import DateTimePicker from 'react-datetime-picker';
import Switch from "react-switch";
import '../assets/react-grid/styles.css'


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();

var logNames = []
var currentDate = new Date();
 var value = [];

class TableFormPop extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            params:{
                limit:'50'
            },
            recordArray: [],
            mixGraph:new Set(),
            checkboxes: [],
            filter: 'ALL',
            newMasterTable:{
                objectType:"table", // options: graph or table
                tableSettings: {
                    chartName: "This is a chart name from TableFormProps",
                    typeOfDimension : "Jaman",
                    idValue:'3',
                    refreshRate: '',
                    period:'',
                    startTime:'', //if needed
                    endTime:'' //if needed
                },
                coordinates: {
                    x: 0,
                    y: 0,
                    w: 10,
                    h: 9,
                    minW: 6,
                    minH: 9
                },
            },
            modalOpen: false


        }

this.readMixTimeSelection1= this.readMixTimeSelection1.bind(this);
this.toggleForm = this.toggleForm.bind(this);
this.update = this.update.bind(this);
        
    }


componentWillMount(){

    this.getLogGroupName();
    
}
readMixTimeSelection1(e){
    if(e.target.value === "Last Hour"){
        this.setState(prevState => {
            let mixGraph = Object.assign({}, prevState.mixGraph);  
            mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())
            mixGraph.endtime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes());
            return { mixGraph };                                
          })
    }
    if(e.target.value === "Last Day"){
        this.setState(prevState => {
            let mixGraph = Object.assign({}, prevState.mixGraph);  
            mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())
            mixGraph.endtime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes());
            return { mixGraph };                                
          })
    
    }
    if(e.target.value === "Last Week"){
        this.setState(prevState => {
            let mixGraph = Object.assign({}, prevState.mixGraph);  
            mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes())
            mixGraph.endtime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes());
            return { mixGraph };                                
          })
    
    
    }
    if(e.target.value === "Last Month"){
        this.setState(prevState => {
            let mixGraph = Object.assign({}, prevState.mixGraph);  
            mixGraph.startTime = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes())
            mixGraph.endtime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes());
            return { mixGraph };                                
          })
    }
}
getLogGroupName =  () => {

          cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else  {
                        //console.log(data);
                        this.setState({temp : data.logGroups});

                        for (var i = 0; i < data.logGroups.length; i++) {

                            this.setState(prevState => ({
                              recordArray : [...prevState.recordArray, {logGroupName : data.logGroups[i].logGroupName
                            , isChecked:false}]
                            }));
                        }

                          this.logNames = this.state.recordArray.splice(0)
                          this.setState(({
                              recordArray:  this.logNames
                          }))
                          console.log(this.state.recordArray);

                          console.log(this.logNames);

                        };
          }.bind(this));

};

onAddingItem = (i) => (event) => {
    console.log(event.target.checked)
    this.setState((state, props) => {
      state.recordArray[i].isChecked = !state.recordArray[i].isChecked;
      return {
        recordArray: state.recordArray
      }
    })
    
};


toggleForm = () => {
    
    this.setState({modalOpen : !this.state.modalOpen})
    this.setState(prevState => ({
        modalOpen: !prevState.modalOpen
    }));

};

update(e,i){
    e.preventDefault();
    this.setState({namespaceNotSelected:false})
    value[i] = e.target.value;
    if(value.length > 5){
        value = [];
    }
  
    console.log(value[1])
 
    this.setState({newMasterTable: {tableSettings: {chartName : value[0]}}});

    
}



    render(){
        
    
        let {recordArray} =  this.state;


        return(


            <div>
                <ModalHeader toggle={this.props.toggle}>New Table Form</ModalHeader>
                <ModalBody>
                    Please provide all the inputs to create a new Table.
                    <form>
                    
                <Form.Group controlId="chartName">
                                        <Form.Label>Table Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter table name" onChange = {(e) => this.update(e,0)}/>
                                        
                </Form.Group>
                        
                        {/* Log group Name selection */}
            <Form.Group>
                <Form.Label>Choose the log group name(s)</Form.Label>
                    {/* <Form.Control as = "select" onChange={(e) => this.readMixTimeSelection1(e)}> */}
                    {/* <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple> */}
                    
                    <Input type="select" multiple={true} defaultValue={"Select a name"} className="dropselect_tag" name="tag" onChange = {(e) => this.update(e,1)}>
                     { recordArray.map((product, i) =>{

                         return(
                                                
             <option value ={product.logGroupName} checked={product.isChecked} >{product.logGroupName}</option>
                                    
                                )
                                       
                    })}
                    </Input>  
                   
            <Form.Text className="text-muted"> Select the log group name(s) </Form.Text>
                    
                    </Form.Group>


                        {/* Time Range selection */}
                    <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>Time Range</Form.Label>
                                        <Form.Control as="select"  
                                        onChange={(e) => this.readMixTimeSelection1(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "Last Hour">Last Hour</option>
                                        <option value = "Last Day">Last Day</option>
                                        <option value = "Last Week">Last Week</option>
                                        <option value = "Last Month">Last Month</option>
                                        </Form.Control>
                                        <Form.Text className="text-muted">
                                            Select the time
                                            </Form.Text>
                    
                    
            </Form.Group>

                   
                 </form>
                
                 

                </ModalBody>

                <ModalFooter>
                                <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newMasterTable:{
                                            objectType:"table", // options: graph or table
                                            tableSettings: {
                                                chartName: this.state.newMasterTable.tableSettings.chartName,
                                                typeOfDimension : "JamanTypeDimension",
                                                idValue:this.state.idValue,
                                                refreshRate: this.state.refreshRate,
                                                period:this.state.period,
                                                startTime:this.state.startTime, //if needed
                                                endTime:this.state.endTime //if needed
                                            },
                                            coordinates: {
                                                x: 0,
                                                y: 0,
                                                w: 100,
                                                h: 13,
                                                minW: 6,
                                                minH: 10
                                            },
                                          
                                        }
                                    }
                                }}>
                               

                                <Button color="primary"  onClick={this.props.toggle}>Done</Button>                                
                                </Link>
                                <Button outline color="secondary" data-dismiss="modal" onClick={this.props.toggle}>Cancel</Button>                          
                                
                  </ModalFooter>
            </div>
        )
    }

}


    
export default connect()(TableFormPop);






  {/* { recordArray.map((product, i) =>{
                        return(
                                <div class="checkbox checkbox-circle checkbox-color-scheme">
                                    <label class="checkbox-checked">
                                        <input type="checkbox" value={product.logGroupName} checked={product.isChecked} onChange={this.onAddingItem(i)}/> <span class="label-text">{product.logGroupName}</span>
                                    </label>
                                </div>
                            
                        )
                     })} */}