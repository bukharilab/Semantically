// const apiAddress = 'https://api.gosemantically.com';
const apiAddress = "http://api.gosemantically.com";

const apiAddresses = {
  checkLoggedIn: `${apiAddress}/authentication/loggedin.php`,
  login: `${apiAddress}/authentication/login.php`,
  logout: `${apiAddress}/authentication/logout.php`,
  register: `${apiAddress}/authentication/register.php`,
  createDocument: `${apiAddress}/document/create_document.php`,
  deleteDocument: `${apiAddress}/document/delete_document.php`,
  getDocuments: `${apiAddress}/document/get_documents.php`,
  readDocument: `${apiAddress}/document/read_document.php`,
  editDocument: `${apiAddress}/document/edit_document.php`,
  createPost: `${apiAddress}/post/create_post.php`,
  readPost: `${apiAddress}/post/read_post.php`,
  replyPost: `${apiAddress}/post/reply_post.php`,
  getPosts: `${apiAddress}/post/get_posts.php`,
  getAllPosts: `${apiAddress}/post/get_all_posts.php`,
  storeAnnotations: `${apiAddress}/document/store_annotations.php`,
  deleteAllAnnotations: `${apiAddress}/document/delete_all_annotations.php`,
  changeOntologySelection: `${apiAddress}/document/change_ontology_selection.php`,
  changeDeleteAnnotation: `${apiAddress}/document/change_delete_annotation.php`,
  getAnnotations: `${apiAddress}/document/get_annotations.php`,
  checkRecommendation: `${apiAddress}/post/check_recommendation.php`,
  recommendationFlag: `${apiAddress}/post/recommendation_flag.php`,
  postVoting: `${apiAddress}/post/post_voting.php`,
  deletePost: `${apiAddress}/post/delete_post.php`
};

const postAddresses = {
  post: `${document.location.origin}/post`,
};

export { apiAddresses, postAddresses };
