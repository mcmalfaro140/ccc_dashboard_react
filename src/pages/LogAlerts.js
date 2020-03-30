import React, { Component } from 'react';
import MyAlarms from '../components/logAlertComp/MyAlarms'
import ExistingAlarms from '../components/logAlertComp/ExistingAlarms'
import AlarmForm from '../components/logAlertComp/AlarmForm'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class LogAlerts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myAlarms_Set: [],
            dummy_alerts : [
                {
                    name: "My Alarm Name",
                    filter: "Logs > WARN",
                    isSubscribe: true,
                    sns_topic: [
                        "SNS Topic 1",
                        "SNS Topic 2",
                        "SNS Topic 3",
                        "SNS Topic 4",
                    ],
                    log_groups: [
                        "LogGroupName 1",
                        "LogGroupName 2",
                        "LogGroupName 3",
                        "LogGroupName 4",
                        "LogGroupName 5",
                        "LogGroupName 6",
                        "LogGroupName 7",
                    ]
                },
                {
                    name: "My Alarm Name 2",
                    filter: "Logs > WARN",
                    isSubscribe: false,
                    sns_topic: [
                        "SNS Topic 1",
                        "SNS Topic 2",
                        "SNS Topic 3",
                        "SNS Topic 4",
                    ],
                    log_groups: [
                        "LogGroupName 1",
                        "LogGroupName 2",
                        "LogGroupName 3",
                        "LogGroupName 4",
                        "LogGroupName 5",
                        "LogGroupName 6",
                        "LogGroupName 7",
                    ]
                },
                {
                    name: "My Alarm Name 3",
                    filter: "Logs > WARN",
                    isSubscribe: true,
                    sns_topic: [
                        "SNS Topic 1",
                        "SNS Topic 2",
                        "SNS Topic 3",
                        "SNS Topic 4",
                    ],
                    log_groups: [
                        "LogGroupName 1",
                        "LogGroupName 2",
                        "LogGroupName 3",
                        "LogGroupName 4",
                        "LogGroupName 5",
                        "LogGroupName 6",
                        "LogGroupName 7",
                    ]
                },
                {
                    name: "My Alarm Name 4",
                    filter: "Logs > WARN",
                    isSubscribe: false,
                    sns_topic: [
                        "SNS Topic 1",
                        "SNS Topic 2",
                        "SNS Topic 3",
                        "SNS Topic 4",
                    ],
                    log_groups: [
                        "LogGroupName 1",
                        "LogGroupName 2",
                        "LogGroupName 3",
                        "LogGroupName 4",
                        "LogGroupName 5",
                        "LogGroupName 6",
                        "LogGroupName 7",
                    ]
                }
            ]
        }
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount(){
        let temp = this.state.dummy_alerts
        let temp2 = []
        temp.forEach(element => {
            if(element.isSubscribe){
                temp2.push(element)
            }
        });
        this.setState({myAlarms_Set:temp2})
    }

    updateState(newState){
        this.setState({dummy_alerts: newState})
    }
    render() {
        return (
          <div >
              <div className="log_alerts">
                 <Tabs >
                    <TabList>
                    <Tab >My Alarms</Tab>
                    <Tab >Existing Alarms</Tab>
                    <Tab> Create New Alarm</Tab>
                    </TabList>
                
                    <TabPanel>
                        <div>
                            <MyAlarms alarms={this.state.myAlarms_Set}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <ExistingAlarms alarms={this.state.dummy_alerts}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <AlarmForm/>
                        </div>    
                    </TabPanel>
                </Tabs>

              </div>
          </div>
        )
    }
}

export default LogAlerts;