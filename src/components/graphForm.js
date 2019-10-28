import React, { Component } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';


/**
 * Renders the preloader
 */

 var value = [];
 var str= "";
class graphForm extends Component {

    constructor() {
        super();
        this.update = this.update.bind(this);
        this.submit = this.submit.bind(this);
        this.state = { 

       
            metricName : "",
            nameSpace : "",
            chartName : "",
            // accessKeyId : "",
            // secretAccessKey : "",
            instanceId : "",
           // region : "",
            // startTime: new Date(),
            // endTime: new Date(),
        

        }
    
    
    }

    submit(e){
  
      
        e.preventDefault();
       
        this.props.history.push({
           // pathname: str,
            pathname: "/lineGraph",
            state: {metricName: this.state.metricName,
                nameSpace : this.state.nameSpace,
                chartName : this.state.chartName,
                // accessKeyId : this.state.accessKeyId,
                // secretAccessKey : this.state.secretAccessKey,
                instanceId : this.state.instanceId,
                //region : this.state.region,
                // startTime : this.state.startTime,
                // endTime : this.state.endTime


            
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
        this.setState({metricName : value[0]});
        this.setState({nameSpace : value[1]});
        this.setState({chartName : value[2]});
        // this.setState({accessKeyId : value[3]});
        // this.setState({secretAccessKey : value[4]});
        this.setState({instanceId : value[3]});
        //this.setState({region : value[6]});
        // this.setState({startTime : value[7]});
        // this.setState({endTime : value[8]});

      

    }
    handleChangeForStart = date => {
        this.setState({
          startTime: date
        });
        console.log(this.state.startTime)
      };
      handleChangeForEnd = date => {
        this.setState({
          endTime: date
        });
        console.log(this.state.endTime)
      };


    

    render() {
      // if(this.props.location.typeOfGraph === 'Line'){
      //   str = "/lineGraph"
      // }
      // else if(this.props.location.typeOfGraph === 'Bar'){
      //   str = "/barGraph"
      // }

      console.log("the str is " + str);
      
        return (

       <div>
           
    <form onSubmit = {this.submit} > 
               
 
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
          
                  <Button variant = "primary" type="submit"  
                
                 >Done</Button>

                 
                      
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
                </div>
    
        )
    }
}

export default graphForm;