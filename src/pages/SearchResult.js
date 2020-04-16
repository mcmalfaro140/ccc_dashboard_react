import React from 'react';
import AWS from 'aws-sdk';
import mykey from '../keys.json';
import Loader from 'react-loader-spinner'

//Import componets
import LogTableResult from '../components/searchComp/LogTableResult'
import NoFound from '../components/searchComp/NoFound'
import LogGroupList from '../components/searchComp/LogGroupList'
import SearchFilterBar from '../components/searchComp/SearchFilterBar'
import LogDetilData from '../components/searchComp/LogDetailData'

AWS.config.update({secretAccessKey:mykey.secretAccessKey, accessKeyId:mykey.accessKeyId, region:mykey.region});
var cloudwatchlogs = new AWS.CloudWatchLogs();

class SearchResult extends React.Component {

    constructor (props){
        super(props);
        const date = new Date();
        const startDate = date.getTime();
        this.state = {
            resultLenght: 0,
            startDate,
            endDate: new Date(startDate),
            id: 0,
            loading: true,
            showLogTable: false,
            keyword : "",
            logGroupNames : [],
            filterNames: [],
            noResults: false,
            params : {
                limit : '50'
            },
            results: [],
            showMoreInfo:false,
            logId: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.getLogGroupName = this.getLogGroupName.bind(this);
        this.searchByLogGroupName = this.searchByLogGroupName.bind(this);
        this.show = this.show.bind(this)
        this.setId = this.setId.bind(this)
        this.filter = this.filter.bind(this);
        this.showMoreInfoToggle = this.showMoreInfoToggle.bind(this)

    }

    filter(isFilter){
        if(this.state.logGroupNames.length === 0){
            this.getLogGroupName();
        }
        if(isFilter === true){
            let temp = this.props.location.state.filterNames;
            temp.forEach((element, i) => {
                if(i%2 === 0){
                    setTimeout(()=>{ //Added timeout to prevent AWS Rate Exceeded error
                        this.searchByLogGroupName(element);
                    },500 * (i/2))
                }else{
                    this.searchByLogGroupName(element);
                }
            })
        }else{
            let temp = this.props.location.state.logGroupNames;
            temp.forEach((element,i) => { //Added timeout to prevent AWS Rate Exceeded error
                if(i%3 === 0){
                    setTimeout(()=>{
                        this.searchByLogGroupName(element);
                    },1000)
                }else{
                    this.searchByLogGroupName(element);
                }
            })
        }
    }

    //Update componets when page is initialize
    componentDidMount() {
        this.setState({results: [], loading: true, noResults: false, logGroupNames: this.props.location.state.logGroupNames})
        this.filter(this.props.location.state.isFilterbyName)
    }

    //will update the components when new keyword is enter
    componentDidUpdate(prevProps) {
        let keyword = this.props.location.state.search_keyword
        let preKeyword = prevProps.location.state.search_keyword
        let range = this.props.location.state.range
        let preRange = prevProps.location.state.range
        let filter = this.props.location.state.filterNames;
        let prevFilter = prevProps.location.state.filterNames.length;
        let isFilter = this.props.location.state.isFilterbyName;
        let prevIsFilter = prevProps.location.state.isFilterbyName;

        if(range !== preRange || keyword !== preKeyword || filter.length !== prevFilter || isFilter !== prevIsFilter){
            this.setState({results: [], loading: true, noResults: false, filterNames: filter})
            this.filter(isFilter)
        }
    } 

    //gets new user input
    handleChange(event) {
        this.setState({keyword: event.target.value});
    }

    //Funtion to get all the log group names from AWS
    getLogGroupName(){
        this.setState({resultLenght: 0, logGroupNames: []})
        cloudwatchlogs.describeLogGroups(this.state.params, function(err, data) {
            if (err){
                console.log(err, err.stack); // an error occurred
            }else{
                let temp = data.logGroups;
                for (var i = 0; i < temp.length; i++) {
                    this.setState(prevState => ({
                        logGroupNames :  [ ...prevState.logGroupNames,temp[i].logGroupName]
                    }));
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
        arrayKeyWords.forEach((element, i) => {
            if(i < arrayKeyWords.length - 1){
                search_pattern += element + " "
            }else{
                search_pattern += element 
            }
            
        });

        if(range !== "all"){
            let start = this.props.location.state.startTime
            let end = this.props.location.state.endTime
            if(Math.sign(end) === -1){
                start = this.state.startDate
                end = this.state.endDate.getTime() - Math.abs(end)

            }
            var params = {
                logGroupName: logName, /* required */
                endTime: start,
                filterPattern: search_pattern, /*keyword passed by the user */
                startTime: end
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
                if(this.state.results.length > 0){
                    this.setState({ loading: false})
                }               
            }  
            setTimeout(() => 
            {
                this.setState({ loading: false})
            }, 5000); 
        }.bind(this));
    }

    show(e){
        e.preventDefault();
        this.setState({showLogTable: !this.state.showLogTable})
    }

    setId(id){
        this.setState({id: id, showLogTable: !this.state.showLogTable})
    }

    showMoreInfoToggle(id) {
        this.setState({showMoreInfo : !this.state.showMoreInfo , logId:id})
    }

    render() {
        var value = this.props.location.state.search_keyword

        return (
            <div>
                <SearchFilterBar search_keyword={this.props.location.state.search_keyword} range={this.props.location.state.range} isFilterbyName={this.props.location.state.isFilterbyName} logGroupNames={this.props.location.state.logGroupNames} filterNames={this.props.location.state.filterNames} id={this.props.location.state.id}/>
                { this.state.loading ? (
                    <div className="loader">
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
                        { this.state.noResults ? 
                            <NoFound value={value}/>
                            : 
                            <div>
                                {!this.state.showLogTable ? 
                                    <LogGroupList results={this.state.results} setId={this.setId} search_keyword={this.props.location.state.search_keyword}/>
                                    : 
                                    <div>
                                        {!this.state.showMoreInfo ? (
                                            <LogTableResult results={this.state.results[this.state.id]} showToggle ={this.show} showDetail={this.showMoreInfoToggle}/>
                                            
                                        ) : (
                                            <LogDetilData logGroupName={this.state.results[this.state.id].logGroupName} log={this.state.results[this.state.id].events[this.state.logId]} goBack={this.showMoreInfoToggle}></LogDetilData>
                                        )}
                                    </div>
                                    
                                }
                            </div>
                        }
                    </div>
                )}
            </div>
        );
    }
}

export default SearchResult;
