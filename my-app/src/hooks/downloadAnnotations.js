import getText from './getText';
import getTermStr from './getTermString';

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

const saveAsHTML = (annotations, annotationSelection, hasHighlights) => {
  const schemaJson = {
    "@context": "http://schema.org",
    "@type": "MedicalEntity",
    "code": []
  };

  const onlySelectedAnnotations = {};
  for (const term in annotationSelection) {
    if (annotationSelection[term] !== -1)
      onlySelectedAnnotations[term] = annotations[term][annotationSelection[term]];
  }

  for(const term in onlySelectedAnnotations) {
    const annotation = onlySelectedAnnotations[term];

    schemaJson['code'].push({"@type": "MedicalCode", "name": getTermStr(term), "codingSystem": annotation.acronym, "link": annotation.annotatedClass['@id']});
    // if(hasHighlights) {
    //   html = html.insertAt(thisAnnotations[i].to, '</span>');
    //   html = html.insertAt(thisAnnotations[i].from - 1, '<span class="tippy" title="' + thisAnnotations[i].definition + '">');
    // }
  }

  download('document.html', '<html><head><title><\/title><link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,800" rel="stylesheet">' + ((hasHighlights) ? '<script src="https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js"><\/script>' : '') + '<style>.container { font-family: Nunito Sans,Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica Neue,Helvetica,Arial,sans-serif; font-size: 1.125rem; padding: 4%; margin: 0 auto; }' + ((hasHighlights) ? ' .tippy { background: rgba(255,202,223,.5); color: #d22489; outline: 0; border-bottom: 1px solid #f27da6; padding: 0 4px; font-weight: 600; cursor: help; }' : '') + '<\/style><script type="application/ld+json">' + JSON.stringify(schemaJson) + '<\/script><\/head><body class="container"' + ((hasHighlights) ? ' onload="tippy(\'.tippy\');"' : '') + '>' + getText() + '<\/body><\/html>');
}

export {saveAsHTML};
// const saveAsHTML = (annotations, highlightAnnotations = false) => {
//   const schemaJson = {
//       "@context": "http://schema.org",
//       "@type": "MedicalEntity",
//       "code": []
//   };
//
//
// }
