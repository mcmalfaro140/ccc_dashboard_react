import React, { Component } from "react";
import { connect } from 'react-redux';

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword : ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleChange(event) {
    this.setState({keyword: event.target.value});
  }

  handleBack() {
    this.props.history.push('/');
  }


  render() {
    return (
      <React.Fragment>
        <div className="navbar-custom">
          { this.props.title === "Dashboard" ?
            (<ul className="list-unstyled topnav-menu topnav-menu-left m-0">
              <li>
                <button className="button-menu-mobile waves-effect" onClick={this.props.menuToggle}>
                  <i className="fe-menu"></i>
                </button>
              </li>

              <li>
                <h3 className="page-title-main">{this.props.title}</h3>
              </li>
            </ul>
            ):(
            <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
              <li>
                <button className="button-menu-mobile waves-effect" onClick={this.handleBack}>
                  <i className="mdi mdi-arrow-left-bold"></i>
                </button>
              </li>

              <li>
                <h3 className="page-title-main">{this.props.title}</h3>
              </li>
            </ul>
            )
          }
          
            
        </div>
      </React.Fragment >
    );
  }
}


export default connect()(Topbar);

