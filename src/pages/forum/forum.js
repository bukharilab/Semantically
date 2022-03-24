import React, { useEffect, useState } from "react";
import "./forum.css";
import Sidebar from "../../components/Sidebar";
import ForumCard from "./components/ForumCard";
import { Button, Tabs, Tab,Col,Row,Form } from "react-bootstrap";

import { getPosts, getAllPosts } from "./hooks/postAPI";

const Forum = () => {
  const [key, setKey] = useState("home");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  // add by asim for post deletion
  const postCardProps = {
    allPosts: allPosts,
    setAllPosts: setAllPosts,
    posts: posts,
    setPosts: setPosts,
  };
  const [del, setDelete] = useState(false);

  // fetch posts
  useEffect(
    () =>
      getPosts((posts) => {
        // sort posts
        posts.sort((post1, post2) => post2.responses - post1.responses);
        setPosts(posts);
      }),
    []
  );
  useEffect(() => getAllPosts((posts) => setAllPosts(posts)), []);

  ///Asim Code
 const [filter,setFilter] = useState('');
const searchPost = (event)=>{
  setFilter(event.target.value);
}

let dataSearch = posts.filter(item =>{
  return Object.keys(item).some(key => 
    item[key].toString().toLowerCase().includes(filter.toString().toLowerCase())
    )
});

let allPostSearch =  allPosts.filter(item => {
return Object.keys(item).some(key =>
  item[key].toString().toLowerCase().includes(filter.toString().toLowerCase())
  )
          
});

  return (
    <div className="app">
      <Sidebar />
      <div id="home-panel">
        <header>
          <Row>
          <Col>
          <Button variant="light" size="lg" disabled>
            Ask Question
          </Button>
          </Col>
          <Col className="text-center">
          <Form.Group className="mb-3">
            <Form.Control className="me-2" placeholder="Search Query" type="search" value={filter} onChange={searchPost.bind(this)}/>
          </Form.Group>
          </Col>
          </Row>
        </header>
        <main className="d-flex flex-column">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Tab eventKey="home" title="My Questions">
              <div className="py-4">
                {dataSearch.map((post) => (
                  <ForumCard {...post} publicPost={false} {...postCardProps} />
                ))}
              </div>
            </Tab>
            <Tab eventKey="public" title="Public">
              <div className="py-4">
                {allPostSearch.map((post) => (
                  <ForumCard {...post} publicPost={true} />
                ))}
              </div>
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Forum;
