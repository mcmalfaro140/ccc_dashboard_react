
import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";



function NewTable (props) {

//Object to hold the data for a single log event
const tabledata = {
  loggroupnames: props.loggroupnames,
  level:"",
  logger:"",
  message:""
};

//Json Array for the log events
var dataFromtable = [];

function newTableData () {
  var new_data = Object.create(tabledata);

  for (var i = 0; i < tabledata.loggroupnames.length; i++) {

    new_data.loggroupnames= props.loggroupnames[i];
    // new_data.level = props.level[i].toLowerCase();
    // new_data.logger = props.logger[i];
    // new_data.message = props.message[i];

    //push the object to the array
    dataFromtable.push(new_data);

    //new object instantiation
    new_data = Object.create(tabledata);
  }


  return dataFromtable;
}


const columns = [
  {
    Header: 'LogGroup Names',
    accessor:'loggroupnames',
    style:{
      textalign:"left"
    },
    width: 350,
    maxwidth:450,
    minwidth:250
  },

  {
    Header:'Error Percentage',
    accessor: 'error',
    style:{
      textalign:"left"
    },
    width: 250,
    maxwidth:300,
    minwidth:150
  },
 
  {
    Header:'Message',
    accessor:'message'

  }
];

return(


        <ReactTable
            columns = {columns}
            data= {newTableData()}
            defaultPageSize={20}
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

export default NewTable;
