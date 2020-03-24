import React, { Component } from 'react';
import AWS from 'aws-sdk';
import { Row, Card, Col,CardDeck } from 'reactstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MetricAlarmDisplay from '../components/metricAlarmComp/MetricAlarmDisplay';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';




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
            }
          }.bind(this))
    }

    render() {

        const item = this.state.alerts.map((item,i) =>{
            return(

                      <MetricAlarmDisplay {...item} id = {i}></MetricAlarmDisplay>

            )
        }
    )
        return (
            
         <div>
            <div className="log_alerts">
               <Tabs >
                  <TabList>
                  <Tab >My Metric Alarms</Tab>
                  
                  </TabList>
              
                  <TabPanel>
                      <div>
                      <Card className = 'my_alarms'>
                        {item}
                    </Card>
                      </div>
                  </TabPanel>  
              </Tabs>

            </div>
        </div>
              
             
                      
                          
                     
                     
         
     

       
          
        )
    }
}

export default MetricAlert;