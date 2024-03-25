import React, {useEffect, useState} from 'react';
import './forum.css';
import Sidebar from '../../components/Sidebar';
import ForumCard from './components/ForumCard';
import {Button, Tabs, Tab, Dropdown, DropdownButton} from 'react-bootstrap';
import TextField from "@mui/material/TextField";
import {getPosts, getAllPosts, getDirectPosts, getUserReplies, getTermResults, getOntology, getAllUsers, getDefinition} from './hooks/postAPI';
import natural from "natural"
import * as d3 from "d3"
import nlp from "compromise"
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
    
    const[recommendedList, setRecommendedList] = useState([])
    const[searchLegendQuery, setSearchLegendQuery] = useState('');
    const[ontologyURI, setOntologyURI] = useState('')

    const[bestDefinition, setBestDefinition] = useState('')
    
    //Code to allow users to filter out specific nodes.
    //--------------------------------------------------------//
    /*
    const [visibilityFilter, setVisibilityFilter] = useState({
      userReplies: true,
      profileRank: true,
      ontologyAnswer: true,
      votes: true,
      confidenceScore: true,
    });
    const handleVisibilityChange = (group, isVisible) => {
      setVisibilityFilter(prev => ({ ...prev, [group]: isVisible }));
      
    };
    const getFilteredData = () => {
      const filteredNodes = nodeArray.filter(node => visibilityFilter[node.group]);
      const filteredLinks = linkArray.filter(link => visibilityFilter[link.source.group] && visibilityFilter[link.target.group]);
      
      return { nodes: filteredNodes, links: filteredLinks };
    };
    const { nodes, links } = getFilteredData();
    Chart({ nodes, links }, replies);
    */
    // Example checkbox
   
    //--------------------------------------------------------//
  let inputHandler = (e) => {

    setInputData(e.target.value)

  }
  function getOntologyDefinition(ont){
    $.ajax({
      method: "GET",
      url: ont + "?apikey=89f4c54e-aee8-4af5-95b6-dd7c608f057f",
      dataType: "JSON",
      xhrFields: {
        withCredentials: false
      },
      success: res => setBestDefinition(res['definition']),
      error: res => 'Error retrieving definition.'
    })
    
  }
  function wilsonScore(pos, total, confidence = 0.95) {
    if (total === 0) {
      return 0;
    }
  
    // The proportion of positive ratings
    const p = pos / total;
  
    // Z-score for the confidence interval (1.96 corresponds to about 95% confidence)
    const z = (() => {
      if (confidence === 0.95) return 1.96;
      // Include other confidence levels if needed
      // For example, for 99% confidence: if (confidence === 0.99) return 2.58;
      // Default to 1.96 if an unrecognized confidence level is provided
      return 1.96;
    })();
  
    // The Wilson score formula
    const denominator = 1 + (z*z / total);
    const score = (p + (z*z / (2*total)) - z * Math.sqrt((p*(1-p) / total) + (z*z / (4*total*total)))) / denominator;
  
    return score;
  }  
  function normalize(value, max){
    return (value / max).toFixed(3);
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
  setRecommendedList([])
  setTitle(false)
}
const downloadSvg = () => {
  // Get the SVG element using its ID or class
  const svg = document.getElementById('graph');
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Add name spaces.
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  // Convert SVG source to URI data scheme.
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

  // Create an anchor for the download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'graph.svg';  // Set the download filename.
  
  // Append to the document
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
};

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
const start = performance.now()
  resetGraph()
  d3.selectAll("svg").remove()
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

    console.log("Retrieval of data successful");
    //This line of code updates the state of the replies array to the replies retrieved from the database. This will be used for when users click on a node, the replies array will be used to compare to the node's reply content and then redirect to the page that leads to the page with the corresponding post id.
    setReplies(replies);
    setName(replies[0].first_name+" "+replies[0].last_name)
    //Push the root node first.
    nodeArray.push({id: name, color: "purple"})
  //For every object in the array, a node will be generated and linked to its related node.
  {replies.map((val)=> {
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
      /*
      if(val.vote_id != null && !nodeArray.find(n => n.voteID === val.vote_id)){
        nodeArray.push({ id: "voteid: "+val.vote_id+" Upvote: "+val.voteup, voteID: val.vote_id, group: 4})  
        linkArray.push({source: "voteid: "+val.vote_id+" Upvote: "+val.voteup, voteID: val.vote_id,target: val.reply_content, value: 10, distance: 200})     
      }
      if(val.vote_id != null && !nodeArray.find(n => n.voteID === val.vote_id)){
        nodeArray.push({ id: "voteid: "+val.vote_id+" Downvote: "+val.votedown, voteID: val.vote_id, group: 4})
        linkArray.push({source: "voteid: "+val.vote_id+" Downvote: "+val.votedown, voteID: val.vote_id, target: val.reply_content, value: 10, distance: 200})
      }
      */
      
    }
    
    //Also, if statements are used to ensure that no null values are used.
   
    
     

    

    
    
    
    
    
    
    

    
    
   
    
    
   
  }
  
  )
  
  }
  const filteredRecommendations = replies.filter(val => val.reply_id != null && val.reply_content != null && val.voteup != null && val.votedown != null)
  .map(val => {
    var upvotes = val.voteup
                                                
                                                var totalVotes = val.voteup + val.votedown;
                                                
                                                const maxConfidenceScore = 10;
                                                const maxCredibilityScore = 5;
                                                
                                                var confidenceScore = val.confidence_score
                                                var rating = val.rating
                                                if(rating == null){
                                                  rating = 0
                                                }
                                                if(confidenceScore == null){
                                                  confidenceScore = 0
                                                }
                                                
                                                    var wilson = wilsonScore(upvotes,totalVotes, 0.95);
                                                    var normalizedConfidence = normalize(confidenceScore, maxConfidenceScore);
                                                    var normalizedCredibility = normalize(rating, maxCredibilityScore);
                                              
                                                // Further calculations would depend on the specifics of your scoring system
                                                // such as how you want to aggregate and calculate the final score
                                                // For instance, a weighted average might look like this:
                                                   var finalScore = (wilson + parseFloat(normalizedConfidence) + parseFloat(normalizedCredibility)) / 3;
                                                  
                                                    
                                                
                                                console.log(finalScore)

                                                return {
                                                  reply_id: val.reply_id,
        reply_content: val.reply_content,
        totalVoteUp: val.voteup,
        totalVoteDown: val.votedown,
        wilsonScore: wilson.toFixed(3),
        confidenceScore: confidenceScore,
        rating: rating,
        score: finalScore.toFixed(3),
        ontology_link: val.ontology_link,
      }
    
  }).sort((a, b) => b.score - a.score);
setRecommendedList(filteredRecommendations);
console.log("All recommendation:",filteredRecommendations)
        console.log("ontology link: ",filteredRecommendations[0].ontology_link)
        setOntologyURI(filteredRecommendations[0].ontology_link)
        getOntologyDefinition(filteredRecommendations[0].ontology_link)
  //After all the nodeArray and LinkArray arrays are populated, the function will generate a graph with the data.
  //The process is the same for the medical term and ontology inputs but with different data being retrieved from the api.
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
    console.log("Retrieval of data successful", terminology);
     setTerminologyResults(terminology)
     console.log(terminologyResults)
     nodeArray.push({id: term, group:5})
     
     {terminology.map((val) => {
      
      
      if(!nodeArray.find(n => n.id === val.curr_ontology)){
        nodeArray.push({id: val.curr_ontology, group: 1})
      }
      if(!nodeArray.find(n => n.id === val.post_content)){
        nodeArray.push({id: val.post_content, group: 2})
      }
      if(val.reply_id != null && val.reply_content != null && !nodeArray.find(n => n.id === val.reply_content)){
        nodeArray.push({id: val.reply_content, group: 3})  
        
        linkArray.push({source: val.reply_content, target: val.post_content, relationship: "reply_to" ,value: 10, distance: 200})
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
        /*
        if(val.vote_id != null && !nodeArray.find(n => n.voteID === val.vote_id)){
          nodeArray.push({ id: "voteid: "+val.vote_id+" Upvote: "+val.voteup, voteID: val.vote_id, group: 4})  
          linkArray.push({source: "voteid: "+val.vote_id+" Upvote: "+val.voteup, voteID: val.vote_id,target: val.reply_content, value: 10, distance: 200})     
        }
        if(val.vote_id != null && !nodeArray.find(n => n.voteID === val.vote_id)){
          nodeArray.push({ id: "voteid: "+val.vote_id+" Downvote: "+val.votedown, voteID: val.vote_id, group: 4})
          linkArray.push({source: "voteid: "+val.vote_id+" Downvote: "+val.votedown, voteID: val.vote_id, target: val.reply_content, value: 10, distance: 200})
        }
        */
        
      }
        
        
    
  
      
      
      linkArray.push({source: val.curr_ontology, target: term, value: 10, distance: 200})
      linkArray.push({source: val.post_content, target: val.curr_ontology, value: 10, distance: 200})
      
     }
      )
     
     }
     const filteredRecommendations = terminology.filter(val => val.reply_id != null && val.reply_content != null && val.voteup != null && val.votedown != null)
                                              .map(val => {
                                                var upvotes = val.voteup
                                                
                                                var totalVotes = val.voteup + val.votedown;
                                                
                                                const maxConfidenceScore = 10;
                                                const maxCredibilityScore = 5;
                                                
                                                var confidenceScore = val.confidence_score
                                                var rating = val.rating
                                                if(rating == null){
                                                  rating = 0
                                                }
                                                if(confidenceScore == null){
                                                  confidenceScore = 0
                                                }
                                                
                                                    var wilson = wilsonScore(upvotes,totalVotes, 0.95);
                                                    var normalizedConfidence = normalize(confidenceScore, maxConfidenceScore);
                                                    var normalizedCredibility = normalize(rating, maxCredibilityScore);
                                              
                                                // Further calculations would depend on the specifics of your scoring system
                                                // such as how you want to aggregate and calculate the final score
                                                // For instance, a weighted average might look like this:
                                                   var finalScore = (wilson + parseFloat(normalizedConfidence) + parseFloat(normalizedCredibility)) / 3;
                                                  
                                                    
                                                
                                                console.log(finalScore)

                                                return {
                                                  reply_id: val.reply_id,
        reply_content: val.reply_content,
        totalVoteUp: val.voteup,
        totalVoteDown: val.votedown,
        wilsonScore: wilson.toFixed(3),
        confidenceScore: confidenceScore,
        rating: rating,
        score: finalScore.toFixed(3),
        ontology_link: val.ontology_link,
                                              }}).sort((a, b) => b.score - a.score);
        setRecommendedList(filteredRecommendations);
        console.log("All recommendation:",filteredRecommendations)
        console.log("ontology link: ",filteredRecommendations[0].ontology_link)
        setOntologyURI(filteredRecommendations[0].ontology_link)
        getOntologyDefinition(filteredRecommendations[0].ontology_link)
     Chart(data,terminology)
  });
  
  
}
  //setNodeArray({id:a, color: "red"})
  //displayGraph();
  if(searchOntology){
    
    setTitle(true)
  console.log("Before flush",nodeArray)
  setSearchLegendQuery('Ontology')
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
        
        if(val.terminology != null && !nodeArray.find(n => n.id === val.terminology)){
        nodeArray.push({id: val.terminology,  group: 1})
        linkArray.push({source: val.terminology, target: ontology_term, relationship: "defined_by", value: 10, distance: 200})
        }
        if(val.post_content != null && !nodeArray.find(n => n.id === val.post_content)){
        nodeArray.push({id: val.post_content, group: 2})
        linkArray.push({source: val.post_content, target: val.terminology, relationship: "current_ontology_of", value: 10, distance: 200})
        }
        if(val.reply_id != null && val.reply_content != null && !nodeArray.find(n => n.id === val.reply_content)){
          nodeArray.push({id: val.reply_content, group: 3})  
          
          linkArray.push({source: val.reply_content, target: val.post_content, relationship: "reply_to", value: 10, distance: 200})
          if(val.voteup != null ){
            nodeArray.push({ id: "ReplyId: "+val.reply_id+", Vote up: "+val.voteup, group: 4})  
            linkArray.push({source: "ReplyId: "+val.reply_id+", Vote up: "+val.voteup,target: val.reply_content, relationship: "upvote", value: 10, distance: 200})     
          }

          if(val.votedown != null ){
            nodeArray.push({ id:  "ReplyId: "+val.reply_id+", Vote down: "+val.votedown, group: 4})
            linkArray.push({source: "ReplyId: "+val.reply_id+", Vote down: "+val.votedown,  target: val.reply_content, relationship: "downvote", value: 10, distance: 200})
          }
          if(val.confidence_score != null){
            nodeArray.push({ id: "ReplyId: "+val.reply_id+", Confidence score: "+val.confidence_score, group: 6})  
            linkArray.push({source: "ReplyId: "+val.reply_id+", Confidence score: "+val.confidence_score,target: val.reply_content, relationship: "self_scored", value: 10, distance: 200})     
          }
          /*
          if(val.vote_id != null && !nodeArray.find(n => n.voteID === val.vote_id)){
            nodeArray.push({ id: "voteid: "+val.vote_id+" Upvote: "+val.voteup, voteID: val.vote_id, group: 4})  
            linkArray.push({source: "voteid: "+val.vote_id+" Upvote: "+val.voteup, voteID: val.vote_id,target: val.reply_content, value: 10, distance: 200})     
          }
          if(val.vote_id != null && !nodeArray.find(n => n.voteID === val.vote_id)){
            nodeArray.push({ id: "voteid: "+val.vote_id+" Downvote: "+val.votedown, voteID: val.vote_id, group: 4})
            linkArray.push({source: "voteid: "+val.vote_id+" Downvote: "+val.votedown, voteID: val.vote_id, target: val.reply_content, value: 10, distance: 200})
          }
          */
          
        }
        
        
        
        
        
        
        
        
        
        
        
        
       }
        )
        const filteredRecommendations = ontology_result.filter(val => val.reply_id != null && val.reply_content != null && val.voteup != null && val.votedown != null && val.ontology_link != null)
                                              .map(val => {
                                                var upvotes = val.voteup
                                                
                                                var totalVotes = val.voteup + val.votedown;
                                                
                                                const maxConfidenceScore = 10;
                                                const maxCredibilityScore = 5;
                                                
                                                var confidenceScore = val.confidence_score
                                                var rating = val.rating
                                                if(rating == null){
                                                  rating = 0
                                                }
                                                if(confidenceScore == null){
                                                  confidenceScore = 0
                                                }
                                                
                                                    var wilson = wilsonScore(upvotes,totalVotes, 0.95);
                                                    var normalizedConfidence = normalize(confidenceScore, maxConfidenceScore);
                                                    var normalizedCredibility = normalize(rating, maxCredibilityScore);
                                              
                                                // Further calculations would depend on the specifics of your scoring system
                                                // such as how you want to aggregate and calculate the final score
                                                // For instance, a weighted average might look like this:
                                                   var finalScore = (wilson + parseFloat(normalizedConfidence) + parseFloat(normalizedCredibility)) / 3;
                                                  
                                                    
                                                
                                                

                                                return {
                                                  reply_id: val.reply_id,
        reply_content: val.reply_content,
        totalVoteUp: val.voteup,
        totalVoteDown: val.votedown,
        wilsonScore: wilson.toFixed(3),
        confidenceScore: confidenceScore,
        rating: rating,
        score: finalScore.toFixed(3),
        ontology_link: val.ontology_link,
                                              }}).sort((a, b) => b.score - a.score);;
        setRecommendedList(filteredRecommendations);
        console.log("All recommendation:",filteredRecommendations)
        console.log("ontology link: ",filteredRecommendations[0].ontology_link)
        setOntologyURI(filteredRecommendations[0].ontology_link)
        getOntologyDefinition(filteredRecommendations[0].ontology_link)
       }
      
       Chart(data, ontology_result)
    });
    
    
  }
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
  
     
  
  // Determine how to process each node based on its group
  switch(d.group) {
    case 4: 
    let voteParts = d.id.split(':');
        let voteType = voteParts[1]; // 'upvote' or 'downvote'
       
        let voteCount = voteParts[voteParts.length - 1]; // the actual vote count
        
        return `${voteCount}`;// Assuming group 4 is for upvotes/downvotes
    case 6: // Assuming group 6 is for confidence scores
    
    let confidenceParts = d.id.split(':');
    let confidenceScore = confidenceParts[confidenceParts.length - 1]; // the actual confidence score
    
    return `${confidenceScore}`;
    default:
      // For other nodes, just return the id as is
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
    .data(["end"])      // Just one marker type called 'end'
  .enter().append("marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)   // Controls the distance between the arrowhead and the node
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999"); // Arrow color
      
  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke-length", 100)
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
    .style("font-size", 24);
  const linkText = svg.append("g")
    .attr("class", "link-labels")
  .selectAll("text")
  .data(links)
  .join("text")
    .text(d => d.relationship) // Assuming you want to display the 'value' property as the label
    .attr("font-size", 16)
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
                <div class="form-check"> 
                
</div></li> <br/>
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
            ):<div class="legend"> 
            <h3> Legend </h3>
            <ul>
              <li> <span class="circle" style={{backgroundColor:"#d62728"}}></span> Replies</li> <br/>
              <li> <span class="circle" style={{backgroundColor:"#2ca02c"}}></span> Forum posts</li> <br/>
              <li> <span class="circle" style={{backgroundColor:"#ff7f0e"}}></span> Terminology </li> <br/>
              <li> <span class="circle" style={{backgroundColor:"#9467bd"}}></span> Votes</li> <br/>
              <li> <span class="circle" style={{backgroundColor:"#8c564b"}}></span> Confidence Score </li> <br/>
              <li> <span class="circle" style={{backgroundColor:"#1f77b4"}}></span> {searchLegendQuery} </li>
            </ul>
          </div>}
            
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
            <th> Reply Content </th>
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
                    <td> {recommendedList[0].reply_content}</td>
                    <td> {recommendedList[0].totalVoteUp}</td>
                    <td> {recommendedList[0].totalVoteDown}</td>
                    <td> {recommendedList[0].wilsonScore}</td>
                    <td> {recommendedList[0].confidenceScore}</td>
                    <td> {recommendedList[0].rating}</td>             
                    <td> {recommendedList[0].score} </td>
                  </tr> 
                )
                 
                )}
                  </tbody>
                </table>
                {bestDefinition ? (<div>
                    <h3 style={{fontSize: 30}}> Ontology Definition </h3>
                    <p style={{fontSize: 40, border: '5px solid black', padding: 10}}> {bestDefinition} </p>
                    </div>
                ):null}
                
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
            <th> Reply Content </th>
            <th> Upvotes </th>
            <th> Downvotes </th>
            <th> Wilson Score </th>
            <th> Confidence score </th>
            <th> Rating </th>
            <th> Score</th>
          </tr>
        </thead>
                <tbody>
                {recommendedList.slice(0,5).map((val, index) => (
                  <tr key={(val.reply_id)}>  
                    <td> 
                      {(index == 0) && (<div> <span class="gold_medal"> {index + 1} </span></div>)}
                      {(index == 1) && (<div> <span class="silver_medal"> {index + 1} </span></div>)}
                      {(index == 2) && (<div> <span class="bronze_medal"> {index + 1} </span></div>)}
                      {index >= 3 && (index + 1)}
                   </td>
                    <td> {val.reply_content}</td>
                    <td> {val.totalVoteUp}</td>
                    <td> {val.totalVoteDown}</td>
                    <td> {val.wilsonScore}</td>
                    <td> {val.confidenceScore}</td>
                    <td> {val.rating}</td>             
                    <td> {val.score} </td>
                  </tr> 
                )
                 
                  )}
                  </tbody>
                  </table>
                </div>
                
              ): <p> No recommended results. </p>}

            </div>
            <button id="download" onClick={downloadSvg}>Download Graph</button>
                  
              </div>


            </Tab>
            
        </Tabs>

        </main>
      </div>
    </div>
  );
}

export default Forum;
