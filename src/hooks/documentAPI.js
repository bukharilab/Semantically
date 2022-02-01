import $ from 'jquery';
const address = "http://localhost/Semantically/api";

const readDocument = (document_id, updateContent) => {
  if (!document_id) return;
  $.post({
    url: `${address}/read_document.php`,
    data: {document_id: document_id},
    success: data => updateContent(data['content'])});
}

const editDocument = (document_id, content) => {
  if (!document_id) return;
  $.post({
    url: `${address}/edit_document.php`,
    data: {document_id: document_id, content: content},
    success: () => console.log(content + ": saved")});
}

const createPost = (user_id, terminology, question, context, selected_ontology, callback) => {
  $.post({
    url: `${address}/create_post.php`,
    data: {
      user_id: user_id,
      terminology: terminology,
      question: question,
      context: context,
      selected_ontology: selected_ontology,
    },
    success: data => callback(data)});
}

const readPost = (post_id, updatePostData) => {
  if (!post_id) return;
  $.post({
    url: `${address}/read_post.php`,
    data: {post_id: post_id},
    success: data => {updatePostData(data['post_data']); console.log(data)}});
}

export {readDocument, editDocument, createPost, readPost};
