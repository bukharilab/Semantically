const apiAddress = 'https://api.gosemantically.com';

const apiAddresses = {
  checkLoggedIn: `${apiAddress}/authentication/loggedin.php`,
  login: `${apiAddress}/authentication/login.php`,
  logout: `${apiAddress}/authentication/logout.php`,
  register: `${apiAddress}/authentication/register.php`,
  createDocument: `${apiAddress}/document/create_document.php`,
  getDocuments: `${apiAddress}/document/get_documents.php`,
  readDocument: `${apiAddress}/document/read_document.php`,
  editDocument: `${apiAddress}/document/edit_document.php`,
  createPost: `${apiAddress}/post/create_post.php`,
  readPost: `${apiAddress}/post/read_post.php`,
  replyPost: `${apiAddress}/post/reply_post.php`,
  getPosts: `${apiAddress}/post/get_posts.php`
};

export {apiAddresses};
