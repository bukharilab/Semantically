const getRemovedHighlights = annotationSelection => {
  return Object.keys(annotationSelection)
      .filter(highlight => annotationSelection[highlight] == -1);
}

export default getRemovedHighlights;
