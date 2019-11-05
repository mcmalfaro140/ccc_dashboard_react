import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
        this.submit = this.submit.bind(this);
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
       
           
        

        }
    
    
    }}

    readSelection(e){
      let newStartTime;
      let newPeriod;
      if(e.target.value==="6 hour"){
        newStartTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(),currentDate.getHours()-6,currentDate.getMinutes());
        newPeriod = 120;
      }
      else if(e.target.value === "Last Day"){
        newStartTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1,currentDate.getHours(),currentDate.getMinutes());
        newPeriod = 180;
      }
      else if(e.target.value === "Last Week"){
        newStartTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7,currentDate.getHours(),currentDate.getMinutes());
        newPeriod = 600;
      }
      else if(e.target.value === "Last Month"){
        newStartTime = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes());
        newPeriod = 2400;
      }

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


    

    render() {
      if(this.props.location.typeOfGraph === 'line'){
        str = "/lineGraph"
      }
      else if(this.props.location.typeOfGraph === 'bar'){
        str = "/barGraph"
      }

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
              
             

        <Form.Group controlId="chartName">
            <Form.Label>Chart Name: </Form.Label>
            <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,2)}/>
            <Form.Text className="text-muted">
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
    
        )
    }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    user: state.Auth.user
  }
}

export default connect()(graphForm);
