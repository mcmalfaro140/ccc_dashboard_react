import React, { Component } from "react";
import { connect } from 'react-redux';


const Notifications = [{
  id: 1,
  text: 'Caleb Flakelar commented on Admin',
  subText: '1 min ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'primary'
},
{
  id: 2,
  text: 'New user registered.',
  subText: '5 min ago',
  icon: 'mdi mdi-account-plus',
  bgColor: 'info'
},
{
  id: 3,
  text: 'Cristina Pride',
  subText: 'Hi, How are you? What about our next meeting',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'success'
},
{
  id: 4,
  text: 'Caleb Flakelar commented on Admin',
  subText: '2 days ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'danger'
},
{
  id: 5,
  text: 'Caleb Flakelar commented on Admin',
  subText: '1 min ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'primary'
},
{
  id: 6,
  text: 'New user registered.',
  subText: '5 min ago',
  icon: 'mdi mdi-account-plus',
  bgColor: 'info'
},
{
  id: 7,
  text: 'Cristina Pride',
  subText: 'Hi, How are you? What about our next meeting',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'success'
},
{
  id: 8,
  text: 'Caleb Flakelar commented on Admin',
  subText: '2 days ago',
  icon: 'mdi mdi-comment-account-outline',
  bgColor: 'danger'
}];

const ProfileMenus = [{
  label: 'My Account',
  icon: 'fe-user',
  redirectTo: "/",
},
{
  label: 'Settings',
  icon: 'fe-settings',
  redirectTo: "/"
},
{
  label: 'Lock Screen',
  icon: 'fe-lock',
  redirectTo: "/"
},
{
  label: 'Logout',
  icon: 'fe-log-out',
  redirectTo: "/logout",
  hasDivider: true
}]


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
    const isCondensed = this.props.isCondensed || false;
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

