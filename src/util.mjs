import { closest } from '@grrr/utils';
import { HANDLER_ATTRIBUTE } from './constants';

/**
 * Determine if given DOM element is an anchor (`<a>`).
 */
export const isAnchor = tag => tag.tagName.toLowerCase() === 'a';

/**
 * Determine if KeyboardEvent includes a modifier key.
 */
export const isModifierKey = e => e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;

/**
 * Find element with data-handler attribute.
 *
 * findElementWithHandler :: DomNode -> ?DomNode
 */
export const findElementWithHandler = closest(x => x.hasAttribute(HANDLER_ATTRIBUTE));

/**
 * console.warn proxy.
 * Walks ownerDocument to get to console, to avoid using global window.
 */
export const warn = (elm, ...args) =>
  typeof elm.ownerDocument.defaultView.console !== 'undefined'
    ? elm.ownerDocument.defaultView.console.warn(...args)
    : undefined;

/**
 * Crude and incomplete replacement for Array.from
 *
 * nodesToArray :: NodeList -> Array
 */
export const toArray = xs => Array.prototype.slice.call(xs);
