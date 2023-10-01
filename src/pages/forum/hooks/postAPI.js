import $ from "jquery";
import { apiAddresses } from "../../../appInfo";

const setUp = () =>
  $.ajaxSetup({
    xhrFields: {
      withCredentials: true,
    },
  });

  const createPost = (question, terminology, ontology, context, callback) => {
    setUp();
    $.post({
      url: apiAddresses.createPost,
      data: {
        question: question,
        terminology: terminology,
        ontology: ontology,
        context: context,
        
      },
      success: (data) => callback(data["post_id"]),
    });
  };
  const getUserReplies = (first_name, last_name, callback) => {
    setUp();
    $.post({
       url: apiAddresses.getUserReplies,
       data: {
         first_name: first_name,
         last_name: last_name,
       },
       success: (data) => callback(data["replies"]),
    })
    
  };
  const getTermResults = (terminology, callback) =>{
    setUp();
    $.post({
       url: apiAddresses.getTermResults,
       data: {
         terminology: terminology
       },
       success: (data) => callback(data["terminology"]),
    })
  }
  const getOntology = (ontology, callback) =>{
    setUp();
    $.post({
       url: apiAddresses.getOntology,
       data: {
         ontology: ontology
       },
       success: (data) => callback(data["ontology"]),
    })
  }
const createDirectPost = (question, terminology, ontology, context, expertID, callback) => {
  setUp();
  $.post({
    url: apiAddresses.createDirectPost,
    data: {
      question: question,
      terminology: terminology,
      ontology: ontology,
      context: context,
      expertID: expertID,
    },
    success: (data) => callback(data["post_id"]),
    
  });
};

const readPost = (post_id, callback) => {
  setUp();
  $.post({
    url: apiAddresses.readPost,
    data: { post_id: post_id },
    success: (data) => callback(data["post"], data["replies"]),
  });
};

const getPosts = (callback) => {
  setUp();
  $.post({
    url: apiAddresses.getPosts,
    success: (data) => callback(data["posts"]),
  });
};

const getAllPosts = (callback) => {
  setUp();
  $.post({
    url: apiAddresses.getAllPosts,
    success: (data) => callback(data["all_posts"]),
  });
};

const getDirectPosts = (callback) => {
  setUp();
  $.post({
    url: apiAddresses.getDirectPosts,
  success: (data) => callback(data["direct_posts"]),
  })
}
const replyPost = (
  post_id,
  ontology,
  ontology_link,
  content,
  confidence_score,
  callback
) => {
  setUp();
  $.post({
    url: apiAddresses.replyPost,
    data: {
      post_id: post_id,
      ontology: ontology,
      ontology_link: ontology_link,
      content: content,
      confidence_score: confidence_score,
    },
    success: () => callback(),
  });
};

const postVoting = (post_reply_id,vote_up,vote_down,callback) =>{
  setUp();
  $.post({
    url: apiAddresses.postVoting,
    data: {post_reply_id: post_reply_id, vote_up: vote_up, vote_down:vote_down },
    success: (data) => callback(data["message"]),
  });
  };

  const deletePost =(post_id,callback) =>{
    setUp();
    $.post({
      url: apiAddresses.deletePost,
      data: {post_id: post_id},
      success: (data) => callback(data["message"]),
    });
  };

export { createPost, createDirectPost,getPosts, getAllPosts, getDirectPosts, readPost, replyPost,postVoting, getUserReplies, getTermResults, getOntology,deletePost };
