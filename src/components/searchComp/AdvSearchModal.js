import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';



class AdvSearchModal extends React.Component {
    constructor(props){
        super(props);
        const date = new Date();
        const startDate = date.getTime();
        this.state = {
            startDate,
            endDate: new Date(startDate),
            prevId: "col-0",
            keyword: "",
            range: "all"
        }
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    onChange = (startDate, endDate) => this.setState({ startDate, endDate });

    handleInputChange(event) {
        this.setState({keyword: event.target.value});
      }

    handleColorChange(id) {
        let prevElem = document.getElementById(this.state.prevId);
        let newElem = document.getElementById(id);
        let element = document.getElementById("calendar_form");

        ReactDOM.findDOMNode(prevElem).style.color = "#24242496";
        ReactDOM.findDOMNode(prevElem).style.borderBlockEnd = "none";

        ReactDOM.findDOMNode(newElem).style.color = "red";
        ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";
        ReactDOM.findDOMNode(element).style.display = "none";

        if( id === "col-0"){
            this.setState({prevId: id, range: "all", startDate:"" , endDate:"" })
        }else if( id === "col-1"){
            this.setState({prevId: id, range: "1h", endDate: this.state.startDate - 3600}) //3600 sec in 1 hour
        }else if( id === "col-2"){
            this.setState({prevId: id, range: "6h", endDate: this.state.startDate - 21600})
        }else if( id === "col-3"){
            this.setState({prevId: id, range: "1d", endDate: this.state.startDate - 86400})
        }else if( id === "col-4"){
            this.setState({prevId: id, range: "1w", endDate: this.state.startDate - 604800})
        }else if( id === "col-5"){
            this.setState({prevId: id, range: "custom"})
            if(ReactDOM.findDOMNode(element).style.display === "none"){
                ReactDOM.findDOMNode(element).style.display = "block";
            }else{
                ReactDOM.findDOMNode(element).style.display = "none";
            }
        }

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
                            <Input type="text" name="keyWord" id="keyWord" placeholder="Enter a keyword" value={this.state.keyword} onChange={this.handleInputChange} />
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
                    <Link
                        to={{
                            pathname:'/search_results',
                            state:{
                                search_keyword: this.state.keyword,
                                range: this.state.range,
                                startTime: this.state.startDate,
                                endTime: this.state.endDate
                            }
                        }}
                    >
                    <Button color="primary" onClick={this.props.toggle}>Search</Button>{' '}
                    </Link>
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </div>
        )
    }
}

export default AdvSearchModal;