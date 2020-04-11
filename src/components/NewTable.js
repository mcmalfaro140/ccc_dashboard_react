
import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";



function NewTable (props) {

//Object to hold the data for a single log event
const tabledata = {
  loggroupnames : props.logGroups,
  recordsmatched:props.recordsmatched,
  logger:"",
  message:"",
  scannedLogStreams:props.scannedLogStreams
};


//Json Array for the log events
var dataFromtable = [];

function newTableData () {
  var new_data = Object.create(tabledata);

  for (var i = 0; i < tabledata.loggroupnames.length; i++) {

    new_data.loggroupnames = props.loggroupnames[i];
    new_data.recordsmatched = props.recordsmatched[i];
    new_data.scannedLogStreams = props.scannedLogStreams[i];


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
    Header:'Records Matched',
    accessor: 'recordsmatched',
    style:{
      textalign:"left"
    },
    width: 200,
    maxwidth:200,
    minwidth:150
  },
 
  {
    Header:'Message',
    accessor:'scannedLogStreams'

  }
];

//Subrow component to display errror messages briefly
const subComponent = row => {
    return (
      <div>
        {row.original.types.map((type, id) => {
          return (
            <div className='subRow' key={ id }>{ type.name }</div>
          );
        })}
      </div>
    );
  };
  

return(
    
    

        <ReactTable
            columns = {columns}
            Subcomponent = {subComponent}
            expandedRows={ true }
            data= {newTableData()}
            defaultPageSize={5}
            getTdProps={(state, rowInfo, column, instance,...rest) => {
                return {
                  onClick: (e, handleOriginal) => {
                console.log('A Td Element was clicked!')
                console.log('it produced this event:', e)
                console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo)
                console.log('It was in this table instance:', instance.props.data)
         
                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
        }}

        >
        {(state, makeTable, instance,rowInfo, column,...rest) => {
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
