import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../../keys.json';
import { Card, CardBody, Collapse, Table } from 'reactstrap'

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();

class LogDetailData extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            prevLogs: [],
            nextLogs: [],
            currentPrevLogs:[],
            currentNextLogs: [],
            showInfo: true,
            showPrev: false,
            showNext: false,
            morePre: true,
            moreNext: true
        }
        this.handleClick = this.handleClick.bind(this);
        this.getPrevLogs = this.getPrevLogs.bind(this);
        this.getNextLogs = this.getNextLogs.bind(this);
        this.setDisplayArr = this.setDisplayArr.bind(this);
        this.addLogs = this.addLogs.bind(this);
    }

    componentDidMount(){
       this.getPrevLogs();
       this.getNextLogs();
    }

    getPrevLogs(range) {
        var params = {
            logGroupName: this.props.logGroupName, /* required */
            endTime: this.props.log.timestamp + 1 ,
            limit: 100
            // startTime: this.props.log.timestamp - range
          };
        cloudwatchlogs.filterLogEvents(params, function(err, data) {
            if(err){
                console.log(err, err.stack); // an error occurred
            }else{ 
                this.setState({prevLogs: data.events.reverse()})
                let firstSet = this.setDisplayArr(this.state.prevLogs, 0) 
                this.setState({currentPrevLogs: firstSet})              
            }
        }.bind(this));
    }

    getNextLogs() {
        var params = {
            logGroupName: this.props.logGroupName, /* required */
            // endTime: this.props.log.timestamp + range,
            startTime: this.props.log.timestamp,
            limit: 100
          };
        cloudwatchlogs.filterLogEvents(params, function(err, data) {
            if(err){
                console.log(err, err.stack); // an error occurred
            }else{ 
                this.setState({nextLogs: data.events}) 
                let firstSet = this.setDisplayArr(this.state.nextLogs,1) 
                this.setState({currentNextLogs: firstSet})           
            }
        }.bind(this));
    }

    handleClick(id) {
       if(id === 0){
        this.setState({showInfo : !this.state.showInfo})
       }else if(id == 1){
        this.setState({showPrev: !this.state.showPrev})
       }else if(id == 2){
        this.setState({showNext: !this.state.showNext})
       }
    }

    setDisplayArr(arr, id){
        let count = 0;
        let ans = [];

        if(arr.length < 25){
            ans = [...ans, ...arr]
            arr = []
        }else{
            while(count < 25){
                ans.push(arr[0]);
                arr.splice(0,1);
                count++;
            }
        }

        if(id === 0){
            this.setState({prevLogs: arr})
        }else{
            this.setState({nextLogs: arr})
        }
        return ans
    }

    addLogs(id){
        if(id === 0){
            let newArr = this.setDisplayArr(this.state.prevLogs, id)
            let check = true
            if(this.state.prevLogs.length === 0){
                check = false
            }
            this.setState({currentPrevLogs : [...this.state.currentPrevLogs, ...newArr], morePre: check})
        }else{
            let newArr = this.setDisplayArr(this.state.nextLogs, id)
            let check = true
            if(this.state.nextLogs.length === 0){
                check = false
            }
            this.setState({currentNextLogs : [...this.state.currentNextLogs, ...newArr], moreNext: check})
        }
    }

    render() {
        const prev = this.state.currentPrevLogs.map((item, i) => {
            var t = new Date(parseInt(item.timestamp));
            let time = t.toGMTString();
            return(
                <tr>
                    <td> > </td>
                    <td>{time}</td>
                    <td>{item.message}</td>
                </tr>
            )
        })

         const next = this.state.currentNextLogs.map((item,i) => {
            var t = new Date(parseInt(item.timestamp));
            let time = t.toGMTString();
            return(
                <tr>
                    <td> > </td>
                    <td>{time}</td>
                    <td>{item.message}</td>
                </tr>
            )
        })

        return(
            <div>
                <Card className="log_details_box"> 
                    <div style={{display:"flex"}}>
                        <i onClick={() => this.props.goBack(0)} className="mdi mdi-arrow-left-bold-circle"></i>
                        <h2>{this.props.log.logStreamName}</h2>
                    </div>
                    <CardBody>
                    <div>
                        <h3 onClick={() => this.handleClick(0)}><i id="arrow0" className={this.state.showInfo ?'mdi mdi-menu-right down' : 'mdi mdi-menu-right' }></i>Current Log Details:</h3>
                        <Collapse isOpen={this.state.showInfo} id="0">
                            <h4>Log Stream Name:</h4>
                            <p>{this.props.log.logStreamName}</p>
                            <h4>Time Stamp:</h4>
                            <p>{this.props.log.timestamp}</p>
                            <h4>Ingestion Time:</h4>
                            <p>{this.props.log.ingestionTime}</p>
                            <h4>Event ID:</h4>
                            <p>{this.props.log.eventId}</p>
                            <h4>Message:</h4>
                            <p>{this.props.log.message}</p>
                        </Collapse>
                    </div>
                    <div>
                        <h3 onClick={() => this.handleClick(1)}><i id="arrow1" className={this.state.showPrev ? 'mdi mdi-menu-right down' : 'mdi mdi-menu-right'}></i>Previous Logs:</h3>
                        <Collapse isOpen={this.state.showPrev} id="1">
                            <Table striped>
                                <tbody>
                                    {prev}
                                </tbody>
                            </Table>
                            <div onClick={() => this.addLogs(0)}>{this.state.morePre ? "Show more" : "No more items to display"}</div>
                        </Collapse>
                    </div>
                    <div>
                        <h3 onClick={() => this.handleClick(2)}><i id="arrow2" className={this.state.showNext ? 'mdi mdi-menu-right down' : "mdi mdi-menu-right"}></i>Logs After:</h3>
                        <Collapse isOpen={this.state.showNext} id="2" >
                            <Table striped>
                                <tbody>
                                    {next}
                                </tbody>
                            </Table>
                            <div onClick={() => this.addLogs(1)}>{this.state.moreNext ? "Show more" : "No more items to display"}</div>
                        </Collapse>
                    </div>
                    </CardBody>
                </Card>
            </div> 
            
        )
    }
}

export default LogDetailData;