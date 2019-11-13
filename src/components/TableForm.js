import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import NewTable from './NewTable.js';


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
AWS.config.logger = console;
var cloudwatchlogs = new AWS.CloudWatchLogs();
var currentDate = new Date();

class TableForm extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      params :{
          limit: '50',
          
        },
      queryparams : {
        endTime: Math.round((currentDate.getTime() / 1000)),
        queryString: "fields @message | filter @message like /(?i)error/", 
        startTime: Math.round((currentDate.getTime() / 10000)) - 1  , 
        limit:1000,
       // logGroupName:this.props.logGroupName
      logGroupNames:props.logGroupNames
      },
      
   params_Query:{
     queryId:props.queryId
   },
   arr:[],
   timer:"",

        temp: [],
        dataTemp: [],

        tableData:[{
          loggroupname: [],
           recordsMatched:[],
           recordsScanned:[],
          errorPercentage:[]
      }]

  };
  this.getLogGroupName();
  }

 
componentDidMount(){

console.log("component did mount, displaying current state loggroupname " + this.state.queryparams.logGroupName);
this.getQueryId();
this.getqueryRes();
for (var i = 0; i < this.state.dataTemp; i++){

}
}
shouldComponentUpdate(nextProps,nextState){
  
   if(nextState.queryparams.logGroupNames !== this.state.queryparams.logGroupName){
    console.log("should component update "  + nextState.queryparams.logGroupName)
    setTimeout(console.log(this.state.dataTemp.length),10000);
    console.log("should component update, displaying current state query string " + this.state.queryparams.queryString);
    console.log("should component update, displaying the current state "  + this.state.queryparams.logGroupName)

    return true;
   }
   return true
}
componentWillUpdate(nextProps,nextState){
  if(nextState.queryparams.logGroupName !== this.state.queryparams.logGroupName){
    console.log("component will update "  + nextState.queryparams.logGroupName)
    return true;
   }
}
componentDidUpdate(nextProps, nextState){
 
console.log("component did update, displaying current state loggroupname " + this.state.queryparams.logGroupName);
this.getQueryId()

return true;
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

    // for (var i = 0; i < this.state.dataTemp.length; i++) {

      this.setState({
        queryparams: {                   
            logGroupNames: this.state.dataTemp,
            queryString:this.state.queryparams.queryString,
            endTime:this.state.queryparams.endTime,
            startTime:this.state.queryparams.startTime
      }})
    //}


          };  
        }.bind(this));


};


getQueryId =  () => {

  setTimeout(()=> cloudwatchlogs.startQuery(this.state.queryparams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else  {
      console.log(data);

    this.setState({
      params_Query: {                   // object that we want to update
            // keep all other key-value pairs
          queryId: data.queryId      // update the value of specific key
         
      }
  })
  console.log(this.state.params_Query.queryId)
}
}.bind(this)),2000);

};

getqueryRes = () => {
setTimeout(()=> cloudwatchlogs.getQueryResults(this.state.params_Query, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else  {
    
    console.log(data); 
    this.setState({arr: data.results})   

  }
  }.bind(this)),5000);

};


render () {
    return (
      <div>

            {/* <NewTable loggroupnames = {this.state.queryparams.logGroupNames}
                      
                
                
            ></NewTable> */}
      </div>
     
      
    );
  }

}

export default TableForm;




// <div className="row">
// <div className="col-2 text-left">
//     <label>Select the log group name</label>
// </div>
// <div className="col-4 text-left">
//     <select onChange={this.onDropdownSelected}>
//         {optionItems}
//     </select>
// </div>
// </div>

// createSelectItems() {
//   let items = [];
//   for (let i = 0; i <= this.state.dataTemp; i++) {
//        items.push(<option key={i} value={i}>{i}</option>);
//   }
//   return items;
// }

// onDropdownSelected(e) {
//  console.log("The selected log group name is ", e.target.value);

// }

// let obj = {
//   array: this.state.dataTemp
// };
// let optionItems = obj.array.map((item) =>
//   <option key={item} >{item}</option>
// );