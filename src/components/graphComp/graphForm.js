import React, { Component } from 'react';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import { SketchPicker } from 'react-color'
import Switch from "react-switch";
import '../../assets/react-grid/styles.css'
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css' // Default Style


/**
 * Renders the preloader
 */

 var value = [];
 var currentDate = new Date();
class graphForm extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.readSelection = this.readSelection.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.refreshGraph = this.refreshGraph.bind(this);
        this.onDateRangeSelection = this.onDateRangeSelection.bind(this);
        this.checkAllFilled = this.checkAllFilled.bind(this);
        this.calculateY = this.calculateY.bind(this);
      
        this.state = { 
            checkbox:false,
            isRealTime: false,
            refreshRate:null,
            colorSelected:' ',
            isAllFieldFilled:false,
            metricName:null, 
            nameSpace:null,
            chartName:null,
            typeOfDimension : null,
            idValue:null,
            startTime:null, 
            period:null,
            endTime:null, //if needed ,
            xAxisRange:null,
            xAxisSelection:"",
            refreshRateSelection:"",
            y : 0
    }}

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

    componentWillReceiveProps(nextProps){
        if(nextProps.graphInfor != null){
            this.setState({isRealTime : nextProps.graphInfor.realTime})
        }
    }
    componentDidMount(){
        if(this.props.graphInfor != null){
            this.setState({isRealTime : this.props.graphInfor.realTime});
            if(this.props.graphInfor.realTime === false){
                this.setState({startTime : new Date(this.props.graphInfor.startTime).getTime()});
                this.setState({endTime : new Date(this.props.graphInfor.endTime).getTime()})
            } else{
                this.setState({startTime : new Date(this.props.graphInfor.startTime)});
                this.setState({endTime : new Date(this.props.graphInfor.endTime)})
            }      
            this.setState({colorSelected : this.props.graphInfor.colorSelected});
        }else{
            this.setState({y : this.calculateY()})
        }
        
    }
    refreshGraph(e){
       if(e.target.value === "Three Seconds"){
           this.setState({refreshRate : 3000, refreshRateSelection : 'Three Seconds'});
       }
       if(e.target.value === "Ten Seconds"){
           this.setState({refreshRate : 10000,refreshRateSelection : 'Ten Seconds' });
       }
       if(e.target.value === "One minute"){
           this.setState({refreshRate : 60000,refreshRateSelection: 'One minute' });
       }
       if(e.target.value === "Ten minutes"){
           this.setState({refreshRate : 600000, refreshRateSelection:'Ten minutes'});
       }
       this.checkAllFilled();
    }

    toggleSwitch (isRealTime){
        this.setState({isRealTime})
        this.checkAllFilled();
    }
    toggleForm(){
        this.props.toggleForm();
};
   
    checkAllFilled(color){
        if(this.state.isRealTime === true){

            if(this.state.nameSpace == null || this.state.nameSpace === ''|| this.state.metricName == null ||  this.state.metricName ==='' ||this.state.chartName == null ||
                this.state.typeOfDimension == null || this.state.typeOfDimension === '' || this.state.idValue == null || this.state.idValue ==='' || this.xAxisRange == null ||
                    this.xAxisRange === '' ||this.state.refreshRate == null || this.state.refreshRate === '' || (color == null || this.state.colorSelected === ' ')){

                        this.setState({isAllFieldFilled:false});
            }
            if( this.state.nameSpace != null && this.state.nameSpace !== '' && this.state.metricName != null && this.state.metricName !== '' && this.state.chartName != null &&
                this.state.chartName !== '' && this.state.typeOfDimension != null && this.state.typeOfDimension !== '' && this.state.idValue != null && this.state.idValue !== '' &&this.state.startTime !== ' ' &&
                this.state.endTime !== ' ' && (color != null || this.state.colorSelected !== ' ') && this.state.xAxisRange != null &&
                    this.state.refreshRate != null){
                   
                        this.setState({isAllFieldFilled:true});
               
            }
        }
        else if(this.state.isRealTime === false){

            if(this.state.nameSpace == null || this.state.nameSpace === '' ||this.state.metricName == null || this.state.metricName === '' || this.state.chartName == null || this.state.chartName === '' ||
                this.state.typeOfDimension == null ||  this.state.typeOfDimension === '' || this.state.idValue == null || this.state.idValue === '' ||this.state.startTime === ' ' ||
                    this.state.endTime === ' ' || (color == null || this.state.colorSelected === ' ')){
    
                        this.setState({isAllFieldFilled:false});
            }
            if(this.state.nameSpace != null && this.state.nameSpace !== '' && this.state.metricName != null && this.state.metricName !== '' && this.state.chartName != null && this.state.chartName !== '' &&
                    this.state.typeOfDimension != null && this.state.typeOfDimension !== '' &&this.state.idValue != null && this.state.idValue !== '' && this.state.startTime !== ' ' &&
                    this.state.endTime !== ' ' && (color != null || this.state.colorSelected !== ' ')){

                        this.setState({isAllFieldFilled:true});
               
            }
        }
      
    }
    //Dropdown helper
    readSelection(e){
      this.setState({endTime : new Date()})
      if(e.target.value === "Last 15 Minutes"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes()-15),
                        period : 60,
                        xAxisRange: 900000,
                        xAxisSelection: 'Last 15 Minutes'});
      }
      if(e.target.value === "Last Hour"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes()),
                         period : 120,
                         xAxisSelection : 'Last Hour',
                         xAxisRange: 3600000});
        
      }
      if(e.target.value === "Last Two Hours"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-2,currentDate.getMinutes()),
                         period : 120,
                         xAxisSelection : 'Last Two Hours',
                         xAxisRange: 7200000})
      }
      if(e.target.value === "Last Day"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()),
                         period : 120,
                         xAxisSelection : 'Last Day',
                         xAxisRange: 86400000})
      }
      this.checkAllFilled();
  }

  changeColor = (color) =>{
    this.setState({colorSelected : color.hex});
    console.log(this.state.colorSelected);
    this.checkAllFilled(color);

}

  update(e,i){
      e.preventDefault();
      this.setState({namespaceNotSelected:false})
      value[i] = e.target.value;
      if(value.length > 5){
          value = [];
      }
      this.setState({nameSpace : value[0]});
      this.setState({chartName : value[1]});
      this.setState({metricName : value[2]});
      this.setState({typeOfDimension : value[3]});
      this.setState({idValue : value[4]});

      this.checkAllFilled();
  }

 onDateRangeSelection = (startTime, endTime) => {

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

    render() {
        let start = new Date(parseInt(this.state.startTime));
        let end = new Date(parseInt(this.state.endTime));
        let startTime = start.toGMTString();
        let endTime = end.toGMTString();
       // let startTime = new Date(new Date(this.state.startTime).getTime()+86400000);
        let timeSelection;
        if(this.state.isRealTime === true ){
            timeSelection = 
             <div>            
            <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>X Axis Time Range</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.readSelection(e)}
            defaultValue = {this.props.graphInfor==null?null:this.props.graphInfor.xAxisSelection}
            >
                {this.props.graphInfor==null?
                    <option disabled selected>Make Selection</option>
                    :null
                }
            <option value = "Last 15 Minutes">Last 15 Minutes</option>
            <option value = "Last Hour">Last Hour</option>
            <option value = "Last Two Hours">Last Two Hours</option>
            <option value = "Last Day">Last Day</option>
            </Form.Control>
            {
                this.state.xAxisRangeEmpty == null?
                <Form.Text className="text-muted">
                Select the time
                </Form.Text>
                :
                <Form.Text className="error-text">
                {this.state.xAxisRangeEmpty}
                </Form.Text>
            }
           
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect10">
            <Form.Label>Refresh Rate</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.refreshGraph(e)}
            defaultValue = {this.props.graphInfor==null?null:this.props.graphInfor.refreshRateSelection}>
            {this.props.graphInfor==null?
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
        else if(this.state.isRealTime === false){
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
                        <ModalHeader toggle={this.toggleForm}>{this.props.graphInfor == null ? 'New Chart Form':'Modify Chart Form'}</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a chart.
                                <form>                                
                                {this.props.graphInfor == null ?
                                <Form.Group>
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
                            </Form.Group> : null}
                            {this.props.graphInfor == null?
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Name Space: </Form.Label>
                                         <Form.Control type="text" placeholder="Ex. AWS/EC2" onChange = {(e) => this.update(e,0)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.nameSpace:"" }/>
                                            <Form.Text className="text-muted">
                                            specify the name space such as AWS/EC2...
                                            </Form.Text>
                                    </Form.Group> : null}

                            
                                    <Form.Group controlId="chartName">
                                        <Form.Label>Chart Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,1)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.chartName:""}/>
                                            <Form.Text className="text-muted">
                                            specify the chart name that you want...
                                            </Form.Text>
                                    </Form.Group>

                                    {this.props.graphInfor == null?
                                    <Form.Group controlId="metricName">
                                        <Form.Label>Metric Name: </Form.Label> 
                                         <Form.Control type="text" placeholder="Ex. CPUUtilization" onChange = {(e) => this.update(e,2)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.metricName:""}/>
                                            <Form.Text className="text-muted">
                                            specify the metric name that you want such as CPUUtilization...
                                            </Form.Text> 
                                        
                                     </Form.Group>:null} 
                                    
                                     {this.props.graphInfor == null?
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension Name: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. InstanceId" onChange = {(e) => this.update(e,3)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.typeOfDimension:""}/>
                                                 <Form.Text className="text-muted">
                                                Dimension name Ex.InstanceId...
                                                </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Dimension Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Ex. i-123456hf78kp9lxc0 " onChange = {(e) => this.update(e,4)} defaultValue={this.props.graphInfor!=null?this.props.graphInfor.idValue:""}/>
                                                 <Form.Text className="text-muted">
                                                 Dimension value Ex.i-123456hf78kp9lxc0 
                                                 </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form> : null}

                                    {timeSelection}
                                    <br/>
                                    <Form.Label className = 'center'>Graph Color</Form.Label>
                                     <span className = 'center' style = {{fontSize:'small'}}>Color Selected: {this.state.colorSelected}</span>
                                    <Form.Group className = 'center' controlId="exampleForm.ControlSelect3">
                                       <SketchPicker
                                       color = {this.state.colorSelected}
                                       onChange = {this.changeColor}
                                       />
                                    </Form.Group>
        
                                   
                              
                                </form>
                            </ModalBody>
                            <ModalFooter>   
                                <Link to={
                                        {pathname:'/dashboard',  
                                         state:{ 
                                            newGraph:{
                                                id:this.props.selectedGraphId!=null?this.props.selectedGraphId:"",
                                                objectType:"graph", // options: graph or table
                                                graphSettings: {
                                                    type:this.props.graphInfor!=null? this.props.graphInfor.type: this.props.whatever, //options: line, pie, or bar
                                                    realTime:this.state.isRealTime, //options: true or false
                                                    metricName : this.state.metricName!=null ? this.state.metricName: (this.props.graphInfor!=null?this.props.graphInfor.metricName:""),
                                                    nameSpace:this.state.nameSpace!=null ? this.state.nameSpace: (this.props.graphInfor!=null?this.props.graphInfor.nameSpace:""),
                                                    chartName:this.state.chartName!=null? this.state.chartName: (this.props.graphInfor!=null?this.props.graphInfor.chartName:""),
                                                    typeOfDimension:this.state.typeOfDimension!=null? this.state.typeOfDimension: (this.props.graphInfor!=null?this.props.graphInfor.typeOfDimension:""),
                                                    idValue:this.state.idValue!=null? this.state.idValue: (this.props.graphInfor!=null?this.props.graphInfor.idValue:""),
                                                    refreshRate: this.state.refreshRate!=null?this.state.refreshRate:(this.props.graphInfor!=null?this.props.graphInfor.refreshRate:""),
                                                    colorSelected:this.state.colorSelected,
                                                    period:this.state.period!=null?this.state.period:(this.props.graphInfor!=null?this.props.graphInfor.period:""),
                                                    startTime:this.state.startTime, //if needed
                                                    endTime:this.state.endTime, //if needed
                                                    xAxisRange : this.state.xAxisRange!=null? this.state.xAxisRange:(this.props.graphInfor!=null?this.props.graphInfor.xAxisRange:""),
                                                    xAxisSelection: this.state.xAxisSelection,
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
                                            },
                                        }
                                }
                                }

                            > 
                               <Button color="primary" disabled = {this.state.isAllFieldFilled === false && this.props.graphInfor == null} onClick={this.toggleForm}>{this.props.graphInfor == null ? "Create Graph" : "Modify Graph"}</Button> 
                            </Link>                       
                                <Button color="secondary" onClick={this.toggleForm}>Cancel</Button>
                            </ModalFooter>
                           
                            </div>
               
    
        )
    }
}


export default connect()(graphForm);
