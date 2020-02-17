import {
  findElementWithHandler,
  isAnchor,
  isModifierKey,
  toArray,
  warn,
} from './util';
import { ENHANCER_ATTRIBUTE, HANDLER_ATTRIBUTE } from './constants';

const DEFAULT_HANDLER_OPTIONS = {
  allowModifierKeys: false,
};

/**
 * Get handler function for given handler.
 */
const getHandlerFn = handler => {
  if (typeof handler === 'function') {
    return handler;
  }
  if (handler && handler.fn) {
    return handler.fn;
  }
  return undefined;
};

/**
 * Get optional handler options.
 */
const getHandlerOptions = (handler = {}) => ({
  ...DEFAULT_HANDLER_OPTIONS,
  ...handler.options,
});

/**
 * Enhance method.
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
    const enhancerCollection = elm.getAttribute(ENHANCER_ATTRIBUTE);
    if (!enhancerCollection) {
      return elm;
    }
    // Allow multiple, comma-separated enhancers.
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
 * Handle method.
 */
export const handle = (root, handlers) => {
  if (!handlers) {
    return;
  }
  root.addEventListener('click', e => {
    const trigger = findElementWithHandler(e.target);
    if (!trigger) {
      return;
    }
    const handlerCollection = trigger.getAttribute(HANDLER_ATTRIBUTE);
    if (!handlerCollection) {
      return;
    }
    // Allow multiple, comma-separated handlers.
    handlerCollection.split(',').map(handler => handler.trim()).forEach(handler => {
      const fn = getHandlerFn(handlers[handler]);
      const options = getHandlerOptions(handlers[handler]);
      // Honour default behaviour on `<a>`s when using modifier keys when clicking,
      // but only when not explicitly allowed via `allowModifierKeys` handler option:
      // - Meta / Ctrl opens in new tab.
      // - Shift opens in a new window.
      // - Alt (option on macOS) can be operating system based operation.
      if (isAnchor(trigger) && isModifierKey(e) && !options.allowModifierKeys) {
        return;
      }
      // Invoke the handler function.
      if (typeof fn === 'function') {
        fn(trigger, e);
      } else {
        warn(trigger, 'Non-existing handler: "%s" on %o', handler, trigger);
      }
    });
  });
};

export default { handle, enhance };
