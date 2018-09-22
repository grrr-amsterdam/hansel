import { handle } from '../src/hansel';

const byId = id => document.querySelector(`#${id}`);

const getHandlers = () => ({
  foo: jest.fn(),
  bar: jest.fn()
});

const clickEvent = (e = {
  bubbles: true,
  cancelable: true,
  view: window,
  detail: 0,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  button: 0,
  relatedTarget: undefined
}) => {
  const evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click', e.bubbles, e.cancelable, e.view, e.detail,
    e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey,
    e.metaKey, e.button, e.relatedTarget);
  return evt;
};

describe('Hansel.handle', () => {
  test('Should listen to handler-clicks', () => {
    const handlers = getHandlers();
    document.body.innerHTML = `
      <a href="#" id="a" data-handler="foo">foo</a>
      <a href="#" id="b" data-handler="bar">bar</a>
      <a href="#" id="c" data-handler="nix">nix</a>
      <a href="#" id="d" data-handler="foo">foo</a>
    `;
    handle(document.documentElement, handlers);

    const [a, b, c] = ['a', 'b', 'c'].map(byId);

    a.click();
    expect(handlers.foo).toBeCalledWith(a, expect.any(Event));

    b.click();
    expect(handlers.bar).toBeCalledWith(b, expect.any(Event));

    c.ownerDocument.defaultView.console.warn = jest.fn();
    c.click();
    expect(c.ownerDocument.defaultView.console.warn).toBeCalledWith(
      'Non-existing handler: "%s" on %o', 'nix', c
    );

    d.click();
    expect(handlers.foo).toBeCalledWith(d, expect.any(Event));
  });

  test('Should ignore clicks with meta keys', () => {
    const handlers = getHandlers();
    document.body.innerHTML = `
      <a href="#" id="a" data-handler="foo">foo</a>
      <a href="#" id="b" data-handler="bar">bar</a>
      <a href="#" id="c" data-handler="nix">nix</a>
      <a href="#" id="d" data-handler="foo">foo</a>
    `;
    handle(document.documentElement, handlers);

    const [a, b, c] = ['a', 'b', 'c'].map(byId);

    a.dispatchEvent(clickEvent());
    expect(handlers.foo.mock.calls.length).toBe(1);

    a.dispatchEvent(clickEvent({ metaKey: true }));
    expect(handlers.foo.mock.calls.length).toBe(1);

    a.dispatchEvent(clickEvent());
    expect(handlers.foo.mock.calls.length).toBe(2);

    a.dispatchEvent(clickEvent({ ctrlKey: true }));
    expect(handlers.foo.mock.calls.length).toBe(2);

    a.dispatchEvent(clickEvent({ altKey: true }));
    expect(handlers.foo.mock.calls.length).toBe(2);

    a.dispatchEvent(clickEvent({ shiftKey: true }));
    expect(handlers.foo.mock.calls.length).toBe(2);
  });

  test('Should allow multiple handlers', () => {
    const handlers = getHandlers();

    document.body.innerHTML = '<button data-handler="foo,bar">click me</button>';
    handle(document.documentElement, handlers);

    const button = document.querySelector('button');
    button.click();

    expect(handlers.foo).toBeCalledWith(button, expect.any(Event));
    expect(handlers.bar).toBeCalledWith(button, expect.any(Event));
  });

  test('Should scope handlers to root element', () => {
    const handlers = getHandlers();

    document.body.innerHTML = `
      <div id="a">
        <a href="#" id="afoo" data-handler="foo">A.foo</a>
        <a href="#" id="abar" data-handler="bar">A.bar</a>
      </div>
      <div id="b">
        <a href="#" id="bfoo" data-handler="foo">B.foo</a>
        <a href="#" id="bbar" data-handler="bar">B.bar</a>
      </div>
    `;

    handle(document.querySelector('a'), handlers);

    const [bfoo, bbar] = ['bfoo', 'bbar'].map(byId);

    // These clicks won't call the handlers, because only #a is handled by Hansel.
    bfoo.click();
    expect(handlers.foo.mock.calls.length).toBe(0);

    bbar.click();
    expect(handlers.bar.mock.calls.length).toBe(0);
  });
});
