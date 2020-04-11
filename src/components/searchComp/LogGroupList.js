import React from 'react';
import { Card, CardBody, Table} from 'reactstrap';
import '@lls/react-light-calendar/dist/index.css'

class LogGroupList extends React.Component {
    render(){
        const items = this.props.results.map((item, i) => {
            return(
                <tr key={i} className="row_results">
                    <th className="col_results" scope="row">{item.events.length}</th>
                    <td onClick={() => this.props.setId(i)}>{item.logGroupName}</td>
                </tr>
            )
        });

        return(
            <div>
                <Card className="card-box"> 
                    <CardBody>
                        <Table hover > 
                            <thead >
                                <tr className="table_header">
                                    <th ><h3>Found</h3></th>
                                    <th><h3>Log Group Names</h3></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default LogGroupList;