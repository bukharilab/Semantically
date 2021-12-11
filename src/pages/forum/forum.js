import React, {useEffect, useState} from 'react';
import './forum.css';
import Sidebar from '../../components/Sidebar';
import ForumCard from './components/ForumCard';
import {Button, Tabs, Tab} from 'react-bootstrap';

import {getPosts} from './hooks/postAPI';

const Forum = () => {
  const [key, setKey] = useState('home');
  const [posts, setPosts] = useState([]);

  // fetch posts
  useEffect(() => getPosts(posts => setPosts(posts)), []);

  return (
    <div className="app">
      <Sidebar />
      <div id="home-panel">
        <header>
          <Button variant="light" size="lg" disabled>Ask Question</Button>
        </header>
        <main className="d-flex flex-column">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}>
          <Tab eventKey="home" title="My Questions">
            <div className="py-4">
            {posts.map(post => <ForumCard {...post} />)}
            </div>
          </Tab>
          <Tab eventKey="public" title="Public" disabled>

          </Tab>
        </Tabs>

        </main>
      </div>
    </div>
  );
}

export default Forum;
