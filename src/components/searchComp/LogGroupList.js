import React from 'react';
import { Card, CardBody, Table, Row, Col, Modal, ModalHeader, ModalFooter, Button } from 'reactstrap';
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'
import ReactDOM from 'react-dom';

class LogGroupList extends React.Component {
    constructor (props){
        super(props);
        const date = new Date();
        const startDate = date.getTime();
        this.state = {
            startDate,
            endDate: new Date(startDate),
            prevId: "c-0",
            open: false
        }
        this.calendar = this.calendar.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    calendar() {
        this.setState({open: !this.state.open})
    }

    onChange = (startDate, endDate) => this.setState({ startDate, endDate });

    handleChange(id) {
        let prevElem = document.getElementById(this.state.prevId);
        let newElem = document.getElementById(id);

        ReactDOM.findDOMNode(newElem).style.color = "red";
        ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";
        ReactDOM.findDOMNode(prevElem).style.color = "rgba(56, 56, 56, 0.596)";
        ReactDOM.findDOMNode(prevElem).style.borderBlockEnd = "none";

        if(id === "c-5"){
            ReactDOM.findDOMNode(newElem).style.color = "red";
            ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";
            this.calendar()
        }

        this.setState({prevId: id})

    }

    render(){
        const { startDate, endDate } = this.state
        const items = this.props.results.map((item, i) => {
            return(
                <tr className="row_results">
                    <th className="col_results" scope="row">{item.events.length} logs</th>
                    <td onClick={() => this.props.setId(i)}>{item.logGroupName}</td>
                </tr>
            )
        });

        return(
            <div>
                <Card className="card-box"> 
                    <div className="logGroupHeader">
                        <Row>
                            <Col><h5>Filters: </h5></Col>
                            <Col id="c-0" onClick={() => this.handleChange("c-0")} >
                                All
                            </Col>
                            <Col id="c-1" onClick={() => this.handleChange("c-1")} >
                                1h
                            </Col>
                            <Col id="c-2" onClick={() => this.handleChange("c-2")} >
                                6h
                            </Col>
                            <Col id="c-3" onClick={() => this.handleChange("c-3")} >
                                1d
                            </Col>
                            <Col id="c-4" onClick={() => this.handleChange("c-4")} >
                                1w
                            </Col>
                            <Col id="c-5" onClick={() => this.handleChange("c-5")}> Custome </Col>
                        </Row>
                        <Modal isOpen={this.state.open} className="calendar_modal">
                            <ModalHeader >Select a Time Range:</ModalHeader>
                            <ReactLightCalendar startDate={startDate} endDate={endDate} onChange={this.onChange} range displayTime />
                            <ModalFooter>
                                <Button color="primary" onClick={this.calendar} >Done</Button>{' '}
                                <Button color="secondary" onClick={this.calendar}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <CardBody>
                        <Table hover > 
                            <thead >
                                <tr className="table_header">
                                    <th ><h3>Found</h3></th>
                                    <th><h3>Log Group Names</h3></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default LogGroupList;