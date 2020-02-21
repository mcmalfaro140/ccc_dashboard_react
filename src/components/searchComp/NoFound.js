import React from 'react';
import not_found_img from '../../assets/images/notfound.png'

class NoFound extends React.Component {

    render(){
        return(
            <div className="notResultDiv">
                <img className="no_found_img" src={not_found_img} alt="Not Results" />
                <h1>OOPS!</h1>
                <h3>No results found for:</h3>
                <h3 className="key">{this.props.value}</h3>
            </div> 
        )
    }
}

export default NoFound;
