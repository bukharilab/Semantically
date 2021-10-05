export default function DocumentCard() {
  return (
    <div className="card document-card is-small">
      <header class="card-header">
        <p class="card-header-title">
          Document Title
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          Lorem ipsum dolor sit amet, consectetur...
        </div>
      </div>
      <footer className="card-footer">
        <a href="#" className="card-footer-item">Open</a>
        <a href="#" className="card-footer-item">Delete</a>
      </footer>
    </div>
  );
}
