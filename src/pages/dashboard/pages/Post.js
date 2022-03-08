import React, { useState } from 'react';
import {Card, Button, Modal, Form, Col, Row, } from 'react-bootstrap';

export default function Post() {
  const [openAnswerModal, updateOpenAnswerModal] = useState(false);

  return (
    <div id="post-panel">
      <header>
      <Card style={{ width: 'auto', padding: '.5rem' }}>
  <Card.Body>
    <Card.Title style={{ fontSize: '2rem' }}>Cancer</Card.Title>
    <Card.Subtitle className="mb-5 text-muted">Which ontology should I use?</Card.Subtitle>
    <Card.Text>
      Context: Omnis nihil <strong>cancer</strong> autem numquam autem sit.
    </Card.Text>
    <div className="text-right mt-4"><Button variant="outline-primary" size="lg" onClick={() => updateOpenAnswerModal(true)}>
    Answer
  </Button></div>
  </Card.Body>
</Card>

      </header>
      <main>
      {openAnswerModal ? <AnswerModal updateOpenAnswerModal={updateOpenAnswerModal} /> : null}

      <Card style={{ width: 'auto' }} className="mt-5">
  <Card.Body>
    <Card.Title>NCIT <small>{'<Best Answer>'}</small></Card.Title>
    <Card.Subtitle className="mb-2 text-muted">Steve Mb.</Card.Subtitle>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <div className="text-right mt-5">
    <Button variant="outline-success" size="sm" className="mr-3">UpVote</Button><strong>{' 5 '}</strong>
    <Button variant="outline-danger" size="sm" className="ml-3">DownVote</Button>
    </div>
  </Card.Body>
</Card>

<Card style={{ width: 'auto' }} className="mt-5">
<Card.Body>
<Card.Title>OBT</Card.Title>
<Card.Subtitle className="mb-2 text-muted">Steve Mb.</Card.Subtitle>
<Card.Text>
Some quick example text to build on the card title and make up the bulk of
the card's content.
</Card.Text>
<div className="text-right mt-5">
<Button variant="outline-success" size="sm" className="mr-3">UpVote</Button><strong>{' 2 '}</strong>
<Button variant="outline-danger" size="sm" className="ml-3">DownVote</Button>
</div>
</Card.Body>
</Card>
      </main>
    </div>
  );
}

function AnswerModal({updateOpenAnswerModal}) {
  const closeModal = () => updateOpenAnswerModal(false);

  return (
    <Modal.Dialog size="lg">
  <Modal.Body>
  <Form className="p-5">
  <Row className="mb-1">
  <Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
    <Form.Label>Select Ontology</Form.Label>
    <Form.Control as="select" size="md" custom>
      <option>NCIT</option>
      <option>OBT</option>
    </Form.Control>
  </Form.Group>
  </Row>
  <Form.Row>
<Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
  <Form.Label>Justification</Form.Label>
  <Form.Control type="text" placeholder="Normal text" />
</Form.Group>
</Form.Row>
  </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
    <Button variant="primary">Post</Button>
  </Modal.Footer>
</Modal.Dialog>
  )
}
