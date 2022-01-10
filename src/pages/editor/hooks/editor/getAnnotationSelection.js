const getAnnotationSelection = (ontologySelection, annotationDeletion, annotations) => {
    const annotationSelection = {};
    for (const key in ontologySelection) {
        let count = 0;
        if (annotationDeletion[key] == 1) {
            // annotation deleted
            annotationSelection[key] = -1;
            continue;
        }

        for (const ontology of annotations[key]) {
            if (ontology.ontologyId == ontologySelection[key]) {
                annotationSelection[key] = count;
                break;
            }
            count++;
        }
    }
    return annotationSelection;
}

export default getAnnotationSelection;