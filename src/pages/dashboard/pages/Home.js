import DocumentCard from '../components/DocumentCard';
import {Button} from 'react-bootstrap';

export default function Home() {
  return (
    <div id="home-panel">
      <header>
        <Button variant="light">New Document</Button>
      </header>
      <main>
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
      </main>
    </div>
  );
}
