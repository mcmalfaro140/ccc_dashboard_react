import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

class Fail extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            keyword : "",
        }
        this.handleChange = this.handleChange.bind(this);
    }

    //gets new user input
    handleChange(event) {
        this.setState({keyword: event.target.value});
    }

    render(){
        return(
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
        )
    }
}

export default Fail;
