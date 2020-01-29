import React, { Component } from 'react';
import AWS from 'aws-sdk';
import {Line} from 'react-chartjs-2';
import myKeys from '../keys.json';
import '../assets/react-grid/styles.css'

class TestLine extends Component {
    constructor(porps){
        super(porps)
        this.state = {

        }
        this.showOptions =  this.showOptions.bind(this)
    }

    componentDidMount() {
        console.log(this.props)
    }

    showOptions(e){
        e.preventDefault();
        this.setState({ showOptions: !this.state.showOptions});
    }

    render(){
        return(
            <div>
                <div >
                    <h2 className="float-left" >{this.props.graphSettings.chartName}</h2>
                    <div style={{paddingTop:'23px'}} className="dropdown float-right show" onClick={this.showOptions}>
                    <a className="dropdown-toggle arrow-none card-drop" data-toggle="dropdown" aria-expanded="true">
                        <i style={{fontSize:'130%'}}className="mdi mdi-dots-vertical"></i>
                    </a>
                    { this.state.showOptions? (
                        <div className="dropdown-menu dropdown-menu-right show" x-placement="bottom-end">
                            <a href="" class="dropdown-item">Modify</a>
                            <a href="" class="dropdown-item">Delete</a>
                        </div>
                    ): null }
                    </div>
                </div>
                <Line
                    data={{
                        datasets: [{
                            label: 'Dataset 2',
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            lineTension: 0,
                            borderDash: [8, 4]
                            },{
                            label: 'Dataset 1',
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            lineTension: 0,
                            borderDash: [8, 4]
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            xAxes: [{
                                type: 'realtime',
                                realtime: {
                                    duration: 900000,    // this would be the length of the graph in this case it display 15 mins
                                    refresh: 40000,      // onRefresh callback will be called every 1000 ms *** 
                                    delay: 1000,        // delay of 1000 ms, so upcoming values are known before plotting a line
                                    pause: false,       // chart is not paused
                                    ttl: undefined,     // data will be automatically deleted as it disappears off the chart

                                    // a callback to update datasets
                                    onRefresh: function(chart) {
                                        chart.data.datasets.forEach(function(dataset) {
                                            
                                            dataset.data.push({
                                                x: Date.now(),
                                                y: Math.random()
                                            });
                                        });
                                    },
                                    delay: 2000
                                }
                            }]
                        },
                        plugins: {
                            streaming: {            // per-chart option
                                frameRate: 5       // chart is drawn 30 times every second
                            }
                        }
                    }}
                />
            </div>
        )
    }
}

export default TestLine;
