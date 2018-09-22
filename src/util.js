export const findInDomAncestry = (matchFn, node) =>
    !node
    ? undefined
    : matchFn(node)
    ? node
    : findInDomAncestry(matchFn, node.parentNode);

export const findElementWithHandler = elm => {
  if (!elm || elm.tagName === 'HTML') {
    return;
  }
  if (elm.getAttribute('data-handler')) {
    return elm;
  }
  if (!elm.parentNode || elm.parentNode.nodeName === 'BODY') {
    return false;
  }
  return findElementWithHandler(elm.parentNode);
};


