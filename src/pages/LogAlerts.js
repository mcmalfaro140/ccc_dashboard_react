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
            isMyAlarms : true,
            isAlarms : false,
            isCreateAlarm : false
        }
        this.setComp = this.setComp.bind(this);
    }

    setComp(id){
        if(id === '0'){
            this.setState({isMyAlarms: true, isAlarms: false, isCreateAlarm: false})
        }else if(id === '1'){
            this.setState({isMyAlarms: false, isAlarms: true, isCreateAlarm: false})
        }else{
            this.setState({isMyAlarms: false, isAlarms: false, isCreateAlarm: true})
        }
    }
    render() {
        return (
          <div >
              <div className="log_alerts">
                  {/* <ul>
                      <li onClick={()=> this.setComp(0)}>My Alarms | </li>
                      <li onClick={()=> this.setComp(1)}>Existing Alarms | </li>
                      <li onClick={()=> this.setComp(2)}>Create New Alarm</li>
                  </ul> */}
                 <Tabs >
                    <TabList className = 'log_tab'>
                    <Tab >My Alarms</Tab>
                    <Tab >Existing Alarms</Tab>
                    <Tab> Create New Alarm</Tab>
                    </TabList>
                
                    <TabPanel>
                        <div className = 'innerM'>
                            <MyAlarms/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className = 'innerM'>
                            <ExistingAlarms/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className = 'innerM'>
                            <AlarmForm/>
                        </div>    
                    </TabPanel>
                </Tabs>

              </div>
              {/* { this.state.isMyAlarms ? (
                <div>
                    <MyAlarms/>
                </div>
              ) : (
                <div>
                    {this.state.isAlarms ? (<ExistingAlarms/>) : (<AlarmForm/>)}
                </div>
              )} */}
              
              
          </div>
        )
    }
}

export default LogAlerts;