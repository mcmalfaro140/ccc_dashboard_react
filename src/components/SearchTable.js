import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";

class SearchTable extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            tabledata : {
                timeStamp: "",
                level:"",
                logger:"",
                message:""
            },
            columns : [
                {
                    Header: 'Log Stream Name',
                    accessor:'logStreamName',
                    style:{
                      textalign:"left"
                    },
                    width: 350,
                    maxwidth:150,
                    minwidth:150
                },
                {
                    Header: 'Time Stamp',
                    accessor:'timeStamp',
                    style:{
                        textalign:"left"
                    },
                    width: 150,
                    maxwidth:150,
                    minwidth:150
                },
                {
                    Header:'Message',
                    accessor:'message'
              
                }
            ]

        }
        this.newTableData = this.newTableData.bind(this);
    }
    
    newTableData(){
        let tableData = []
        var new_data = Object.create(this.state.tabledata);
        // console.log(this.props.events)
      
        for (var i = 0; i < this.props.events.length; i++) {
            new_data.logStreamName = this.props.events[i].logStreamName;
            new_data.timeStamp= this.props.events[i].timestamp;
            new_data.message = this.props.events[i].message;
        
            //push the object to the array
            tableData.push(new_data);
        
            //new object instantiation
            new_data = Object.create(this.state.tabledata);
        }

        return tableData;
    }

    render(){
        return(
            <ReactTable columns = {this.state.columns} data= {this.newTableData()} defaultPageSize={20}>
                {(state, makeTable, instance) => {
                    return (
                    <div style={{ background: '#ffffff', borderRadius: '25px', width:'100%', height:'100%'}}>
                        {makeTable()}
                    </div>
                    )
                }}
            </ReactTable>
        )
    }
}

export default SearchTable;
