import React, { Component } from 'react';
import { Button, Modal } from 'reactstrap';
import Loader from 'react-loader-spinner'
import Completed from '../../assets/images/completed.png'
import Incomplete from '../../assets/images/incomplete.png'

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={!this.props.isComplete} className="Loading_modale">
                {this.props.isLoading ? (
                    <div className="Loading_spinner">
                        <Loader
                            type="Circles"
                            color="#00BFFF"
                            height={100}
                            width={100}
                        />
                        <div><h1>Processing Task...</h1></div>
                    </div>
                ) : (
                    <div className="Loading_message">
                        <img src={this.props.isSuccessful ? Completed:Incomplete}/>
                        <div><h1>{this.props.isSuccessful ? "Task completed successfully." : "There was an error. Please try again."}</h1></div>
                        <Button onClick={() => this.props.close()}>Close</Button>
                    </div>
                )}
                
            </Modal>
        )
    }
}

export default Loading;