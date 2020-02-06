import { findElementWithHandler, toArray, warn } from './util';
import { ENHANCER_ATTRIBUTE, HANDLER_ATTRIBUTE } from './constants';

/**
 * enhance :: DomNode -> Object -> Array
 */
export const enhance = (root, enhancers) => {
  if (!enhancers) {
    return [];
  }
  const rootHasEnhancers = (
    // If the root element is a DocumentFragment, the root itself can't be enhanced.
    typeof root.hasAttribute === 'function' && root.hasAttribute(ENHANCER_ATTRIBUTE)
  );
  const enhancedElements = (rootHasEnhancers ? [root] : []).concat(
    toArray(root.querySelectorAll(`[${ENHANCER_ATTRIBUTE}]`))
  );
  return enhancedElements.map(elm => {
    // Allow multiple, comma-separated enhancers.
    const enhancerCollection = elm.getAttribute(ENHANCER_ATTRIBUTE);
    if (!enhancerCollection) {
      return elm;
    }
    enhancerCollection.split(',').map(enhancer => enhancer.trim()).forEach(enhancer => {
      if (typeof enhancers[enhancer] === 'function') {
        enhancers[enhancer](elm);
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
export const handle = (root, handlers, { allowModifierKeys = false } = {}) => {
  if (!handlers) {
    return;
  }

  root.addEventListener('click', (e) => {
    const trigger = findElementWithHandler(e.target);
    if (!trigger) {
      return;
    }
    if (trigger.tagName === 'A' && !allowModifierKeys && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      // Honour default behaviour on `<a>`s when using modifier keys when clicking:
      // - Meta / Ctrl open in new tab.
      // - Shift opens in a new window.
      return;
    }
    // Allow multiple, comma-separated handlers.
    const handlerCollection = trigger.getAttribute(HANDLER_ATTRIBUTE);
    if (!handlerCollection) {
      return;
    }
    handlerCollection.split(',').map(handler => handler.trim()).forEach(handler => {
      if (typeof handlers[handler] === 'function') {
        handlers[handler](trigger, e);
      } else {
        warn(trigger, 'Non-existing handler: "%s" on %o', handler, trigger);
      }
    });
  });
};

export default { handle, enhance };
