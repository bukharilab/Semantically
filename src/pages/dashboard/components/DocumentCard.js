import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function DocumentCard({doc_id, doc_name, description}) {
  return (
    <Card style={{ width: '18rem' }} className="document-card">
  <Card.Body>
    <Card.Title>{doc_name}</Card.Title>
    <Card.Subtitle className="mb-2 text-muted text-smal">Last modified: Jan 2, 2021</Card.Subtitle>
    <Card.Text>
      {description}
    </Card.Text>
    <Card.Link><Link to={`/document/${doc_id}`}>edit</Link></Card.Link>
    <Card.Link href="#">delete</Card.Link>
  </Card.Body>
</Card>



  );
}
