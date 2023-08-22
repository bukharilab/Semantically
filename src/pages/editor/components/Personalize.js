import React,{useState, state, useEffect} from 'react';
import {Component} from 'react'
import {Card, Button, Modal, Row, Form, Col, Accordion, FormControl, Dropdown} from 'react-bootstrap';
import AskQuestion from './AskQuestion';
import {postAddresses} from '../../../appInfo';
import { getUser_ID } from '../hooks/editor/documentAPI';
import $ from "jquery";

const Personalize = ({updatePersonalize, updateOpenPostModal, expert, updateShowExpert, updateExpert, updateID, ID}) => {
    
       
       
       
       
       
      
       
       
       const [data, setData] = useState([])
       
       const fetchData = () => {
       
        //Add conditional statement 
        var url = "https://recommend.gosemantically.com/searchExpert/"+ID;
        
        fetch(url)
        //Grab the api data
        .then((response) => response.json())
        //Then, add it to the array by updating the state.
        .then((newData)=> setData(newData.message[0]))
        console.log(data)
        
        console.log("It works")
       }
       
       const closeModal = () => updatePersonalize(false);
       const goToAskQuestionModal = (e) => {
        closeModal();
        updateOpenPostModal(true)
        updateExpert(true)
        updateShowExpert(e)
        
       }
       return (
           <div>
             <Modal 
             show={true}
             size="lg"
             aria-labelledby="contained-modal-title-vcenter"
             centered
             onShow = {fetchData}
             >
                <Modal.Header closeButton onHide={closeModal}>
                    <Modal.Title id="contained-modal-title-vcenter"> Recommended Experts </Modal.Title>
                    
                </Modal.Header>
                <Modal.Body className="px-5">
                
                    <h2 id = "title"> List of Experts </h2>
             <table id = "tableFormat" class = "table">
             <tbody>
              <tr id = "headerRow">
                 <th> User_ID </th>
                 <th> Name </th>
                 <th> Weighted Score </th>
                 <th> Similarity Score </th>
              </tr>
              
              {data.map((val)=> (
                    
                   
                    <tr key={val.id}>
                       <td > {val.user_id} </td>
                       <td > {val.user_name} </td>
                       <td > {val.Weighted_Score} </td>
                       <td > {val.similarity_score} </td>
                       <Button variant = "primary" onClick={() => goToAskQuestionModal([val.user_id, val.user_name, val.Weighted_Score,val.similarity_score])}> Select </Button> 
                    </tr>
                   
                  ))
                
                  }
                   
                 
                 
              </tbody>
             </table>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={closeModal} variant="secondary">Close</Button>
                
              
                </Modal.Footer>
             </Modal>
             
             </div>
       );

}



export default Personalize;


