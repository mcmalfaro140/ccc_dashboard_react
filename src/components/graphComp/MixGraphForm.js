import React, { Component } from 'react';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import { SketchPicker } from 'react-color'
import Switch from "react-switch";
import '../../assets/react-grid/styles.css';
import ReactLightCalendar from '@lls/react-light-calendar';


/**
 * Renders the preloader
 */

 var value = [];
 var currentDate = new Date();
class MixGraphForm extends Component {

    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.refreshGraph = this.refreshGraph.bind(this);
        this.mixUpdate = this.mixUpdate.bind(this);
        this.readMixedSelection1 = this.readMixedSelection1.bind(this);
        this.readMixedSelection2 = this.readMixedSelection2.bind(this);
        this.readMixTimeSelection1 = this.readMixTimeSelection1.bind(this);
        this.changeColorFirstGraph = this.changeColorFirstGraph.bind(this);
        this.changeColorSecondGraph = this.changeColorSecondGraph.bind(this);
        this.onDateRangeSelection = this.onDateRangeSelection.bind(this);
        this.checkAllFilled = this.checkAllFilled.bind(this);
        this.calculateY = this.calculateY.bind(this);
      
        this.state = { 
            isRealTime: false,
            refreshRate:null,
              mixGraph:{
                typeOfGraph:null,
                metricName:null, 
                nameSpace:null,
                typeOfDimension : null,
                idValue:null,
                chartName:null,
                colorSelected:'',
                typeOfGraph1:null,
                metricName1:null, 
                nameSpace1:null,
                typeOfDimension1 : null,
                idValue1:null,
                colorSelected1:'' 
            },
                isAllFieldFilled:false,
                startTime:null, //if needed
                period:null,
                endTime:null,
                xAxisRange:null,
                xAxisSelection:"",
                refreshRateSelection:"",
                y : 0
    }}
componentWillReceiveProps(nextProps){
    if(nextProps.mixGraphInfor != null){
        this.setState({isRealTime : nextProps.mixGraphInfor.realTime})
    }
}
componentDidMount(){
    if(this.props.mixGraphInfor != null){
        this.setState({isRealTime : this.props.mixGraphInfor.realTime});
        if(this.props.mixGraphInfor.realTime === false){
            this.setState({startTime : new Date(this.props.mixGraphInfor.startTime).getTime()});
            this.setState({endTime : new Date(this.props.mixGraphInfor.endTime).getTime()})
        } else{
            this.setState({startTime : new Date(this.props.mixGraphInfor.startTime)});
            this.setState({endTime : new Date(this.props.mixGraphInfor.endTime)})
        }  
        this.setState(prevState => {
            let mixGraph = Object.assign({}, prevState.mixGraph);   
            mixGraph.colorSelected = this.props.mixGraphInfor.colorSelected;
            mixGraph.colorSelected1 = this.props.mixGraphInfor.colorSelected1;
            return { mixGraph };            
        });   
        
    }else{
        this.setState({y : this.calculateY()})
    }
}

calculateY(){
    let dashboard = this.props.dashboard
    let holder = []
    let new_y = 0
    dashboard.forEach(element => {
        if(!holder.includes(element.coordinates.y)){
            holder.push(element.coordinates.y)
            new_y += element.coordinates.h
        }
    });
    return new_y
  }

//Mix form update
mixUpdate(e,i){
    e.preventDefault();
    value[i] = e.target.value;
    if(value.length >9){
        value = []
    }
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.nameSpace = value[0];   
        mixGraph.nameSpace1 = value[1];  
        mixGraph.chartName = value[2];
        mixGraph.metricName = value[3]; 
        mixGraph.metricName1 = value[4]; 
        mixGraph.typeOfDimension = value[5]; 
        mixGraph.typeOfDimension1 = value[6]; 
        mixGraph.idValue = value[7];
        mixGraph.idValue1 = value[8];
        return { mixGraph };                                
      })
  
}
toggleSwitch (isRealTime){
        this.setState({isRealTime});
        this.checkAllFilled();
    }
toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen})
        this.setState({namespaceNotSelected : true})
};
checkAllFilled(color){
    if(this.state.isRealTime === true){
         if(this.state.mixGraph.typeOfGraph != null &&  this.state.mixGraph.typeOfGraph1 != null
                && this.state.mixGraph.nameSpace != null && this.state.mixGraph.nameSpace !== '' && this.state.mixGraph.nameSpace1 != null && this.state.mixGraph.nameSpace1 !== ''
                && this.state.mixGraph.chartName != null && this.state.mixGraph.chartName !== '' && this.state.mixGraph.metricName != null && this.state.mixGraph.metricName !== ''
                && this.state.mixGraph.metricName1 != null && this.state.mixGraph.metricName1 !== '' && this.state.mixGraph.typeOfDimension != null && this.state.mixGraph.typeOfDimension !== ''
                && this.state.mixGraph.typeOfDimension1 != null && this.state.mixGraph.typeOfDimension1 !== '' && this.state.mixGraph.idValue != null && this.state.mixGraph.idValue !== ''
                && this.state.mixGraph.idValue1 != null && this.state.mixGraph.idValue1 !== '' && this.state.startTime != null && this.state.endTime != null
                && this.state.mixGraph.colorSelected !== '' && (color != null || this.state.mixGraph.colorSelected1 !== '') && this.state.refreshRate != null 
                && this.state.xAxisRange != null){
                    this.setState({isAllFieldFilled: true});
                }else{
                    this.setState({isAllFieldFilled: false});
                }
    }
    else if(this.state.isRealTime === false){
               if(this.state.mixGraph.typeOfGraph != null && this.state.mixGraph.typeOfGraph1 != null
                && this.state.mixGraph.nameSpace != null && this.state.mixGraph.nameSpace !== '' && this.state.mixGraph.nameSpace1 != null && this.state.mixGraph.nameSpace1 !== ''
                && this.state.mixGraph.chartName != null && this.state.mixGraph.chartName !== '' && this.state.mixGraph.metricName != null && this.state.mixGraph.metricName !== ''
                && this.state.mixGraph.metricName1 != null && this.state.mixGraph.metricName1 !== '' && this.state.mixGraph.typeOfDimension != null && this.state.mixGraph.typeOfDimension !== ''
                && this.state.mixGraph.typeOfDimension1 != null && this.state.mixGraph.typeOfDimension1 !== '' && this.state.mixGraph.idValue != null && this.state.mixGraph.idValue !== ''
                && this.state.mixGraph.idValue1 != null && this.state.mixGraph.idValue1 !== '' && this.state.startTime != null && this.state.endTime != null
                && this.state.mixGraph.colorSelected !== '' && (color != null || this.state.mixGraph.colorSelected1 !== '')){
                    this.setState({isAllFieldFilled: true});
                }else{
                    this.setState({isAllFieldFilled: false});
                }

    }
}
onDateRangeSelection= (startTime, endTime) => {
    this.setState({startTime , endTime})
        let start, end;
        if(startTime != null){
            start = new Date(startTime);
        }
        if(endTime != null){
            end = new Date(endTime);
        }
        if(start!=null && end!=null){
        let dateDiff = end.getTime() - start.getTime();
        let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
        if(days<1){
            this.setState({period:60});
        }
        if(days === 1){
            this.setState({period:120});
        }
        if(days >1 && days <5){
            this.setState({period: 600});
        }
        if(days > 5 && days < 25){
            this.setState({period: 1800});
        }
        if(days > 25 ){
            this.setState({period: 3600})
        }
    }
    this.checkAllFilled();
}
  
readMixTimeSelection1(e){
    this.setState({endTime : new Date()})
    if(e.target.value === "Last Hour"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())})
        this.setState({period : 60,   xAxisSelection : 'Last Hour',
                      xAxisRange: 3600000})
        
    
    }
    if(e.target.value === "Last 15 Minutes"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes()-15)})
        this.setState({period : 60 ,xAxisRange: 900000,
                         xAxisSelection: 'Last 15 Minutes'})
    }
    if(e.target.value === "Last Two Hours"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-2,currentDate.getMinutes())})
        this.setState({period : 60 , xAxisSelection : 'Last Two Hours',
                        xAxisRange: 7200000})
    }
    if(e.target.value === "Last Day"){
        this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())})
        this.setState({period : 60, xAxisSelection : 'Last Day',
                         xAxisRange: 86400000})

    }
    this.checkAllFilled();
}
refreshGraph(e){
    if(e.target.value === "Three Seconds"){
        this.setState({refreshRate : 3000,refreshRateSelection : 'Three Seconds'})
    }
    if(e.target.value === "Ten Seconds"){
        this.setState({refreshRate : 10000,refreshRateSelection : 'Ten Seconds' })
    }
    if(e.target.value === "One minute"){
        this.setState({refreshRate : 60000,refreshRateSelection: 'One minute'})
    }
    if(e.target.value === "Ten minutes"){
        this.setState({refreshRate : 600000,refreshRateSelection:'Ten minutes'})
    }
    this.checkAllFilled();
 }
readMixedSelection1(e){
    var type = e.target.value;
    this.setState(prevState => ({
        mixGraph: {                   // object that we want to update
            ...prevState.mixGraph,    // keep all other key-value pairs
            typeOfGraph:type    // update the value of specific key
        }
    }))
    this.checkAllFilled();
}
readMixedSelection2(e){
    var type = e.target.value;
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.typeOfGraph1 = type;                                     
        return { mixGraph };                               
      })
      this.checkAllFilled();
}
changeColorFirstGraph = (color) =>{
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.colorSelected = color.hex
        return { mixGraph };                                
      });
    this.checkAllFilled();
}
changeColorSecondGraph = (color) =>{
    this.setState(prevState => {
        let mixGraph = Object.assign({}, prevState.mixGraph);  
        mixGraph.colorSelected1 = color.hex
        return { mixGraph };                                
      });

      this.checkAllFilled(color);
}
render() {
        let start = new Date(parseInt(this.state.startTime));
        let end = new Date(parseInt(this.state.endTime));
        let startTime = start.toGMTString();
        let endTime = end.toGMTString();
        let timeSelection;
        if(this.state.isRealTime === true){
            timeSelection = 
         <div>
             
             <Form.Group controlId="exampleForm.ControlSelect2">
                 <Form.Label>Time Range</Form.Label>
                  <Form.Control as="select"  
                 onChange={(e) => this.readMixTimeSelection1(e)}
                 defaultValue = {this.props.mixGraphInfor==null?null:this.props.mixGraphInfor.xAxisSelection}>
                    {this.props.mixGraphInfor==null?
                    <option disabled selected>Make Selection</option>
                    :null
                }
                    <option value = "Last 15 Minutes">Last 15 Minutes</option>
                    <option value = "Last Hour">Last Hour</option>
                    <option value = "Last Two Hours">Last Two Hours</option>
                    <option value = "Last Day">Last Day</option>
                                </Form.Control>
                         <Form.Text className="text-muted">
                             Select the time
                         </Form.Text>
                    </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect10">
            <Form.Label>Refresh Rate</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.refreshGraph(e)}
            defaultValue = {this.props.mixGraphInfor==null?null:this.props.mixGraphInfor.refreshRateSelection}>
           {this.props.mixGraphInfor==null?
                    <option disabled selected>Make Selection</option>
                    :null
                }
            <option value = "Three Seconds">Three Seconds</option>
            <option value = "Ten Seconds">Ten Seconds</option>
            <option value = "One minute">One minute</option>
            <option value = "Ten minutes">Ten minutes</option>
            
            </Form.Control>
            <Form.Text className="text-muted">
                Select the refresh rate
                </Form.Text>
            </Form.Group>
         </div>
           
            
        }
        else{
            timeSelection = 
            <div>
            <br/>
            <div>
                <Row>
                    <Col>
                        <Form.Label style = {{marginBottom:'-30px'}}>
                        Start Time :
                        </Form.Label>
                        <Form.Text className="text-muted">
                        (select the start time ...)
                        </Form.Text>
                    </Col>
                    <Col>
                        <Form.Label style = {{marginBottom:'-30px'}}>
                        End Time : 
                        </Form.Label>
                        <Form.Text className="text-muted">
                        (select the end time ...)
                        </Form.Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span style = {{fontSize : 'small'}}>{this.state.startTime==null?null:startTime}</span>
                    </Col>
                    <Col>
                    <span style = {{fontSize : 'small'}}>{this.state.endTime==null?null:endTime}</span>
                    </Col>

                </Row>
                <br/>
            </div>
            <div className = 'center'>
            <Form.Group>
                <ReactLightCalendar startDate={this.state.startTime==null?null:new Date(this.state.startTime).getTime()} endDate={this.state.endTime==null?null:new Date(this.state.endTime).getTime()} onChange={this.onDateRangeSelection} range displayTime />
            </Form.Group>
            </div>
            </div>
        }
      
        return (

         
                        <div>
                        <ModalHeader toggle={this.props.toggleMixForm}>{this.props.mixGraphInfor == null ? 'New Mix Chart Form':'Modify Mix Chart Form'}</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a mix chart.
                                <form>
                                {this.props.mixGraphInfor == null ?
                                < Form.Group>
                                    <label className="center">
                                    <h5>Real Time</h5>
                                    <Switch
                                        checked={this.state.isRealTime}
                                        onChange={this.toggleSwitch}
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={20}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={15}
                                        width={40}
                                        className="react-switch"
                                        id="material-switch"
                                    />

                                    </label>
                                </Form.Group>: null}
                                {this.props.mixGraphInfor == null?
                                <Form>
                                    <Row>
                                        <Col>
                                         <Form.Label>Graph 1</Form.Label>
                                        </Col>
                                        <Col>
                                         <Form.Label>Graph 2</Form.Label>
                                        </Col>
                                    </Row>
                                </Form>:null}
                                {this.props.mixGraphInfor == null?
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                        <Row>
                                            <Col>
                                            <Form.Label>Type of graph: </Form.Label>
                                            <Form.Control as="select"  
                                        onChange={(e) => this.readMixedSelection1(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "line">Line Graph</option>
                                        <option value = "bar">Bar Graph</option>
                                        </Form.Control>                                         
                                           <Form.Text className="text-muted">
                                            Select the type
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Type of graph: </Form.Label>
                                            <Form.Control as="select"  
                                        onChange={(e) => this.readMixedSelection2(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "line">Line Graph</option>
                                        <option value = "bar">Bar Graph</option>
                                        </Form.Control>                                         
                                           <Form.Text className="text-muted">
                                            Select the type
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form.Group>:null}


                                    {this.props.mixGraphInfor == null?
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Name Space: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. AWS/EC2" onChange = {(e) => this.mixUpdate(e,0)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.nameSpace:"" } />
                                            <Form.Text className="text-muted">
                                            name space such as AWS/EC2 ...
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Name Space: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. AWS/EC2" onChange = {(e) => this.mixUpdate(e,1)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.nameSpace1:"" }/>
                                            <Form.Text className="text-muted">
                                            name space such as AWS/EC2 ...
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>:null}

                                    <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>Chart name: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the chart name" onChange = {(e) => this.mixUpdate(e,2)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.chartName:""}/>
                                            <Form.Text className="text-muted">
                                            specify the chart name that you want...                                            
                                            </Form.Text>  
                                   </Form.Group>

                                   {this.props.mixGraphInfor == null?
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Metric name: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. CPUCreditUsage" onChange = {(e) => this.mixUpdate(e,3)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.metricName:""}/>
                                            <Form.Text className="text-muted">
                                            metric name such as CPUCreditUsage...                                        
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Metric name: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. CPUUtilization" onChange = {(e) => this.mixUpdate(e,4)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.metricName1:""}/>
                                            <Form.Text className="text-muted">
                                            metric name such as CPUUtilization...                                        
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>:null}

                              
                                    {this.props.mixGraphInfor == null?
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension name: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. InstanceId" onChange = {(e) => this.mixUpdate(e,5)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.typeOfDimension:""}/>
                                            <Form.Text className="text-muted">
                                            Dimension name Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Dimension name: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. InstanceId" onChange = {(e) => this.mixUpdate(e,6)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.typeOfDimension1:""}/>
                                            <Form.Text className="text-muted">
                                            Enter the dimension Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>:null}

                                    {this.props.mixGraphInfor == null?
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. i-123456hf78kp9lxc0 " onChange = {(e) => this.mixUpdate(e,7)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.idValue:""} />
                                            <Form.Text className="text-muted">
                                            Dimension value Ex.i-123456hf78kp9lxc0 
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Dimension Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. i-123456hf78kp9lxc0" onChange = {(e) => this.mixUpdate(e,8)} defaultValue={this.props.mixGraphInfor!=null?this.props.mixGraphInfor.idValue1:""}/>
                                            <Form.Text className="text-muted">
                                            Dimension value Ex.i-123456hf78kp9lxc0 
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>:null}

                
                                     {timeSelection}

                                    <br/>
                                    <Form>
                                        <Form.Label className = 'center'>Graph Color</Form.Label>
                                        <Row>
                                            <Col>
                                            <span className = 'center' style = {{fontSize:'small'}}>Color Selected Graph 1: {this.state.mixGraph.colorSelected}</span>
                                            </Col>
                                            <Col>
                                            <span className = 'center' style = {{fontSize:'small'}}>Color Selected Graph 2: {this.state.mixGraph.colorSelected1}</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <SketchPicker
                                                color = {this.state.mixGraph.colorSelected}
                                                onChange = {this.changeColorFirstGraph}
                                                />
                                            </Col>
                                            <Col>
                                                <SketchPicker
                                                color = {this.state.mixGraph.colorSelected1}
                                                onChange = {this.changeColorSecondGraph}
                                                />
                                             </Col>
                                        </Row>
                                    </Form>

                    
                                   
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newGraph:{
                                            objectType:"graph", // options: graph or table
                                            graphSettings: {
                                                type:this.props.mixGraphInfor!=null? this.props.mixGraphInfor.type: this.props.whatever, //options: line, pie, or bar
                                                typeOfGraph: this.state.mixGraph.typeOfGraph!=null?this.state.mixGraph.typeOfGraph:(this.props.mixGraphInfor!=null?this.props.mixGraphInfor.typeOfGraph:""),
                                                typeOfGraph1: this.state.mixGraph.typeOfGraph1!=null?this.state.mixGraph.typeOfGraph1:(this.props.mixGraphInfor!=null?this.props.mixGraphInfor.typeOfGraph1:""),
                                                realTime:this.state.isRealTime, //options: true or false
                                                metricName:this.state.mixGraph.metricName!=null ? this.state.mixGraph.metricName: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.metricName:""), 
                                                metricName1:this.state.mixGraph.metricName1!=null ? this.state.mixGraph.metricName1: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.metricName1:""),
                                                nameSpace:this.state.mixGraph.nameSpace!=null ? this.state.mixGraph.nameSpace: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.nameSpace:""),
                                                nameSpace1:this.state.mixGraph.nameSpace1!=null ? this.state.mixGraph.nameSpace1: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.nameSpace1:""),
                                                chartName:this.state.mixGraph.chartName!=null? this.state.mixGraph.chartName: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.chartName:""),
                                                typeOfDimension : this.state.mixGraph.typeOfDimension!=null? this.state.mixGraph.typeOfDimension: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.typeOfDimension:""),
                                                typeOfDimension1 : this.state.mixGraph.typeOfDimension1!=null? this.state.mixGraph.typeOfDimension1: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.typeOfDimension1:""),
                                                idValue:this.state.mixGraph.idValue!=null? this.state.mixGraph.idValue: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.idValue:""),
                                                idValue1:this.state.mixGraph.idValue1!=null? this.state.mixGraph.idValue1: (this.props.mixGraphInfor!=null?this.props.mixGraphInfor.idValue1:""),
                                                refreshRate: this.state.refreshRate!=null?this.state.refreshRate:(this.props.mixGraphInfor!=null?this.props.mixGraphInfor.refreshRate:""),
                                                colorSelected:this.state.mixGraph.colorSelected,
                                                colorSelected1:this.state.mixGraph.colorSelected1,
                                                period:this.state.period!=null?this.state.period:(this.props.mixGraphInfor!=null?this.props.mixGraphInfor.period:""),
                                                startTime:this.state.startTime, //if needed
                                                endTime:this.state.endTime, //if needed
                                                xAxisRange : this.state.xAxisRange!=null? this.state.xAxisRange:(this.props.mixGraphInfor!=null?this.props.mixGraphInfor.xAxisRange:""),
                                                xAxisSelection : this.state.xAxisSelection,
                                                refreshRateSelection : this.state.refreshRateSelection
                                            },
                                            coordinates: {
                                                x: 0,
                                                y: this.state.y,
                                                w: 8,
                                                h: 2,
                                                minW: 8,
                                                minH: 2
                                            },
                                        }
                                    }
                                }}>
                                     <Button color="primary" disabled = {this.state.isAllFieldFilled === false && this.props.mixGraphInfor == null} onClick={this.props.toggleMixForm}>{this.props.mixGraphInfor == null ? "Create Graph" : "Modify Graph"}</Button>
                                </Link>
                                <Button color="secondary" onClick={this.props.toggleMixForm}>Cancel</Button>
                            </ModalFooter>
                           
                            </div>
               
    
        )
    }
}


export default connect()(MixGraphForm);
