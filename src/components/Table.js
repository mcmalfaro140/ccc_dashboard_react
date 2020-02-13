
import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";



function Table (props) {

//Object to hold the data for a single log event
const tabledata = {
  timeStamp: "",
  level:"",
  logger:"",
  message:""
};

//Json Array for the log events
var dataFromtable = [];

function newTableData () {
  var new_data = Object.create(tabledata);

  for (var i = 0; i < props.timeStamp.length; i++) {

    new_data.timeStamp= props.timeStamp[i];
    new_data.level = props.level[i].toLowerCase();
    new_data.logger = props.logger[i];
    new_data.message = props.message[i];

    //push the object to the array
    dataFromtable.push(new_data);

    //new object instantiation
    new_data = Object.create(tabledata);
  }


  return dataFromtable;
}


const columns = [
  {
    Header: 'TimeStamp',
    accessor:'timeStamp',
    style:{
      textalign:"left"
    },
    width: 150,
    maxwidth:150,
    minwidth:150
  },

  {
    Header:'Level',
    accessor: 'level',
    style:{
      textalign:"left"
    },
    width: 100,
    maxwidth:100,
    minwidth:100
  },
  {
    Header:'Logger',
    accessor:'logger'
  },
  {
    Header:'Message',
    accessor:'message',
    filterable:true


  }
];

return(


        <ReactTable
            columns = {columns}
            data= {newTableData()}
            defaultPageSize={5}
        >
        {(state, makeTable, instance) => {
            return (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '25px',
                  width:'100%',
                  height:'50%'
                }}
              >
                {makeTable()}
              </div>
            )
          }}
        </ReactTable>
      )
}

export default Table;
