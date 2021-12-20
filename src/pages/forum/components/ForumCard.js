import {Card, Button, Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function ForumCard({post_id, post_title, terminology, 
  curr_ontology, post_content, responses, publicPost}) {
  return (

    <div className="d-inline-block forum-card mr-3 mb-3">
  <Card style={{ width: '18rem' }}>
  <Card.Header className="text-right p-1"><Badge variant={publicPost ? 'light' : 'dark'}>
    {`${responses} ${responses == 1 ? 'response' : 'responses'}`}
    </Badge></Card.Header>
  <Card.Body>
    <Card.Title className="">
      <span>{post_title}</span>

        

    </Card.Title>
    <Card.Subtitle className="mb-2 text-muted text-smal">{`${terminology}: ${curr_ontology}`}</Card.Subtitle>
    <Card.Text>
      {post_content}
    </Card.Text>
    <Card.Link><Link to={`/post/${post_id}`}>open</Link></Card.Link>
    {!publicPost ? <Card.Link href="#">delete</Card.Link> : null}
  </Card.Body>
</Card>
</div>



  );
}
