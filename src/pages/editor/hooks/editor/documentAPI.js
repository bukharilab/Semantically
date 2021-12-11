import $ from 'jquery';
import {apiAddresses} from '../../../../appInfo';

const readDocument = (document_id, callback) => {
  if (!document_id) return;
  $.post({
    url: apiAddresses.readDocument,
    data: {document_id: document_id},
    success: data => callback(data['content'])});
}

const editDocument = (document_id, content) => {
  if (!document_id) return;
  $.post({
    url: apiAddresses.editDocument,
    data: {document_id: document_id, content: content},
    success: () => console.log(content + ": saved")});
}

const createPost = (user_id, terminology, question, context, selected_ontology, callback) => {
  $.post({
    url: apiAddresses.createPost,
    data: {
      user_id: user_id,
      terminology: terminology,
      question: question,
      context: context,
      selected_ontology: selected_ontology,
    },
    success: data => callback(data)});
}

export {readDocument, editDocument, createPost};
