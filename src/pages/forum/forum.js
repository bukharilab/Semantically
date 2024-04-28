import React, {useEffect, useState} from 'react';
import './forum.css';
import Sidebar from '../../components/Sidebar';
import ForumCard from './components/ForumCard';
import {Button, Tabs, Tab, Dropdown, DropdownButton} from 'react-bootstrap';
import TextField from "@mui/material/TextField";
import {getPosts, getAllPosts, getDirectPosts, getUserReplies, getTermResults, getOntology, getAllUsers, getDefinition} from './hooks/postAPI';

import * as d3 from "d3"

import $ from 'jquery';

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
    const[selectedDefinition, setSelectedDefinition] = useState('')
    const[recommendedList, setRecommendedList] = useState([])
    const[searchLegendQuery, setSearchLegendQuery] = useState('');
    const[ontologyURI, setOntologyURI] = useState('')

    const[bestDefinition, setBestDefinition] = useState('')
//-----------------------------------------------------------------//
//Filtering system logic
/*
const [renderedNodes, setRenderedNodes] = useState([]);
const [renderedLinks, setRenderedLinks] = useState([]);
const filterGraphByGroup = (groupNum) => {
  const nodesToKeep = nodeArray.filter(node => node.group !== groupNum);
  console.log(nodesToKeep)
 
  const nodesToKeepIds = new Set(nodesToKeep.map(node => node.id));
  console.log(nodesToKeepIds)

  const filteredLinks = linkArray.filter(link => link.group !== groupNum
   
  );
  console.log(filteredLinks)
  // Also, ensure that links point to node objects if they were initially pointing to IDs
  // This is necessary as d3.forceLink expects source/target to be objects after initialization
  
  
  setRenderedNodes(nodesToKeep);
  setRenderedLinks(filteredLinks);
};

useEffect(() => {
  // Clear existing graph
  d3.select('#graph').selectAll('*').remove();

  // Render the graph with filtered data
  renderGraph(renderedNodes, renderedLinks);
}, [renderedNodes, renderedLinks]); // Re-run when filtered data changes

//-----------------------------------------------------------------//
const renderGraph = (nodes, links) =>{
  resetGraph()
  Chart({nodes, links},replies)
}

*/

//-----------------------------------------------------------------//
  let inputHandler = (e) => {

    setInputData(e.target.value)

  }
  
  function wilsonScore(pos, total, confidence = 0.95) {
    if (total === 0) {
      return 0;
    }
  
    
    const p = pos / total;
  
    
    const z = (() => {
      if (confidence === 0.95) return 1.96;
      
      return 1.96;
    })();
  
    
    const denominator = 1 + (z*z / total);
    const score = (p + (z*z / (2*total)) - z * Math.sqrt((p*(1-p) / total) + (z*z / (4*total*total)))) / denominator;
  
    return score;
  }  
  function normalize(value, max){
    return (value / max).toFixed(3);
  }


const postCardProps = {
  allPosts: allPosts,
  setAllPosts: setAllPosts,
  posts: posts,
  //replies: replies,
  setPosts:setPosts,
  directPosts: directPosts,
  setDirectPosts: setDirectPosts
};
var hardcoded = [

"Represents an address",

"Cellular division"

]

const resetGraph = () => {
  setNodeArray([])
  setLinkArray([])
  setReplies([]) 
  setOntologyResults([])
  setTerminologyResults([])
  setRecommendedList([])
  setTitle(false)
  d3.selectAll("svg").remove()
}

function getOntologyDefinition(ont){

  $.ajax({
    method: "GET",
    url: ont + "?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f",
    dataType: "JSON",
    xhrFields: {
      withCredentials: false
    },
    success: res => setBestDefinition(res["definition"][0]),
    error: res => "error retrieving definition."
  })
}

function getTopResults(results){
  const scoredResultsPromises = results.filter(x => x.reply_content != null).map((val,index) => {
    const upvotes = val.voteup || 0;
    const totalVotes = upvotes + (val.votedown || 0);
    const maxRank = 10;
    const maxConfidenceScore = 10;
    const maxCredibilityScore = 5;
    const confidenceScore = val.confidence_score || 0;
    const rating = val.rating || 0;
    const rank = val.rank || 0;
    const wilson = wilsonScore(upvotes, totalVotes, 0.95);
    const normalizedConfidence = normalize(confidenceScore, maxConfidenceScore);
    const normalizedCredibility = normalize(rating, maxCredibilityScore);
    const normalizedRank = normalize(rank, maxRank)
    const ontologyDefinition = val.curr_ontology == 'NCIT' ? "Temporary inability to speak or move while waking up or falling asleep.": hardcoded[index];
    console.log(ontologyDefinition)
    
    const finalScore = ((wilson + parseFloat(normalizedConfidence) + parseFloat(normalizedCredibility))/ 3).toFixed(3);
    return {
      ...val,
      ontology_definition: ontologyDefinition,
      score: finalScore,
      wilsonScore: wilson.toFixed(3)
    };
  });

  // Sort by score in descending order and take the top 5
  const top5Results = scoredResultsPromises.sort((a, b) => b.score - a.score).slice(0, 5);
  
  setRecommendedList(top5Results);
  
  console.log("Recommended list: ", recommendedList)
  if(top5Results.length > 0) {
    setOntologyURI(top5Results[0].ontology_link);
    getOntologyDefinition(top5Results[0].ontology_link);
  }
  return top5Results
}

//This function is invoked when the user clicks the search button. The function first resets the graph and then determines whether the input is an ontology, medical term or expert user.
//Once it parses the meaning of the input, it then sends an api call for the relevant data from the database. The backend will return an array of data containing the data related to the input.
//For example, if the search input is the name of an expert, it will return all of their replies to forum posts, the ontologies and terminologies they recommend and the critical reception of their answers from other community members.
const searchInput = (a) => {
const start = performance.now()
  resetGraph()
  
  if(searchForUser) { 
  //var name = processNameQuery(a)
  var name = a
  setTitle(true)
  setSearchLegendQuery('User')
  setName(name)
  console.log("Name search : ",name)
  var nameArray = name.split(" ")
  console.log(nameArray)
  //Sends an api call to the database.
  getUserReplies(nameArray[0], nameArray[1], replies => {
    const topUserReplies = getTopResults(replies)
    console.log("Retrieval of data successful");
    //This line of code updates the state of the replies array to the replies retrieved from the database. This will be used for when users click on a node, the replies array will be used to compare to the node's reply content and then redirect to the page that leads to the page with the corresponding post id.
    setReplies(topUserReplies);
    setName(replies[0].first_name+" "+replies[0].last_name)
    //Push the root node first.
    nodeArray.push({id: name, color: "purple"})
  //For every object in the array, a node will be generated and linked to its related node.
  {topUserReplies.map((val)=> {
    if(!nodeArray.find(n => n.id === val.ontology)){
      nodeArray.push({id: val.ontology, group: 2})
      linkArray.push({source: val.ontology, target: name, relationship: "has_suggested", value: 10, distance: 200})
    }
    if(!nodeArray.find(n => n.id === val.profile_rank)){
    nodeArray.push({id: val.profile_rank, group: 1})
    linkArray.push({source: val.profile_rank, target: name, relationship: "is_ranked", value: 10, distance: 200})
    }
    //If statements are used to make sure that no two nodes with the same exact data can be replicated. In d3.js, if a node with the same exact data is found in the array used to generate the nodes, it will not link with any nodes and will float away.
    if(val.reply_id != null && val.reply_content != null && !nodeArray.find(n => n.id === val.reply_content)){
      nodeArray.push({id: val.reply_content, group: 3})  
      
      linkArray.push({source: val.reply_content, target: val.ontology, relationship: "reply_ontology", value: 10, distance: 200})
      if(val.voteup != null ){
        nodeArray.push({ id: "Reply_id: "+val.reply_id+" Upvote: "+val.voteup, group: 4})  
        linkArray.push({source: "Reply_id: "+val.reply_id+" Upvote: "+val.voteup,target: val.reply_content, relationship: "upvote", value: 10, distance: 200})     
      }
      if(val.votedown != null ){
        nodeArray.push({ id: "Reply_id: "+val.reply_id+" Downvote: "+val.votedown, group: 4})
        linkArray.push({source: "Reply_id: "+val.reply_id+" Downvote: "+val.votedown,  target: val.reply_content, relationship: "downvote",value: 10, distance: 200})
      }
      if(val.confidence_score != null){
        nodeArray.push({ id: "Reply_id: "+val.reply_id+" Confidence score: "+val.confidence_score, group: 6})  
        linkArray.push({source: "Reply_id: "+val.reply_id+" Confidence score: "+val.confidence_score,target: val.reply_content, relationship: "self_scored", value: 10, distance: 200})     
      }
    
      
    }
    
    //Also, if statements are used to ensure that no null values are used.
  }
  
  )
  
  }
  
  Chart(data, replies)
  
  });
  
}
if(searchMedicalTerm){
  resetGraph()
  d3.selectAll("svg").remove()
  setTitle(true)
  setSearchLegendQuery('Terminology')
console.log("Before flush",nodeArray)
setName(searchMedicalTerm)
console.log("After flush",nodeArray)
var term = a;
setTerm(term)
getTermResults(term, terminology =>
  {
    const topTerminologyResults = getTopResults(terminology)
    console.log("Retrieval of data successful", terminology);
     setTerminologyResults(topTerminologyResults)
     console.log(topTerminologyResults)
     nodeArray.push({id: term, group:5})
     
     {topTerminologyResults.map((val) => { 
      
      if(!nodeArray.find(n => n.id === val.post_content)){
        nodeArray.push({id: val.post_content, group: 1})
        linkArray.push({source: val.post_content, target: term, relationship: "has_ontology",value: 10, distance: 200})
      }
      if(!nodeArray.find(n => n.id === val.curr_ontology)){
        linkArray.push({source: val.curr_ontology, target: val.post_content, relationship: "suggested_for", value: 10, distance: 200})
        nodeArray.push({id: val.curr_ontology, group: 2})
      }
      if(val.reply_id != null && val.reply_content != null && !nodeArray.find(n => n.id === val.reply_content)){
        nodeArray.push({id: val.reply_content, group: 3})  
        
        linkArray.push({source: val.reply_content, target: val.curr_ontology, relationship: "reply_to" ,value: 10, distance: 200})
        if(val.voteup != null ){
          nodeArray.push({ id: "Reply_id: "+val.reply_id+" Upvote: "+val.voteup, group: 4})  
          linkArray.push({source: "Reply_id: "+val.reply_id+" Upvote: "+val.voteup,target: val.reply_content, relationship: "upvote", value: 10, distance: 200})     
        }
        if(val.votedown != null ){
          nodeArray.push({ id: "Reply_id: "+val.reply_id+" Downvote: "+val.votedown, group: 4})
          linkArray.push({source: "Reply_id: "+val.reply_id+" Downvote: "+val.votedown,  target: val.reply_content, value: 10, relationship: "downvote" ,distance: 200})
        }
        if(val.confidence_score != null){
          nodeArray.push({ id: "Reply_id: "+val.reply_id+" Confidence score: "+val.confidence_score, group: 6})  
          linkArray.push({source: "Reply_id: "+val.reply_id+" Confidence score: "+val.confidence_score,target: val.reply_content, value: 10, relationship: "self_scored",distance: 200})     
        }
        
      }
      
      
      
     }
      )
     
     }
     
     Chart(data,terminology)
  });
  
  
}
  
  if(searchOntology){
    
    setTitle(true)
  console.log("Before flush",nodeArray)
  setSearchLegendQuery('Ontology')
  console.log("After flush",nodeArray)
  var ontology_term = a;
  setOntology(ontology_term)
  getOntology(ontology_term, ontology_result =>
    {
      const scoredOntologyResults = getTopResults(ontology_result)
      
      console.log("Retrieval of data successful", scoredOntologyResults);
       setOntologyResults(scoredOntologyResults)
       console.log(ontologyResults)
       nodeArray.push({id: ontology_term, group:5})
       {scoredOntologyResults.map((val) => {
        
        if(val.terminology != null && !nodeArray.find(n => n.id === val.terminology)){
        nodeArray.push({id: val.terminology,  group: 2})
        linkArray.push({source: val.terminology, id: val.terminology, target: ontology_term, relationship: "defined_by", group: 1,value: 10, distance: 200})
        }
        if(val.post_content != null && !nodeArray.find(n => n.id === val.post_content)){
        nodeArray.push({id: val.post_content, group: 1})
        linkArray.push({source: val.post_content, target: val.terminology, id: val.post_content, relationship: "current_ontology_of", group: 2,value: 10, distance: 200})
        }
        if(val.reply_id != null && val.reply_content != null && !nodeArray.find(n => n.id === val.reply_content)){
          nodeArray.push({id: val.reply_content, group: 3})  
          
          linkArray.push({source: val.reply_content, id: val.reply_content, target: val.post_content, relationship: "reply_to", value: 10, group: 3,distance: 200})
          if(val.voteup != null ){
            nodeArray.push({ id: "ReplyId: "+val.reply_id+", Vote up: "+val.voteup, group: 4})  
            linkArray.push({source: "ReplyId: "+val.reply_id+", Vote up: "+val.voteup, id: "ReplyId: "+val.reply_id+", Vote up: "+val.voteup,target: val.reply_content, group:4, relationship: "upvote", value: 10, distance: 200})     
          }

          if(val.votedown != null ){
            nodeArray.push({ id:  "ReplyId: "+val.reply_id+", Vote down: "+val.votedown, group: 4})
            linkArray.push({source: "ReplyId: "+val.reply_id+", Vote down: "+val.votedown,  id: "ReplyId: "+val.reply_id+", Vote down: "+val.votedown, target: val.reply_content, group:4, relationship: "downvote", value: 10, distance: 200})
          }
          if(val.confidence_score != null){
            nodeArray.push({ id: "ReplyId: "+val.reply_id+", Confidence score: "+val.confidence_score, group: 6})  
            linkArray.push({source: "ReplyId: "+val.reply_id+", Confidence score: "+val.confidence_score, id: "ReplyId: "+val.reply_id+", Confidence score: "+val.confidence_score,target: val.reply_content, group: 6, relationship: "self_scored", value: 10, distance: 200})     
          }
        
          
        }   
        
       }
        )
        
       }
       
       Chart(data, ontology_result)
    });
    
    
  }
  console.log("Node array: ", nodeArray)
  console.log("Link array: ", linkArray)
  const end = performance.now()
  const totalTime = end - start
  console.log("Total time elapsed: ", totalTime)
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

function getLabelText(d) {  
  
  switch(d.group) {
    case 4: 
    let voteParts = d.id.split(':');
        let voteType = voteParts[1]; 
       
        let voteCount = voteParts[voteParts.length - 1]; 
        
        return `${voteCount}`;
    case 6: 
    
    let confidenceParts = d.id.split(':');
    let confidenceScore = confidenceParts[confidenceParts.length - 1]; 
    
    return `${confidenceScore}`;
    default:
     
      return d.id;
  }
}
//------------------------------------------------------------------//
//Graph Generation code
const Chart = (data, replyData) => {
    
  // Specify the dimensions of the chart.
  const width = 2500;
  const height = 1500;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  console.log("Links", data.links)
  console.log("Nodes", data.nodes)
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
      svg.append("defs").selectAll("marker")
    .data(["end"])     
  .enter().append("marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)   
    .attr("refY", 0)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999"); 
      
  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke-length", 200)
      .attr("marker-end", "url(#end)"); 
  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
      .attr("r", 60)
      .attr("fill", d => color(d.group))
    .on("click",function(d){
      console.log("Clicked",replyData)
      
      var data = d3.select(this).data()
      console.log(data)
      redirectToPost(data, replyData)   
    });


  node.append("title")
      
      
  var label = svg.selectAll(".mytext")
  .data(nodes)
  .enter()
  .append("text")
  //Sets the text for each node.
    .text(function (d) { return getLabelText(d) })
    .style("text-anchor", "middle")
    .style("fill", "#000")
    .style("font-family", "Arial")
    .style("font-size", 42);
  const linkText = svg.append("g")
    .attr("class", "link-labels")
  .selectAll("text")
  .data(links)
  .join("text")
    .text(d => d.relationship) 
    .attr("font-size", 30)
    .attr("fill", "#F00");     
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
        linkText
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
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
/*
  const filterGraph = (groupNum) => {
      
    console.log(data.nodes)
    console.log(data.links)
    const filteredNodes = nodeArray.filter(node => node.group === groupNum)
    const filteredLinks = linkArray.filter(link => link.group === groupNum)
   console.log("Filtered nodes: ", filteredNodes)
   console.log("Filtered links: ", filteredLinks)
   
    
    resetGraph()
    Chart({filteredNodes, filteredLinks}, replies)

}
*/
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
            {replies.length > 0 ? (
              <div class="legend"> 
              <h3> Legend </h3>
              <ul>
                <li> <span class="circle" style={{backgroundColor:"#d62728"}}>   </span> User Replies  
               
                </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#2ca02c"}}></span> Profile rank</li> <div class="form-check"> 
                
</div><br/>

                <li> <span class="circle" style={{backgroundColor:"#ff7f0e"}}></span> Ontology Answer </li><div class="form-check"> 
                
</div> <br/>
                <li> <span class="circle" style={{backgroundColor:"#9467bd"}}></span> Votes</li><div class="form-check"> 
                
</div> <br/>
                <li> <span class="circle" style={{backgroundColor:"#8c564b"}}></span> Confidence Score</li> <div class="form-check"> 
                
</div><br/>
                <li> <span class="circle" style={{backgroundColor:"#1f77b4"}}></span> {searchLegendQuery} </li>
              </ul>
            </div>
            ):null}
            {terminologyResults.length > 0 ? (
              <div class="legend"> 
              <h3> Legend </h3>
              <ul>
                <li> <span class="circle" style={{backgroundColor:"#d62728"}}></span> Replies 
                
                
                </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#ff7f0e"}}></span> Forum posts</li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#2ca02c"}}></span> Suggested ontologies </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#9467bd"}}></span> Votes</li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#8c564b"}}></span> Confidence Score </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#1f77b4"}}></span> {searchLegendQuery} </li>
              </ul>
            </div>
            ):null}
            {ontologyResults.length > 0 ? (
              <div class="legend"> 
              <h3> Legend </h3>
              <ul>
                <li> <span class="circle" style={{backgroundColor:"#d62728"}}></span> Replies 
                
                
                </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#ff7f0e"}}></span> Terminology</li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#2ca02c"}}></span> Forum posts </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#9467bd"}}></span> Votes</li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#8c564b"}}></span> Confidence Score </li> <br/>
                <li> <span class="circle" style={{backgroundColor:"#1f77b4"}}></span> {searchLegendQuery} </li>
              </ul>
            </div>
            ): null }
       <div id="graph">

       </div>
       {replies.map((val) =>{
        <li> {val.post_reply_id}</li>
        
       })}
            
            <div>
              <h3 class = "jumbotron" style={{fontSize: 40}}> Most Recommended Results </h3>
              
              <div>
                <h1> Best Result </h1>
                <table>
                <thead> 
          <tr> 
          <th> Rank </th>
            <th> Suggested ontology </th>
            <th> Terminology </th>
            <th> Ontology definition</th>
            <th> Upvotes </th>
            <th> Downvotes </th>
            <th> Wilson Score </th>
            <th> Confidence score </th>
            <th> Rating </th>
            <th> Score</th>
          </tr>
        </thead>
        <tbody>
        {recommendedList.slice(0,1).map((val) => (
          
                  <tr key={(val.reply_id)}>  
                    <td> <span class="gold_medal"> 1 </span></td>
                    <td> {recommendedList[0].curr_ontology}</td>
                    <td> {recommendedList[0].terminology} </td>
                    <td>  {bestDefinition} </td>
                    <td> {recommendedList[0].voteup}</td>
                    <td> {recommendedList[0].votedown}</td>
                    <td> {recommendedList[0].wilsonScore}</td>
                    <td> {recommendedList[0].confidence_score}</td>
                    <td> {recommendedList[0].rating || 0}</td>             
                    <td> {recommendedList[0].score} </td>
                  </tr> 
                  
                )
                 
                )}
                
                  
                  </tbody>
                </table>
                
                
      {/* Textbox that is conditionally rendered */}
      
              </div>
              <br/>
             
              <hr/>
              
              {recommendedList && recommendedList.length > 0 ? (
                
                <div>
                  <h1 > All Top results</h1>
                <table>
                <thead> 
          <tr> 
            <th> Rank </th>
            <th> Suggested ontology </th>
            <th> Terminology </th>
            <th> Ontology definition </th>
            <th> Upvotes </th>
            <th> Downvotes </th>
            <th> Wilson Score </th>
            <th> Confidence score </th>
            <th> Rating </th>
            <th> Score</th>
          </tr>
        </thead>
                <tbody>
                {recommendedList.map((val, index) => (
                  <tr key={(val.reply_id)}>  
                    <td> 
                      {(index == 0) && (<div> <span class="gold_medal"> {index + 1} </span></div>)}
                      {(index == 1) && (<div> <span class="silver_medal"> {index + 1} </span></div>)}
                      {(index == 2) && (<div> <span class="bronze_medal"> {index + 1} </span></div>)}
                      {index >= 3 && (index + 1)}
                   </td>
                   <td> {val.curr_ontology}</td>
                   <td> {val.terminology} </td>
                   <td> {val.ontology_definition} </td>
                    <td> {val.voteup}</td>
                    <td> {val.votedown}</td>
                    <td> {val.wilsonScore}</td>
                    <td> {val.confidence_score}</td>
                    <td>{val.rating || 0}</td>
        
                    <td> {val.score} </td>
                  </tr> 
                )
                 
                  )}
                  </tbody>
                  </table>
                </div>
                
              ): <p> No recommended results. </p>}

            </div>
            
                  
              </div>


            </Tab>
            
        </Tabs>

        </main>
      </div>
    </div>
  );
}

export default Forum;
