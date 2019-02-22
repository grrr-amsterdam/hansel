"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.handle = exports.enhance = exports.HANDLER_ATTRIBUTE = exports.ENHANCER_ATTRIBUTE = void 0;

var _util = require("./util");

// eslint-disable-next-line import/no-cycle
var ENHANCER_ATTRIBUTE = 'data-enhancer';
exports.ENHANCER_ATTRIBUTE = ENHANCER_ATTRIBUTE;
var HANDLER_ATTRIBUTE = 'data-handler';
/**
 * enhance :: DomNode -> Object -> Array
 */

exports.HANDLER_ATTRIBUTE = HANDLER_ATTRIBUTE;

var enhance = function enhance(root, enhancers) {
  if (!enhancers) {
    return [];
  }

  var rootHasEnhancers = // If the root element is a DocumentFragment, the root itself can't be enhanced.
  typeof root.hasAttribute === 'function' && root.hasAttribute(ENHANCER_ATTRIBUTE);
  var enhancedElements = (rootHasEnhancers ? [root] : []).concat((0, _util.toArray)(root.querySelectorAll("[".concat(ENHANCER_ATTRIBUTE, "]"))));
  return enhancedElements.map(function (elm) {
    // Allow multiple, comma-separated enhancers.
    var enhancerCollection = elm.getAttribute(ENHANCER_ATTRIBUTE);

    if (!enhancerCollection) {
      return elm;
    }

    enhancerCollection.split(',').map(function (enhancer) {
      return enhancer.trim();
    }).forEach(function (enhancer) {
      if (typeof enhancers[enhancer] === 'function') {
        enhancers[enhancer](elm);
      } else {
        (0, _util.warn)(elm, 'Non-existing enhancer: "%s" on %o', enhancer, elm);
      }
    });
    return elm;
  });
};
/**
 * handle :: DomNode -> Object -> Void
 */


exports.enhance = enhance;

var handle = function handle(root, handlers) {
  if (!handlers) {
    return;
  }

  root.addEventListener('click', function (e) {
    var trigger = (0, _util.findElementWithHandler)(e.target);

    if (!trigger) {
      return;
    }

    if (trigger.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      // Honour default behaviour on <a>s when using modifier keys when clicking.
      // Meta / Ctrl open in new tab.
      // Shift opens in a new window.
      return;
    } // Allow multiple, comma-separated handlers.


    var handlerCollection = trigger.getAttribute(HANDLER_ATTRIBUTE);

    if (!handlerCollection) {
      return;
    }

    handlerCollection.split(',').map(function (handler) {
      return handler.trim();
    }).forEach(function (handler) {
      if (typeof handlers[handler] === 'function') {
        handlers[handler](trigger, e);
      } else {
        (0, _util.warn)(trigger, 'Non-existing handler: "%s" on %o', handler, trigger);
      }
    });
  });
};

exports.handle = handle;
var _default = {
  handle: handle,
  enhance: enhance
};
exports.default = _default;