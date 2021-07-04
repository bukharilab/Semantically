const getText = () => {
  return document.querySelector("trix-editor").editor.getDocument().toString().trim();
}

export default getText;
