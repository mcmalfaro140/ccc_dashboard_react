import React from 'react'
import ReactDOM from 'react-dom';
import { Button, Card, CardBody, Label, Input, Row, Col,  Modal, ModalHeader, ModalFooter} from 'reactstrap';
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'

class SearchFilterBar extends React.Component {
    constructor(props){
        super(props);
        const date = new Date();
        const startDate = date.getTime();
        this.state = {
            startDate,
            endDate: new Date(startDate),
            prevId: "col-0",
            dropDownOpen: false
        }
        this.openCalendar = this.openCalendar.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    openCalendar() {
        this.setState({dropDownOpen: !this.state.dropDownOpen})
    }

    onChange = (startDate, endDate) => this.setState({ startDate, endDate });

    handleColorChange(id) {
        let prevElem = document.getElementById(this.state.prevId);
        let newElem = document.getElementById(id);

        ReactDOM.findDOMNode(newElem).style.color = "red";
        ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";
        ReactDOM.findDOMNode(prevElem).style.color = "rgba(56, 56, 56, 0.596)";
        ReactDOM.findDOMNode(prevElem).style.borderBlockEnd = "none";

        if(id === "col-5"){
            ReactDOM.findDOMNode(newElem).style.color = "red";
            ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";
            this.openCalendar()
        }

        this.setState({prevId: id})

    }

    render(){
        const { startDate, endDate } = this.state
        return(
            <Card className="search_filter_bar">
                <CardBody>
                    <Row >
                        <Col>
                            <Label>New Search: </Label>
                            <Row>
                                <Col ><Input type="text" name="keyWord" id="keyWord" placeholder="Enter a keyword" /></Col>
                            </Row>
                        </Col>
                        <Col>
                            <Label>Filters: </Label>
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
                                <Col id="col-5" onClick={() => this.handleColorChange("col-5")}> Custome </Col>
                                <Col ><Button color="primary">Search</Button></Col>
                            </Row>
                            <Modal isOpen={this.state.dropDownOpen} className="calendar_modal">
                                <ModalHeader >Select a Time Range:</ModalHeader>
                                <ReactLightCalendar startDate={startDate} endDate={endDate} onChange={this.onChange} range displayTime />
                                <ModalFooter>
                                    <Button color="primary" onClick={this.openCalendar} >Done</Button>{' '}
                                    <Button color="secondary" onClick={this.openCalendar}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

export default SearchFilterBar;