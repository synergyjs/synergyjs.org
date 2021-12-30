# CLI

The Synergy CLI aims to provide an exceptional developer experience and outstanding performance for building websites using Web Components. While Synergy itself gives you everything you need to build runtime web components without a compilation step, the CLI takes things a step further and simplifies the process of building websites with Synergy web components.

## TL;DR

The CLI expects that you will have two things:

1. a `components` folder, containing a directory for each of your projects Custom Elements. Inside a component folder you may have...

   - `index.js` - the default export is your components factory function
   - `index.html` - your components HTML template
   - `index.css` - your components CSS

2. a `synergy.config.js` file, where you will configure routes, data sourcing, and also component-level render strategies.

Here are a few of the things that you get for free in return;

## Scoped CSS

There's [no Shadow DOM by default](), but selectors in a components' CSS file are automatically prefixed with an element selector, effectively stopping styles from leaking out whilst still allowing styles to cascade down. If you need to include style rules for the root element, you can use the element selector yourself to do that as the CLI won't prefix those.

## Minification

All of the HTML, CSS, and JS gets minified when the `build` script is run.

## Optimisation

...

## Nested Components

You can use any local component within your component templates. There's no need to import anything; the CLI checks each template and automatically loads definitions for any local component that is used in any template.

## Routes

Routes are defined inside your `synergy.config.js` module along the lines of "when matching route pattern `X`, load component `Y`".

## Page Data

When it comes to sourcing the data for your website, the CLI is influenced by Next.js, but it's also different in several ways. If you're familiar with Next.js, you'll instantly recognise the role of the `getStaticPaths` and `getStaticProps` functions to generate dynamic routes and source your page data.

## Component-level Render Strategies

Synergy understands 3 different types of rendering strategy:

1. `static` - component is only loaded during the prerender
2. `hydrate` - component is loaded during prerender and hydrated efficiently when the user loads your page.
3. `enhance` - (read _progressive enhancement_) component is not loaded during the prerender, only when the page is served to the user.

Synergy trivialises this fine-grained control over component rendering strategies, making it easier for you to build performant and resilient websites that...

- achieve excellent TTFB and TTFI
- progressively enhance pages with JS-dependent components at runtime

## install

```sh
npm i --D @synergy/cli
```

## project anatomy

```
project
|
└───synergy.config.js
│
└───components
│   │
│   └───x-foo
│       └───index.js
│       └───index.html
│       └───index.css

```

## synergy.config.js

Your configuration file should export a JavaScript object. Within this object, you can define several different configuration options.

```js
export default {
  //configuration options
}
```

### Configuration options

Options available to set within synergy.config.js include:

- `routes` (array)
- `components` (object)

### routes

```js
export default {
  routes: [
    // static route
    {
      match: '/',
      component: 'x-home',
      getStaticProps: async (context) => {
        // called once for the page matching '/'
        return {
            props: {}, // will be passed to the page component as props
          }
      },
    },
    // dynamic routes
    {
      match: 'posts/[id]',
      component: 'x-post',
      getStaticPaths: async () => {
        return {
            paths: [
              { params: { ... } } // See the "paths" section below
            ]
          };
      },
      getStaticProps: async (context) => {
        // called for each path returned from getStaticPaths
        return {
          props: {}, // will be passed to the page component as props
        }
      },
    },
  ],
};
```

### components

## commands

- `dev`
  Starts a development server on port 3000 that will auto-reload whenever you change any of your components
- `test`
- `build`
