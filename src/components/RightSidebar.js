import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-perfect-scrollbar/dist/css/styles.css';

class RightSideBar extends Component {
    rightBarNodeRef;

    static defaultProps = {
        title: 'Right Sidebar'
    }

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.state = {}
    }

    /**
     * 
     */
    componentWillMount = () => {
        document.addEventListener('mousedown', this.handleOtherClick, false);
    }

    /**
     * 
     */
    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleOtherClick, false);
    }
    /**
     * Handles the close
     */
    handleClose = (e) => {
        e.preventDefault();
        this.hide();
    }

    /**
     * Handle the click anywhere in doc
     */
    handleOtherClick = (e) => {
        if (this.rightBarNodeRef.contains(e.target))
            return;
        // else hide the right sidebar
        this.hide();
    }

    /**
     * Hide rightside bar
     */
    hide() {
        document.body.classList.remove("right-bar-enabled");
    }

    render() {
        return (
            <React.Fragment>
                <div className="right-bar" ref={node => this.rightBarNodeRef = node}>
                    <div className="rightbar-title">
                        <Link to="#" className="right-bar-toggle float-right" onClick={this.handleClose}>
                            <i className="dripicons-cross noti-icon"></i>
                        </Link>
                        <h5 className="m-0 text-white">Settings </h5>
                    </div>
                </div>
                <div className="rightbar-overlay"></div>
            </React.Fragment>
        )
    }
}

export default connect()(RightSideBar);