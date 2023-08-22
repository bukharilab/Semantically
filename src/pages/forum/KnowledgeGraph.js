import { Graph } from "react-d3-graph";
import React,{useState, useEffect} from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Col,
  Row,
  Container,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
 const KnowledgeGraph = ({postId, post_title,
  terminology,
  curr_ontology,
  post_content,
  name,
  replies}) => {
    const paramIDVal = useLocation().state.postId;
    const paramTitleVal = useLocation().state.post_title;
    const paramReplyVal = useLocation().state.replies;
    const paramNameVal = useLocation().state.name;
    //let {id} = useParams();
    
    const parseReplyData = JSON.parse(paramReplyVal)
    const [pId, setPostId] = useState(paramIDVal);
    const [pTitle, setPostTitle] = useState(paramTitleVal);
    const [pName, setUserName] = useState(paramNameVal);
    const [pReplyCount, setReplyCount] = useState(0);
    const [nodeModal, setNodeModal] = useState(false);
    const [modalData, setModalData] = useState(0);
    
    const pTitleString = ""+pTitle;
    const[nodeArray, setNodeArray] = useState([{id: pTitleString, color: "red"}, {id: pName, color: "green"}]);
    const[linkArray, setLinkArray] = useState([{ source: pTitleString, target: pName }]);
    useEffect(() => {
      console.log(parseReplyData)
      
      parseReplyData.map((val) => {
        nodeArray.push({id: val.first_name+''+val.last_name, color: "purple"})
        nodeArray.push({id: val.reply_content, color: "blue"})
        nodeArray.push({id: val.ontology, color: "magenta"})
        linkArray.push({source: val.first_name+''+val.last_name, target: val.reply_content})
        linkArray.push({source: val.reply_content, target: pTitleString})
        linkArray.push({source: val.ontology, target: val.reply_content})
        console.log(nodeArray)
        console.log(linkArray)
        
        
        nodeArray.push({id: val.upvote, color: "orange"});
        linkArray.push({source: val.upvote, target: val.first_name+''+val.last_name})
        console.log(nodeArray)
        
         
        
      })
      
    })
    //useEffect(() => console.log(parseReplyData))
    
    
    
    const addNode = () => {
     nodeArray.push({id: "Sam"})
     linkArray.push({source: "Sam", target: pTitleString})
     console.log(nodeArray)
     
    }
    const closeModal = () => setNodeModal(false);
    const data = {
        //nodes: [{ id: pTitleString, color: "red"}, { id: "Sally", color: "purple"}, { id: "Alice" }],
        nodes: nodeArray,
        links: linkArray,
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
        setModalData(nodeId)
        setNodeModal(true);
        
      };
      
      const onClickLink = function(source, target) {
        window.alert(`Clicked link between ${source} and ${target}`);
      };
    return (
        <div>
            <div class="jumbotron bg-dark text-white">
            <h1 > Knowledge Graph for post # {pId} </h1>            
            <h2> Post title: {pTitle}</h2>
            
            </div>
            
            
            <Graph
    id="graph-id" // id is mandatory
    data={data}
    config={myConfig}
    onClickNode={onClickNode}
    onClickLink={onClickLink}
  />
        {nodeModal ? 
        (
         
           <Modal
           show={nodeModal}>
           <Modal.Header closeModal onHide={closeModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          {'Node details'}
        </Modal.Title>
          
      </Modal.Header>
      <Modal.Body className="px-5">
        <p style={{fontSize: 30}}> Data: {modalData}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
      </Modal.Footer>
           </Modal>
          
        ):null}
        <h5> Legend </h5>
        <ul class="list-group"> 
          <li class="list-group-item"> <span style={{color:'red'}}> Red: </span> User Question</li>
          <li class="list-group-item"> <span style={{color:'green'}}> Green: </span> User name </li>
          <li class="list-group-item"> <span style={{color:'blue'}}> Blue: </span> Replies</li>
          <li class="list-group-item"> <span style={{color:'purple'}}> Purple: </span> Experts</li>
          <li class="list-group-item"> <span style={{color:'orange'}}> Orange: </span> Upvotes</li>
          <li class="list-group-item"> <span style={{color:'magenta'}}> Magenta: </span> Ontology</li>
        </ul>
        <Button><Link style={{color: "white"}} to={{pathname: '/post/'+pId}}> Go Back </Link></Button>
        
        </div>
        
    )
}
export default KnowledgeGraph;