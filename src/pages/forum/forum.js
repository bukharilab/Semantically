import React, {useEffect, useState} from 'react';
import './forum.css';
import Sidebar from '../../components/Sidebar';
import ForumCard from './components/ForumCard';
import {Button, Tabs, Tab} from 'react-bootstrap';
import TextField from "@mui/material/TextField";
import {getPosts, getAllPosts, getDirectPosts, getUserReplies} from './hooks/postAPI';
import { Graph } from "react-d3-graph";
import {Link} from "react-router-dom";
import * as d3 from "d3"


const Forum = () => {
  const [key, setKey] = useState('home');
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [directPosts, setDirectPosts] = useState([]);


  const [inputData, setInputData] = useState("");
  const [replies, setReplies] = useState([]);
  const [name, setName] = useState("");
  const [reset, setReset] = useState(false)
  const [title, setTitle] = useState(false)
  const [graph, showGraph] = useState(false)
    const[nodeArray, setNodeArray] = useState([]);
    const[linkArray, setLinkArray] = useState([]);
  let inputHandler = (e) => {

    setInputData(e.target.value)
  }

  

// add by asim for post deletion
const postCardProps = {
  allPosts: allPosts,
  setAllPosts: setAllPosts,
  posts: posts,
  //replies: replies,
  setPosts:setPosts,
  directPosts: directPosts,
  setDirectPosts: setDirectPosts
};
const resetGraph = () => {
  setNodeArray([])
  setLinkArray([])
  setReplies([])
  setReset(false)
  setTitle(false)
}
const searchUser = (a) => {
  
  setTitle(true)
  console.log("Before flush",nodeArray)
  setReset(true)
  console.log("After flush",nodeArray)
  var name = a;
  setName(a)
  const myName = name.split(" ");
  console.log(myName[0],myName[1])
  getUserReplies(myName[0], myName[1], replies => {
    console.log("Retrieval of data successful");
    setReplies(replies);
    console.log(replies[0].first_name)
    console.log(replies)
    setName(replies[0].first_name+" "+replies[0].last_name)
    
    nodeArray.push({id: name, color: "purple"})
    
  {replies.map((val)=> {
    
    
    nodeArray.push({id: val.reply_content, group: 1})
    nodeArray.push({id: val.ontology, group: 2})
    nodeArray.push({id: val.profile_rank, group: 3})
    /*
    nodeArray.push({id: val.vote_up, group: 3})
    
    nodeArray.push({id: val.vote_down, group: 5})
    */
   
    linkArray.push({source: val.profile_rank, target: name, value: 10, distance: 100})

    
    linkArray.push({source: val.ontology, target: val.reply_content, value: 10, distance: 100})
    /*
    linkArray.push({source: val.vote_up, target: val.reply_content, value: 10, distance: 100})
    
    
    linkArray.push({source: val.vote_down, target: val.reply_content, value: 10, distance: 100})
*/
    linkArray.push({source: val.reply_content, target: name, value: 10, distance: 100});
    
   
    
    
   console.log(nodeArray)    
   console.log(linkArray)  
  }
  
  )
  Chart(data)
  }
  });
  
  //setNodeArray({id:a, color: "red"})
  //displayGraph();
}

/*
const searchUser = (a) => {

  setTitle(true)
  console.log("Before flush",nodeArray)
  setReset(true)
  console.log("After flush",nodeArray)
  var name = a;
  setName(a)
  const myName = name.split(" ");
  console.log(myName[0],myName[1])
  getUserReplies(myName[0], myName[1], replies => {
    console.log("Retrieval of data successful");
    setReplies(replies);
    console.log(replies[0].first_name)
    console.log(replies)
    setName(replies[0].first_name+" "+replies[0].last_name)
    
    nodeArray.push({id: name, color: "purple"})
    
  {replies.map((val)=> {
    
    
    nodeArray.push({id: val.reply_content, color: "blue"})
    nodeArray.push({id: val.ontology, color: "magenta"})
    nodeArray.push({id: val.profile_rank, color: "orange"})
    
    nodeArray.push({id: val.vote_up, color: "green"})
    nodeArray.push({id: val.vote_down, color: "red"})

   
    linkArray.push({source: val.profile_rank, target: name})

    //linkArray.push({source: val.reply_content, target: name})
    linkArray.push({source: val.ontology, target: val.reply_content})
    linkArray.push({source: val.reply_content, target: name});
    
    linkArray.push({source: val.vote_up, target: val.reply_content})
    linkArray.push({source: val.vote_down, target: val.reply_content})
    
    
   console.log(nodeArray)      
  }
 
  )
  showGraph(true)
  }
  });
  
  //setNodeArray({id:a, color: "red"})
  //displayGraph();
}
*/
const data = {
  //nodes: [{ id: pTitleString, color: "red"}, { id: "Sally", color: "purple"}, { id: "Alice" }],
  nodes: nodeArray,
  links: linkArray,
};


const Chart = (data) => {
    
  // Specify the dimensions of the chart.
  const width = 928;
  const height = 600;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));
  console.log(links)
  console.log(nodes)
  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(linkDistance).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      
      .on("tick", ticked);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke-length", 100);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
      .attr("r", 20)
      .attr("fill", d => color(d.group))
      

  node.append("title")
      .text(d => d.id);
      
      var label = svg.selectAll(".mytext")
      .data(nodes)
      .enter()
      .append("text")
        .text(function (d) { return d.id; })
        .style("text-anchor", "middle")
        .style("fill", "#000")
        .style("font-family", "Arial")
        .style("font-size", 12);
   /*
  const text = node.append("text")
  .text(function(d) { return d.id; });
*/
  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
        
  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    label
        .attr("x", function(d){ return d.x; })
        .attr("y", function (d) {return d.y - 10; });
  }
  function linkDistance(d) {
    return d.distance;
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  
  console.log(svg.node())
  d3.select('#graph').append(()=>svg.node());
  return svg.node();
};

// the graph configuration, just override the ones you need
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 1000,
    highlightStrokeColor: "blue",
    fontSize: 15,
  },
  link: {
    highlightColor: "lightblue",
  },
};


      
      
const onClickNode = function(nodeId) {
 
  
};

const onClickLink = function(source, target) {
  window.alert(`Clicked link between ${source} and ${target}`);
};

const [del, setDelete] = useState(false);

  // fetch posts
  useEffect(() => getPosts(posts => {
    // sort posts
    posts.sort((post1, post2) => post2.responses - post1.responses);
    setPosts(posts);
  }), []);
  useEffect(() => getAllPosts(posts => setAllPosts(posts)), []);
  useEffect(() => getDirectPosts(posts => setDirectPosts(posts)), []);
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
            {posts.map(post => <ForumCard {...post} publicPost={false} {...postCardProps}/>)}
            </div>
          </Tab>
          <Tab eventKey="public" title="Public">
            <div className="py-4">
              {allPosts.map(post => <ForumCard {...post} publicPost={true} {...postCardProps}/>)}
            </div>
          </Tab>
          <Tab eventKey="direct_questions" title="Direct Questions">
            <div className="py-4">
              {directPosts.map(post => <ForumCard {...post} publicPost={false} {...postCardProps}/>)}
            </div> 
          </Tab>
          
          <Tab eventKey="knowledge_graph" title="Knowledge Graph">
          
            <div className="py-4">
            <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={inputHandler}
          label="Search for an expert"
        />

            <p> {inputData}</p>
            <Button onClick={() => searchUser(inputData)}> Search </Button>
            <Button onClick={() => Chart(data)}> Generate Graph</Button>
            {title ? (
                 <h2> Search results for: {name} </h2>
            ) :null}
       <div id="graph">

       </div>

            
  <p> Replies: </p>
            {replies.map((val)=> (
                    
                   
                    <tr key={val.post_reply_id}>
                       <td > {val.reply_content} </td>
                      
                       
                    </tr>
                   
                  ))
                
                  }
                  <br></br>
                  {reset ? (
                     <Button onClick={() => resetGraph()}> Reset Graph</Button>
                  ) :null}
              </div>


            </Tab>
            
        </Tabs>

        </main>
      </div>
    </div>
  );
}

export default Forum;
