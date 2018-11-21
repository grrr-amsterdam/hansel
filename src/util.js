import closest from '@grrr/utils/functions/closest';
// eslint-disable-next-line import/no-cycle
import { HANDLER_ATTRIBUTE } from './hansel';

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
