import React,{useState} from 'react';
import {Card, Button, Modal, Row, Form, Col, Accordion, FormControl, Dropdown} from 'react-bootstrap';
import {createPost} from '../../forum/hooks/postAPI';
import {postAddresses} from '../../../appInfo';
import {Link} from "react-router-dom";
import {createDirectPost} from '../../forum/hooks/postAPI';

const AskQuestion = ({word, ontology, updateOpenPostModal, currentHighlight, annotationSelection, annotations, expert, updateShowExpert, showExpert, updateExpert}) => {
  
  const [context, updateContext] = useState("");
  const [expertID, updateExpertID] = useState(0);
  const questions = [
    "Which ontology should I use?",
    "What is the suitable ontology vocabulary?",
    "Does this ontology best describe this terminology?"
  ];
  const [question, updateQuestion] = useState(0);
  const [questionOntology, updateQuestionOntology] = useState(annotationSelection[currentHighlight]);

  const acronyms = annotations[currentHighlight].reduce((ontologies, ontology) => ontologies.concat(ontology.acronym), []);

  const closeModal = () => updateOpenPostModal(false);

  const submit = () => {
    updateExpertID(expert[0])
    if(showExpert){
      alert(expert[0])
      createDirectPost(questions[question], word, acronyms[questionOntology], context, expert[0], post_id => {
         window.open(`${postAddresses.post}/${post_id}`,"_self");
         closeModal();
       });
    }
    else {
    createPost(questions[question], word, acronyms[questionOntology], context, post_id => {
     window.open(`${postAddresses.post}/${post_id}`,"_self");
      closeModal();
    
    });
  }
  }
  return (
    <Modal
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      
    >
      <Modal.Header closeButton onHide={closeModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          {'Ask Question'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        
        <Form>
         
         {showExpert ? (
          <div>
            <table id = "tableFormat" class = "table">
              <th  id = "headerRow"> Expert Credentials </th>
              <tbody> 
                  <tr>
                    <th> ID </th>
                    <th> User name </th>
                    <th> Weighted score</th>
                    <th> Similarity score</th>
                  </tr>
                  <tr>
                    <td>{expert[0]}</td>
                    <td>{expert[1]}</td>
                    <td>{expert[2]}</td>
                    <td>{expert[3]}</td>
                  </tr>
              </tbody>
            </table> 
         </div>
         ):null
         
         }
       
        <Row className="mb-1">
          <Form.Group as={Col} controlId="term">
            <Form.Label>Terminology</Form.Label>
            <Form.Control type="text" value={word} disabled />
          </Form.Group>
          <Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
            <Form.Label>Question</Form.Label>
            <Form.Control as="select" size="md" value={question} onChange={evt => updateQuestion(evt.target.value)} custom>
            
              {questions.map((question, index) => <option value={index}>{question}</option>)}
            </Form.Control>
          </Form.Group>
        </Row>
        <Row className="mb-1">
          <Form.Group as={Col} controlId="term">
            <Form.Label>Please explain</Form.Label>
            <Form.Control as="textarea" rows={3} value={context} onChange={evt => updateContext(evt.target.value)} placeholder="Elaborate on your question..." />
          </Form.Group>
        </Row>
        {question == 2 ?
        <Row className="mb-1">
        <Form.Group as={Col} controlId="exampleForm.SelectCustomSizeLg">
          <Form.Label>Select Ontology</Form.Label>
          <Form.Control as="select" size="md" value={questionOntology} onChange={evt => updateQuestionOntology(evt.target.value)} custom>
            {acronyms.map((acronym, idx) => <option value={idx}>{acronym}</option>)}
          </Form.Control>
        </Form.Group>
        </Row> : null }
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button onClick={closeModal} variant="secondary">Close</Button>
    <Button variant="primary" onClick={() => submit()}>Submit</Button>
    
      </Modal.Footer>
    </Modal>
  )
};

export default AskQuestion;
