import $ from 'jquery';
import {apiAddresses} from '../../../appInfo';

const setUp = () => $.ajaxSetup({
  xhrFields: {
      withCredentials: true
  }
});

const createDocument = (name, desc, content, setNewDocumentId) => {
  setUp();
  $.post({
    url: apiAddresses.createDocument,
    data: {doc_name: name, description: desc, content: content},
    success: data => setNewDocumentId(data['document_id'])});
}

const getDocuments = updateDocuments => {
  setUp();
  $.post({
    url: apiAddresses.getDocuments,
    success: data => updateDocuments(data['documents'])});
}

export {createDocument, getDocuments};
