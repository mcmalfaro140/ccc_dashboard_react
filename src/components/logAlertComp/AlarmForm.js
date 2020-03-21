import React, { Component } from 'react';
import { Row, Card, Col } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {Form,Button} from 'react-bootstrap';
import AWS from 'aws-sdk';
import mykey from '../../keys.json';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
let cloudwatchlogs = new AWS.CloudWatchLogs();
let value = [];
let newArr = [];
class AlarmForm extends Component {
    constructor(props) {
        newArr = [];
        super(props);
        this.state = {
            logGroupNames:[],
            topicArns:[],
            isSelectAll:false,
            subscriptionProtocol:[],
            logAlarmInput:{
                AlarmName:null,
                LogLevelSign:null,
                LogLevel:null,
                Keywords:[],
                LogGroupNameSelection:[],
                SNS_Selection:null
            }
           
        }
        this.signSelection = this.signSelection.bind(this);
        this.levelSelection = this.levelSelection.bind(this);
        this.snsSelection = this.snsSelection.bind(this);
        this.showObj = this.showObj.bind(this);
        this.isSelectAll = this.isSelectAll.bind(this);
        this.logGroupSelection = this.logGroupSelection.bind(this);
        this.addProtocol = this.addProtocol.bind(this);
    }
    componentWillMount(){
        this.getLogGroupName();
        this.getSNSTopics();
    }
    signSelection(e){
        let v = e.target.value;
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.LogLevelSign = v;
            return { logAlarmInput };                                
          })
    }
    levelSelection(e){
        let v = e.target.value;
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.LogLevel = v;
            return { logAlarmInput };                                
          })
    }
    getSNSTopics(){
        let sns = new AWS.SNS();
        var params = {
           // NextToken: 'STRING_VALUE'
          };
          sns.listTopics(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data.Topics);
                this.setState({topicArns:data.Topics}); // successful response
            }        
          }.bind(this));
    }
    getLogGroupName(){
        cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
            if (err){
                console.log(err, err.stack); // an error occurred
            }else  {
                let temp = data.logGroups;
                let logs = [];
                for (var i = 0; i < temp.length; i++) {
                    logs.push(temp[i].logGroupName);
                }
                this.setState({logGroupNames:logs});
            }
        }.bind(this))
    }
    update(e,i){
        e.preventDefault();
        value[i] = e.target.value;
        if(value.length > 2){
            value = [];
        }
        let keywords;
        keywords = value[1].split(' ');
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.AlarmName = value[0];
            logAlarmInput.Keywords = keywords;
            return { logAlarmInput };                                
          })
  
    }
    snsSelection(e){
        let v = e.target.value;
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.SNS_Selection = v;
            return { logAlarmInput };                                
          })
    }
    logGroupSelection(i){
        if(this.state.isSelectAll === true){
            newArr = this.state.logGroupNames;
        }else{
            newArr.push(this.state.logGroupNames[i]);
        }
        
        let count = newArr.reduce((n, x) => n + (x === this.state.logGroupNames[i]), 0);
        if(count === 2){
            newArr = newArr.filter(a => a !== this.state.logGroupNames[i])
        }
        console.log(newArr);
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.LogGroupNameSelection = newArr;
            return { logAlarmInput };                                
          })
      
    }
    isSelectAll(){
        this.setState({isSelectAll:!this.state.isSelectAll});
        if(this.state.isSelectAll === false){
            this.setState(prevState => {
                let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
                logAlarmInput.LogGroupNameSelection = this.state.logGroupNames;
                return { logAlarmInput };                                
              })
        }else{
            this.setState(prevState => {
                let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
                logAlarmInput.LogGroupNameSelection = [];
                return { logAlarmInput };                                
              })
        }
    }
    addProtocol(){
        this.setState({subscriptionProtocol:[...this.state.subscriptionProtocol,{name:'',id:'',value:''}]})
    }
    showObj(){
        console.log(this.state.logAlarmInput);
    }
    render() {
        return (
            <Card>
                <Form.Group>
                    <Form.Label className = 'form_header'>New Log Alarm Form </Form.Label>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Alarm Name: </Form.Label>
                    <Form.Control type="text" className = 'form_input' onChange = {(e) => this.update(e,0)}/>
                </Form.Group> 

                            
                <Form.Group>
                    <Form.Label>Filter Pattern: </Form.Label>
                </Form.Group>

                                    
                <Form.Group>   
                   <Row>
                       <Col>
                            <Form.Label className = 'log_level'>Log Level: </Form.Label>   
                       </Col>
                        
                       <Col>
                            <Form.Control as="select" onChange={this.signSelection}>
                                <option value ="<">&lt;</option>
                                <option value = '>'>&gt;</option>
                                <option value = '≤'>≤</option>
                                <option value = '≥'>≥</option>
                            </Form.Control>    
                       </Col> 
                       <Col>
                            <Form.Control as="select" onChange={this.levelSelection}>
                                <option value = 'ERROR'>ERROR</option>
                                <option value = 'WARN'>WARN</option>
                                <option value = 'INFO'>INFO</option>
                            </Form.Control>   
                       </Col>
                       <Col>
                       </Col>
                       <Col>
                       </Col>
                       <Col>
                       </Col>
                       <Col>
                       </Col>
                       <Col>
                       </Col>
                       
                   </Row>
 
                   
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label className = 'log_level'>Keywords(optional): </Form.Label>   
                        </Col>
                        <Col xs = {10}>
                            <Form.Control type="text" onChange = {(e) => this.update(e,1)} />
                        </Col>
                    </Row>
                    
                </Form.Group>              
                                    
                <Form.Group>
                    <Form.Label>Select the log group name/s:</Form.Label>
                    <div>
                        <input type="checkbox" value="" onChange = {this.isSelectAll}/>
                        <label className = 'checkss'>
                                Select All
                        </label>
                    </div>
                </Form.Group> 

                <Form.Group className = 'log_level'>
                    {
                        this.state.logGroupNames.map((item,i)=>{
                            return(
                                <div>
                                    {
                                        this.state.isSelectAll === true?
                                        <div>
                                        <input type="checkbox" checked = {this.state.isSelectAll} disabled/>
                                            <label className = 'checkss'>
                                                    {item}
                                            </label>
                                        </div>
                                        :
                                        <div>
                                        <input type="checkbox" onChange = {(e) => this.logGroupSelection(i)}/>
                                            <label className = 'checkss'>
                                                    {item}
                                            </label>
                                        </div>
                                    }
                                    
                                </div>
                            )  
                        })
                    }

                </Form.Group>

                <Form.Group>
                    <Form.Label>Pick an SNS: </Form.Label>
                    <Form.Control as="select" className = 'form_input' onChange = {this.snsSelection}>
                        {
                            this.state.topicArns.map(item=>{
                                return(
                                <option value = {item.TopicArn}>{item.TopicArn.split(':')[item.TopicArn.split(':').length-1]}</option>
                                )
                            })
                        }
                               
                    </Form.Control>    
                </Form.Group>

                <Form.Group>
                    <Button className = 'button_a' style = {{float:'right'}} onClick = {this.addProtocol}>Add Subscription Endpoint</Button>
                </Form.Group>

                {
                    this.state.showEndPoint === true?
                    <Form.Group>
                        
                    </Form.Group>
                 :null
                }

                <Form.Group>
                    <div className = 'subscribe_div'>
                        <Button className = 'subscribe_but' onClick = {this.showObj}>Create & Subscribe to New Alarm</Button>
                    </div>
                </Form.Group>
                

        
                              
                        

            </Card>
        )
    }
}

export default AlarmForm;