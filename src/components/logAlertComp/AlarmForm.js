import React, { Component } from 'react';
import { Row, Card, Col, Button } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {Form,Table} from 'react-bootstrap';
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
            listSubscriptions:null,
            showobj:false,
            subscribedTopicArn:null,
            logAlarmInput:{
                AlarmName:null,
                LogLevelSign:null,
                LogLevel:null,
                Keywords:[],
                LogGroupNameSelection:[],
                SNS_Selection:null,
                KeywordRelationship:null,
            }
           
        }
        this.signSelection = this.signSelection.bind(this);
        this.levelSelection = this.levelSelection.bind(this);
        this.snsSelection = this.snsSelection.bind(this);
        this.showObj = this.showObj.bind(this);
        this.isSelectAll = this.isSelectAll.bind(this);
        this.logGroupSelection = this.logGroupSelection.bind(this);
        this.addProtocol = this.addProtocol.bind(this);
        this.deleteProtocol = this.deleteProtocol.bind(this);
        this.attachEndpointsToSNSTopic = this.attachEndpointsToSNSTopic.bind(this);
        this.keywordRelationshipSelection = this.keywordRelationshipSelection.bind(this);
       
    }
    componentWillMount(){
        this.getLogGroupName();
        this.getSNSTopics();
    }
    listSubscriptions(arn){
        let sns = new AWS.SNS();
        var params = {
            TopicArn: arn, /* required */
          };
          sns.listSubscriptionsByTopic(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);
                this.setState({listSubscriptions:data.Subscriptions});
            }   
          }.bind(this));
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
    deleteProtocol(index){
        this.state.subscriptionProtocol.splice(index,1);
        this.setState({subscriptionProtocol:this.state.subscriptionProtocol});
     }
    update(e,i){
        e.preventDefault();
        value[i] = e.target.value;
        if(value.length > 2){
            value = [];
        }
        let keywords;
        if(value[1] === undefined){
            keywords = '';
        }else{
            keywords = value[1].split(' ');
        }
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.AlarmName = value[0];
            logAlarmInput.Keywords = keywords;
            return { logAlarmInput };                                
          })
  
    }
    keywordRelationshipSelection(e){
        let v = e.target.value;
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.KeywordRelationship = v;
            return { logAlarmInput };                                
          })
    }
    snsSelection(e){
        let v = e.target.value;
        let v_trimmed = v.split(":")[v.split(":").length-1];
        this.setState(prevState => {
            let logAlarmInput = Object.assign({}, prevState.logAlarmInput);  
            logAlarmInput.SNS_Selection = v_trimmed;
            return { logAlarmInput };                                
          })
          this.setState({subscribedTopicArn:v});
          this.listSubscriptions(v);
    }
    attachEndpointsToSNSTopic(e){
        e.preventDefault();
        let sns = new AWS.SNS();
        this.state.subscriptionProtocol.forEach(protocols =>{
            var params = {
                Protocol: protocols.name, /* required */
                TopicArn: this.state.subscribedTopicArn, /* required */
                Endpoint: protocols.value,
                ReturnSubscriptionArn: true
              };
              sns.subscribe(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else{
                    this.listSubscriptions(this.state.subscribedTopicArn);
                }   
              }.bind(this));
        })
    }
    addProtocol(){
        this.setState({subscriptionProtocol:[...this.state.subscriptionProtocol,{name:'',id:'',value:''}]})
    }
    protocolOption(e,index){
        let arr = this.state.subscriptionProtocol;
        let obj = {name: e.target.value, id : index, value:""};
        arr[index] = obj;
        this.setState({subscriptionProtocol:arr});
      
    }
    protocolValue(e,index){
        let arr = this.state.subscriptionProtocol;
        arr.map(elem=>{
            if(elem.id === index){
                elem.value = e.target.value;
            }
            return arr;
        })
        this.setState({subscriptionProtocol:arr});
    }
    unsubscribe(e,subscribedTopicArn,topicArn){
        //  this.setState({subscription: false});
          e.preventDefault();
          let sns = new AWS.SNS();
          var params = {
              SubscriptionArn: subscribedTopicArn /* required */
            };
            sns.unsubscribe(params, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else   { 
                  this.listSubscriptions(topicArn);
              }
            }.bind(this));
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
   
    showObj(){
        this.setState({showobj:!this.state.showobj})
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
                    <Form.Control type="text" placeholder="Enter alarm name here" className = 'form_input' onChange = {(e) => this.update(e,0)}/>
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
                                <option disabled selected>Select</option>
                                <option value ="<">&lt;</option>
                                <option value = '>'>&gt;</option>
                                <option value = '=='>=</option>
                                <option value = '<='>≤</option>
                                <option value = '>='>≥</option>
                            </Form.Control>    
                       </Col> 
                       <Col>
                            <Form.Control as="select" onChange={this.levelSelection}>
                                <option disabled selected>Select</option>
                                <option value = 'TRACE'>TRACE</option>
                                <option value = 'ERROR'>ERROR</option>
                                <option value = 'WARN'>WARN</option>
                                <option value = 'INFO'>INFO</option>
                                <option value = 'DEBUG'>DEBUG</option>
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
                        <Col xs={2.5}>
                            <Form.Control as="select" onChange={this.keywordRelationshipSelection}>
                                    <option disabled selected>Keyword Relationship</option>
                                    <option value = 'ANY'>ANY</option>
                                    <option value = 'ALL'>ALL</option>
                                </Form.Control>   
                        </Col>
                        <Col xs = {8}>
                            <Form.Control type="text" placeholder="Enter keywords here" onChange = {(e) => this.update(e,1)} />
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
                    <Form.Control as="select" className = 'form_input' onChange = {(e) => this.snsSelection(e)}>
                        <option disabled selected>Make Selection</option>
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
                {
                            this.state.listSubscriptions != null&& this.state.listSubscriptions.length > 0?  
                              <div className = 'scrolling'>
                                    <Form.Label>Subscribed Endpoints of the topic: {this.state.subscribedTopicArn.split(':')[this.state.subscribedTopicArn.split(':').length-1]}</Form.Label>
                                    <Table striped bordered hover size="sm">
                                         <thead>
                                            <tr>
                                                <th>Protocol</th>
                                                <th>Endpoint</th>
                                                <th>Owner</th>
                                                <th>SubscriptionArn</th>
                                                <th>TopicArn</th>
                                                <th>Action</th>
                                            </tr> 
                                        </thead>
                                        <tbody>
                                            { this.state.listSubscriptions.map((item,i)=>{
                                                return(
                                                    <tr>
                                                        <td>{item.Protocol}</td>
                                                        <td>{item.Endpoint}</td>
                                                        <td>{item.Owner}</td>
                                                        <td>{item.SubscriptionArn}</td>
                                                        <td>{item.TopicArn}</td>
                                                        <td><Button onClick = {(e) => this.unsubscribe(e,item.SubscriptionArn,item.TopicArn)}>Remove</Button></td>
                                                    </tr>
                                                )
                                                     })
                                                 }
                           </tbody>
                            </Table> 
                            </div> 
                            :null}

                </Form.Group>
                <Form.Group>
                <fieldset disabled = {this.state.subscribedTopicArn == null}>
                    <Button style = {{float:'right'}} onClick = {this.addProtocol}>Add Subscription Endpoint</Button>
                </fieldset>
                </Form.Group>
                <form onSubmit = {(e)=>this.attachEndpointsToSNSTopic(e)}>
                {
                this.state.subscriptionProtocol.map(({name, value},index)=>{
                              return(
                                <>
                                <hr style = {{borderColor:'#d1d1d1'}}/>
                                        <Row className = 'rows'>  
                                       
                                            <Col>
                                                <div>
                                                    <label>Protocol</label>
                                                </div>
                                                <div>
                                                    <select className = 'selection' onChange={(e) => this.protocolOption(e,index)}>
                                                        <option disabled selected>Select</option>
                                                        <option value="http">http</option>
                                                        <option value="https">https</option>
                                                        <option value="email">email</option>
                                                        <option value="sms">sms</option>
                                                        <option value="lambda">lambda</option>
                                                    </select>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div>
                                                    <label>Value</label>
                                                </div>
                                                <div>
                                                    <input value = {value} className = 'inputs' onChange = {(e) => this.protocolValue(e,index)}/>
                                                </div>  
                                            </Col>
                                            <Col xs={2}>
                                                <div className = 'remove_div'>
                                                    <div className = 'remove_label'>
                                                        <label>Remove</label>
                                                    </div>
                                                    <div className = 'remove_icon_div'>
                                                    <i class = "mdi mdi-delete-variant" style = {{fontSize:'200%',color:'black'}} onClick = {() =>this.deleteProtocol(index)}></i>
                                                    </div> 
                                                </div>  
                                            </Col>
                                        </Row>
                                    </>
                              )
                            })
                            }
                             {
                            this.state.subscriptionProtocol.length > 0?
                                 <Button color="primary" type="submit" className="add_end">Attach Endpoint/s</Button>:null
                        }
                        </form>

                {
                    this.state.showobj === true?
                    <Form.Group>
                        {JSON.stringify(this.state.logAlarmInput)}
                    </Form.Group>
                 :null
                }

                <Form.Group>
                    <div className = 'subscribe_div'>
                        <Button color="danger" onClick = {this.showObj}>Create & Subscribe to New Alarm</Button>
                    </div>
                </Form.Group>
                       

            </Card>
        )
    }
}

export default AlarmForm;