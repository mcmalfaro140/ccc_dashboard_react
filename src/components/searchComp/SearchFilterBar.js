import React from 'react'
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom'
import { Button, Card, CardBody, Label, Input, Row, Col,  Modal, ModalHeader, ModalFooter, CustomInput} from 'reactstrap';
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
            dropDownOpen: false,
            keyword: "",
            range:"",
            isFilterbyName: false,
            logGroupNames: [],
            filterNames: [],
            filter:[],
            isOpen: true

        }
        this.openCalendar = this.openCalendar.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.activateList = this.activateList.bind(this);
        this.hideBox = this.hideBox.bind(this);
    }

    componentDidMount(){
        this.setState({
            keyword: this.props.search_keyword,
            range: this.props.range,
            isFilterbyName: this.props.isFilterbyName,
            logGroupNames: this.props.logGroupNames,
            filterNames: this.props.filterNames
        })

        if(this.props.isFilterbyName && this.props.filterNames.length > 0){
            let resultData = {
                logGroupName: "",
                checked: false,
            }
            this.props.logGroupNames.map((ele, i)=> {
                var new_data = Object.create(resultData);  
                    new_data.logGroupName = ele;
                    new_data.checked = this.props.filterNames.includes(ele)
                    this.setState(prevState => ({
                        filter : [...prevState.filter, new_data]
                    }));
            })
        }
        this.handleColorChange(this.props.id);
    }

    handleCheck(checkIndex){
        let tempArr = this.state.filter;
        let tempFilter = []
        tempArr[checkIndex].checked = !tempArr[checkIndex].checked
        tempArr.map((e,i)=> {
            if(e.checked === true){
                tempFilter.push(e.logGroupName)
            }
        })
        this.setState({ filter: tempArr, filterNames: tempFilter})
    }

    handleInputChange(event) {
        this.setState({keyword: event.target.value});
    }

    activateList(){
        this.setState({isFilterbyName: !this.state.isFilterbyName, filterNames: []})
        this.hideBox()
    }

    hideBox(){
        let ele = document.getElementById("logNamesDiv");
        let eleSwitch = document.getElementById("logGroupSwitch");
        if(eleSwitch.checked === true){
            if(this.state.filter.length === 0){
                this.state.logGroupNames.map((ele, i)=> {
                    let resultData = {
                        logGroupName: "",
                        checked: false,
                    }
                    var new_data = Object.create(resultData);  
                        new_data.logGroupName = ele;
                        this.setState(prevState => ({
                            filter : [...prevState.filter, new_data]
                        }));
                })
            }
            ele.style.display = "block"
        }else{
            ele.style.display = "none"
        }
    }

    openCalendar() {
        this.setState({dropDownOpen: !this.state.dropDownOpen})
    }

    onChange = (startDate, endDate) => this.setState({ startDate, endDate });

    handleColorChange(id) {
        let prevElem = document.getElementById(this.state.prevId);
        let newElem = document.getElementById(id);
        ReactDOM.findDOMNode(prevElem).style.color = "rgba(56, 56, 56, 0.596)";
        ReactDOM.findDOMNode(prevElem).style.borderBlockEnd = "none";
        ReactDOM.findDOMNode(newElem).style.color = "red";
        ReactDOM.findDOMNode(newElem).style.borderBlockEnd = "red solid 1px";

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
            this.openCalendar()
        }

        this.setState({prevId: id})

    }

    render(){
        const { startDate, endDate } = this.state;
        const names = [];
        for (let i = 0 ; i < this.state.filter.length; i++){
            if(i % 2 !== 0){
                names.push(<Row xs="2"><Col xs="6"><CustomInput key={i-1} type="checkbox" id={i-1} label={this.state.filter[i-1].logGroupName} checked={this.state.filter[i-1].checked} onChange={() => this.handleCheck(i-1)}/></Col><Col xs="6"><CustomInput key={i} type="checkbox" id={i} label={this.state.filter[i].logGroupName} checked={this.state.filter[i].checked} onChange={() => this.handleCheck(i)}/></Col></Row>)
            }else{
                if(i+1 === this.state.logGroupNames.length){
                    names.push(<Row xs="2"><Col xs="6" ><CustomInput key={i} type="checkbox" id={i} label={this.state.filter[i].logGroupName} checked={this.state.filter[i].checked} onChange={() => this.handleCheck(i)}/></Col></Row>)
                }
            }
        }
        return(
            <Card className="search_filter_bar">
                <CardBody>
                    <Row >
                        <Col>
                            <Label>New Search: </Label>
                            <Row>
                                <Col ><Input type="text" name="keyWord" id="keyWord" value={this.state.keyword} onChange={this.handleInputChange} /></Col>
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
                                <Col >
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
                                        <Button color="primary">Search</Button>
                                    </Link>
                                </Col>
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
                    <Row>
                        <Label><CustomInput type="switch" id="logGroupSwitch" name="logGroupSwitch" label="Filter by Log Group Name?" onChange={this.activateList} checked={this.state.isFilterbyName}/></Label>
                    </Row>
                    <Row>
                        <div id="logNamesDiv">
                            {names}
                        </div>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

export default SearchFilterBar;