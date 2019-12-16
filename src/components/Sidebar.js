import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle} from 'reactstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MetisMenu from 'metismenujs/dist/metismenujs';

import profilePic from '../assets/images/users/defaultUser.png';
import Logout from '../pages/auth/Logout';

var currentDate = new Date();


//Side menu navigation
//TODO modify alert route
class SideNavContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGrapOptions: false,
            showRealtimeOptions: false,
            showLogTableOptions: false,
            graphActive: false,
            realTimeActive: false,
            logTableActive: false
          }
        this.showGrapOptions = this.showGrapOptions.bind(this);
        this.showRealtimeOptions = this.showRealtimeOptions.bind(this);
        this.showLogTableOptions = this.showLogTableOptions.bind(this);
        this.myTest = this.myTest.bind(this);
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
        this.setState({ showGrapOptions: !this.state.showGrapOptions, graphActive: !this.state.graphActive});
    }
    myTest(){
        console.log("clicked")
        return(
            <div>
                <h1>hello Misael</h1>
            </div>
        )
    }
    
    render(){
    return <React.Fragment>

    <div id="sidebar-menu">
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
                      <i class="mdi mdi-clock"></i>
                      <span> Realtime </span>
                      <span className="menu-arrow"></span>
                  </a>
                  { this.state.showRealtimeOptions ? (
                   <ul className="nav-second-level nav" aria-expanded="false">
                      <li>
                            <a onClick={this.props.toggleForm} className="waves-effect side-nav-link-ref">
                              <i className="mdi mdi-chart-bar"></i>
                              <span> Bar Chart </span>
                          </a>
                      </li>
                      <li>
                          <a onClick={this.props.toggleForm} className="waves-effect side-nav-link-ref">
                              <i class="mdi mdi-chart-line"></i>
                              <span> Line Chart </span>
                          </a>
                      </li>
                  </ul>
                  ): null }
              </li>
              <li className={this.state.logTableActive? ("active"):null}>
                  <a className="waves-effect side-nav-link-ref" onClick={this.showLogTableOptions}>
                      <i class="mdi mdi-folder-multiple-outline"></i>
                      <span> Logs </span>
                      <span className="menu-arrow"></span>
                  </a>
                  { this.state.showLogTableOptions? (
                   <ul className="nav-second-level nav" aria-expanded="false">
                       <li>
                       <Link to={{pathname:'/dashboard', 
                                    state:{ 
                                        newMasterTable:{
                                            objectType:"table", // options: graph or table
                                            tableSettings:{
                                                master:"true",
                                            }
                                        }
                                    }
                                }} className="waves-effect side-nav-link-ref">
                            {/* <a onClick={this.props.toggleForm} className="waves-effect side-nav-link-ref"> */}
                              <i class="mdi mdi-table-large"></i>
                              <span> New Log Table </span>
                            </Link>
                      </li>
                      <li>
                          <Link to="/" className="waves-effect side-nav-link-ref">
                              <i class="fe-search"></i>
                              <span> Search Logs </span>
                          </Link>
                      </li>
                  </ul>
                  ): null }
              </li>
              <li className={this.state.graphActive ? ("active"):null}>
                  <a className="waves-effect" aria-expanded="false" onClick={this.showGrapOptions}>
                      <i class="mdi mdi-elevation-rise"></i>
                      <span> New Graph </span>
                      <span className="menu-arrow"></span>
                  </a>
                  { this.state.showGrapOptions ? (
                   <ul className="nav-second-level nav" aria-expanded="false">
                      <li>
                            {/* <a onClick={this.props.toggleForm} className="waves-effect side-nav-link-ref">    
                              <i className="mdi mdi-chart-bar"></i>
                              <span> Bar Chart </span>
                          </a> */}
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
                                <i class="mdi mdi-elevation-rise"></i>
                                <span> Line Chart </span>
                            </Link>
                      </li>
                      <li>
                            <a onClick={this.props.toggleForm} className="waves-effect side-nav-link-ref">
                              <i class="mdi mdi-chart-arc"></i>
                              <span> Pie Chart </span>
                            </a>
                      </li>

                  </ul>
                  ): null }
              </li>
              <li>
                  <a className="waves-effect side-nav-link-ref" onClick={this.props.rightSidebarToggle}>
                      <i class="mdi mdi-bell-ring-outline"></i>
                      <span> Alerts </span>
                  </a>
              </li>
              <li>
                  <a className="waves-effect side-nav-link-ref" onClick={this.props.goFullScreen}>
                      <i class="mdi mdi-fullscreen"></i>
                      <span> FullScreen Mode </span>
                  </a>
              </li>
              <li>
                  <a className="waves-effect side-nav-link-ref" onClick={this.props.rightSidebarToggle}>
                      <i class="mdi mdi-settings"></i>
                      <span> Settings </span>
                  </a>
              </li>

          </ul>
      </div>
      <div className="clearfix"></div>
    </React.Fragment>
    }
}

//Side menu User fragment
//TODO: Update user email dynamically with back end and add logout link.
const UserProfile = () => {
    return <React.Fragment>
        <div className="user-box text-center ">
            <img src={profilePic} alt="user-img" title="mcmalfaro@hotmail.com" className="rounded-circle img-thumbnail avatar-lg" />
            <h5>mcmalfaro@hotmail.com</h5>

            <ul className="list-inline">
                <li className="list-inline-item">
                    <Link to="/Logout" className="text-custom">
                        <i className="mdi mdi-power"></i>
                        <span> Logout </span>
                    </Link>
                </li>
            </ul>
        </div>
    </React.Fragment>
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
    componentWillMount = () => {
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
        const isCondensed = this.props.isCondensed || false;

        return (
            <React.Fragment>
                <div className='left-side-menu' ref={node => this.menuNodeRef = node}>
                    {!isCondensed && <PerfectScrollbar><UserProfile /><SideNavContent {...this.props}/></PerfectScrollbar>}
                    {isCondensed && <UserProfile /> && <SideNavContent />}
                </div>
            </React.Fragment>
        );
    }
}

export default connect()(Sidebar);
