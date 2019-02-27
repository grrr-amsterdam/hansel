# Hansel

[![Build Status](https://travis-ci.com/grrr-amsterdam/hansel.svg?branch=master)](https://travis-ci.com/grrr-amsterdam/hansel)

### Runner of handlers and enhancers

- Lightweight (less than 1kb minified and gzipped)
- Transpile to desired browser target
- No dependencies (except a minor utility function)

Based on the article ["Progressive enhancement with handlers and enhancers" by Hidde de Vries](https://hiddedevries.nl/en/blog/2015-04-03-progressive-enhancement-with-handlers-and-enhancers).
We've been using this model for many years with great pleasure, fine-tuning here and there.

Read the article for a deeper explanation.


## Installation

Using npm:

```
npm install @grrr/hansel
```

Note: depending on your setup additional configuration might be needed ([see below](#usage-with-build-tools)).

## Usage

Import into your main JavaScript file:

```js
import { enhance, handle } from '@grrr/hansel';

enhance(document.documentElement, {
    enhancer1(elm) {
    },
    enhancer2(elm) {
    },
    enhancerN(elm) {
    }
});

handle(document.documentElement, {
    handler1(elm, event) {
    },
    handler2(elm, event) {
    },
    handlerN(elm) {
    }
});
```

## Enhancers

`enhance` will look for DOM nodes containing the `data-enhancer` attribute.
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

Handlers are called on click, using a global event listener on the `document`. Meta-clicks are caught and *not* passed on to the handler.

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

## Furthermore

Thanks to the global click listener, handlers do not have to be re-initialized to dynamically added content. The presence of a `data-handler` attribute is enough.

Enhancers are run immediately however, so you might want to run them again, for instance when loading new DOM nodes in response to an AJAX call. The first argument to `enhance` is the container element within which nodes are searched. Therefore, you can pass the parent to the newly created nodes as reference to enhance all its children:

```js
const myContainer = document.querySelector('foo');
myContainer.innerHTML = htmlContainingEnhancedElements;

enhance(myContainer, myEnhancers);
```

## Usage with build tools

This package is published with untranspiled JavaScript. All files are in the form of ECMAScript Modules (ESM), with `.mjs` as file extension. This means that you'll need to transpile the package yourself.

Not every build tool or bundler will recognize `.mjs` files correctly, and not every setup will transpile these files when they're in the `node_modules` folder. Here's a list with commonly used tools and usage instructions:

#### Webpack

The latest version of Webpack should transpile `.mjs` files properly when used with the default Babel loader ([babel-loader](https://github.com/babel/babel-loader)).

#### Rollup

The latest version of Rollup should transpile `.mjs` files properly when used with the default Babel plugin ([rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel)).

#### Browserify

Use the following [babelify](https://github.com/babel/babelify#why-arent-files-in-node_modules-being-transformed) settings to transform `.mjs` files in the `node_modules`:

```js
global: true,
ignore: /\/node_modules\/(?!.*.*\/.*.mjs)/,
```

The [esmify](https://github.com/mattdesl/esmify) plugin might also prove to be usefull.

#### Babel

If you're transpiling with Babel in any other setup, use the following ignore pattern to properly ignore the `node_modules` and allow `.mjs` files to be transpiled:

```js
ignore: [/\/node_modules\/(?!.*.*\/.*.mjs)/],
```

This can be added in your `babel.config.js`, `.babelrc` or `package.json`; quotes will be necessary for JSON-based configurations.
