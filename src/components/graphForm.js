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
            instanceId : "",


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
                instanceId : this.state.instanceId,

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
        this.setState({instanceId : value[3]});


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


                  <Button variant = "primary" type="submit"

                 >Done</Button>



                </form>

                </div>

        )
    }
}

export default graphForm;
