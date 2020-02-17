import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import Loader from 'react-loader-spinner'

//Import componets
import LogTableResult from '../components/searchComp/LogTableResult'
import Fail from '../components/searchComp/Fail'
import NoFound from '../components/searchComp/NoFound'
import LogGroupList from '../components/searchComp/LogGroupList'
import SearchFilterBar from '../components/searchComp/SearchFilterBar'

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();


class SearchResult extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            id: 0,
            loading: true,
            showLogTable: false,
            keyword : "",
            logGroupNames : [],
            noResults: false,
            params : {
                limit : '50'
            },
            results: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.getLogGroupName = this.getLogGroupName.bind(this);
        this.searchByLogGroupName = this.searchByLogGroupName.bind(this);
        this.show = this.show.bind(this)
        this.setId = this.setId.bind(this)
    }

    //Update componets when page is initialize
    componentDidMount() {
        this.setState({results: [], loading: true, noResults: false})
        this.getLogGroupName();
    }

    //will update the components when new keyword is enter
    componentDidUpdate(prevProps) {
        console.log("search porps update")
        let keyword = this.props.location.state.search_keyword
        let preKeyword = prevProps.location.state.search_keyword
        let range = this.props.location.state.range
        let preRange = prevProps.location.state.range
        if(range !== preRange ){
            if(keyword !== preKeyword){
                this.setState({results: [], loading: true, noResults: false})
                for (var i = 0; i < this.state.logGroupNames.length; i++) {
                    this.searchByLogGroupName(this.state.logGroupNames[i])
                }
            }
        }else if (keyword !== preKeyword){
            this.setState({results: [], loading: true, noResults: false})
            for (var i = 0; i < this.state.logGroupNames.length; i++) {
                this.searchByLogGroupName(this.state.logGroupNames[i])
            }
        }
    } 

    //gets new user input
    handleChange(event) {
        this.setState({keyword: event.target.value});
    }

    //Funtion to get all the log group names from AWS
    getLogGroupName(){
        console.log("init search")
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
                for (var i = 0; i < temp.length; i++) {
                    this.searchByLogGroupName(this.state.logGroupNames[i]);
                }
            }
        }.bind(this))
    }

    //Funtion to search on a specific log group name base on the keyword input by the user
    searchByLogGroupName(logName){
        let key = this.props.location.state.search_keyword
        let range = this.props.location.state.range;
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

        if(range !== "all"){
            var params = {
                logGroupName: logName, /* required */
                endTime: this.props.location.state.endTime,
                filterPattern: search_pattern, /*keyword passed by the user */
                startTime: this.props.location.state.startTime
                // limit: 1000, 
            };
        }else{
            var params = {
                logGroupName: logName, /* required */
                filterPattern: search_pattern /*keyword passed by the user */
                // limit: 1000, 
            };
        }
        
        
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
            setTimeout(() => 
            {if(this.state.results.length === 0){
                this.setState({ loading: false, noResults: true })
            }else{
                this.setState({ loading: false})
            }}, 1000); 
        }.bind(this));
    }

    show(e){
        e.preventDefault();
        this.setState({showLogTable: !this.state.showLogTable})
    }

    setId(id){
        this.setState({id: id, showLogTable: !this.state.showLogTable})
    }

    render() {
        console.log(this.props)
        let empty_str = true;
        var value = this.props.location.state.search_keyword
        if(value.length > 0){
            empty_str = false
        }

        return (
            <div>
                <SearchFilterBar/>
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
                            <Fail/>
                        ):(
                            ( this.state.noResults ? 
                                <NoFound value={value}/>
                                : 
                                <div>
                                    {this.state.showLogTable ? 
                                        <LogTableResult results={this.state.results[this.state.id]} showToggle ={this.show}/>
                                        : 
                                        <LogGroupList results={this.state.results} setId={this.setId} search_keyword={this.props.location.state.search_keyword}/>
                                    }
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
