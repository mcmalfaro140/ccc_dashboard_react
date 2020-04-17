import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardBody, Modal , Col} from 'reactstrap';
import LineGraph from '../components/graphComp/LineGraph'
import BarGraph from '../components/graphComp/BarGraph';
import MixGraph from '../components/graphComp/MixGraph';
import { getLoggedInUser } from '../helpers/authUtils';
import Loader from '../components/Loader';
import MixGraphForm from '../components/graphComp/MixGraphForm';
import mykey from '../keys.json';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import GraphForm from '../components/graphComp/graphForm';

//import css needed for reac-grid-layout
import '../assets/react-grid/styles.css';
import '../assets/react-grid/styles1.css';
import SystemHealthContext from '../components/SystemHealthComponent/SystemHealthContext';
import LogErrorContext from '../components/SystemHealthComponent/LogErrorContext';
import LogWarningContext from '../components/SystemHealthComponent/LogWarningContext';
import ServerStatusContext from '../components/SystemHealthComponent/ServerStatusContext';
import NightlyScriptContext from '../components/SystemHealthComponent/NightlyScriptContext';
import LogErrorSystemHealth from '../components/SystemHealthComponent/LogErrorSystemHealth';
import LogWarningSystemHealth from '../components/SystemHealthComponent/LogWarningSystemHealth';
import EC2SystemHealth from '../components/SystemHealthComponent/EC2SystemHealth';

const axios = require('axios').default;

class DefaultDashboard extends Component {
   
    constructor(props) {
        
        super(props);
        this.state = {
            user: getLoggedInUser(),
            userDashboard: [],
            showOptions: false,
            systemHealth: false,
            isModify : false,
            isMixModify: false,
            stickyFormData :{},
            stickyMixFormData :{},
            selectedGraphId:"",
            isSystemHealthdefault: false,
            results:[]
        };
        this.showOptions = this.showOptions.bind(this);
        this.systemHealth = this.systemHealth.bind(this);
        this.recordCoordinateChange = this.recordCoordinateChange.bind(this);
        this.setLayout = this.setLayout.bind(this)
        this.test = this.test.bind(this);
    }

    componentDidMount(){
        if(this.state.user.token !== null){
            axios({
                method: 'get',
                url: `${mykey.backend}/getDashboard`,
                headers: {
                    'Authorization': this.state.user.token,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            .then((response)=>{
                let users_dash = JSON.parse(response.data.dashboard);
                let new_dash = [];
                if(users_dash.length > 0){
                    users_dash.forEach((item, index) => {
                        item.id = index;
                        new_dash.push(item)
                    })
                }
                this.setState({userDashboard: new_dash})
                this.props.updateDashboard(this.state.userDashboard)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    componentWillUnmount(){
        this.props.saveDashboard(this.state.userDashboard);
        this.props.updateDashboard(this.state.userDashboard)
    }

    fillBoxListener = (childData) =>{
        let id = childData[1];
        let isFill = childData[0];
        let newDashboard = this.state.userDashboard;
        for(let i = newDashboard.length -1; i>=0;--i){
            if(newDashboard[i].id === id){
                newDashboard[i].graphSettings.isFill = isFill;
                this.setState({userDashboard : newDashboard});
            }   
        }
        this.props.saveDashboard(this.state.userDashboard);
        this.props.updateDashboard(this.state.userDashboard)
    }
    deleteFunction = (childData) => {
        let newDashboard = this.state.userDashboard;
        for(let i = newDashboard.length -1; i>=0;--i){
            if(newDashboard[i].id === childData){
                newDashboard.splice(i,1);
                this.setState({userDashboard : newDashboard});
            }   
        }
        this.props.saveDashboard(this.state.userDashboard);
        this.props.updateDashboard(this.state.userDashboard)
    }

    modifyFunction = (childData) => {
        this.setState({isModify :true});
        this.setState({selectedGraphId : childData});
        const newDashboard = this.state.userDashboard;
        for(let i = newDashboard.length-1; i>=0;--i){
            if(newDashboard[i].id === childData){
                this.setState({stickyFormData : newDashboard[i].graphSettings});
            }
        }
    }

    modifyMixFunction = (childData) => {
        this.setState({isMixModify :true});
        this.setState({selectedGraphId : childData});
        const newDashboard = this.state.userDashboard;
        for(let i = newDashboard.length-1; i>=0;--i){
            if(newDashboard[i].id === childData){
                this.setState({stickyMixFormData : newDashboard[i].graphSettings});
            }
        }           
}
    toggleForm = () =>{
        this.setState({isModify : !this.state.isModify});
    }
    toggleMixForm = () =>{
        this.setState({isMixModify : !this.state.isMixModify});
    }
    componentWillReceiveProps(nextProps){
            let temp = this.state.userDashboard
            if(nextProps.location.state){
                //only activate adds to the array if the props are the specify ones
                if(nextProps.location.state.newGraph){
                    if(this.state.isModify === false &&  this.state.isMixModify === false ){
                        let newName = nextProps.location.state.newGraph.graphSettings.chartName;
                        let preName = this.state.newUpcomingPropsName;
                        if(newName !== preName && !temp.includes(nextProps.location.state.newGraph.graphSettings)){
                            nextProps.location.state.newGraph["id"] = this.state.userDashboard.length;
                            temp.push(nextProps.location.state.newGraph);
                            this.setState({
                                userDashboard: temp,
                                newUpcomingPropsName: newName
                            })
                            this.props.saveDashboard(this.state.userDashboard);
                            this.props.updateDashboard(this.state.userDashboard)
                        }
                    }else if(this.state.isModify === true || this.state.isMixModify === true){
                            let newName = nextProps.location.state.newGraph.graphSettings.chartName;
                            const id = this.state.selectedGraphId;
                            const newDashboard = this.state.userDashboard;   
                            for(let i = newDashboard.length-1; i>=0; i--){     
                                if(newDashboard[i].id === id){
                                    newDashboard[i].graphSettings.xAxisRange = nextProps.location.state.newGraph.graphSettings.xAxisRange;
                                    newDashboard[i].graphSettings.xAxisSelection = nextProps.location.state.newGraph.graphSettings.xAxisSelection;
                                    newDashboard[i].graphSettings.metricName = nextProps.location.state.newGraph.graphSettings.metricName;
                                    newDashboard[i].graphSettings.nameSpace = nextProps.location.state.newGraph.graphSettings.nameSpace;
                                    newDashboard[i].graphSettings.realTime = nextProps.location.state.newGraph.graphSettings.realTime;
                                    newDashboard[i].graphSettings.chartName = nextProps.location.state.newGraph.graphSettings.chartName;
                                    newDashboard[i].graphSettings.typeOfDimension = nextProps.location.state.newGraph.graphSettings.typeOfDimension;
                                    newDashboard[i].graphSettings.idValue = nextProps.location.state.newGraph.graphSettings.idValue;
                                    newDashboard[i].graphSettings.realTime = nextProps.location.state.newGraph.graphSettings.realTime;
                                    if(nextProps.location.state.newGraph.graphSettings.realTime === true){
                                        newDashboard[i].graphSettings.refreshRate = nextProps.location.state.newGraph.graphSettings.refreshRate;
                                        newDashboard[i].graphSettings.refreshRateSelection = nextProps.location.state.newGraph.graphSettings.refreshRateSelection;
                                    }
                                    if(nextProps.location.state.newGraph.graphSettings.type === 'mix'){
                                        newDashboard[i].graphSettings.metricName1 = nextProps.location.state.newGraph.graphSettings.metricName1;
                                        newDashboard[i].graphSettings.nameSpace1 = nextProps.location.state.newGraph.graphSettings.nameSpace1;
                                        newDashboard[i].graphSettings.typeOfDimension1 = nextProps.location.state.newGraph.graphSettings.typeOfDimension1;
                                        newDashboard[i].graphSettings.idValue1 = nextProps.location.state.newGraph.graphSettings.idValue1;
                                        newDashboard[i].graphSettings.typeOfGraph = nextProps.location.state.newGraph.graphSettings.typeOfGraph;
                                        newDashboard[i].graphSettings.typeOfGraph1 = nextProps.location.state.newGraph.graphSettings.typeOfGraph1;
                                        newDashboard[i].graphSettings.colorSelected1 = nextProps.location.state.newGraph.graphSettings.colorSelected1;
                                    }
                                    newDashboard[i].graphSettings.startTime = nextProps.location.state.newGraph.graphSettings.startTime;
                                    newDashboard[i].graphSettings.endTime = nextProps.location.state.newGraph.graphSettings.endTime;
                                    newDashboard[i].graphSettings.colorSelected = nextProps.location.state.newGraph.graphSettings.colorSelected;
                                    newDashboard[i].graphSettings.period = nextProps.location.state.newGraph.graphSettings.period;
                                }
                            
                            this.setState({userDashboard : newDashboard});
                            this.setState({isModify : false, newUpcomingPropsName: newName, isMixModify : false});
                            this.props.saveDashboard(this.state.userDashboard);
                            this.props.updateDashboard(this.state.userDashboard)
                        }
                    }
                }   
        }
    }
    showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
    }
    systemHealth(e){
        e.preventDefault();
        this.setState({ systemHealth: !this.state.systemHealth});
    }

    //Gets call when the user resize the dashboard. Saves the new coordinates
    recordCoordinateChange(newLayout, allLayouts){
        if(allLayouts.lg !== undefined){
            if(allLayouts.lg.length  > 0)
                this.setLayout(allLayouts.lg)
        }else if( allLayouts.md !== undefined){
            if(allLayouts.md > 0)
                this.setLayout(allLayouts.md)
        }else if(newLayout !== undefined){
            this.setLayout(newLayout)
        }        
    }

    setLayout(newLay){
        let temp = this.state.userDashboard
        let updatedDash = [];
        newLay.forEach((chart) => {
            let newGraph = temp.find(temp => temp.id === parseInt(chart.i))
            newGraph.coordinates.x = chart.y
            newGraph.coordinates.x = chart.x
            newGraph.coordinates.w = chart.w
            newGraph.coordinates.h = chart.h

            updatedDash.push(newGraph);
        })
        this.setState({
            userDashboard: updatedDash
        })
        this.props.updateDashboard(updatedDash)
    }

   
    test(id){
        if(id === 'errorComponent'){
            console.log('Error component is being clicked')

        }
        else if(id === 'warningComponent')
        {
            console.log("warning component is being clicked")
        }

    }

    
    render() {

    
        const items = this.state.userDashboard.map((item, i) => {

            if(item.objectType === "graph"){
                if(item.graphSettings.type === "line"){
                    return (   
                       <Card id = "p" key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <LineGraph {...item} parentCallback = {this.deleteFunction} callback = {this.modifyFunction} fillCallback = {this.fillBoxListener}></LineGraph>
                            </CardBody>
                        </Card>
                       );
                }else if(item.graphSettings.type === "bar"){
                    return (
                        <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <BarGraph {...item} parentCallback = {this.deleteFunction} callback = {this.modifyFunction}></BarGraph>
                            </CardBody>                                  
                        </Card>);
                }else if(item.graphSettings.type === "pie"){
                    return (
                        <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody>
                                
                            </CardBody>
                                                
                        </Card>);
                }
                else if(item.graphSettings.type === "mix"){
                    return (
                        <Card key={item.id} data-grid={{x:item.coordinates.x, y:item.coordinates.y, w: item.coordinates.w, h: item.coordinates.h, minW: item.coordinates.minW, minH: item.coordinates.minH}}>
                            <CardBody style={{overflow:'hidden'}}>
                                <MixGraph {...item} parentCallback = {this.deleteFunction} callback = {this.modifyMixFunction}></MixGraph>
                            </CardBody>
                                                
                        </Card>);
                }
            }
        });

        
   
        return (
            
            <React.Fragment>
                {/* <Button onClick={this.saveDashboard}>test</Button> */}
                 <Modal isOpen={this.state.isModify} toggle = {this.toggleForm} > 
                     <GraphForm whatever={this.props.location.typeOfGraph} toggleForm = {this.toggleForm} graphInfor = {this.state.stickyFormData} 
                    />
                </Modal>
                <Modal isOpen={this.state.isMixModify} toggle = {this.toggleMixForm}>
                    <MixGraphForm whatever={this.props.location.typeOfGraph} toggleMixForm = {this.toggleMixForm} mixGraphInfor = {this.state.stickyMixFormData} />
                </Modal>
                <div id="dashboard" style={{paddingTop:'1%'}}>
                    { /* preloader */}
                    {this.props.loading && <Loader />}
                    <SystemHealthContext > 
                        <Card style={{boxShadow: '0 0 15px 0 rgba(30,144,255, 0.486)'}}>
                            <div style={{paddingBottom:'1%'}}className="card-body">
                            <h3 className="float-left" >System Health Bar</h3>
                                <div style={{paddingTop:'20px'}} className="dropdown float-right show" onClick={this.systemHealth}>
                                <div style={{paddingTop:'-15px'}} className="float-left">Last 24 Hours</div>
                            </div>
                            </div>
                            
                        <CardBody className = "healthbar" style={{paddingTop:'0%', margin: '0%'}}>

                                <div>
                                        <Row onClick={() => this.setState({isSystemHealthdefault : !this.state.isSystemHealthdefault})} >
                                                           
                                        <Col id="Column-0" onClick = {() => this.setState({systemHealthComponentid: "Column-0"})}> <LogErrorContext /></Col>
                                        <Col id="Column-1" onClick = {() => this.setState({systemHealthComponentid: "Column-1"})}> <LogWarningContext /></Col>
                                        <Col id="Column-2" onClick = {() => this.setState({systemHealthComponentid: "Column-2"})}><NightlyScriptContext /></Col>
                                        <Col id="Column-3" onClick = {() => this.setState({systemHealthComponentid: "Column-3"})}> <ServerStatusContext /></Col>
                                        
                                        </Row>  
                                    
                                
                                </div>
                            
                        { 
                    this.state.isSystemHealthdefault &&
                    
                    <div>
                            <Row >
                        {
                            this.state.systemHealthComponentid === "Column-0" ?  <Col id ={"ExpandedColumn-0"}>< LogErrorSystemHealth /></Col>
                            : this.state.systemHealthComponentid === "Column-1" ? <Col id ={"ExpandedColumn-1"}>< LogWarningSystemHealth /></Col>
                            : this.state.systemHealthComponentid === "Column-2" ? <p id ={"ExpandedColumn-2"}>This is inside Nightly scripts</p>
                            : <Col id ={"ExpandedColumn-3"} ><EC2SystemHealth /></Col>
                        }
                           </Row>
                    </div>
                   
                        }   

                            

                        </CardBody>
                           

                        </Card>
                    </SystemHealthContext>
                 {/* If one of the system health components is clicked 
                expand the card and show an expanded card */}

 
                    <div id="graphs_layout">
                    <ResponsiveGridLayout  className="layout" 
                        breakpoints={{lg: 1040, md: 868, sm: 375}}
                        cols={{lg: 24, md: 12, sm: 8}}
                        width={this.props.screenSize} 
                        onLayoutChange={(layout,allLayouts) => this.recordCoordinateChange(layout, allLayouts)} 
                        style={{margin:0}}>
                        {items}
                    </ResponsiveGridLayout>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default connect()(DefaultDashboard);




         
            