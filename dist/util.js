"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = exports.warn = exports.findElementWithHandler = exports.findInDomAncestry = void 0;

var _hansel = require("./hansel");

// eslint-disable-next-line import/no-cycle

/**
 * Generic function for traversing a DOM, returning the first element
 * matching the predicate function.
 *
 * findInDomAncestry :: (DomNode -> Bool) -> DomNode -> ?DomNode
 */
var findInDomAncestry = function findInDomAncestry(predicate) {
  return function (node) {
    return !node || node.nodeType === Node.DOCUMENT_NODE ? undefined : predicate(node) ? node : findInDomAncestry(predicate)(node.parentNode);
  };
};
/**
 * Find element with data-handler attribute.
 *
 * findElementWithHandler :: DomNode -> ?DomNode
 */


exports.findInDomAncestry = findInDomAncestry;
var findElementWithHandler = findInDomAncestry(function (x) {
  return x.hasAttribute(_hansel.HANDLER_ATTRIBUTE);
});
/**
 * console.warn proxy.
 * Walks ownerDocument to get to console, to avoid using global window.
 */

exports.findElementWithHandler = findElementWithHandler;

var warn = function warn(elm) {
  var _elm$ownerDocument$de;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof elm.ownerDocument.defaultView.console !== 'undefined' ? (_elm$ownerDocument$de = elm.ownerDocument.defaultView.console).warn.apply(_elm$ownerDocument$de, args) : undefined;
};
/**
 * Crude and incomplete replacement for Array.from
 *
 * nodesToArray :: NodeList -> Array
 */


exports.warn = warn;

var toArray = function toArray(xs) {
  return Array.prototype.slice.call(xs);
};

exports.toArray = toArray;