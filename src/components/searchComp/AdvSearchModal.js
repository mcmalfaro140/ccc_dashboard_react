import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, CustomInput } from 'reactstrap';
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AWS from 'aws-sdk';
import mykey from '../../keys.json';

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();



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
            range: "all",
            params : {},
            logGroupNames : [],
            filterNames : [],
            isFilterbyName: false
        }
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getLogGroupName = this.getLogGroupName.bind(this);
        this.activateList = this.activateList.bind(this);
        this.addName = this.addName.bind(this);
    }

    getLogGroupName(){
        cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
            if (err){
                console.log(err, err.stack); // an error occurred
            }else  {
                let temp = data.logGroups;
                for (var i = 0; i < temp.length; i++) {
                    this.setState(prevState => ({
                        logGroupNames : [...prevState.logGroupNames, temp[i].logGroupName]
                    }));
                }
            }
        }.bind(this))
    }

    componentDidMount(){
        this.getLogGroupName();
        document.getElementById("log_search_form").onkeypress = function(e) {
            var key = e.charCode || e.keyCode || 0;     
            if (key === 13) {
              e.preventDefault();
            }
        }
    }

    activateList(){
        let element = document.getElementById("logGroupNamesDiv");
        if(ReactDOM.findDOMNode(element).style.display !== "none"){
            ReactDOM.findDOMNode(element).style.display = "none"
            this.setState({isFilterbyName: false})
        }else{
            ReactDOM.findDOMNode(element).style.display = "block"
            this.setState({isFilterbyName: true})
        }
    }

    addName(str,id){
        let element = document.getElementById(id);
        
        if(element.checked === true){
            this.setState(prevState => ({
                filterNames : [...prevState.filterNames, str]
            }));
        }else{
            let temp = this.state.filterNames.splice(this.state.filterNames.indexOf(str), 1);
            this.setState({filterNames: temp})
        }
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
            this.setState({prevId: id, range: "1h", endDate: this.state.startDate - 3600000}) //3600000 sec in 1 hour
        }else if( id === "col-2"){
            this.setState({prevId: id,  range: "6h", endDate: this.state.startDate - 21600000})
        }else if( id === "col-3"){
            this.setState({prevId: id,  range: "1d", endDate: this.state.startDate - 86400000})
        }else if( id === "col-4"){
            this.setState({prevId: id, range: "1w", endDate: this.state.startDate - 604800000})
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
        const names = this.state.logGroupNames.map((item, index) => {
            return(
                <CustomInput type="checkbox" id={index} label={item} onChange={()=>this.addName(item,index)} key={index} />
            )
        })
        return(
            <div className="search_modal">
                <ModalHeader >Advanced Log Search</ModalHeader>
                <ModalBody>
                    <Form id="log_search_form"> 
                        <FormGroup>
                            <Input type="text" name="keyWord" id="keyWord" placeholder="Enter a keyword" value={this.state.keyword} onChange={this.handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label><CustomInput type="switch" id="logGroupSwitch" name="logGroupSwitch" label="Filter by Log Group Name?" onChange={this.activateList} /></Label>
                            <div id="logGroupNamesDiv" style={{display:'none'}}>
                                {names}
                            </div>
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
                                    Custom
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
                                endTime: this.state.endDate,
                                isFilterbyName: this.state.isFilterbyName,
                                logGroupNames : this.state.logGroupNames,
                                filterNames: this.state.filterNames,
                                id: this.state.prevId
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