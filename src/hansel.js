import { findElementWithHandler, warn } from './util';

export const ENHANCER_ATTRIBUTE = 'data-enhancer';
export const HANDLER_ATTRIBUTE = 'data-handler';

/**
 * enhance :: DomNode -> Object -> Array
 */
export const enhance = (root, enhancers) => {
  if (!enhancers) {
    return;
  }
  const enhancedElements = Array.from(root.querySelectorAll(`[${ENHANCER_ATTRIBUTE}]`))
    .concat(root.hasAttribute(ENHANCER_ATTRIBUTE) ? [root] : []);
  return Array.prototype.map.call(enhancedElements, elm => {
    // Allow multiple, comma-separated enhancers.
    const enhancerCollection = elm.getAttribute(ENHANCER_ATTRIBUTE);
    enhancerCollection.split(',').forEach(enhancer => {
      if (typeof enhancers[enhancer] === "function") {
        return enhancers[enhancer](elm);
      } else {
        warn(elm, 'Non-existing enhancer: "%s" on %o', enhancer, elm);
      }
    });
    return elm;
  });
};

/**
 * handle :: DomNode -> Object -> Void
 */
export const handle = (root, handlers) => {
  if (!handlers) {
    return;
  }

  root.addEventListener('click', (e) => {
    const trigger = findElementWithHandler(e.target);
    if (!trigger) {
      return;
    }

    if (trigger.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      // Honour default behaviour on <a>s when using modifier keys when clicking.
      // Meta / Ctrl open in new tab.
      // Shift opens in a new window.
      return;
    }

    // Allow multiple, comma-separated handlers.
    const handlerCollection = trigger.getAttribute(HANDLER_ATTRIBUTE);
    handlerCollection.split(',').forEach(handler => {
      if (typeof handlers[handler] === 'function') {
        handlers[handler](trigger, e);
      } else {
        warn(trigger, 'Non-existing handler: "%s" on %o', handler, trigger);
      }
    });
  });
};

export default { handle, enhance };
