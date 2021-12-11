import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function ForumCard({post_id, post_title, terminology, curr_ontology, post_content}) {
  return (

    <div className="d-inline-block forum-card mr-3 mb-3">
  <Card style={{ width: '18rem' }}>
  <Card.Body>
    <Card.Title>{post_title}</Card.Title>
    <Card.Subtitle className="mb-2 text-muted text-smal">{`${terminology}: ${curr_ontology}`}</Card.Subtitle>
    <Card.Text>
      {post_content}
    </Card.Text>
    <Card.Link><Link to={`/post/${post_id}`}>open</Link></Card.Link>
    <Card.Link href="#">delete</Card.Link>
  </Card.Body>
</Card>
</div>



  );
}
