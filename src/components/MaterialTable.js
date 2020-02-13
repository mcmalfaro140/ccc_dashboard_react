import React, { Component } from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import '../assets/react-grid/styles.css'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";


AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();


var id = 0;
class MaterialTable extends React.Component {

    constructor (){
        super()
        this.state = { 
            open: false ,
            results: [],
            loading:false,
            temp:[],
            logGroupName:[]
        };
    }

  componentDidMount(){
    this.getLogGroupName()
  }

   //Funtion to get all the log group names from AWS
   getLogGroupName(){
    cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
        if (err){
            console.log(err, err.stack); // an error occurred
        }else  {
            let temp = data.logGroups;
            for (var i = 0; i < temp.length; i++) {
                this.setState(prevState => ({
                    logGroupName : [...prevState.logGroupName, temp[i].logGroupName]
                }));
            }
            for (var i = 0; i < temp.length; i++) {
                this.searchByLogGroupName(this.state.logGroupName[i]);
            }
        }
    }.bind(this))
}

//Funtion to search on a specific log group name base on the keyword input by the user
searchByLogGroupName(logName){
    

    var params = {
        logGroupName: logName, /* required */
        filterPattern: ' ' /*keyword pass by the user */
        // limit: 1000, 
    };
    
    cloudwatchlogs.filterLogEvents(params, function(err, data) {
        if(err){
            console.log(err, err.stack); // an error occurred
        }else{ 
            if(data.events.length > 0){

                let resultData = {
                    logGroupName: "",
                    events: []
                }

                var new_data = Object.create(resultData);  
                new_data.logGroupName = logName;
                new_data.events = data.events

                this.setState(prevState => ({
                    results : [...prevState.results, new_data]
                }));
            }
        }  
        setTimeout(() => this.setState({ loading: false }), 10000); 
    }.bind(this));
}

 

    render() {
      console.log(this.state.results)

       const { results } = this.state
       const { row } = this.props;
       const { open } = this.state;  

        return (
          <>
        <TableRow >
          <TableCell>
            <Button
              onClick={() => this.setState(({ open }) => ({ open: !open }))}
            >
              Extend / Collapse
            </Button>
          </TableCell>
          {/* <TableCell>{row.name}</TableCell>
          <TableCell align="right">{row.calories}</TableCell>
          <TableCell align="right">{row.fat}</TableCell>
          <TableCell align="right">{row.carbs}</TableCell>
          <TableCell align="right">{row.protein}</TableCell> */}
        </TableRow>
        <Collapse in={open} component="tr" style={{ display: "block" }}>
          <td>
            <div>Expanded data.</div>
          </td>
        </Collapse>
          </>
        );
      }
     
  }

  // MaterialTable.propTypes = {
  //   classes: PropTypes.object.isRequired
  // };
  
//  export default withStyles(styles)(MaterialTable);

  
  const styles = theme=> ({
      root: {
        width: "100%",
        //marginTop: theme.spacing.unit,
        //overflowX: "auto"
      },
      table: {
        minWidth: 300
      }
    });
    
    //let id = 0;
    function createData(name) {
      id += 1;
      return { id, name};
    }
    
    const rows = [
     
       "/aws/apigateway/trying","/aws/lambda/ChatRoomConnectFunction","/aws/lambda/ChatRoomDisconnectFunction",
                        "/aws/lambda/ChatRoomOnMessageFunction","/aws/lambda/LogsToElasticsearch_searchlogs","/aws/lambda/asdvasjhdgja",
                        "/aws/lambda/dummy", "/aws/lambda/notification", "/aws/rds/instance/database-1/error","App1","notificationsLogs",
                        "sns","test"
                            
    ];


function SimpleTable (props) {
      const { classes } = props;
      let rowsObject = []

      for(let i = 0 ; i < rows.length ; i ++){

        var filterLogParams = {
          logGroupName : rows[i],
          filterPattern: ' ',
          limit: 50
      }

       cloudwatchlogs.filterLogEvents(filterLogParams, function(err, data) {
        if(err){
            console.log(err, err.stack); // an error occurred
        }else{ 
            if(data.events.length > 0){

                let resultData = {
                    logGroupName: "",
                    events: []
                }

                var new_data = Object.create(resultData);  
                new_data.logGroupName = rows[i];
                new_data.events = data.events
                rowsObject.push(new_data)

            }
        }  
           
      
      }.bind(this))
      
       
}//End of for loop

      console.log(rowsObject)
    
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Log Group Name</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsObject.map(element => (
                 <MaterialTable row={element}  />
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
    
    SimpleTable.propTypes = {
      classes: PropTypes.object.isRequired
    };
    
   export default withStyles(styles)(SimpleTable);
    