import $ from 'jquery';
import {apiAddresses} from '../../../../appInfo';

const setUp = () => $.ajaxSetup({
  xhrFields: {
      withCredentials: true
  }
});

const readDocument = (document_id, callback) => {
  if (!document_id) return;
  setUp();
  $.post({
    url: apiAddresses.readDocument,
    data: {document_id: document_id},
    success: data => callback(data['content'])});
}

const editDocument = (document_id, content) => {
  if (!document_id) return;
  setUp();
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

const storeAnnotations = (document_id, annotations, callback) => {
  setUp();
  $.post({
    url: apiAddresses.storeAnnotations,
    data: {document_id: document_id, annotations: annotations},
    success: () => {console.log("annotations saved"); callback();}});
}

const getAnnotations = (document_id, callback) => {
  setUp();
  $.post({
    url: apiAddresses.getAnnotations,
    data: {document_id: document_id},
    success: data => callback(data['annotations'])});
}

export {readDocument, editDocument, createPost, storeAnnotations, getAnnotations};
