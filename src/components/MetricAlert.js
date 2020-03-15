import React, { Component } from 'react';
import AWS from 'aws-sdk';
import { Row, Card, CardBody,CardHeader, Modal,Button, Col,Popover,PopoverBody, PopoverHeader } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {Checkmark} from 'react-checkmark';


class MetricAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
           alerts:[],
           showAlertDetails:false,
           isOpen:false,
           subscription: false,
          }
        this.returnMetricAlarms = this.returnMetricAlarms.bind(this);
        this.showAlertDetails = this.showAlertDetails.bind(this);
        this.toggle = this.toggle.bind(this);
        this.subscribe = this.subscribe.bind(this);
       
    }
    componentDidMount(){
        this.returnMetricAlarms();
    }
    subscribe(){
        this.setState({subscription: !this.state.subscription});
    }
    showAlertDetails(){
        this.setState({showAlertDetails:!this.state.showAlertDetails});
    }
    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }
    returnMetricAlarms(){
        let alertsArr = this.state.alerts;
        var params = {
            // ActionPrefix: 'STRING_VALUE',
            // AlarmNamePrefix: 'STRING_VALUE',
            // AlarmNames: [
            //   'STRING_VALUE',
            //   /* more items */
            // ],
            // MaxRecords: 'NUMBER_VALUE',
            // NextToken: 'STRING_VALUE',
            // // StateValue: OK | ALARM | INSUFFICIENT_DATA
          };
          let cloudwatch = new AWS.CloudWatch();
          cloudwatch.describeAlarms(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else{
                
                for(let i = 0; i< data.MetricAlarms.length;i++){
                   const alert = {};
                   alert['AlarmName'] = data.MetricAlarms[i].AlarmName;
                   alert['MetricName'] = data.MetricAlarms[i].MetricName;
                   alert['ComparisonOperator'] = data.MetricAlarms[i].ComparisonOperator;
                   alert['AlarmArn'] =  data.MetricAlarms[i].AlarmArn;
                   alert['AlarmDescription'] = data.MetricAlarms[i].AlarmDescription;
                   alert['AlarmConfigurationUpdatedTimestamp'] = data.MetricAlarms[i].AlarmConfigurationUpdatedTimestamp;
                   alert['AlarmActions'] = data.MetricAlarms[i].AlarmActions;
                   alert['Namespace'] = data.MetricAlarms[i].Namespace;
                   alert['Period'] = data.MetricAlarms[i].Period;
                   alert['Statistic'] = data.MetricAlarms[i].Statistic;
                   alert['TreatMissingData'] = data.MetricAlarms[i].TreatMissingData;
                   alert['StateValue'] = data.MetricAlarms[i].StateValue;
                   alert['Threshold'] = data.MetricAlarms[i].Threshold;
                   alert['DatapointsToAlarm'] = data.MetricAlarms[i].DatapointsToAlarm;
                   alertsArr.push(alert);
                }
                this.setState({alerts: alertsArr});   
                console.log(alertsArr);      
            }
          }.bind(this))
    }

    render() {
        console.log(this.state.alerts);
        const item = this.state.alerts.map((item,i) =>{
            let color;
            let sign, signIndicator;
            if(item.StateValue === 'OK')
                color = 'green';
            else if(item.StateValue === 'ALARM')
                color = 'red';
            if(item.ComparisonOperator.includes('Greater')){
                sign = '>';
                signIndicator = 'Greater';
            }
            else if(item.ComparisonOperator.includes('Greater')){

            }
            return(

                <Card style={{ width: window.innerWidth/4}}>
                    <Row>
                        <Col>
                            <div style = {{marginTop:10,marginBottom:0,marginLeft:15}}>
                                <Row>
                                    <Col>
                                        <h4 > {item.AlarmName}  </h4> 
                                    </Col>
                                    <Col style = {{marginTop:9}}>
                                        {this.state.subscription=== true? <Checkmark size = 'medium' />:null}
                                    </Col>
                                </Row>
                            </div>
                            <p style ={{marginTop:0,marginBottom:0,marginLeft:15}}><span style ={{backgroundColor:color, color: 'white',fontSize : window.innerWidth/100}}>Status: {item.StateValue}</span></p>
                            <p style ={{marginTop:0,marginBottom:0,marginLeft:15}}><span style = {{fontSize : window.innerWidth/100}}>{item.Namespace}</span></p>
                            <p style ={{marginTop:0,marginBottom:0,marginLeft:15}}><span style = {{fontSize : window.innerWidth/100}}>{item.MetricName}</span></p>
                            <a className="waves-effect side-nav-link-ref" onClick={this.toggle} id = 'pop'>
                            <p style ={{marginTop:0,marginBottom:0,marginLeft:15}}><span style = {{fontSize : window.innerWidth/100}}>More Infor {this.state.isOpen === false? <i class = 'mdi mdi-menu-left'/>:<i class="mdi mdi-menu-right"></i>}</span></p>
                            </a> 
                        </Col>
                        <Col>
                            <p style ={{marginTop:20, marginLeft:70}}>
                                 <h1 style = {{marginLeft: 10, marginBottom : 0,fontSize:window.innerWidth/20}}><span>{sign}</span></h1>
                                 <p><span style = {{fontSize : window.innerWidth/100}}>{signIndicator}</span></p>
                            </p>
                        </Col>
                    </Row>  
                    <CardBody style={{overflow:'hidden'}}>
                    <p style ={{marginTop:0,marginBottom:0}}><span><h5>{item.MetricName} {sign} {item.Threshold} for {item.DatapointsToAlarm} datapoint</h5></span></p>
                    <p style = {{marginTop:0}}><span style = {{textAlign :'center'}}> Description: {item.AlarmDescription}</span></p>
                   <div style = {{textAlign: 'center',marginBottom:0}}>
                       {this.state.subscription === false?
                       <Button style ={{backgroundColor:'blue',color:'white',borderRadius: '12px',width:window.innerWidth/8,maxWidth:'100%'}} onClick = {this.subscribe}>Subscribe</Button>
                       :
                       <Button style ={{backgroundColor:'grey',color:'white',borderRadius: '12px',width:window.innerWidth/8,maxWidth:'100%'}} onClick = {this.subscribe}>Unsubscribe</Button>
                    }
                       
                    </div>
                    {this.state.isOpen === true?   
                  <Popover placement="right" target="pop" isOpen = {this.state.isOpen} toggle = {this.toggle} >
                 
                    <PopoverHeader style = {{textAlign: 'center'}}>    
                                    <h5>Alarm Information</h5>
                    </PopoverHeader>
                 <PopoverBody>  
                                <h6>ComparisonOperator: {item.ComparisonOperator}</h6> 
                                <h6>AlarmArn:{item.AlarmArn}</h6>
                                <h6>AlarmDescription: {item.AlarmDescription}</h6> 
                                <h6>AlarmActions: {item.AlarmActions}</h6>
                                <h6>Namespace: {item.Namespace}</h6> 
                                <h6>Period:{item.Period}</h6>
                                <h6>Statistic: {item.Statistic}</h6>
                                <h6>TreatMissingData:{item.TreatMissingData}</h6>      
                 
                 </PopoverBody>

                    
  
                  </Popover>
                    
                     
                      :null}
                     </CardBody>
                   
                   
                   
                    {/* <Row>
                        <Col>
                            <Button style ={{backgroundColor:'blue',color:'white'}}>Subscribe</Button>
                        </Col>
                        <Col>
                             <Button style = {{backgroundColor:'red',color:'white'}}>Unsubscribe</Button>
                        </Col>
                    </Row> */}
                   
                   
                </Card>
            )
        }

        )
        return (
            <div>
               {item}
            </div>
        )
    }
}

export default MetricAlert;