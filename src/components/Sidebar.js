import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MetisMenu from 'metismenujs/dist/metismenujs';

import profilePic from '../assets/images/users/defaultUser.png';
import logo from '../assets/images/logo_ccc.png';


//Side menu navigation
//TODO modify alert route
class SideNavContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGrapOptions: false,
            showRealtimeOptions: false,
            showLogTableOptions: false,
            showNotificationOptions: false,
            realTimeActive: false,
            logTableActive: false,
            notificationActive: false,
          }
        this.showGrapOptions = this.showGrapOptions.bind(this);
        this.showRealtimeOptions = this.showRealtimeOptions.bind(this);
        this.showLogTableOptions = this.showLogTableOptions.bind(this);
        this.showNotificationOptions = this.showNotificationOptions.bind(this);
    }
    showNotificationOptions(e){
        e.preventDefault();
        this.setState({showNotificationOptions : !this.state.showNotificationOptions, notificationActive : !this.state.notificationActive});
    }
    showRealtimeOptions(e){
        e.preventDefault();
        this.setState({ showRealtimeOptions: !this.state.showRealtimeOptions, realTimeActive: !this.state.realTimeActive});
    }
    showLogTableOptions(e){
        e.preventDefault();
        this.setState({ showLogTableOptions: !this.state.showLogTableOptions, logTableActive: !this.state.logTableActive});
    }
    showGrapOptions(e){
        e.preventDefault();
        this.setState({ showGrapOptions: !this.state.showGrapOptions});
      
        
    }
    
    render(){
    return <React.Fragment>

    <div id="sidebar-menu">

        <div className="logo-box">
            <Link to="/" className="logo text-center">
              <span className="logo-lg">
                <img src={logo} alt="" height="30" />
              </span>
            </Link>
        </div>
        {/* Side menu User fragment
        TODO: Update user email dynamically with back end and add logout link. */}
        <div className="user-box text-center ">
            <img src={profilePic} alt="user-img" title="mcmalfaro@hotmail.com" className="rounded-circle img-thumbnail avatar-lg" />
            <h5>Hi, {this.props.user.username}.</h5>

            <ul className="list-inline">
                <li className="list-inline-item">
                    <a onClick={this.props.logOut} className="text-custom log_out">
                        <i className="mdi mdi-power"></i>
                        <span> Logout </span>
                    </a>
                </li>
            </ul>
        </div>
        {/* Options */}
          <ul className="metismenu" id="side-menu">
              <li className="menu-title">Navigation</li>

              <li>
                  <Link to="/dashboard" className="waves-effect side-nav-link-ref">
                      <i className="mdi mdi-view-dashboard"></i>
                      <span> Dashboard </span>
                  </Link>
              </li>
              <li className={this.state.realTimeActive ? ("active"):null}>
                  <a className="waves-effect side-nav-link-ref" onClick={this.showRealtimeOptions}>
                        <i className="mdi mdi-elevation-rise"></i>
                      <span> Charts </span>
                      <span className="menu-arrow"></span>
                  </a>
                  { this.state.showRealtimeOptions ? (
                   <ul className="nav-second-level nav" aria-expanded="false">
                      <li>
                         <Link to={{
                                typeOfGraph : 'bar' }}
                                onClick = {this.props.toggleForm}
                                className="waves-effect side-nav-link-ref">
                                <i className="mdi mdi-chart-bar"></i>
                                <span> Bar Chart </span>
                            </Link>
                      </li>
                      <li>
                            <Link to={{
                                typeOfGraph : 'line' }}
                                onClick = {this.props.toggleForm}
                                className="waves-effect side-nav-link-ref">
                                <i className="mdi mdi-chart-line"></i>
                                <span> Line Chart </span>
                            </Link>
                      </li>
                      <li>
                            <Link to={{
                                typeOfGraph : 'mix' }}
                                onClick = {this.props.toggleMixForm}
                                className="waves-effect side-nav-link-ref">
                                <i class="mdi mdi-chart-histogram"></i>
                                <span> Mix Chart </span>
                            </Link>
                      </li>
                  </ul>
                  ): null }
              </li>
              <li className={this.state.logTableActive? ("active"):null}>
                  <a className="waves-effect side-nav-link-ref" onClick={this.showLogTableOptions}>
                      <i className="mdi mdi-folder-multiple-outline"></i>
                      <span> Logs </span>
                      <span className="menu-arrow"></span>
                  </a>
                  { this.state.showLogTableOptions? (
                   <ul className="nav-second-level nav" aria-expanded="false">
                      <li onClick = {this.props.toggleSearchModal}>
                          <Link className="waves-effect side-nav-link-ref">
                              <i className="fe-search"></i>
                              <span> Log Search</span>
                          </Link>
                      </li>
                  </ul>
                  ): null }
           </li>
              <li className = {this.state.notificationActive?("active"):null}>
                  <a className="waves-effect side-nav-link-ref" onClick={this.showNotificationOptions}>
                      <i className="mdi mdi-bell-ring-outline"></i>
                      <span> Notifications </span>
                      <span className="menu-arrow"></span>
                  </a>
                  { this.state.showNotificationOptions ? (
                         <ul className="nav-second-level nav" aria-expanded="false">
                             <li>
                                <Link to = "/metricAlarms">
                                <i class="mdi mdi-alert-box">  </i>
                                    Metric Alarms
                                </Link>
                             </li>
                             <li>
                                 <Link to="/logAlarms" >
                                 <i class="mdi mdi-alert-circle">  </i>
                                    Log Alarms
                                 </Link>
                             </li>
                         </ul>
                  ) :null }
              </li>
              <li>
                  <a className="waves-effect side-nav-link-ref" onClick={this.props.goFullScreen}>
                      <i className="mdi mdi-fullscreen"></i>
                      <span> FullScreen Mode </span>
                  </a>
              </li>
              <li>
                  <a className="waves-effect side-nav-link-ref" onClick={this.props.rightSidebarToggle}>
                      <i className="mdi mdi-settings"></i>
                      <span> Settings </span>
                  </a>
              </li>

          </ul>
      </div>
      <div className="clearfix"></div>
    </React.Fragment>
    }
}


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.handleOtherClick = this.handleOtherClick.bind(this);
        this.initMenu = this.initMenu.bind(this);
    }

    /**
     * Bind event
     */
    UNSAFE_componentWillMount = () => {
        document.addEventListener('mousedown', this.handleOtherClick, false);
    }


    /**
     * 
     */
    componentDidMount = () => {
        this.initMenu();

    }

    /**
     * Component did update
     */
    componentDidUpdate = (prevProps) => {
        if (this.props.isCondensed !== prevProps.isCondensed) {
            if (prevProps.isCondensed) {
                document.body.classList.remove("sidebar-enable");
                document.body.classList.remove("enlarged");
            } else {
                document.body.classList.add("sidebar-enable");
                const isSmallScreen = window.innerWidth < 768;
                if (!isSmallScreen) {
                    document.body.classList.add("enlarged");
                }
            }

            this.initMenu();
        }
    }

    /**
     * Bind event
     */
    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleOtherClick, false);
    }

    /**
     * Handle the click anywhere in doc
     */
    handleOtherClick = (e) => {
        if (this.menuNodeRef.contains(e.target))
            return;
        // else hide the menubar
        document.body.classList.remove('sidebar-enable');
    }

    /**
     * Init the menu
     */
    initMenu = () => {
        // render menu
        new MetisMenu("#side-menu");
        var links = document.getElementsByClassName('side-nav-link-ref');
        var matchingMenuItem = null;
        for (var i = 0; i < links.length; i++) {
            if (this.props.location.pathname === links[i].pathname) {
                matchingMenuItem = links[i];
                break;
            }
        }

        if (matchingMenuItem) {
            matchingMenuItem.classList.add('active');
            var parent = matchingMenuItem.parentElement;

            /**
             * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3. 
             * We should come up with non hard coded approach
             */
            if (parent) {
                parent.classList.add('active');
                const parent2 = parent.parentElement;
                if (parent2) {
                    parent2.classList.add('in');
                }
                const parent3 = parent2.parentElement;
                if (parent3) {
                    parent3.classList.add('active');
                    var childAnchor = parent3.querySelector('.has-dropdown');
                    if (childAnchor) childAnchor.classList.add('active');
                }

                const parent4 = parent3.parentElement;
                if (parent4)
                    parent4.classList.add('in');
                const parent5 = parent4.parentElement;
                if (parent5)
                    parent5.classList.add('active');
            }
        }
    }



    render() {
        const showMenu = this.props.showMenu;
        return (
            <React.Fragment>
                <div style={showMenu ? {visibility:'visible'} : {visibility:'hidden'}}ref={node => this.menuNodeRef = node}>
                    <PerfectScrollbar>
                        <SideNavContent {...this.props}/>
                    </PerfectScrollbar>
                </div>
                <div className={showMenu ? "sidebar-overlay" : ""} onClick={this.props.menuToggle}></div>
                {/* <div className="sidebar-overlay"></div> */}
            </React.Fragment>
        );
    }
}

export default connect()(Sidebar);
