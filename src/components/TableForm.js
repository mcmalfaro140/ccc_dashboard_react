import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import { Button,Form} from "react-bootstrap";

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
AWS.config.logger = console;
var cloudwatchlogs = new AWS.CloudWatchLogs();

class TableForm extends React.Component {

  constructor (props) {
    super();
    this.state = {
      params :{
          limit: '50'
      },

      streamParams :{
        logGroupName: '/aws/apigateway/trying'
        },

        endTime:'',
        startTime:'',
        temp: [],
        dataTemp: [],

        streamTemp: [],
        streamdataTemp: []

  };
    this.handleChange = this.handleChange.bind(this);

  }

componentWillMount(){

  this.getLogGroupName();
  this.getLogStreamName();

}


handleChange (evt) {

    this.setState({ [evt.target.streamParams.logGroupName]: evt.target.value });

}

getLogGroupName =  () => {



  cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
            console.log(data);
            this.setState({temp : data.logGroups});
            console.log(this.state.temp);


        for (var i = 0; i < this.state.temp.length; i++) {

            this.setState(prevState => ({
              dataTemp : [...prevState.dataTemp, this.state.temp[i].logGroupName]
            }));
    }
    console.log(this.state.dataTemp);


          };        // successful response
        }.bind(this));

  };
  getLogStreamName =  () => {

    cloudwatchlogs.describeLogStreams(this.state.streamParams, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else  {
              console.log(data);
              this.setState({streamTemp : data.logStreams});
              console.log(this.state.streamTemp);


        for (var i = 0; i < this.state.streamTemp.length; i++) {

              this.setState(prevState => ({
                streamdataTemp : [...prevState.streamdataTemp, this.state.streamTemp[i].logStreamName]
              }));
        }
        console.log(this.state.streamdataTemp);

      };        // successful response
    }.bind(this));

};


createSelectItems() {
     let items = [];
     for (let i = 0; i <= this.state.dataTemp; i++) {
          items.push(<option key={i} value={i}>{i}</option>);
     }
     return items;
 }

onDropdownSelected(e) {
    console.log("The selected log group name is ", e.target.value);
//    this.setState({streamParams:{logGroupName : e.target.value}});

}

render () {

  let obj = {
      array: this.state.dataTemp
  };
  let optionItems = obj.array.map((item) =>
      <option key={item} >{item}</option>
  );

    return (
      <div>
            <div className="row">
                <div className="col-2 text-left">
                    <label>Select the log group name</label>
                </div>
                <div className="col-4 text-left">
                    <select onChange={this.onDropdownSelected}>
                        {optionItems}
                    </select>
                </div>
            </div>
      </div>

    );
  }

}

export default TableForm;
