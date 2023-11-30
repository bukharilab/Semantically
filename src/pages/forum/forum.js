import React, {useEffect, useState} from 'react';
import './forum.css';
import Sidebar from '../../components/Sidebar';
import ForumCard from './components/ForumCard';
import {Button, Tabs, Tab, Dropdown, DropdownButton} from 'react-bootstrap';
import TextField from "@mui/material/TextField";
import {getPosts, getAllPosts, getDirectPosts, getUserReplies, getTermResults, getOntology, getAllUsers} from './hooks/postAPI';
import natural from "natural"
import * as d3 from "d3"
import nlp from "compromise"

const Forum = () => {

  //This is where all states of data are instantiated. These are used to store data for the graph components and user inputs in the Knowledge Graph tab
  //States are a react component which are
  const [key, setKey] = useState('home');
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [directPosts, setDirectPosts] = useState([]);
  const [searchForUser, setSearchUser] = useState(false);
  const [searchMedicalTerm, setSearchMedicalTerm] = useState(false)
  const [term, setTerm] = useState(false)
  const [terminologyResults, setTerminologyResults] = useState([])
  const [inputData, setInputData] = useState("");
  const [replies, setReplies] = useState([]);
  const [name, setName] = useState("");
  const [searchOntology, setSearchOntology] = useState([]);
  const [title, setTitle] = useState(false)
  const [ontology, setOntology] = useState(false)
  const [ontologyResults, setOntologyResults] = useState([])
    const[nodeArray, setNodeArray] = useState([]);
    const[linkArray, setLinkArray] = useState([]);
    const[userNameArray, setUserNameArray] = useState([])
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

//This function resets the graph data to avoid duplication of data. All data is reset so that it reflects the current data being used for visualization.
const resetGraph = () => {
  setNodeArray([])
  setLinkArray([])
  setReplies([]) 
  
  setTitle(false)
}

const processNameQuery = (a) => {
  var tokenizer = new natural.WordTokenizer()
  const getName = tokenizer.tokenize(a)
  let doc = nlp(a).people().text()
  
  console.log(getName)
  console.log(doc)
  return doc
}
const processOntologyQuery = (a) =>{
  var tokenizer = new natural.SentenceTokenizer()
  const getOntology = natural.PorterStemmer.tokenizeAndStem(a)

}
const processTermQuery = (a) =>{
  let doc = nlp(a)
  
}
//This function is invoked when the user clicks the search button. The function first resets the graph and then determines whether the input is an ontology, medical term or expert user.
//Once it parses the meaning of the input, it then sends an api call for the relevant data from the database. The backend will return an array of data containing the data related to the input.
//For example, if the search input is the name of an expert, it will return all of their replies to forum posts, the ontologies and terminologies they recommend and the critical reception of their answers from other community members.
const searchInput = (a) => {

  resetGraph()
  d3.selectAll("svg").remove()
  if(searchForUser) { 
  var name = processNameQuery(a)
  setTitle(true)
  
  setName(name)
  console.log(name)
  var nameArray = name.split(" ")
  console.log(nameArray)
  //Sends an api call to the database.
  getUserReplies(nameArray[0], nameArray[1], replies => {

    console.log("Retrieval of data successful");
    //This line of code updates the state of the replies array to the replies retrieved from the database. This will be used for when users click on a node, the replies array will be used to compare to the node's reply content and then redirect to the page that leads to the page with the corresponding post id.
    setReplies(replies);
    setName(replies[0].first_name+" "+replies[0].last_name)
    //Push the root node first.
    nodeArray.push({id: name, color: "purple"})
  //For every object in the array, a node will be generated and linked to its related node.
  {replies.map((val)=> {
    //If statements are used to make sure that no two nodes with the same exact data can be replicated. In d3.js, if a node with the same exact data is found in the array used to generate the nodes, it will not link with any nodes and will float away.
    if(!nodeArray.find(n => n.id === val.reply_content)){
    nodeArray.push({id: val.reply_content, group: 1})
    }
    if(!nodeArray.find(n => n.id === val.ontology)){
      nodeArray.push({id: val.ontology, group: 2})
    }
    if(!nodeArray.find(n => n.id === val.profile_rank)){
    nodeArray.push({id: val.profile_rank, group: 3})
    }
    //Also, if statements are used to ensure that no null values are used.
    if(!(val.vote_up == null)){
      if(!nodeArray.find(n => n.id === val.vote_up)){
      nodeArray.push({id: val.vote_up, group: 4})
      
      }
      linkArray.push({source: val.vote_up, target: val.reply_content, value: 10, distance: 200})
      
      
    }
    if(!(val.vote_down == null)){
      if(!nodeArray.find(n => n.id === val.vote_down)){
      nodeArray.push({id: val.vote_down, group: 4})
      
      }
      linkArray.push({source: val.vote_down, target: val.reply_content, value: 10, distance: 200})
      
      
    }
    
     

    linkArray.push({source: val.profile_rank, target: name, value: 10, distance: 200})

    
    linkArray.push({source: val.ontology, target: name, value: 10, distance: 200})
    
    
    
    
    

    linkArray.push({source: val.reply_content, target: val.ontology, value: 10, distance: 200});
    
   
    
    
   
  }
  
  )
  
  }
  //After all the nodeArray and LinkArray arrays are populated, the function will generate a graph with the data.
  //The process is the same for the medical term and ontology inputs but with different data being retrieved from the api.
  Chart(data, replies)
  
  });
  
}
if(searchMedicalTerm){
  resetGraph()
  d3.selectAll("svg").remove()
  setTitle(true)
console.log("Before flush",nodeArray)

console.log("After flush",nodeArray)
var term = a;
setTerm(term)
getTermResults(term, terminology =>
  {
    console.log("Retrieval of data successful", terminology);
     setTerminologyResults(terminology)
     console.log(terminologyResults)
     nodeArray.push({id: term, group:5})
     {terminology.map((val) => {
      console.log("Start insertion")
      
      if(!nodeArray.find(n => n.id === val.curr_ontology)){
        nodeArray.push({id: val.curr_ontology, group: 1})
      }
      
      nodeArray.push({id: val.post_content, group: 2})
      
      linkArray.push({source: val.curr_ontology, target: term, value: 10, distance: 200})
      linkArray.push({source: val.post_content, target: val.curr_ontology, value: 10, distance: 200})
      
     
     }
      )
     
     }
     Chart(data,terminology)
  });
  
  
}
  //setNodeArray({id:a, color: "red"})
  //displayGraph();
  if(searchOntology){
    
    setTitle(true)
  console.log("Before flush",nodeArray)
  
  console.log("After flush",nodeArray)
  var ontology_term = a;
  setOntology(ontology_term)
  getOntology(ontology_term, ontology_result =>
    {
      console.log("Retrieval of data successful", ontology_result);
       setOntologyResults(ontology_result)
       console.log(ontologyResults)
       nodeArray.push({id: ontology_term, group:5})
       {ontology_result.map((val) => {
        console.log("Start insertion")
        if(!nodeArray.find(n => n.id === val.terminology)){
        nodeArray.push({id: val.terminology,  group: 1})
        }
        if(!nodeArray.find(n => n.id === val.post_content)){
        nodeArray.push({id: val.post_content, group: 2})
        }
        linkArray.push({source: val.terminology, target: ontology_term, value: 10, distance: 200})
        linkArray.push({source: val.post_content, target: val.terminology, value: 10, distance: 200})
        
       
       }
        )
       
       }
       Chart(data, ontology_result)
    });
    
    
  }
}

// This is the data that will be used for generating the nodes, links and their values to represent the data as a knowledge graph.
const data = {
  
  nodes: nodeArray,
  links: linkArray,
};
//These functions are used for switching between different search query prompts when the user selects a dropdown item.
const openUserSearchBar = () => {
     setSearchMedicalTerm(false)
     setSearchOntology(false)
     setSearchUser(true)
}
const openMedicalTerm = () => {
     setSearchUser(false)
     setSearchOntology(false)
     setSearchMedicalTerm(true)
}
const openOntologySearchBar = () => {
  setSearchOntology(true)
  setSearchMedicalTerm(false)
  setSearchUser(false)
}

//This function is for redirecting a user to a specific post based on the data from the node that was clicked.
function redirectToPost (e, f){
console.log(e[0].id)
var nodeData = e[0].id;
f.map((val) => {

   if(val.reply_content == nodeData)
    window.open("http://localhost:3000/post/"+val.post_id)

   else if(val.post_content == nodeData)
    window.open("http://localhost:3000/post/"+val.post_id)

   
})
 

}
//------------------------------------------------------------------//
//Graph Generation code
const Chart = (data, replyData) => {
    
  // Specify the dimensions of the chart.
  const width = 1500;
  const height = 800;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));
  console.log("Links",links)
  console.log("Nodes",nodes)
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
      .attr("r", 40)
      .attr("fill", d => color(d.group))
    .on("click",function(d){
      console.log("Clicked",replyData)
      
      var data = d3.select(this).data()
      console.log(data)
      redirectToPost(data, replyData)
        
         
      
       
      
      
      
    });


  node.append("title")
      .text(d => d.id);
      
      var label = svg.selectAll(".mytext")
      .data(nodes)
      .enter()
      .append("text")
      //Sets the text for each node.
        .text(function (d) { return d.id; })
        .style("text-anchor", "middle")
        .style("fill", "#000")
        .style("font-family", "Arial")
        .style("font-size", 16);
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
          

          {/* 
          From down here, you will find the code that defines the knowledge graph tab.
          

          */}
          <Tab eventKey="knowledge_graph" title="Knowledge Graph">
          <div class="jumbotron bg-dark text-white">


          <h1> Knowledge Graph </h1>
          </div>
        <p> Choose what to search for and input to the search bar for results. To redirect to a post, click on a node.</p>

        {/* Dropdown component for the user to select between different search query types (Expert, Medical term, Ontology) */}
         <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Search type
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => openUserSearchBar()}> User </Dropdown.Item>
        <Dropdown.Item onClick={() => openMedicalTerm()}> Medical term </Dropdown.Item>
        <Dropdown.Item onClick={() => openOntologySearchBar()}> Ontology </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
         
          {searchForUser ?
          (

            <div className="py-4">
              <h2> Search for a user</h2>
            <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={inputHandler}
          label="Search for an expert"
        />
        <Button onClick={() => searchInput(inputData)}> Search </Button>
        </div>
          ):null}

          
          {searchMedicalTerm ?
          (
            <div className="py-4">
              <h2> Search for a medical term</h2>
            <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={inputHandler}
          label="Search for a medical term"
        />
        <Button onClick={() => searchInput(inputData)}> Search </Button>
        </div>
          ):null}

{searchOntology ?
          (

            <div className="py-4">
              <h2> Search for an ontology</h2>
            <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={inputHandler}
          label="Search for an ontology"
        />
        <Button onClick={() => searchInput(inputData)}> Search </Button>
        </div>
          ):null}
            <div className="py-4">
            
        
            
            
           
            {title ? (
              
                 <h2> Search results for: {name} </h2>
            ) :null}
            <div>
              <button type="button" class="btn btn-success" onClick={() => processNameQuery()}> Test </button>
            </div>
       <div id="graph">

       </div>
       {replies.map((val) =>{
        <li> {val.post_reply_id}</li>
       })}
            
  
                  
              </div>


            </Tab>
            
        </Tabs>

        </main>
      </div>
    </div>
  );
}

export default Forum;
