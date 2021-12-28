import React, { useEffect, useState } from 'react';
import {Card, Button, Modal, Form, Col, Row, } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';

import {readPost, replyPost} from './hooks/postAPI';

export default function Post() {
  const { postId } = useParams();
  const [openAnswerModal, updateOpenAnswerModal] = useState(false);
  const [title, setTitle] = useState('');
  const [terminology, setTerminology] = useState('');
  const [ontology, setOntology] = useState('');
  const [context, setContext] = useState('');
  const [name, setName] = useState('');
  const [replies, setReplies] = useState([]);

  const updateReplies = () => {
    readPost(postId,
      ({post_title, terminology, curr_ontology, post_content, first_name, last_name}, replies) => {
        setTitle(post_title);
        setTerminology(terminology);
        setOntology(curr_ontology);
        setContext(post_content);
        setName(`${first_name} ${last_name}`);
        setReplies(replies);
      });
  }
  // fetch post info
  useEffect(() => updateReplies(), []);

  return (
    <div className="app">
    <Sidebar />
    <div id="post-panel" className="mx-auto">
      <header>
      <Card style={{ width: 'auto' }}>
      <Card.Header as="h5">
        <div className="d-flex justify-content-between">
          <span>{terminology}</span>
          <span>{ontology}</span>
        </div>
      </Card.Header>
      <Card.Body style={{ padding: '.5rem' }}>
      <div className="p-4">
        <Card.Title style={{ fontSize: '2rem' }}>{title}</Card.Title>
        <Card.Subtitle className="mb-5 text-muted">{name}</Card.Subtitle>
        <Card.Text>
          {context}
        </Card.Text>
        <div className="text-right mt-4"><Button variant="outline-primary" size="lg" onClick={() => updateOpenAnswerModal(true)}>
        Answer
      </Button></div></div>
      </Card.Body>
    </Card>

      </header>
      <main>
      {openAnswerModal ? <AnswerModal updateOpenAnswerModal={updateOpenAnswerModal} postId={postId} updateReplies={updateReplies} /> : null}

      {replies.map(({ontology, reply_content, first_name, last_name}) =>

        <Card style={{ width: 'auto' }} className="mt-5">
          <Card.Body>
            <Card.Title>{ontology}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{`${first_name} ${last_name}`}</Card.Subtitle>
            <Card.Text>
              {reply_content}
            </Card.Text>
            <div className="text-right">
              <Button variant="outline-success" size="sm" className="mr-3" disabled>UpVote</Button>
              <strong>{' 0 '}</strong>
              <Button variant="outline-danger" size="sm" className="ml-3" disabled>DownVote</Button>
            </div>
          </Card.Body>
        </Card>

      )}
      </main>
    </div>
    </div>
  );
}

function AnswerModal({postId, updateReplies, updateOpenAnswerModal}) {
  const closeModal = () => updateOpenAnswerModal(false);
  const [ontology, setOntology] = useState('NCIT');
  const [content, setContent] = useState('');

  return (
    <Modal.Dialog size="lg">
  <Modal.Body>
  <Form className="p-5">
  <Row className="mb-1">
  <Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
    <Form.Label>Select Ontology</Form.Label>
    <Form.Control as="select" size="md" value={ontology} onChange={evt => setOntology(evt.target.value)} custom>
      <option value="LOINC">LOINC</option>
      <option value="VO">VO</option>
      <option value="DOID">DOID</option>
      <option value="GSSO">GSSO</option>
      <option value="ICPC2P">ICPC2P</option>
      <option value="BAO">BAO</option>
      <option value="NIFSTD">NIFSTD</option>
      <option value="COVID">COVID-19</option>
      <option value="OHPI">OHPI</option>
      <option value="DTO">DTO</option>
      <option value="OHMI">OHMI</option>
      <option value="OBIB">OBIB</option>
      <option value="VICO">VICO</option>
      <option value="KTAO">KTAO</option>
      <option value="EFO">EFO</option>
      <option value="HTN">HTN</option>
      <option value="RBO">RBO</option>
      <option value="ODAE">ODAE</option>
      <option value="MELO">MELO</option>
      <option value="NCIT">NCIT</option>
      <option value="IOBC">IOBC</option>
      <option value="CANCO">CANCO</option>
      <option value="CCONT">CCONT</option>
      <option value="NCRO">NCRO</option>
    </Form.Control>
  </Form.Group>
  </Row>
  <Form.Row>
<Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
  <Form.Label>Reason</Form.Label>
  <Form.Control as="textarea" rows={3} value={content} onChange={evt => setContent(evt.target.value)} />
</Form.Group>
</Form.Row>
  </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
    <Button variant="primary" onClick={() => replyPost(postId, ontology, content,
      () => { updateReplies(); closeModal(); })}>Post</Button>
  </Modal.Footer>
</Modal.Dialog>
  )
}
