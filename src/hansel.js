import { findElementWithHandler } from './util';

/**
 * Runner of enhancers
 */
export const enhance = (root, enhancers) => {
  if (!enhancers) {
    return;
  }
  const enhancerElms = root.querySelectorAll("[data-enhancer]");
  return Array.prototype.map.call(enhancerElms, elm => {
    // allow multiple comma-separated enhancers
    const enhancerCollection = elm.getAttribute("data-enhancer");
    enhancerCollection.split(",").forEach(enhancer => {
      if (typeof enhancers[enhancer] === "function") {
        return enhancers[enhancer](elm);
      } else if (elm.ownerDocument.defaultView.console) {
        // This avoids accessing the global window
        elm.ownerDocument.defaultView.console.log(
          'Non-existing enhancer: "%s" on %o', enhancer, elm
        );
      }
    });
    return elm;
  });
};

export const handle = (root, handlers) => {
  if (!handlers) {
    throw new Error('Nothing to handle');
  }

  root.addEventListener('click', (e) => {
    if (e.target.tagName === 'HTML') {
      return;
    }

    const trigger = findElementWithHandler(e.target || e.srcElement);
    if (!trigger) {
      return;
    }

    const handlerCollection = trigger.getAttribute('data-handler');
    if (!handlerCollection) {
      return;
    }

    if (trigger.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      // Honour default behaviour on <a>s when using modifier keys when clicking.
      // Meta / Ctrl open in new tab.
      // Shift opens in a new window.
      return;
    }

    handlerCollection.split(',').forEach(handler => {
      if (typeof handlers[handler] === 'function') {
        handlers[handler](trigger, e);
      } else if (console && console.log) {
        console.log('Non-existing handler: "%s" on %o', handler, trigger);
      }
    });
  });
};
