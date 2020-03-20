import React, { Component,useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Checkbox ,Modal, Col,Row} from 'react-bootstrap';


function LogTableForm(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const name = [props]
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Log Table Form</Modal.Title>
          </Modal.Header>
        <Modal.Body >
     
        <Form>
                <Form.Row>
                    <Col>
                        <Form.Check type="checkbox" label="App1" controlId="LogGroupOne"/>
                        <Form.Check type="checkbox" label="Log Group 2" />
                        <Form.Check type="checkbox" label="Log Group 3" />
                        <Form.Check type="checkbox" label="Log Group 4" />

                    </Col>

                    <Col>
                        <Form.Check type="checkbox" label="Log Group 5" />
                        <Form.Check type="checkbox" label="Log Group 6" />
                        <Form.Check type="checkbox" label="Log Group 7" />
                        <Form.Check type="checkbox" label="Log Group 8" />

                    </Col>

                    <Col>
                        <Form.Check type="checkbox" label="Log Group 9" />
                        <Form.Check type="checkbox" label="Log Group 10 " />
                        <Form.Check type="checkbox" label="Log Group 11" />
                        <Form.Check type="checkbox" label="Log Group 12" />

                    </Col>
                </Form.Row>
                <Form.Group as={Row} controlId="formHorizontalCheck">
                        <Col sm={{ span: 10, offset: 4 }}>
                        <Form.Check label="Select All" />
                        </Col>
            </Form.Group>

        </Form> 

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
export default LogTableForm