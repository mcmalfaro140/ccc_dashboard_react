
import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import NewTable from './NewTable.js';


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
//AWS.config.logger = console;
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
        queryString: "fields @message | filter @message like /(?i)info/",
        startTime: Math.round((currentDate.getTime() / 40000)) - 1  ,
        limit:1000,
      logGroupNames:props.logGroupNames
      },
      params_Query:{
        queryId:props.queryId
      },
      //Misael's new variables
      test: this.test.bind(this),
      helper: this.helper.bind(this),
      setIds: this.setIds.bind(this),
      getID: this.getID.bind(this),
      stopQuery: this.stopQuery.bind(this),
      idArray:[],

      /*--------------------------- */
      getResults: this.getResults.bind(this),
      setQueryResults: this.setQueryResults.bind(this),
      resultHelper: this.resultHelper.bind(this),
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
      //constructor calls to get the log group names
      this.getLogGroupName();
    }


getLogGroupName =  () => {

  cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
                //console.log(data);
                this.setState({temp : data.logGroups});


                for (var i = 0; i < this.state.temp.length; i++) {

                    this.setState(prevState => ({
                      dataTemp : [...prevState.dataTemp, this.state.temp[i].logGroupName]
                    }));
                  }
                  console.log(this.state.dataTemp);


                    this.setState({
                      queryparams: {
                          logGroupNames: this.state.dataTemp,
                          queryString:this.state.queryparams.queryString,
                          endTime:this.state.queryparams.endTime,
                          startTime:this.state.queryparams.startTime
                    }})


                };
  }.bind(this));


};



test = () =>{

  let count = 0
  let res = []
  let temp = []

//Get four group names and four query setIds
//store them in a varibale to get the results innerWidth
//Getquery results

  setTimeout(async() => {

 for (var i =0 ; i < 4 ; i++) {

        temp = await this.state.getID(this.state.dataTemp[i])

        await this.state.setIds(temp.queryId)
        await console.log(this.state.idArray)


        console.log("Log group name used for this result is " + this.state.dataTemp[i])
        console.log("id used for this result is " + this.state.idArray[i])

        res = await this.getResults(this.state.idArray[i]);
        console.log(res)
        await this.state.setQueryResults(res)
      }

},count * 600);//End of setTimeout

}

helper = () => {
    let count = 0

    this.state.dataTemp.forEach(element => {
        setTimeout(async() => {
          let temp = await this.state.getID(element)

          await this.state.setIds(temp.queryId)
          this.state.stopQuery(temp.queryId)


          let res = await this.getResults(temp.queryId);
          console.log(res)
          await this.state.setQueryResults(res)

        },count * 250);


        count++
      }
    );

    return count;
}

resultHelper = (num) => {
  let count = 0
  let tempResult = []
  num.forEach( element => {
    setTimeout(async() => {
      tempResult = await this.state.getResults(element)

    },count * 350);

    count++
  });

  return count;
}

getResults = (queryIdNum) => {
  return new Promise((resolve, reject) => {
    var queryid = {
       queryId:queryIdNum
    };

    cloudwatchlogs.getQueryResults(queryid, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
        return reject(err)
      }else{
        return resolve(data)       // successful response
        }
    });

  })

}

setQueryResults (queryRes){
  this.setState(prevState => ({
    arr: [...prevState.arr, queryRes]
  }))

}
setIds(id){
  this.setState(prevState => ({
    idArray: [...prevState.idArray, id]
  }))
}
getID = (name) => {
  return new Promise((resolve, reject) => {
    var params = {
      endTime: Math.round((currentDate.getTime() / 1000)), /* required */
      queryString: "fields @message | filter @message like /(?i)error/", /* required */
      startTime: Math.round((currentDate.getTime() / 10000)) - 1, /* required */
      limit: 1000,
      logGroupName: name
    };

    cloudwatchlogs.startQuery(params, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
      }else{
        return resolve(data)       // successful response
        }
    });

  })
}

stopQuery = (id) => {
  return new Promise((resolve, reject) => {
    var params = {
      queryId: id /* required */
    };

    cloudwatchlogs.stopQuery(params, function(err, data) {
      if (err){
         console.log(err, err.stack); // an error occurred
      }else {
        resolve("stopped") // successful response
      }
    })
  })
}
render () {
    return (
      <div>

            {<NewTable loggroupnames = {this.state.dataTemp}


            ></NewTable> }

            <button onClick={this.state.test}>Click me to test</button>
      </div>


    );
  }

}

export default TableForm;
