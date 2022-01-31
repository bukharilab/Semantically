import getTermStr from './sidebar/getTermString';
import getDefinition from './sidebar/getDefinition';
import sortKeys from './sidebar/sortKeys';

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

const saveAsJSON = async (content, annotations, annotationSelection, definitions, updateDefinitions) => {
  const schemaJson = {};

  const onlySelectedAnnotations = {};
  for (const term in annotationSelection) {
    if (annotationSelection[term] !== -1)
      onlySelectedAnnotations[term] = annotations[term][annotationSelection[term]];
  }

  for(const term in onlySelectedAnnotations) {
    const annotation = onlySelectedAnnotations[term];
    const url = annotation.link;
    const def = url in definitions ? definitions[url] : await getDefinition(url);
    updateDefinitions({...definitions, [url]: def});

    schemaJson[getTermStr(term, content)] = def;
  }

  download('document.json', JSON.stringify(schemaJson));
}

const saveAsHTML = async (content, annotations, annotationSelection, definitions, updateDefinitions, hasHighlights) => {
  const schemaJson = {
    "@context": "http://schema.org",
    "@type": "MedicalEntity",
    "code": []
  };

  console.log(content);

  const onlySelectedAnnotations = {};
  for (const term in annotationSelection) {
    if (annotationSelection[term] !== -1)
      onlySelectedAnnotations[term] = annotations[term][annotationSelection[term]];
  }

  let addedLength = 0;
  let text = content;
  let annText = "";
  let ended = 0;

  for(const term of sortKeys(Object.keys(onlySelectedAnnotations))) {
    const annotation = onlySelectedAnnotations[term];
    schemaJson['code'].push({"@type": "MedicalCode", "name": getTermStr(term, text), "codingSystem": annotation.acronym, "link": annotation.ontologyId});
    if(hasHighlights) {
      const url = annotation.link;
      const def = url in definitions ? definitions[url] : await getDefinition(url);
      updateDefinitions({...definitions, [url]: def});
      annText += text.substring(ended, annotation.from - 1) + `<span class="tippy" title="${def}">${text.substring(annotation.from - 1, annotation.to)}</span>`;
      ended = annotation.to;
    }
  }
  annText += text.substring(ended);

  download('document.html', '<html><head><title><\/title><link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,800" rel="stylesheet">' + ((hasHighlights) ? '<script src="https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js"><\/script>' : '') + '<style>.container { font-family: Nunito Sans,Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica Neue,Helvetica,Arial,sans-serif; font-size: 1.125rem; padding: 4%; margin: 0 auto; }' + ((hasHighlights) ? ' .tippy { background: rgba(255,202,223,.5); color: #d22489; outline: 0; border-bottom: 1px solid #f27da6; padding: 0 4px; font-weight: 600; cursor: help; }' : '') + '<\/style><script type="application/ld+json">' + JSON.stringify(schemaJson) + '<\/script><\/head><body class="container"' + ((hasHighlights) ? ' onload="tippy(\'.tippy\');"' : '') + '>' + (hasHighlights ? annText : text) + '<\/body><\/html>');
}

export {saveAsHTML, saveAsJSON};
