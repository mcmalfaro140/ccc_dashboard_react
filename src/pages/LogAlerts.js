import React, { Component } from 'react';
import MyAlarms from '../components/logAlertComp/MyAlarms'
import ExistingAlarms from '../components/logAlertComp/ExistingAlarms'
import AlarmForm from '../components/logAlertComp/AlarmForm'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import mykey from '../keys.json';
import { getLoggedInUser } from '../helpers/authUtils';
import Loading from '../components/logAlertComp/Loading'
import { Button, Modal } from 'reactstrap';
import Incomplete from '../assets/images/incomplete.png'




const axios = require('axios').default;

class LogAlerts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: getLoggedInUser(),
            myAlerts_Set: [],
            logAlerts_Set:[],
            isLoading: true,
            isComplete: true,
            isSuccessful: true,
            isErrorOpen: false
        }
        this.getAlerts = this.getAlerts.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.close = this.close.bind(this)
        this.deleteAlert = this.deleteAlert.bind(this);
        this.deleteReq = this.deleteReq.bind(this);
        this.setSuccess = this.setSuccess.bind(this);
        this.setFail = this.setFail.bind(this);
        this.setComplete = this.setComplete.bind(this);
    }

    setSuccess(){
        this.setState({isLoading: false,isSuccessful: true })
    }
    setFail(){
        this.setState({isLoading: false,isSuccessful: false })
    }
    setComplete(){
        this.setState({isComplete: !this.state.isComplete})
    }

    componentDidMount(){
        this.getAlerts()
    }

    close(){
        this.setState({isComplete: true, isErrorOpen: false})
    }

    deleteReq(id){
        this.setState({isComplete:false})
        axios({
            method: 'post',
            url: `${mykey.backend}/deleteLogAlarm`,
            headers: {
                'Authorization': this.state.user.token,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: {
                'LogAlarmId' : id
            }
        })
        .then((response)=>{
            if(response.data.Result == "Success"){
                this.setState({isLoading: false, isSuccessful:true})
                this.getAlerts();
            }else{
                this.setState({isLoading: false, isSuccessful:false})
            }
        })
        .catch((err)=>{
            this.setState({isLoading: false,isSuccessful:false})
            console.log(err)
        })
    }

    deleteAlert(id){
        let alarm = this.state.logAlerts_Set[id]
        if(alarm.Users.length == 1){
            if(alarm.Users[0] == this.state.user.username){
                this.deleteReq(alarm.LogAlarmId)
            }else{
                this.setState({isErrorOpen: true})
            }
        }else if(alarm.Users.length == 0){
            this.deleteReq(alarm.LogAlarmId)
        }else{
            this.setState({isErrorOpen: true})
        }
    }

    subscribe(id){
        this.setState({isComplete:false})
        if(this.state.user.token !== null){
            axios({
                method: 'post',
                url: `${mykey.backend}/subscribeToLogAlarm`,
                headers: {
                    'Authorization': this.state.user.token,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: {
                    'LogAlarmId' : id
                }
            })
            .then((response)=>{
                if(response.data.Result == "Success"){
                    this.setState({isLoading: false, isSuccessful:true})
                    this.getAlerts();
                }else{
                    this.setState({isLoading: false, isSuccessful:false})
                }
            })
            .catch((err)=>{
                this.setState({isLoading: false,isSuccessful:false})
                console.log(err)
            })
        }
    }
    unsubscribe(id){
        this.setState({isComplete:false})
        if(this.state.user.token !== null){
            axios({
                method: 'post',
                url: `${mykey.backend}/unsubscribeToLogAlarm`,
                headers: {
                    'Authorization': this.state.user.token,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: {
                    'LogAlarmId' : id
                }
            })
            .then((response)=>{
                console.log(response)
                if(response.data.Result == "Success"){
                    this.setState({isLoading: false, isSuccessful:true})
                    this.getAlerts();
                }else{
                    this.setState({isLoading: false, isSuccessful:false})
                }
            })
            .catch((err)=>{
                this.setState({isLoading: false,isSuccessful:false})
                console.log(err)
            })
        }
    }

    getAlerts(){
        if(this.state.user.token !== null){
            axios({
                method: 'get',
                url: `${mykey.backend}/getLogAlarms`,
                headers: {
                    'Authorization': this.state.user.token,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            .then((response)=>{
                let alerts = response.data.Result.allLogAlarms
                let my_alerts = response.data.Result.userLogAlarms
                alerts.forEach(element => {
                    if(element.Users.includes(this.state.user.username)){
                        element.isSubscribe = true
                    }else{
                        element.isSubscribe = false
                    }
                });
                my_alerts.forEach(element => {
                    if(element.Users.includes(this.state.user.username)){
                        element.isSubscribe = true
                    }else{
                        element.isSubscribe = false
                    }
                });
                this.setState({myAlerts_Set: my_alerts, logAlerts_Set: alerts})
            })
            .catch((err)=>{
                console.log(err)
            })
        }
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
                            <MyAlarms handleDelete={this.deleteAlert} handleSubscribe={this.subscribe} handleUnubscribe={this.unsubscribe} alerts={this.state.myAlerts_Set}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <ExistingAlarms handleDelete={this.deleteAlert} handleSubscribe={this.subscribe} handleUnubscribe={this.unsubscribe} alerts={this.state.logAlerts_Set}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <AlarmForm getAlerts={this.getAlerts} success={this.setSuccess} fail={this.setFail} complete={this.setComplete} user={this.state.user}/>
                        </div>    
                    </TabPanel>
                </Tabs>
              </div>
              <Loading isLoading={this.state.isLoading} isComplete={this.state.isComplete} isSuccessful={this.state.isSuccessful} close={this.close} />
              <Modal isOpen={this.state.isErrorOpen} className="delete_modal">
                    <img src={Incomplete}/>
                    <div>Can't delete alarm. There are more users subscribed to it.</div>
                    <Button onClick={() => this.close()}>Close</Button>
                </Modal>
              
          </div>
        )
    }
}

export default LogAlerts;