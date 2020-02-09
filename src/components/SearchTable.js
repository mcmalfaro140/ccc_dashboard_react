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
                    Header: 'Log Group Names',
                    accessor:'logGroupName',
                    style:{
                      textalign:"left"
                    },
                    // width: 50,
                    // maxwidth:50,
                    // minwidth:50
                }
            ]

        }
        this.newTableData = this.newTableData.bind(this);
    }
    
    newTableData(){
        let tableData = []
        var new_data = Object.create(this.state.tabledata);
      
        // for (var i = 0; i < this.props.events.length; i++) {
        //     var t = new Date(parseInt(this.props.events[i].timestamp));
        //     let time = t.toGMTString();
        //     // console.log(time)
        //     new_data.logStreamName = this.props.events[i].logStreamName;
        //     new_data.timeStamp= time;
        //     new_data.message = this.props.events[i].message;
        
        //     //push the object to the array
        //     tableData.push(new_data);
        
        //     //new object instantiation
        //     new_data = Object.create(this.state.tabledata);
        // }

        return tableData;
    }

    render(){
        let tableSize = 20;
        if(this.props.events.length < 20){
            tableSize = this.props.events.length
        }
        return(
            <ReactTable columns = {this.state.columns} data= {this.newTableData()} defaultPageSize={tableSize}>
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
