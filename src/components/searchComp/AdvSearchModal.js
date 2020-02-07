import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'
import { FormLabel, Row, Col } from 'react-bootstrap';


class AdvSearchModal extends React.Component {
    constructor(props){
        super(props);
        const date = new Date();
        const startDate = date.getTime();
        this.state = {
            startDate,
            endDate: new Date(startDate),
            prevId: "col-0"
        }
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    onChange = (startDate, endDate) => this.setState({ startDate, endDate });

    handleColorChange(id) {
        let prevElem = document.getElementById(this.state.prevId);
        let newElem = document.getElementById(id);
        let element = document.getElementById("calendar_form");

        ReactDOM.findDOMNode(newElem).style.color = "red";
        ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";
        ReactDOM.findDOMNode(prevElem).style.color = "#24242496";
        ReactDOM.findDOMNode(prevElem).style.borderBlockEnd = "none";

        if(id === "col-5"){
            if(ReactDOM.findDOMNode(element).style.display === "none"){
                ReactDOM.findDOMNode(element).style.display = "block";
            }else{
                ReactDOM.findDOMNode(element).style.display = "none";
            }
        }else{
            ReactDOM.findDOMNode(element).style.display = "none";
        }

        this.setState({prevId: id})

    }

    render(){
        const { startDate, endDate } = this.state
        var start = new Date(parseInt(startDate));
        var end = new Date(parseInt(endDate));
        let startTime = start.toGMTString();
        let endTime = end.toGMTString();
        return(
            <div className="search_modal">
                <ModalHeader >Advanced Log Search</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Input type="text" name="keyWord" id="keyWord" placeholder="Enter a keyword" />
                        </FormGroup>
                        <FormGroup>
                            <Label>Filter by Time: </Label>
                            <Row>
                                <Col id="col-0" onClick={() => this.handleColorChange("col-0")}>
                                    All
                                </Col>
                                <Col id="col-1" onClick={() => this.handleColorChange("col-1")}>
                                    1h
                                </Col>
                                <Col id="col-2" onClick={() => this.handleColorChange("col-2")}>
                                    6h
                                </Col>
                                <Col id="col-3" onClick={() => this.handleColorChange("col-3")}>
                                    1d
                                </Col>
                                <Col id="col-4" onClick={() => this.handleColorChange("col-4")}>
                                    1w
                                </Col>
                                <Col id="col-5" onClick={() => this.handleColorChange("col-5")}>
                                    Custome
                                </Col>
                            </Row>
                        </FormGroup>
                        <div id="calendar_form">
                            <FormGroup>
                                <Row>
                                    <Col>
                                        <Label>Start Time:</Label>
                                        <FormText>{startTime}</FormText>
                                    </Col>
                                    <Col>
                                        <Label>End Time:</Label>
                                        <FormText>{endTime}</FormText>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <ReactLightCalendar startDate={startDate} endDate={endDate} onChange={this.onChange} range displayTime /> 
                            </FormGroup>
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.toggle}>Search</Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </div>
        )
    }
}

export default AdvSearchModal;