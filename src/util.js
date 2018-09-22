/**
 * Generic function for traversing a DOM, returning the first element
 * matching the predicate function.
 *
 * findInDomAncestry :: (DomNode -> Bool) -> DomNode -> ?DomNode
 */
export const findInDomAncestry = predicate => node =>
    typeof node.nodeType === 'undefined' || node.nodeType === Node.DOCUMENT_NODE
    ? undefined
    : predicate(node)
    ? node
    : findInDomAncestry(predicate)(node.parentNode);

/**
 * Find element with data-handler attribute.
 *
 * findElementWithHandler :: DomNode -> ?DomNode
 */
export const findElementWithHandler =
  findInDomAncestry(x => x.hasAttribute('data-handler'));
