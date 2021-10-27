import $ from 'jquery';

const readDocument = (document_id, updateContent) => {
  if (!document_id) return;
  $.post({
    url: 'http://localhost:3001/read_document.php',
    data: {document_id: document_id},
    success: data => updateContent(data['content'])});
}

export {readDocument};
