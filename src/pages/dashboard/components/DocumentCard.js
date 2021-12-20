import {Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import DeleteDocumentModal from '../components/modals/DeleteDocumentModal';

export default function DocumentCard(deleteDocProps) {
  const {doc_id, doc_name, description, showDelDocModal} = deleteDocProps;
  const deleteDoc = () => deleteDocProps.updateShowDelDocModal(true);
  return (
    <>
      <Card style={{ width: '18rem' }} className="document-card">
        <Card.Body>
          <Card.Title>{doc_name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted text-smal">Last modified: Jan 2, 2021</Card.Subtitle>
          <Card.Text>
            {description}
          </Card.Text>
          <Card.Link><Link to={`/document/${doc_id}`}>edit</Link></Card.Link>
          <Card.Link><Button variant="link" onClick={deleteDoc}>delete</Button></Card.Link>
        </Card.Body>
      </Card>
      {showDelDocModal ? <DeleteDocumentModal {...deleteDocProps} /> : null}
    </>
  );
}
