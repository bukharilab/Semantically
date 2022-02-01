import $ from "jquery";
import { apiAddresses } from "../../../../appInfo";

const setUp = () =>
  $.ajaxSetup({
    xhrFields: {
      withCredentials: true,
    },
  });

const readDocument = (document_id, callback) => {
  if (!document_id) return;
  setUp();
  $.post({
    url: apiAddresses.readDocument,
    data: { document_id: document_id },
    success: (data) => callback(data["content"]),
  });
};

const editDocument = (document_id, content) => {
  if (!document_id) return;
  setUp();
  $.post({
    url: apiAddresses.editDocument,
    data: { document_id: document_id, content: content },
    success: () => console.log(content + ": saved"),
  });
};

const createPost = (
  user_id,
  terminology,
  question,
  context,
  selected_ontology,
  callback
) => {
  $.post({
    url: apiAddresses.createPost,
    data: {
      user_id: user_id,
      terminology: terminology,
      question: question,
      context: context,
      selected_ontology: selected_ontology,
    },
    success: (data) => callback(data),
  });
};

const storeAnnotations = (document_id, annotations) => {
  setUp();
  // console.log(annotations);
  $.post({
    url: apiAddresses.storeAnnotations,
    data: { document_id: document_id, annotations: annotations },
    success: () => console.log("annotations saved"),
  });
};

const deleteAllAnnotations = (document_id) => {
  setUp();
  $.post({
    url: apiAddresses.deleteAllAnnotations,
    data: { document_id: document_id },
    success: () => {
      console.log("all annotations deleted");
    },
  });
};

const changeOntologySelection = (document_id, annotation_id, ontology_id) => {
  setUp();
  $.post({
    url: apiAddresses.changeOntologySelection,
    data: {
      document_id: document_id,
      anno_id: annotation_id,
      ontology_id: ontology_id,
    },
    success: () => console.log("ontology changed"),
  });
};

const changeDeleteAnnotation = (document_id, annotation_id, status) => {
  setUp();
  $.post({
    url: apiAddresses.changeDeleteAnnotation,
    data: { document_id: document_id, anno_id: annotation_id, status: status },
    success: () => {
      console.log("annotation delete status changed");
    },
  });
};

const getAnnotations = (document_id, callback) => {
  setUp();
  $.post({
    url: apiAddresses.getAnnotations,
    data: { document_id: document_id },
    success: (data) =>
      callback(
        data["annotations"],
        data["ontology_selection"],
        data["anno_deletion"]
      ),
  });
};

///Added by Asim

const checkRecommendation = (term, flag, callback) => {
  $.post({
    url: apiAddresses.checkRecommendation,
    data: { term: term, flag: flag },
    success: (data) => callback(data["message"]),
  });
};

const recommendationFlag = (post_reply_id, flag, callback) => {
  $.post({
    url: apiAddresses.recommendationFlag,
    data: { post_reply_id: post_reply_id, flag: flag },
    success: (data) => callback(data["message"]),
  });
};

export {
  readDocument,
  editDocument,
  createPost,
  storeAnnotations,
  changeOntologySelection,
  getAnnotations,
  changeDeleteAnnotation,
  deleteAllAnnotations,
  checkRecommendation,
  recommendationFlag,
};
