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


class TableFormPop extends Component {

    constructor(props) {
        super(props);
        this.state = { 
        }
    }
    render(){
        return(
            <div>
                <ModalHeader toggle={this.props.toggleForm}>New Table Form</ModalHeader>
                <ModalBody>
                    Please provide all the inputs to create a new Table.
                    <form>
                        <Form.Group>
                            <br/>
                            <Form.Label>Choose the log group/s: </Form.Label>
                        </Form.Group>
                    </form>
                </ModalBody>
            </div>
        )
    }

}

    
export default connect()(TableFormPop);
