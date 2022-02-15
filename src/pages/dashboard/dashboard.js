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
  //////////////////// for algorithm testing
  var stats  = require('simple-statistics');
  const lower_bound = () => {
    var upvotes=9;
    var n=18;
    var confidence=0.95;
    // for performance purposes you might consider memoize the calcuation for z
    const z = stats.probit(1-(1-confidence)/2);
  
    // p̂, the fraction of upvotes
    const phat = 1.0 * upvotes / n;
  
    const result=(phat + z*z / (2*n) - z * Math.sqrt((phat * (1 - phat) + z*z / (4*n)) / n)) / (1 + z*z/n);
    console.log("results",result);
  }

  ////////////////////////End

  // fetch user documents
  useEffect(() => getDocuments(updateDocuments), []);

  useEffect(()=>lower_bound(),[]);

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
