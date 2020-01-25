import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from 'reactstrap';
import Table from './Tables'

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
            }
        }

        this.getSearchResult = this.getSearchResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getLogGroupName = this.getLogGroupName.bind(this);
    }

    componentDidMount() {
        this.getLogGroupName();
        setTimeout(() => this.setState({ loading: false }), 1000); 
    }

    getSearchResult(value){
        console.log("misael")
        return true
    }

    handleChange(event) {
        this.setState({keyword: event.target.value});
    }

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
            }
        }.bind(this))

    }

    render() {
        let empty_str = true;
        var value = this.props.location.state.search_keyword
        if(value.length > 0){
            empty_str = false
        }
        return (
            <div>
                { this.state.loading ? (
                    <div class="loader">
                        <Loader
                            type="Circles"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            // timeout={3000} //3 secs
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
                            <Card className="card-box"> 
                                <div style={{width:'100%'}}>
                                    <h2 className="float-left" >Results for "{this.props.location.state.search_keyword}"</h2>
                                </div>
                                <CardBody>
                                    <Table/>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default SearchResult;
