import React, { Component } from 'react';
import AWS from 'aws-sdk';
import { Row, Card, Col,CardDeck } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MetricAlarmDisplay from '../components/metricAlarmComp/MetricAlarmDisplay';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ExistingMetricAlarms from '../components/metricAlarmComp/ExistingMetricAlarms';
import MyMetricAlarms from '../components/metricAlarmComp/MyMetricAlarms';
import mykey from '../keys.json';
import { getLoggedInUser } from '../helpers/authUtils';

const axios = require('axios').default;




class MetricAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
           user: getLoggedInUser(),
           alerts:[],
           subscribedAlerts:[],
          }
        this.returnMetricAlarms = this.returnMetricAlarms.bind(this);
        this.updateState = this.updateState.bind(this);
       
    }
    componentDidMount(){
        this.returnMetricAlarms();
        if(this.state.user.token !== null){
          axios({
              method: 'get',
              url: `${mykey.backend}/getMetricAlarms`,
              headers: {
                  'Authorization': this.state.user.token,
                  'Content-Type': 'application/json'
              }
          })
          .then((response)=>{
             console.log(response);
          })
          .catch((err)=>{
              console.log(err)
          })
      }
    }
    updateState(newState){
      let subscribedArr = [];
      let stateAlerts = this.state.alerts;
      stateAlerts.map(alert=>{
         if(alert.AlarmArn === newState.AlarmArn){
           alert = newState;
         }
         return stateAlerts;
      })
      this.setState({alerts:stateAlerts});
      console.log(stateAlerts);
      this.state.alerts.forEach(elem=>{
        if(elem.AlarmActions.length > 0){
          subscribedArr.push(elem);
        }
     })
     this.setState({subscribedAlerts:subscribedArr});

  }
    returnMetricAlarms(){
        let alertsArr = this.state.alerts;
        let subscribedArr = [];
        let params = {
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
                   alert['Dimensions'] = data.MetricAlarms[i].Dimensions;
                   alert['EvaluationPeriods'] = data.MetricAlarms[i].EvaluationPeriods;
                   alert['AlarmActions'] = data.MetricAlarms[i].AlarmActions;
                   alertsArr.push(alert);
                }
                this.setState({alerts: alertsArr}); 
                this.state.alerts.forEach(elem=>{
                   if(elem.AlarmActions.length > 0){
                     subscribedArr.push(elem);
                   }
                })
                this.setState({subscribedAlerts:subscribedArr});

            }
          }.bind(this))
    }

    render() {
    
        return (
            
         <div>
            <div className="log_alerts">
               <Tabs >
                  <TabList>
                  <Tab >My Alarms</Tab>
                  <Tab>Existing Alarms</Tab>
                  </TabList>
                
                  <TabPanel>
                    <div>
                        <MyMetricAlarms updateState = {this.updateState} alarms = {this.state.subscribedAlerts}/>
                    </div>
                  </TabPanel>
                  <TabPanel>
                      <div>
                        <ExistingMetricAlarms updateState = {this.updateState} alarms = {this.state.alerts}/>
                      </div>
                      {/* <Card className = 'my_alarms'>
                        {item}
                    </Card> */}                     
                  </TabPanel>  
              </Tabs>

            </div>
        </div>
              
          
        )
    }
}

export default MetricAlert;