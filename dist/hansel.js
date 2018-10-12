"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.handle = exports.enhance = void 0;

var _util = require("./util");

/**
 * enhance :: DomNode -> Object -> Void
 */
var enhance = function enhance(root, enhancers) {
  if (!enhancers) {
    return;
  }

  var enhancedElements = root.querySelectorAll("[data-enhancer]");
  return Array.prototype.map.call(enhancedElements, function (elm) {
    // Allow multiple, comma-separated enhancers.
    var enhancerCollection = elm.getAttribute("data-enhancer");
    enhancerCollection.split(",").forEach(function (enhancer) {
      if (typeof enhancers[enhancer] === "function") {
        return enhancers[enhancer](elm);
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


    var handlerCollection = trigger.getAttribute('data-handler');
    handlerCollection.split(',').forEach(function (handler) {
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