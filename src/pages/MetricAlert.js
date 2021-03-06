import React, { Component } from 'react';
import AWS from 'aws-sdk';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ExistingMetricAlarms from '../components/metricAlarmComp/ExistingMetricAlarms';
import MyMetricAlarms from '../components/metricAlarmComp/MyMetricAlarms';
import mykey from '../keys.json';
import { getLoggedInUser } from '../helpers/authUtils';
import Loading from '../components/logAlertComp/Loading'
const axios = require('axios').default;




class MetricAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
           user: getLoggedInUser(),
           alerts:[],
           usersAlerts:[],
           allAlerts:[],
           subscribedAlerts:[],
           isLoading: true,
           isComplete: true,
           isSuccessful: true
          }
        this.returnMetricAlarms = this.returnMetricAlarms.bind(this);
        this.updateState = this.updateState.bind(this);
        this.close = this.close.bind(this);
       
    }
    
    componentDidMount(){
        //called deleteMetricAlarm endpoint in returnMetricAlarms function.
        this.returnMetricAlarms();
        
    }
    getAlerts(){
      let subscribedArr = [];
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
           this.setState({usersAlerts:response.data.Data.user, allAlerts: response.data.Data.all});
           this.state.alerts.forEach(alert =>{
            response.data.Data.user.forEach(userAlert=>{
               if(alert.AlarmArn === userAlert.alarmArn){
                 alert['isSubscribed'] = true;
                 subscribedArr.push(alert);
               }
             })
           })
           this.setState({subscribedAlerts:subscribedArr});
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    }
    deleteAlerts(){
     //checks for the deleted aws metric alarm in all array
     let awsAlertsArr = [];
     this.state.alerts.forEach(alert =>{
        awsAlertsArr.push(alert.AlarmArn);
     })
     this.state.allAlerts.forEach(allAlert=>{
       if(!awsAlertsArr.includes(allAlert.alarmArn)){
        axios({
            method: 'post',
            url: `${mykey.backend}/deleteMetricAlarms`,
            headers: {
                'Authorization': this.state.user.token,
                'Content-Type': 'application/json'
            },
            data:{
                'ids': allAlert.metricAlarmId,
            }
        }).then((response) =>{
            console.log(response);
        })
       }
     })
    }
    close(){
      this.setState({isComplete:true});
    }
    updateState(isLoading, isSuccessful){
      this.setState({isComplete : false});
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
          let subscribedArr = [];
          let userArnArr = [];
          let stateAlert = this.state.alerts;
           this.setState({usersAlerts:response.data.Data.user, allAlerts: response.data.Data.all});
           response.data.Data.user.forEach(userAlert=>{
              userArnArr.push(userAlert.alarmArn);
           })
           stateAlert.forEach(elem =>{
            if(!userArnArr.includes(elem.AlarmArn)){
               elem['isSubscribed'] = false;
            }
            response.data.Data.user.forEach(userAlert=>{
              if(elem.AlarmArn === userAlert.alarmArn){
                elem['isSubscribed'] = true;
                subscribedArr.push(elem);
              }
              
            })
           
          })
          this.setState({alerts:stateAlert,subscribedAlerts:subscribedArr, isLoading:isLoading, isSuccessful: isSuccessful});
        })
        .catch((err)=>{
            console.log(err)
        })
    }
  }
    returnMetricAlarms(){
        let alertsArr = this.state.alerts;
        let params = {
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
                this.getAlerts();
                this.deleteAlerts();
                
          
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
                  </TabPanel>  
              </Tabs>
            </div>
            <Loading isLoading={this.state.isLoading} isComplete={this.state.isComplete} isSuccessful={this.state.isSuccessful} close={this.close} />

        </div>
              
          
        )
    }
}

export default MetricAlert;