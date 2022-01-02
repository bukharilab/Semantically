import {Modal, Button} from 'react-bootstrap';

export default function RemoveAnnotationsModal({resetAnnotations, updateShowRemoveAnnotationsModal, callback, removeAnnotationMsg}) {
  const handleClose = () => updateShowRemoveAnnotationsModal(false);
  const submit = () => {
      resetAnnotations();
      handleClose();
      callback();
  }

  return (
    <Modal
          show={true}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
        <Modal.Title>Removing All Annotations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {removeAnnotationMsg}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="danger" onClick={submit}>Remove All</Button>
        </Modal.Footer>
    </Modal>
  )
}
