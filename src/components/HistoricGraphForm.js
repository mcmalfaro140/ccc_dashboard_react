import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';


var value = [];
class HistoricGraphForm extends Component {
    constructor() {
        super();
        this.update = this.update.bind(this);
        this.submit = this.submit.bind(this);
        this.readSelection = this.readSelection.bind(this);
        this.state = { 

       
            metricName : "",
            nameSpace : "",
            chartName : "",
            // accessKeyId : "",
            // secretAccessKey : "",
            instanceId : "",
            timeRange:"",
           // region : "",
            // startTime: new Date(),
            // endTime: new Date(),
        

        }
    
    
    }

    readSelection(e){

        this.setState({timeRange : e.target.value});
    }
    submit(e){
  
      
        e.preventDefault();
       
        this.props.history.push({
           // pathname: str,
            pathname: "/historicLineGraph",
            state: {metricName: this.state.metricName,
                nameSpace : this.state.nameSpace,
                chartName : this.state.chartName,
                // accessKeyId : this.state.accessKeyId,
                // secretAccessKey : this.state.secretAccessKey,
                instanceId : this.state.instanceId,
                timeRange : this.state.timeRange,
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

    render() {
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

                      
                      
                   <Form.Group controlId="nameSpace">
                       <Form.Label>Name Space: </Form.Label>
                       <Form.Control type="text" placeholder="Enter name space" onChange = {(e) => this.update(e,1)}/>
                        <Form.Text className="text-muted">
                       specify the name space ...
                       </Form.Text>
                   </Form.Group>

                     
                    
       
               <Form.Group controlId="chartName">
                   <Form.Label>Chart Name: </Form.Label>
                   <Form.Control type="text" placeholder="Enter chart name" onChange = {(e) => this.update(e,2)}/>
                   <Form.Text className="text-muted">
                     specify the chart name that you want...
                   </Form.Text>
               </Form.Group>
  
                 
                      
                 
                      
               <Form.Group controlId="instanceId">
                       <Form.Label>Instance ID: </Form.Label>
                        <Form.Control type="text" placeholder="Enter instance id" onChange = {(e) => this.update(e,3)} />
                       <Form.Text className="text-muted">
                         Enter your instance id
                    </Form.Text>
               </Form.Group>
           
                 
               <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Time Range</Form.Label>
                    <Form.Control as="select" 
                   
                     onChange={this.readSelection}>
                    <option disabled selected>Make Selection</option>
                    <option value = "Last Hour">Last Hour</option>
                    <option value = "Last Day">Last Day</option>
                    <option value = "Last Week">Last Week</option>
                    <option value = "Last Month">Last Month</option>
                    </Form.Control>
                </Form.Group>
               
              
       
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
           </div>
        )
    }
}

export default HistoricGraphForm;