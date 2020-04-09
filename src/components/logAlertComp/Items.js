import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import AWS from 'aws-sdk';
import { Row, Card, Col, Button, Collapse,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import {Form} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleModal:false,
            topicArns:[],
            subscribingTopicArn:null,
            topicArnToAttachEndpoints:null,
            addProtocol:false,
            listSubscriptions:null,
            subscriptionProtocol : [],
            logAlarmId:null,
        }
        this.handleInfoClick = this.handleInfoClick.bind(this);
        this.openSubscriptionModal = this.openSubscriptionModal.bind(this);
        this.toggleModalAndSubscribe = this.toggleModalAndSubscribe.bind(this);
        this.getTopicARN = this.getTopicARN.bind(this);
        this.openProtocolModal = this.openProtocolModal.bind(this);
        this.listSubscriptions = this.listSubscriptions.bind(this);
        this.addProtocol = this.addProtocol.bind(this);
        this.attachEndpointsToSNSTopic = this.attachEndpointsToSNSTopic.bind(this);
        this.protocolOption = this.protocolOption.bind(this);
        this.protocolValue = this.protocolValue.bind(this);
        this.deleteProtocol = this.deleteProtocol.bind(this);
        this.unsubscribeEndpoints = this.unsubscribeEndpoints.bind(this);
    }
    componentDidMount(){
        this.getSNSTopics();
    }
    handleInfoClick(id){
        let build_strid = "alarm-id-" + id
        let element = document.getElementById(build_strid);
        let react_ele = ReactDOM.findDOMNode(element);
        if(react_ele.classList.contains("show")){
            react_ele.classList.remove("show")
        }else{
            react_ele.classList.add("show")
        }
       
    }
    
    getTopicARN(e){
        this.setState({subscribingTopicArn:e.target.value});
    }
    addProtocol(){
        this.setState({attachedEndpoints:false});
        this.setState({subscriptionProtocol:[...this.state.subscriptionProtocol,{name:'',id:'',value:''}]})
    }
    deleteProtocol(i){
        this.state.subscriptionProtocol.splice(i,1);
        this.setState({subscriptionProtocol:this.state.subscriptionProtocol});
    }
    protocolOption(e,i){
        let arr = this.state.subscriptionProtocol;
        let obj = {name: e.target.value, id : i, value:""};
        arr[i] = obj;
        this.setState({subscriptionProtocol:arr});
    }
    protocolValue(e,i){
        let arr = this.state.subscriptionProtocol;
        arr.map(elem=>{
            if(elem.id === i){
                elem.value = e.target.value;
            }
            return arr;
        })
        this.setState({subscriptionProtocol:arr});
    }
    attachEndpointsToSNSTopic(e){
        e.preventDefault();
        let sns = new AWS.SNS();
        this.state.subscriptionProtocol.forEach(protocols =>{
            var params = {
                Protocol: protocols.name, /* required */
                TopicArn: this.state.topicArnToAttachEndpoints, /* required */
                Endpoint: protocols.value,
                ReturnSubscriptionArn: true
              };
              sns.subscribe(params, function(err, data) {
                if (err){
                    toast.error("Please Enter Proper Value for Endpoints.",{
                        position: toast.POSITION.TOP_LEFT
                    })
                }
                else{
                    this.listSubscriptions(this.state.topicArnToAttachEndpoints);
                    toast.success("Attach endpoints successfully.",{
                        position: toast.POSITION.TOP_LEFT
                    })
                }   
              }.bind(this));
        })
    }
    unsubscribeEndpoints(e,subscribedTopicArn,topicArn){
        //  this.setState({subscription: false});
          e.preventDefault();
          let sns = new AWS.SNS();
          var params = {
              SubscriptionArn: subscribedTopicArn /* required */
            };
            sns.unsubscribe(params, function(err, data) {
              if (err){
                toast.error("You must confirm subscription in order to remove it.");
              }
              else   { 
                  this.listSubscriptions(topicArn);
              }
            }.bind(this));
      }
    openSubscriptionModal(e,id){
        this.setState({toggleModal:!this.state.toggleModal,logAlarmId:id});
    }
    openProtocolModal(e,item){
        this.setState({addProtocol:!this.state.addProtocol});
        if(item !== 1){
            this.state.topicArns.forEach(elem=>{
                if(elem.TopicArn.split(":")[elem.TopicArn.split(":").length-1]===item){
                    this.listSubscriptions(elem.TopicArn);
                    this.setState({topicArnToAttachEndpoints:elem.TopicArn});
                }
            })      
        }else{
            this.setState({listSubscriptions:null,subscriptionProtocol:[], attachedEndpoints:false});
        }
    }

    //retrieves all the endpoints subscribed to the specific topic arn 
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
    toggleModalAndSubscribe(e,i){
        this.setState({toggleModal:!this.state.toggleModal})
        //if i = 1 then we put subscribe the topic to alarms functions inside
        if(this.state.subscribingTopicArn!=null && i === 1){
            this.props.handleSubscribe(this.state.logAlarmId)
        }
        //if i = 0 then it is closing the modal only
        else if(i === 0){
            this.setState({listSubscriptions:null});
        }

    }

    //retrieves all the SNS Topics from aws
    getSNSTopics(){
        let sns = new AWS.SNS();
        var params = {
           // NextToken: 'STRING_VALUE'
          };
          sns.listTopics(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                this.setState({topicArns:data.Topics}); // successful response
            }        
          }.bind(this));
    }
    createSns = (snsArr,element) => {
        let sns = [] 
        snsArr.map((elem,i) => {
            console.log(elem);
            sns.push(
                <Row>
                    <Col xs = '2.5'>
                        <li key={i}>{elem}</li>
                    </Col>
                    <Col>
                        <span className = {element.isSubscribe===true?"myClickableThingy":"addTopic_non"} onClick = {(e)=>this.openProtocolModal(e,elem)}>Add Endpoint</span>
                    </Col>
                </Row>
                
            )
        })
        return sns
    }

    createLogGroupName = (logNamesArr) => {
        let logName = [] 
        logNamesArr.map((e,i) => {
            logName.push(
                <li key={i}>{e}</li>
            )
        })
        return logName
    }

    createAlarms = () => {
        let alarm = []
        this.props.alerts.map((element, i) => {
            console.log(element)
            let key_str = "";
            element.Keywords.forEach(e => {
                key_str += e + ' ';
            });
            let str_key = "."
            if(element.KeywordRelationship != null){
                str_key = `, and if they contain ${element.KeywordRelationship} of the keywords.`
            }
            let desc_srt = `The user will be notify when logs are " ${element.Comparison}  ${element.LogLevel} " ${str_key}`
            let alarm_id = "alarm-id-" + i;
            alarm.push(
                <div key={i}>
                    <Row>
                        <Col xs="1">
                            {element.isSubscribe ?
                            <i className="mdi mdi-checkbox-marked-circle"></i>
                            :
                            <i className="mdi mdi-alarm-check alarm_off"></i>}
                        </Col>
                        <Col xs="3">
                            <Row>{element.AlarmName}</Row>
                            <Row className="pointer" onClick={() => this.handleInfoClick(i)} ><i className="mdi mdi-menu-right"></i> See More Details</Row>
                        </Col>
                        <Col>
                            <Row>Filter Pattern:</Row>
                            <Row>Logs {element.Comparison} {element.LogLevel}</Row>
                        </Col>
                        <Col>
                            <Row>Keywords:</Row>
                            <Row>{key_str}</Row>
                        </Col>
                        <Col xs="2">
                            {element.isSubscribe ? 
                                <Button color="danger" block onClick={() => this.props.handleUnubscribe(element.LogAlarmId)}><i className="far fa-bell-slash"></i> Unsubscribe</Button>
                                :
                                <Button color="primary" block onClick={(e)=>this.openSubscriptionModal(e,element.LogAlarmId)}><i className="far fa-bell"></i> Subscribe</Button>}
                                {/* this.props.handleSubscribe(element.LogAlarmId) */}
                            
                        </Col>
                        <Col xs='1'>
                            <i className="mdi mdi-delete-variant" onClick={() => this.props.handleDelete(i)}></i>
                        </Col>
                    </Row>
                    <Collapse id={alarm_id} isOpen={false}>
                        <Row>
                            <Col>
                                <h3>Alarm Description:</h3>
                                <p>{desc_srt}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3>Log Group Names Attached:</h3>
                                <ul>
                                    {this.createLogGroupName(element.LogGroups)}
                                </ul>
                            </Col>
                            <Col>
                                <h3> 
                                    <span>SNS Attached </span>
                                </h3>
                                <ul>
                                    {this.createSns(element.SNSTopics,element)}
                                </ul>
                            </Col>
                        </Row>
                    </Collapse>

                    
                </div>
            )
        });
        return alarm
    }

    render() {
        return (
            <>
            <Card className="my_alarms">
                {this.createAlarms()}
            </Card>
            <Modal isOpen = {this.state.toggleModal} toggle = {this.toggleModalAndSubscribe} className = 'modalku'>
                <ModalHeader className = 'modalHeader'><span className = 'modalInfor'>Subscription Detail</span></ModalHeader>
                <ModalBody>
                        <Form.Group>
                            <Form.Label>Topic Name</Form.Label>
                            <Form.Control as="select"  
                                onChange={(e) => this.getTopicARN(e)}>
                                <option disabled selected>Make Selection</option>
                                {this.state.topicArns.map(item=>{
                                    return(
                                        <option value = {item.TopicArn}>{item.TopicArn.split(':')[item.TopicArn.split(':').length-1]}</option>
                                    )
                                })}                              
                             </Form.Control>
                            </Form.Group>

                </ModalBody>
                <ModalFooter>
                    <Button className = 'subscribe' onClick = {(e) => this.toggleModalAndSubscribe(e,1,null)}>Subscribe</Button>
                    <Button style ={{height : 40}} color="secondary" onClick = {(e) => this.toggleModalAndSubscribe(e,0,null)}> Cancel </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen = {this.state.addProtocol} toggle = {(e)=>this.openProtocolModal(e,1)} className = 'modalku'>
                <ModalHeader className = 'modalHeader'><span className = 'modalInfor'>Add Endpoints</span></ModalHeader>
                <ModalBody>
                {
                            this.state.listSubscriptions != null&& this.state.listSubscriptions.length > 0?  
                              <div className = 'scrollingss'>
                                    <Form.Label>Subscribed Endpoints of the topic: {this.state.topicArnToAttachEndpoints.split(':')[this.state.topicArnToAttachEndpoints.split(':').length-1]}</Form.Label>
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
                                                        <td><Button className = 'button_a' onClick = {(e) => this.unsubscribeEndpoints(e,item.SubscriptionArn,item.TopicArn)}>Remove</Button></td>
                                                    </tr>
                                                )
                                                     })
                                                 }
                           </tbody>
                            </Table> 
                            </div> 
                            :null}
                    <Button className = 'button_a' style = {{float:'right'}} onClick = {this.addProtocol}>Add Subscription Endpoint</Button>
                    <br></br><br></br>
                        <form onSubmit = {(e)=>this.attachEndpointsToSNSTopic(e)}>
                        {
                            this.state.subscriptionProtocol.map(({name, value},index)=>{
                              return(
                                <>
                                <hr style = {{borderColor:'#d1d1d1'}}/>
                                        <Row>  
                                       
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
                                <input type="submit" value="Add Endpoint/s" className = 'submitButton1'/>:null
                        }
                            
                          </form>
                </ModalBody>
                <ModalFooter>
                     <Button style ={{height : 40}} color="secondary" onClick = {(e)=>this.openProtocolModal(e,1)}> Close </Button>
                </ModalFooter>
            </Modal>
            <ToastContainer autoClose={2000}/>
            </>
        )
    }
}

export default Items;