import React, { Component } from 'react';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Row, Col, CardBody } from 'reactstrap';
import { SketchPicker } from 'react-color'
import DateTimePicker from 'react-datetime-picker';
import Switch from "react-switch";
import '../assets/react-grid/styles.css'

// import DateTimePicker from 'react-datetime-picker';


/**
 * Renders the preloader
 */

 var value = [];
 var str= "";
 var currentDate = new Date();
class graphForm extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.submit = this.submit.bind(this);
<<<<<<< HEAD
        this.state = {
            newGraph:{
              objectType:"graph", // options: graph or table
              graphSettings: {
              type: str, //options: line, pie, or bar
              realTime:"false", //options: true or false
              metricName:"",
              nameSpace:"",
              chartName:"",
              instanceId:"",
              refreshRate:"",
              period:"",
              startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
              endTime:new Date() //if needed
              },



=======
        this.readSelection = this.readSelection.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.handleChangeForStart = this.handleChangeForStart.bind(this);
        this.handleChangeForEnd = this.handleChangeForEnd.bind(this);
        this.refreshGraph = this.refreshGraph.bind(this);
   
      
        this.state = { 
            newGraph:{
              mixGraph:{
                typeOfGraph:"",
                metricName:"", 
                nameSpace:"",
                chartName:"",
                typeOfDimension : "InstanceId",
                idValue:"",
                startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                period:120,
                endTime:new Date(),
                colorSelected:"",
    
                typeOfGraph1:"",
                metricName1:"", 
                nameSpace1:"",
                typeOfDimension1 : "InstanceId",
                idValue1:"",
                startTime1:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
                endTime1:new Date(),
                colorSelected1:"" 
            },
            showMenu: false,
            isRealTime: false,
            refreshRate:0,
            screenWidth: 0,
            whichNamespace: "",
            colorSelected:"",
            namespaceNotSelected : true,
            isCondensed: false,
            isFullScreen: false,
            modalOpen: false,
            mixModalOpen: false,
            metricName:"", 
            nameSpace:"",
            chartName:"",
            typeOfDimension : "InstanceId",
            idValue:"",
          //  startTime:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes()), //if needed
          startTime:"", 
          period:120,
            endTime:"" //if needed
              ,
       
           
        
>>>>>>> 6c5dfbfffc8cefe6f2ad0e112d35399909894ba1

        }


    }}

    refreshGraph(e){
       if(e.target.value === "Thirty Seconds"){
           this.setState({refreshRate : 30000})
       }
       if(e.target.value === "One minute"){
           this.setState({refreshRate : 60000 })
       }
       if(e.target.value === "Ten minutes"){
           this.setState({refreshRate : 600000})
       }
       if(e.target.value === "Half an hour"){
           this.setState({refreshRate : 1800000})
       }
    }

    toggleSwitch (isRealTime){
        console.log("is it real ? " + isRealTime)
        this.setState({isRealTime})
    }
    toggleForm = () => {
        this.setState({modalOpen : !this.state.modalOpen})
        // this.setState({whichNamespace : ""})
        this.setState({namespaceNotSelected : true})

};
    //Dropdown helper
    readSelection(e){
      this.setState({endTime : new Date()})
      if(e.target.value === "Last Hour"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-1,currentDate.getMinutes())})
          this.setState({period : 60})
      }
      if(e.target.value === "Last Day"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes())})
          this.setState({period : 120})
      }
      if(e.target.value === "Last Week"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes())})
          this.setState({period : 600})
      }
      if(e.target.value === "Last Month"){
          this.setState({startTime: new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes())})
          this.setState({period : 2400})
      }
  }

<<<<<<< HEAD
      this.setState(prevState => ({
        newGraph: {
          ...prevState.newGraph,
          graphSettings: {
            ...prevState.newGraph.graphSettings,
            startTime :  newStartTime,
            period : newPeriod
          }
        }
      }))
=======
  handleChangeComplete = (color) =>{
    this.setState({colorSelected : color.hex})


    if(this.state.isRealTime === false){
    var dateDiff = this.state.endTime.getTime() - this.state.startTime.getTime()
    var days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    console.log(days + " the date diff")
    console.log(this.state.startTime + " satart")
    console.log(this.state.endTime + "  end time")
    console.log(this.state.isRealTime + "real timmmm")
    if(days === 1){
        this.setState({period:540});
    }
    if(days >1 && days <5){
        this.setState({period: 900});
    }
    if(days > 5 && days < 25){
        this.setState({period: 1800});
    }
    if(days > 25 ){

        this.setState({period: 3600})
    }
}
    
}

    update(e,i){
      e.preventDefault();
      this.setState({namespaceNotSelected:false})
      value[i] = e.target.value;
      if(value.length > 5){
          value = [];
      }
    
      // this.setState({metricName : value[0]})
      // this.setState({nameSpace : value[1]});
      this.setState({nameSpace : value[0]});
      this.setState({chartName : value[1]});
      this.setState({metricName : value[2]});
      this.setState({typeOfDimension : value[3]});
      this.setState({idValue : value[4]});

      
>>>>>>> 6c5dfbfffc8cefe6f2ad0e112d35399909894ba1
  }


   
    submit(e){


        e.preventDefault();

        this.props.history.push({
           // pathname: str,
            pathname: "/Dashboard",
            state: {
                newGraph : this.state.newGraph,
                // metricName: this.state.metricName,
                // nameSpace : this.state.nameSpace,
                // chartName : this.state.chartName,
                // // accessKeyId : this.state.accessKeyId,
                // // secretAccessKey : this.state.secretAccessKey,
                // instanceId : this.state.instanceId,
                // //region : this.state.region,
                // // startTime : this.state.startTime,
                // // endTime : this.state.endTime



            }
        })


    }
  

<<<<<<< HEAD
    update(e,i){
        e.preventDefault();
       // console.log(e.target.value);

        value[i] = e.target.value;
        if(value.length > 4){
            value = [];
        }
        // var newGraph = {...this.state.newGraph};
        // newGraph["metricName"] = value[0];
        // newGraph["nameSpace"] = value[1];
        // newGraph["chartName"] = value[2];
        // newGraph["instanceId"] = value[3];
        // this.setState({newGraph : newGraph});
        this.setState(prevState => ({
          newGraph: {
            ...prevState.newGraph,
            graphSettings: {
              ...prevState.newGraph.graphSettings,
              metricName : value[0],
              nameSpace : value[1],
              chartName : value[2],
              instanceId : value[3]
            }
          }
        }))
        // this.setState({nameSpace : value[1]});
        // this.setState({chartName : value[2]});
        // this.setState({accessKeyId : value[3]});
        // this.setState({secretAccessKey : value[4]});
        // this.setState({instanceId : value[3]});
        //this.setState({region : value[6]});
        // this.setState({startTime : value[7]});
        // this.setState({endTime : value[8]});



    }
    // handleChangeForStart = date => {
    //     this.setState({
    //       startTime: date
    //     });
    //     console.log(this.state.startTime)
    //   };
      // handleChangeForEnd = date => {
      //   this.setState({
      //     endTime: date
      //   });
      //   console.log(this.state.endTime)
      // };



=======
 
     handleChangeForStart = date => {
        this.setState({
          startTime: date
        });
       
      };
      handleChangeForEnd = date => {
        this.setState({
          endTime: date
        });
      };

    
    
    
>>>>>>> 6c5dfbfffc8cefe6f2ad0e112d35399909894ba1

    render() {

<<<<<<< HEAD
      // console.log("the str is " + str);

        return (

          <React.Fragment>

    {/* <form onSubmit = {this.submit} >  */}
    <form>

        <Form.Group controlId="metricName">
            <Form.Label>Metric Name: </Form.Label>
            <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,0)}/>
            <Form.Text className="text-muted">
              specify the metric name that you want...
            </Form.Text>
        </Form.Group>
        {/* <LineGraph mName = {this.state.metricName}/> */}


            <Form.Group controlId="nameSpace">
                <Form.Label>Name Space: </Form.Label>
                <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,1)}/>
                 <Form.Text className="text-muted">
                specify the name space ...
                </Form.Text>
            </Form.Group>
            {/* <LineGraph nSpace = {this.state.nameSpace}/> */}


=======
        
        var timeSelection;
        if(this.state.isRealTime === true){
            timeSelection = 
         <div>
             
            <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Time Range</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.readSelection(e)}>
            <option disabled selected>Make Selection</option>
            <option value = "Last Hour">Last Hour</option>
            <option value = "Last Day">Last Day</option>
            <option value = "Last Week">Last Week</option>
            </Form.Control>
            <Form.Text className="text-muted">
                Select the time
                </Form.Text>
            </Form.Group>
>>>>>>> 6c5dfbfffc8cefe6f2ad0e112d35399909894ba1

            <Form.Group controlId="exampleForm.ControlSelect10">
            <Form.Label>Refresh Rate</Form.Label>
            <Form.Control as="select"  
            onChange={(e) => this.refreshGraph(e)}>
            <option disabled selected>Make Selection</option>
            <option value = "Thirty Seconds">Thirty Seconds</option>
            <option value = "One minute">One minute</option>
            <option value = "Ten minutes">Ten minutes</option>
            <option value = "Half an hour">Half an hour</option>
            
            </Form.Control>
            <Form.Text className="text-muted">
<<<<<<< HEAD
              specify the chart name that you want...
            </Form.Text>
        </Form.Group>
        {/* <LineGraph cName = {this.state.chartName}/> */}

                {/* <p>Refresh Rate: </p>
                <input
                  type='text'
                  // onMouseDown={this.stopPropagation}
                  // onTouchStart={this.stopPropagation}
                  name = "refreshRate"
                  // onChange = {(e) => this.update(e,3)}
                  // id = {this.state.ElementId}
                /> */}


         {/* <Form.Group controlId="accessKeyId">
                <Form.Label>Access Key ID: </Form.Label>
                 <Form.Control type="text" placeholder="Enter access key id" onChange = {(e) => this.update(e,3)}/>
                <Form.Text className="text-muted">
                  Enter your access key id
             </Form.Text>
        </Form.Group> */}
        {/* <LineGraph aId = {this.state.accessKeyId}/> */}


        {/* <Form.Group controlId="secretAccessKey">
                <Form.Label>Secret Access Key: </Form.Label>
                 <Form.Control type="text" placeholder="Enter secret access key" onChange = {(e) => this.update(e,4)}/>
                <Form.Text className="text-muted">
                  Enter your secret access key
             </Form.Text>
        </Form.Group> */}
        {/* <LineGraph sKey = {this.state.secretAccessKey}/> */}


        <Form.Group controlId="instanceId">
                <Form.Label>Instance ID: </Form.Label>
                 <Form.Control type="text" placeholder="Enter instance id" onChange = {(e) => this.update(e,3)} />
                <Form.Text className="text-muted">
                  Enter your instance id
             </Form.Text>
        </Form.Group>
        {/* <LineGraph iId = {this.state.instanceId}/> */}



        {/* <Form.Group controlId="region">
                <Form.Label>Region </Form.Label>
                 <Form.Control type="text" placeholder="Enter region" onChange = {(e) => this.update(e,6)}/>
                <Form.Text className="text-muted">
                  Enter the region of your instance
             </Form.Text>
        </Form.Group> */}
        {/* <LineGraph region = {this.state.region}/> */}

        {/* <Form.Group controlId="startTime">
                <Form.Label>Start Time:  </Form.Label>
                <DateTimePicker
          onChange = {this.handleChangeForStart}
          value = {this.state.startTime}
        />
        </Form.Group>

        <Form.Group controlId="endTime">
                <Form.Label>End Time:  </Form.Label>
                <DateTimePicker
          onChange = {this.handleChangeForEnd}
          value = {this.state.endTime}
        />
        </Form.Group>         */}

              <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Time Range</Form.Label>
                    <Form.Control as="select"
                     placeholder="select"
                     onChange={this.readSelection}>
                    <option value = "6 hour">Last 6 Hour</option>
                    <option value = "Last Day">Last Day</option>
                    <option value = "Last Week">Last Week</option>
                    <option value = "Last Month">Last Month</option>
                    </Form.Control>
                </Form.Group>

                  {/* <Button variant = "primary" type="submit"

                 ></Button> */}
                 <Button variant = "primary"><Link to={{pathname:'/dashboard', state:{ newGraph: this.state.newGraph}}}>Done..</Link></Button>




                </form>

                {/* <LineGraph
                metricName = {"max"}
                // nameSpace = {this.state.nameSpace}
                // chartName = {this.state.chartName}
                // accessKeyId = {this.state.accessKeyId}
                // secretAccessKey = {this.state.secretAccessKey}
                // instanceId = {this.state.instanceId}
                // region = {this.state.region}/>
/> */}

                </React.Fragment>

=======
                Select the refresh rate
                </Form.Text>
            </Form.Group>
         </div>
           
            
        }
        else{
            timeSelection = 
            <div>
            <Form>                        
            <Row>
                <Col>
                     <Form.Label>Start Time</Form.Label>
                        <DateTimePicker 
                            value={this.state.startTime}
                            onChange = {this.handleChangeForStart} />
                </Col>
                <Col>
                        <Form.Label>End Time</Form.Label>
                                <DateTimePicker 
                                    value={this.state.endTime}
                                    onChange = { this.handleChangeForEnd} />
                </Col>
            </Row>
            </Form>
           
            </div>
        }

      // console.log("the str is " + str);
      
        return (

         
                        <div>
                        <ModalHeader toggle={this.props.toggleForm}>New Chart Form</ModalHeader>
                            <ModalBody>
                                Please provide all the inputs to create a chart.
                                <form>
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
                                </Form.Group>


                                <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Name Space: </Form.Label>
                                         <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,0)}/>
                                        <Form.Text className="text-muted">
                                        specify the name space ...
                                        </Form.Text>
                                    </Form.Group>

                                

                                    <fieldset disabled={this.state.namespaceNotSelected}>
                                    <Form.Group controlId="chartName">
                                        <Form.Label>Chart Name: </Form.Label>
                                        <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,1)}/>
                                        <Form.Text className="text-muted">
                                        specify the chart name that you want...
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="metricName">
                                        <Form.Label>Metric Name: </Form.Label> 
                                         <Form.Control type="text" placeholder="Enter metric name" onChange = {(e) => this.update(e,2)}/>
                                        <Form.Text className="text-muted">
                                        specify the metric name that you want...
                                        </Form.Text> 
                                     </Form.Group> 
                                    
                                    <Form>
                                        <Row>
                                            <Col>
                                            <Form.Label>Dimension: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the dimension name" onChange = {(e) => this.update(e,3)} />
                                            <Form.Text className="text-muted">
                                            Enter the dimension 
                                            Ex.InstanceId
                                            </Form.Text>
                                            </Col>
                                            <Col>
                                            <Form.Label>Value: </Form.Label>
                                            <Form.Control type="text" placeholder="Enter the value" onChange = {(e) => this.update(e,4)} />
                                            <Form.Text className="text-muted">
                                            Enter the value
                                            </Form.Text>
                                            </Col>
                                        </Row>
                                    </Form>

                                    {timeSelection}
                                    {/* <Form>
                                    
                                    <Row>
                                        <Col>
                                             <Form.Label>Start Time</Form.Label>
                                                <DateTimePicker 
                                                    value={this.state.startTime}
                                                    onChange = {this.changeStartDate} />
                                        </Col>
                                        <Col>
                                                <Form.Label>End Time</Form.Label>
                                                        <DateTimePicker 
                                                            value={this.state.endTime}
                                                            onChange = {this.changeEndDate} />
                                        </Col>
                                    </Row>

                                    

                                    </Form>
                                    <Form.Group controlId="exampleForm.ControlSelect2">
                                        <Form.Label>Time Range</Form.Label>
                                        <Form.Control as="select"  
                                        onChange={(e) => this.readSelection(e)}>
                                        <option disabled selected>Make Selection</option>
                                        <option value = "Last Hour">Last Hour</option>
                                        <option value = "Last Day">Last Day</option>
                                        <option value = "Last Week">Last Week</option>
                                        <option value = "Last Month">Last Month</option>
                                        </Form.Control>
                                        <Form.Text className="text-muted">
                                            Select the time
                                            </Form.Text>
                                    </Form.Group> */}
                                    <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Graph Color</Form.Label>
                                       <SketchPicker
                                       color = {this.state.colorSelected}
                                       onChange = {this.handleChangeComplete}
                                       />
                                    </Form.Group>

                                    



                                    </fieldset>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newGraph:{
                                            objectType:"graph", // options: graph or table
                                            graphSettings: {
                                                type:this.props.whatever, //options: line, pie, or bar
                                                realTime:this.state.isRealTime, //options: true or false
                                                metricName:this.state.metricName, 
                                                nameSpace:this.state.nameSpace,
                                                chartName:this.state.chartName,
                                                typeOfDimension : this.state.typeOfDimension,
                                                idValue:this.state.idValue,
                                                refreshRate: this.state.refreshRate,
                                                colorSelected:this.state.colorSelected,
                                                period:this.state.period,
                                                startTime:this.state.startTime, //if needed
                                                endTime:this.state.endTime //if needed
                                            },
                                            coordinates: {
                                                x: 0,
                                                y: 0,
                                                w: 10,
                                                h: 9,
                                                minW: 6,
                                                minH: 9
                                            },
                                          
                                        }
                                    }
                                }}>
                                    <Button color="primary" onClick={this.props.toggleForm}>Create graph</Button>
                                </Link>
                                <Button color="secondary" onClick={this.props.toggleForm}>Cancel</Button>
                            </ModalFooter>
                           
                            </div>
               
    
>>>>>>> 6c5dfbfffc8cefe6f2ad0e112d35399909894ba1
        )
    }
}


export default connect()(graphForm);
