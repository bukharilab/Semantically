const saveAsHTML = (hasHighlights, annotations) => {

          let schemaJson = {"@context": "http://schema.org", "@type": "MedicalEntity", "code": []};


          for(var i = thisAnnotations.length - 1; i >= 0; i--) {
            schemaJson['code'].push({"@type": "MedicalCode", "name": thisAnnotations[i].prefLabel, "codingSystem": thisAnnotations[i].ontology, "link": thisAnnotations[i].id});
            if(highlightAnnotations) {
              html = html.insertAt(thisAnnotations[i].to, '</span>');
              html = html.insertAt(thisAnnotations[i].from - 1, '<span class="tippy" title="' + thisAnnotations[i].definition + '">');
            }
          }

          download('document.html', '<html><head><title><\/title><link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,800" rel="stylesheet">' + ((highlightAnnotations) ? '<script src="https://unpkg.com/tippy.js@2.5.4/dist/tippy.all.min.js"><\/script>' : '') + '<style>.container { font-family: Nunito Sans,Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica Neue,Helvetica,Arial,sans-serif; font-size: 1.125rem; padding: 4%; margin: 0 auto; }' + ((highlightAnnotations) ? ' .tippy { background: rgba(255,202,223,.5); color: #d22489; outline: 0; border-bottom: 1px solid #f27da6; padding: 0 4px; font-weight: 600; cursor: help; }' : '') + '<\/style><script type="application/ld+json">' + JSON.stringify(schemaJson) + '<\/script><\/head><body class="container"' + ((highlightAnnotations) ? ' onload="tippy(\'.tippy\');"' : '') + '>' + html + '<\/body><\/html>');
 
}
