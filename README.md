# Hansel

[![Build Status](https://travis-ci.com/grrr-amsterdam/hansel.svg?branch=master)](https://travis-ci.com/grrr-amsterdam/hansel)

### Runner of JavaScript handlers and enhancers

- Lightweight (less than 1kb minified and gzipped)
- Transpile to desired browser target
- No dependencies (except a minor utility function)

Based on the article ["Progressive enhancement with handlers and enhancers" by Hidde de Vries](https://hiddedevries.nl/en/blog/2015-04-03-progressive-enhancement-with-handlers-and-enhancers).
We've been using this model for many years with great pleasure, fine-tuning here and there. Read the article for a deeper explanation.

Built with ❤️ by [GRRR](https://grrr.tech).


## Installation

```sh
$ npm install @grrr/hansel
```

Note: depending on your setup [additional configuration might be needed](https://github.com/grrr-amsterdam/hansel/wiki/Usage-with-build-tools), since this package is published with untranspiled JavaScript.


## Usage

Import into your main JavaScript file:

```js
import { enhance, handle } from '@grrr/hansel';

enhance(document.documentElement, {
    enhancer1(elm) {
        // Enhance elements with this enhancer
    },
    enhancer2(elm) {
    },
    enhancerN(elm) {
    },
});

handle(document.documentElement, {
    handler1(elm, event) {
        // Handle clicks on elements with this handler
    },
    handler2(elm, event) {
    },
    handlerN(elm, event) {
    },
});
```

In a more modular setup, this would look like:

```js
import { enhance, handle } from '@grrr/hansel';
import { enhancer as fooEnhancer, handler as fooHandler } from './foo';
import { enhancer as barEnhancer, handler as barHandler } from './bar';

enhance(document.documentElement, {
    fooEnhancer,
    barEnhancer,
});

handle(document.documentElement, {
    fooHandler,
    barHandler,
});
```

## Enhancers

The `enhance` function will look for DOM nodes containing the `data-enhancer` attribute.
The second argument is a lookup table for enhancer functions. The value of the `data-enhancer` attribute will be matched with the table and if found, executed, given the element as first argument:

```js
// Given <p data-enhancer="foo" data-message="Hello!"></p>

enhance(document.documentElement, {
  foo(elm) {
    console.log(elm.getAttribute('data-message')); // "Hello!"
  }
});
```

Multiple enhancers are possible by comma-separating them:

```html
<div data-enhancer="foo,bar"></div>
```

## Handlers

Handlers are called on click, using a global event listener on the `document`. 

```js
// Given <button data-handler="shout" data-message="Hello!">shout</button>

handle(document.documentElement, {
  shout(elm, e) {
    alert(elm.getAttribute('data-message')); // "Hello!"
    e.preventDefault();
  }
});
```

Multiple handlers are possible by comma-separating them:

```html
<a data-handler="foo,bar" href="/">Do the thing</a>
```

By default, modifier-clicks (`e.metaKey`, `e.ctrlKey` and `e.shiftKey`) on anchors (`<a>`) are caught, and are *not* passed on to the handler. To disable this behaviour, pass a third argument to the method, changing the `allowModifierKeys` setting:

```js
handle(document.documentElement, {
  track(elm, e) {
    window.dataLayer.push() 
  }
}, { 
  allowModifierKeys: true,
});
```

## Furthermore

Thanks to the global click listener, handlers do not have to be re-initialized to dynamically added content. The presence of a `data-handler` attribute is enough.

Enhancers are run immediately however, so you might want to run them again, for instance when loading new DOM nodes in response to an AJAX call. The first argument to `enhance` is the container element within which nodes are searched. Therefore, you can pass the parent to the newly created nodes as reference to enhance all its children:

```js
const myContainer = document.querySelector('foo');
myContainer.innerHTML = htmlContainingEnhancedElements;

enhance(myContainer, myEnhancers);
```
