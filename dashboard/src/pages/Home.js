import DocumentCard from '../components/DocumentCard';

export default function Home() {
  return (
    <div id="home-panel">
      <header>
        <button className="button is-light is-medium" onClick={() => console.log('Database connection failed. Unable to connect to host.')}>New Document</button>
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
