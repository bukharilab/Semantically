import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

import {createDocument} from '../../hooks/dashboardAPIs';

export default function NewDocumentModal({updateShowNewDocModal}) {
  const handleClose = () => updateShowNewDocModal(false);
  const acceptedExtensions = ['.txt'];


  const uploadFile = upload => {
    const name = upload.name;
    if (acceptedExtensions.some(ext => name.endsWith(ext))) {
      updateFile(upload);
      updateValidFile(true);
    } else {
      updateValidFile(false);
    }
  }


  const [title, updateTitle] = useState("");
  const [desc, updateDesc] = useState("");
  const [file, updateFile] = useState(null);
  const [validFile, updateValidFile] = useState(true);
  const [newDocumentId, setNewDocumentId] = useState('');

  const submit = () => {
    createDocument(title, desc, '', setNewDocumentId);
  }

  if (file !== null) {
    // Promise.resolve(file.text()).then(val => console.log(val));
    console.log(file);
  }
  return (
    <>
    {newDocumentId ? <Redirect to={`/document/${newDocumentId}`} /> :
    <Modal
          show={true}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
          <Form.Group>
          <Form.Label htmlFor="document-name">Title</Form.Label>
            <Form.Control
            value={title}
            onChange={evt => updateTitle(evt.target.value)}
            type="text"
            id="document-name"
            />
            </Form.Group>
            <Form.Group>
            <Form.Label htmlFor="document-desc">Description</Form.Label>
              <Form.Control
              value={desc}
              onChange={evt => updateDesc(evt.target.value)}
              as="textarea"
              rows={3}
              id="document-desc"
              />
              </Form.Group>
              <Form.Group>
                <Form.File
                  onChange={evt => uploadFile(evt.target.files[0])}
                  id="starter-file"
                  label={file ? file.name : "Upload starter document"}
                  isInvalid={!validFile}
                  feedback={!validFile ? "Unsupported file extension" : ""}
                  custom
                />
              </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" disabled={!(title && desc && validFile)} onClick={submit}>Create</Button>
          </Modal.Footer>
        </Modal>
      }
        </>

  )
}
