import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';

import {deletePost} from '../../hooks/postAPI';

export default function DeletePostModel({post_id,updateShowDelPostModal,posts,setPosts}) {

    const handleClose = () => updateShowDelPostModal(false);
    console.log('post_id is',post_id);
    console.log('updateshow',updateShowDelPostModal);
   // const[post_res,setPostRes]=useState([]);
    
    const submit = () => {
      //deletePost(post_id,setPostRes);
      deletePost(post_id, () => {
        // remove deleted document
        console.log(posts);
        setPosts(posts.filter(post => post.post_id != post_id));
        console.log(posts.filter(post => post.post_id != post_id));
    });
      handleClose();
     //setDelete(true);
     
    };
  
    return (
      <>
      <Modal
            show={true}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
          <Modal.Header closeButton>
          <Modal.Title>Deleting Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Are you sure? This operation is permanent!
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          <Button variant="danger" onClick={submit}>Delete</Button>
          </Modal.Footer>
      </Modal>
      </>
  
    )
}
