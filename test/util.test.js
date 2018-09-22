import { findElementWithHandler } from '../src/util';

const byId = id => document.querySelector(`#${id}`);

describe('Utilities', () => {
  test('findElementWithHandler', () => {
    document.body.innerHTML = `
      <div id="a">
        <div id="b" data-handler="handlerB">
          <div id="c" data-handler="handlerC">
            <div id="c1"></div>
            <div id="c2" data-handler="handlerC2"></div>
          </div>
          <div id="d"></div>
        </div>
        <div id="e"></div>
      </div>
    `;

    const [a, b, c, c1, c2, d, e] = ['a', 'b', 'c', 'c1', 'c2', 'd', 'e'].map(byId);

    expect(findElementWithHandler(a)).toBeUndefined();
    expect(findElementWithHandler(b)).toBe(b);
    expect(findElementWithHandler(c)).toBe(c);
    expect(findElementWithHandler(c1)).toBe(c);
    expect(findElementWithHandler(c2)).toBe(c2);
    expect(findElementWithHandler(d)).toBe(b);
    expect(findElementWithHandler(e)).toBeUndefined();
  });
});
