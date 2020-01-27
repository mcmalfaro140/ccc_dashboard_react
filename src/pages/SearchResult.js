import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from 'reactstrap';
import SearchTable from '../components/SearchTable'
import not_found_img from '../assets/images/notfound.png'

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();


class SearchResult extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            loading: true,
            keyword : "",
            logGroupName : [],
            params : {
                limit : '50'
            },
            results: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.getLogGroupName = this.getLogGroupName.bind(this);
        this.searchByLogGroupName = this.searchByLogGroupName.bind(this);
    }

    //Update componets when page is initialize
    componentDidMount() {
        this.getLogGroupName();
    }

    //will update the components when new keyword is enter
    componentDidUpdate(prevProps) {
        if(this.props.location.state.search_keyword !== prevProps.location.state.search_keyword){
            this.setState({results: [], loading: true})
            for (var i = 0; i < this.state.logGroupName.length; i++) {
                this.searchByLogGroupName(this.state.logGroupName[i])
            }
        }
    } 

    //gets new user input
    handleChange(event) {
        this.setState({keyword: event.target.value});
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
        let key = this.props.location.state.search_keyword
        let keySplit = key.split(" ");
        let arrayKeyWords = [];
        keySplit.forEach(element => {
            arrayKeyWords.push("?" + element) //adds the OR sign to word
            arrayKeyWords.push("?" + element.toUpperCase()) //adds uppercase  word
            arrayKeyWords.push("?" + element.toLowerCase()) //adds lowercase word
            arrayKeyWords.push("?" + element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()) //adds uppercase to first letter word
        });

        //build filter pattern
        let search_pattern = ""
        arrayKeyWords.forEach(element => {
            search_pattern += element + " "
        });

        var params = {
            logGroupName: logName, /* required */
            filterPattern: search_pattern /*keyword pass by the user */
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
            setTimeout(() => this.setState({ loading: false }), 1000); 
        }.bind(this));
    }

    render() {
        let empty_str = true;
        var value = this.props.location.state.search_keyword
        if(value.length > 0){
            empty_str = false
        }

        const tables = this.state.results.map((item, i) => {
            return(
                <Card className="card-box"> 
                    <div style={{width:'100%'}}>
                        <h2 className="float-left" >{item.logGroupName}</h2>
                    </div>
                    <CardBody>
                        <SearchTable events={item.events}></SearchTable>
                    </CardBody>
                </Card>
            )
        })
        return (
            <div>
                { this.state.loading ? (
                    <div class="loader">
                        <Loader
                            type="Circles"
                            color="#00BFFF"
                            height={100}
                            width={100}
                        />
                        <div className="loaderText">Retrieving Search Results</div>
                    </div>
                ): (
                    <div>
                        { empty_str ? (
                            <div className="errorbox">
                                <div className="errorTxt">Please enter a keyword to search and try again!!!</div>
                                <form className="app-search">
                                    <div className="app-search-box">
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Search..." value={this.state.keyword} onChange={this.handleChange} />
                                        </div>
                                        <div className="btnGroup">
                                            <Link to={{pathname:'/search_results', state: { search_keyword: this.state.keyword}}} >
                                                <Button className="searchBtn" color="primary" size="lg">Search</Button>
                                            </Link>
                                            <Link to={{pathname:'/dashboard'}} >
                                                <Button className="searchBtn" color="primary" size="lg">Go back</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ):(
                            ( this.state.results.length === 0 ? 
                                <div className="notResultDiv">
                                    <img className="no_found_img" src={not_found_img} alt="Not Results" />
                                    <h1>OOPS!</h1>
                                    <h3>No results found for:</h3>
                                    <h3 className="key">{value}</h3>

                                </div> 
                                : 
                                <div>
                                    {tables}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default SearchResult;
