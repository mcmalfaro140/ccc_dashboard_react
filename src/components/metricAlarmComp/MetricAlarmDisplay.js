import React, { Component } from 'react';
import AWS from 'aws-sdk';
import { Row,Button, Col,Modal,ModalHeader,ModalBody,ModalFooter } from 'reactstrap';
import {Form} from 'react-bootstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {Checkmark} from 'react-checkmark';
import Table from 'react-bootstrap/Table';



class MetricAlarmDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
           alert:{
            AlarmName:null,
            MetricName:null,
            ComparisonOperator:null,
            AlarmArn:null,
            AlarmDescription:null,
            AlarmConfigurationUpdatedTimestamp:null,
            AlarmActions:null,
            Namespace:null,
            Period:null,
            Statistic:null,
            TreatMissingData:null,
            StateValue:null,
            Threshold:null,
            DatapointsToAlarm:null,
            EvaluationPeriods:null,
            Dimensions: null,
           },
           id:null,
           showAlertDetails:false,
           isOpen:false,
           subscription: false,
           color:null,
           sign:null,
           topicArns:[],
           subscribedTopicArn:null,
           topicName:'',
           toggleModalAndSubscribe:false,
           subscriptionProtocol : [],
           addProtocol:false,
           listSubscriptions:null,
           attachedEndpoints:false,
           showSubscribedTopicsOfAlarms:false,
          }
        this.showAlertDetails = this.showAlertDetails.bind(this);
        this.toggle = this.toggle.bind(this);
        this.openSubscriptionDetails = this.openSubscriptionDetails.bind(this);
        this.getTopicARN = this.getTopicARN.bind(this);
        this.toggleModalAndSubscribe = this.toggleModalAndSubscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.addProtocol = this.addProtocol.bind(this);
        this.deleteProtocol = this.deleteProtocol.bind(this);
        this.protocolOption = this.protocolOption.bind(this);
        this.attachEndpointsToSNSTopic = this.attachEndpointsToSNSTopic.bind(this);
        this.listSubscriptions = this.listSubscriptions.bind(this);
        this.showSubscribedTopicsOfAlarms = this.showSubscribedTopicsOfAlarms.bind(this);
        this.unsubscribeTopics = this.unsubscribeTopics.bind(this);
    }
    componentWillMount(){
        this.getSNSTopics();
        if(this.props.StateValue === 'OK')
           this.setState({color:'green'});
        else if(this.props.StateValue === 'ALARM')
           this.setState({color:'red'});
        if(this.props.ComparisonOperator === 'GreaterThanThreshold'){
            this.setState({sign:'>'});
        }
        else if(this.props.ComparisonOperator === 'GreaterThanOrEqualToThreshold'){
            this.setState({sign:'≥'});
        } 
        else if(this.props.ComparisonOperator === 'LessThanThreshold'){
            this.setState({sign:'<'});
        } 
        else if(this.props.ComparisonOperator === 'LessThanOrEqualToThreshold'){
            this.setState({sign:'≤'});
        } 
        this.setState(prevState => {
            let alert = Object.assign({}, prevState.alert);  
            alert.AlarmName = this.props.AlarmName;
            alert.MetricName = this.props.MetricName;
            alert.ComparisonOperator = this.props.ComparisonOperator;
            alert.AlarmArn = this.props.AlarmArn;
            alert.AlarmDescription = this.props.AlarmDescription;
            alert.AlarmActions = this.props.AlarmActions;
            alert.AlarmConfigurationUpdatedTimestamp = this.props.AlarmConfigurationUpdatedTimestamp;
            alert.Namespace = this.props.Namespace;
            alert.Period = this.props.Period;
            alert.Statistic = this.props.Statistic;
            alert.TreatMissingData = this.props.TreatMissingData;
            alert.StateValue = this.props.StateValue;
            alert.Threshold = this.props.Threshold;
            alert.DatapointsToAlarm = this.props.DatapointsToAlarm;
            alert.EvaluationPeriods = this.props.EvaluationPeriods;
            alert.Dimensions = this.props.Dimensions;
            return { alert };                                
          })
          this.setState({id : 'Pop' + this.props.id});
    }
    componentWillReceiveProps(nextProps){
        this.setState(prevState => {
            let alert = Object.assign({}, prevState.alert);  
            alert.AlarmName = nextProps.AlarmName;
            alert.MetricName = nextProps.MetricName;
            alert.ComparisonOperator = nextProps.ComparisonOperator;
            alert.AlarmArn = nextProps.AlarmArn;
            alert.AlarmDescription = nextProps.AlarmDescription;
            alert.AlarmActions = nextProps.AlarmActions;
            alert.AlarmConfigurationUpdatedTimestamp = nextProps.AlarmConfigurationUpdatedTimestamp;
            alert.Namespace = nextProps.Namespace;
            alert.Period = nextProps.Period;
            alert.Statistic = nextProps.Statistic;
            alert.TreatMissingData = nextProps.TreatMissingData;
            alert.StateValue = nextProps.StateValue;
            alert.Threshold = nextProps.Threshold;
            alert.DatapointsToAlarm = nextProps.DatapointsToAlarm;
            return { alert };                                
          })
    }
    addProtocol(){
        this.setState({addProtocol:true, attachedEndpoints:false});
        this.setState({subscriptionProtocol:[...this.state.subscriptionProtocol,{name:'',id:'',value:''}]})
    }
    deleteProtocol(index){
       this.state.subscriptionProtocol.splice(index,1);
       this.setState({subscriptionProtocol:this.state.subscriptionProtocol});
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
    getTopicARN(e){
        this.setState({subscribedTopicArn:e.target.value});
        this.listSubscriptions(e.target.value);
    }
    toggleModalAndSubscribe(e,i){
        this.setState({toggleModalAndSubscribe:!this.state.toggleModalAndSubscribe})
        this.setState({addProtocol:false});
        if(this.state.subscribedTopicArn!=null && i === 1){
            let cloudwatch = new AWS.CloudWatch();
            let actionsArray = this.state.alert.AlarmActions;
            actionsArray.push(this.state.subscribedTopicArn);
            this.setState(prevState => {
                let alert = Object.assign({}, prevState.alert);  
                alert.AlarmActions = actionsArray;
                return { alert };                                
              })
            var params = {
                AlarmName: this.state.alert.AlarmName, /* required */
                ComparisonOperator: this.state.alert.ComparisonOperator,
                EvaluationPeriods: this.state.alert.EvaluationPeriods, /* required */
                AlarmActions: actionsArray,
                AlarmDescription: this.state.alert.AlarmDescription,
                DatapointsToAlarm: this.state.alert.DatapointsToAlarm,
                Dimensions: this.state.alert.Dimensions,
                MetricName: this.state.alert.MetricName,
                Namespace: this.state.alert.Namespace,
                Period: this.state.alert.Period,
                Statistic: this.state.alert.Statistic,
                Threshold: this.state.alert.Threshold,
                TreatMissingData: this.state.alert.TreatMissingData,
              };
              cloudwatch.putMetricAlarm(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else {
                    this.setState({subscription:true});
                }    
              }.bind(this));

        }
        else if(i === 0){
            this.setState({listSubscriptions:null,
                            subscriptionProtocol:[],
                            subscribedTopicArn: null,
                            subscription:false,
                            attachedEndpoints:false
                        })
        }
    
    }
    openSubscriptionDetails(){
        this.setState({toggleModalAndSubscribe:true});
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
                    this.setState({attachedEndpoints:true});
                }   
              }.bind(this));
        })
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
    showAlertDetails(){
        this.setState({showAlertDetails:!this.state.showAlertDetails});
    }
    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }
    listSubscriptions(arn){
        let sns = new AWS.SNS();
        var params = {
            TopicArn: arn, /* required */
          };
          sns.listSubscriptionsByTopic(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                this.setState({listSubscriptions:data.Subscriptions});
            }   
          }.bind(this));
    }
    showSubscribedTopicsOfAlarms(){
        this.setState({showSubscribedTopicsOfAlarms: !this.state.showSubscribedTopicsOfAlarms});
    }
    unsubscribeTopics(i){
        let actionArr = this.state.alert.AlarmActions;
        actionArr.splice(i,1);
        this.setState(prevState => {
            let alert = Object.assign({}, prevState.alert);  
            alert.AlarmActions = actionArr;
            return { alert };                                
          })
          var params = {
            AlarmName: this.state.alert.AlarmName, /* required */
            ComparisonOperator: this.state.alert.ComparisonOperator,
            EvaluationPeriods: this.state.alert.EvaluationPeriods, /* required */
            AlarmActions: actionArr,
            AlarmDescription: this.state.alert.AlarmDescription,
            DatapointsToAlarm: this.state.alert.DatapointsToAlarm,
            Dimensions: this.state.alert.Dimensions,
            MetricName: this.state.alert.MetricName,
            Namespace: this.state.alert.Namespace,
            Period: this.state.alert.Period,
            Statistic: this.state.alert.Statistic,
            Threshold: this.state.alert.Threshold,
            TreatMissingData: this.state.alert.TreatMissingData,
          };
          let cloudwatch = new AWS.CloudWatch();
          cloudwatch.putMetricAlarm(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else {
                this.setState({subscription:false});
            }    
          }.bind(this));

    }
    render() { 
        let dropdown = [];
        console.log(this.state.alert.AlarmActions);
        console.log( this.state.topicArns)
        this.state.topicArns.map(item =>{
            if(this.state.alert.AlarmActions.includes(item.TopicArn)){
                dropdown.push(<option disabled value = {item.TopicArn}>{item.TopicArn.split(':')[item.TopicArn.split(':').length-1]}</option>)
            }else{
                dropdown.push(<option value = {item.TopicArn}>{item.TopicArn.split(':')[item.TopicArn.split(':').length-1]}</option>)
            }       
     })  
        return (
          <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <Row>
                <Col xs = "1">
                    {this.state.subscription === true?
                        <Checkmark size = 'large' />
                         :
                         <i className="mdi mdi-alarm-check alarm_off" style = {{fontSize:'400%'}}></i>}
                </Col>
                <Col xs = "3">
                    <Row><h2>{this.state.alert.AlarmName}</h2></Row>
                    <Row><span style ={{backgroundColor:this.state.color, color: 'white',fontSize : window.innerWidth/100,paddingLeft:5, paddingRight:5}}>Status: {this.state.alert.StateValue}</span></Row>
                    <Row><p className = 'margin'><span className = 'fontSize'>{this.state.alert.Namespace}</span></p></Row>
                    <Row><p className = 'margin'><span className = 'fontSize'>{this.state.alert.MetricName}</span></p></Row>
                        {/* <Row><p className = 'margin'>
                            <a className= "waves-effect side-nav-link-ref" onClick={this.showSubscribedTopicsOfAlarms} >
                            <p className = 'margin'><span className = 'fontSize'>Subscribed Topics {this.state.showSubscribedTopicsOfAlarms === false? <i class = 'mdi mdi-menu-left'/>:<i class="mdi mdi-menu-right"></i>}</span></p>
                            </a>
                            </p>
                        </Row>     */}
                    <Row> <a className= "waves-effect side-nav-link-ref" onClick={this.toggle} >
                            <p className = 'margin'><span className = 'fontSize' id = {this.state.id}>More Infor {this.state.isOpen === false? <i class = 'mdi mdi-menu-left'/>:<i class="mdi mdi-menu-right"></i>}</span></p>
                            </a></Row>    
                    </Col>
             <Col xs = "3">
                <Row>
                   <h3>Pattern:</h3>
                </Row>
                <Row>
                    <h4><span>{this.state.alert.MetricName} {this.state.sign} {this.state.alert.Threshold} for {this.state.alert.DatapointsToAlarm} datapoint</span></h4>
                </Row>
             </Col> 
             <Col>
                <Row><h3>Description: </h3></Row>
                <Row>{this.state.alert.AlarmDescription}</Row>
             </Col> 
             <Col>
             <div>
                    <div className = 'div_margin' >
                        <Button color = "danger" onClick = {this.showSubscribedTopicsOfAlarms} block><i class="far fa-bell-slash"></i>Unsubscribe</Button>
                    </div>
                    <div>
                        <Button color = "primary"onClick = {this.openSubscriptionDetails} block><i class="far fa-bell"></i>Subscribe</Button>
                    </div>
                </div>  
         
             </Col>
         

            </Row>
              <Modal isOpen = {this.state.isOpen} toggle = {this.toggle}>
                <ModalHeader className = 'modalHeader'><span className = 'modalInfor'>Alarm Information</span></ModalHeader>
                    <ModalBody>
                            <Table striped bordered hover size="sm">
                                    <tr>
                                        <th>Alarm Name</th>
                                        <td>{this.state.alert.AlarmName}</td>
                                    </tr>
                                    <tr>
                                        <th>ComparisonOperator</th>
                                        <td>{this.state.alert.ComparisonOperator}</td>
                                    </tr>
                                    <tr>
                                        <th>AlarmArn</th>
                                        <td>{this.state.alert.AlarmArn}</td>
                                    </tr>
                                    <tr>
                                        <th>AlarmDescription</th>
                                        <td>{this.state.alert.AlarmDescription}</td>
                                    </tr>
                                    <tr>
                                        <th>AlarmActions</th>
                                        <td>{this.state.alert.AlarmActions.map(item =>{
                                                return(
                                                    <div>
                                                        {item} 
                                                        <hr/>
                                                    </div>
                                                )
                                        })}</td>
                                    </tr>
                                    <tr>
                                        <th>Namespace</th>
                                        <td>{this.state.alert.Namespace}</td>
                                    </tr>
                                    <tr>
                                        <th>Period</th>
                                        <td>{this.state.alert.Period}</td>
                                    </tr>
                                    <tr>
                                        <th>Statistic</th>
                                        <td>{this.state.alert.Statistic}</td>
                                    </tr>
                                    <tr>
                                        <th>TreatMissingData</th>
                                        <td>{this.state.alert.TreatMissingData}</td>
                                    </tr>
                            </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button className = 'button_size' color="secondary" onClick = {this.toggle}> Close </Button>
                    </ModalFooter>
              </Modal>
              <Modal isOpen = {this.state.toggleModalAndSubscribe} toggle = {this.toggleModalAndSubscribe} className = 'modalku'>
                  <ModalHeader className = 'modalHeader'><span className = 'modalInfor'>Subscription Detail</span></ModalHeader>
                  <ModalBody>
                        <Form>
                            <Form.Group>
                                <Form.Label>Already Subscribed Topics: </Form.Label>
                                    {
                                        this.state.alert.AlarmActions.map((item,i) =>{
                                            return (<div>{i+1}.{item.split(':')[item.split(':').length-1]}</div>)
                                        })
                                    }
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Topic Name</Form.Label>
                                <Form.Control as="select"  
                                    onChange={(e) => this.getTopicARN(e)}>
                                    <option disabled selected>Make Selection</option>
                                    {dropdown}                              
                             </Form.Control>
                            </Form.Group>
                            <fieldset disabled = {this.state.subscribedTopicArn == null}>
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
                                                        <td><Button className = 'button_a' onClick = {(e) => this.unsubscribe(e,item.SubscriptionArn,item.TopicArn)}>Remove</Button></td>
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
                                                    <select className = 'selection' value = {name} onChange={(e) => this.protocolOption(e,index)}>
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
                        {
                            this.state.attachedEndpoints === true?
                                <div><span className = 'addEndpoint'>Add Endpoints successfully</span></div>: null
                        }
                            
                          </form>
                          </fieldset>
                          </Form>
                  </ModalBody>
                  <ModalFooter>
                      <Button className = 'subscribe' onClick = {(e) => this.toggleModalAndSubscribe(e,1)}>Subscribe</Button>
                      <Button style ={{height : 40}} color="secondary" onClick = {(e) => this.toggleModalAndSubscribe(e,0)}> Cancel </Button>
                  </ModalFooter>
              </Modal> 
              <Modal isOpen = {this.state.showSubscribedTopicsOfAlarms} toggle = {this.showSubscribedTopicsOfAlarms}>
                    <ModalHeader className = 'modalHeader'><span className = 'modalInfor'>Subscribed Topic/s of {this.state.alert.AlarmName}</span></ModalHeader>
                    <ModalBody>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Subscribed Topics</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.alert.AlarmActions.map((item,i) =>{
                                        return(
                                            <tr>
                                                <td>{item.split(':')[item.split(':').length-1]}</td>
                                                <td><Button className = 'button_a' onClick = {() => this.unsubscribeTopics(i)}>Unsubscribe</Button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                  </ModalBody>
                  <ModalFooter>
                      <Button style ={{height : 40}} color="secondary" onClick = {this.showSubscribedTopicsOfAlarms}> Close </Button>
                  </ModalFooter>
              </Modal>
             
           </div>
   
        )
    }
}

export default MetricAlarmDisplay;