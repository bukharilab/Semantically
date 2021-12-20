import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';

import {deleteDocument} from '../../hooks/dashboardAPIs';

export default function DeleteDocumentModal({updateShowDelDocModal, documents, 
    updateDocuments, doc_id}) {
  const handleClose = () => updateShowDelDocModal(false);

  const submit = () => {
    deleteDocument(doc_id, () => {
        // remove deleted document
        updateDocuments(documents.filter(doc => doc.doc_id !== doc_id));
    });
    handleClose();
  };

  return (
    <>
    <Modal
          show={true}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
        <Modal.Title>Deleting Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Are you sure? This operation is permanent!
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="danger" onClick={submit}>Delete</Button>
        </Modal.Footer>
    </Modal>
    </>

  )
}
