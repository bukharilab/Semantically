import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import './dashboard.css';
import Sidebar from '../../components/Sidebar';
import DocumentCard from './components/DocumentCard';
import NewDocumentModal from './components/modals/NewDocumentModal';
import {Button} from 'react-bootstrap';

import {getDocuments} from './hooks/dashboardAPIs';

const Dashboard = ({loggedIn}) => {
  const [showNewDocModal, updateShowNewDocModal] = useState(false);
  const [documents, updateDocuments] = useState([]);
  const newDocModalProps = {
    updateShowNewDocModal: updateShowNewDocModal
  };

  const docCardProps = {
    documents: documents,
    updateDocuments: updateDocuments
  };

  // fetch user documents
  useEffect(() => getDocuments(updateDocuments), []);

  return (
    <>
      {!loggedIn ?
        <Redirect to="/login" />:
        <div className="app">
          <Sidebar />
          <div id="home-panel">
            <header>
              <Button variant="light" size="lg"
                onClick={() => updateShowNewDocModal(true)}>New Document</Button>
            </header>
            <main>
              {documents.map(document => <DocumentCard {...document} {...docCardProps} />)}
            </main>
          </div>
          {showNewDocModal ? <NewDocumentModal {...newDocModalProps} /> : null}
        </div>
      }
    </>
  );
}

export default Dashboard;
