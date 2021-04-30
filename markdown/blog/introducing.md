# Introducing...Synergy

Today I would like to introduce you to Synergy, it's a tiny runtime web component framework with no external dependencies. It runs in the browser (that's the "runtime" bit), and it doesn't require a compile step, although there is a CLI on the way soon which will enable you to build entire websites out of web components, but more on that later.

There's no big team or community behind Synergy so far, it's just me making a library the way that makes the most sense to me.

From a birds-eye view, there are two key parts to every Synergy component: data and markup. You provide data to your component by creating a factory function. This function accepts an object containing the components initial attribute and property name and values, and returns an object that provides the model for your view. The _markup_ is provided as a template, this can be an HTMLTemplateElement, or it can be a HTML string.

Synergy helps you to build standards-based Web Components in a declarative way and provides a number of key capabilities on top of Web Components, in particular:

- reactive data binding
- prerendering support with component-level hydration
- objects as properties
- automatic binding of named form controls
- asynchronous component initialisation

## Reactive data binding

Synergy is what you might call a _data binder_; it compiles the template with the data you provide it and then updates the DOM efficiently whenever that data changes. There's no virtual DOM, Synergy parses your template and then decorates the resulting DOM with metadata so that it knows which nodes are related to which properties on your data model. When the data changes, Synergy walks the tree and updates the nodes bound to those properties that just changed and _that's it_. It's a simple approach and it works nicely.

## Prerendering support with Component-level hydration

"Prerendering" means rendering your HTML at build time and then serving that html to your users rather than building the document tree from scratch when the user loads the page. "Hydration" is the term used to refer to making prerendered html interactive again without touching the DOM. This enables you to render something on the page for your users much more quickly. Synergy doesn't have a `renderToString`-type method (not yet, at least), so prerendering needs to happen in a real browser. There's currently a CLI in the making for Synergy which will provide this prerendering functionality out of the box, but if you're curious to try it out in the meantime and don't know where to start, then take a look at this article for a simple approach using Puppeteer.

## Objects as properties

Web components only support observing changes to attributes, but like most web component frameworks, Synergy allows you to pass rich data as properties. In your template you treat everything the same (e.g., you provide a value as an attribute, regardless of whether it is a primitive value or not) and the Synergy will look at the value and determine whether or not to provide it to the element as a

The factory function is as old as JavaScript itself, and the perfect way to stamp out multiple objects that carry their own scope.

Web Components are defined with ES Classes, however I opted for the humble factory function instead, having Synergy act as an adapter between the factory function and the class that the browser expects. I won't try to articulate the reasons that factory functions are better than classes for this purpose (because so many people have already done this already) so let's just suffice to say that, whether or not you agree that they're better, factory functions are certainly _simpler_, and this adaptation also enables some other possibilities, including _inferred observables_.

## inferred observables

Web Components require authors to explicitly name observed attributes so that changes to those attributes trigger a components `attributeChangedCallback` lifecycle method. So far in my adventures with Web components, I have found this to be overly repetitive and unintuitive, hence why I finally opted to make attributes and properties reactive by default. I'm happy to support an inverse "opt-out" model at some point in the future if somebody genuinely hits a wall with this, but let's provide that feature if and when its proven as needed and, until then, enjoy defining components that "just work" in the meantime. How _do_ they work? It's Proxy again, this time wrapping an empty object passed to your factory function to provide its initial arguments. Whatever you read from this object is lazily sourced from the element attributes or properties (in that order), and cached to provide the whitelist determining which properties and attributes should be reflected to your model and vice-versa.

## deferred instantiation

Your components view isn't rendered until the first time its `connectedCallback` lifecycle method has fired, and if you return a Promise from your factory, then Synergy simply waits for that promise to resolve before proceeding with your components initial render. You can use that to allow a component to fetch its own data, initialise itself lazily using an IntersectionObserver or some other event, or anything else asynchronous you might think of.

## factory function

You create a factory function to provide a data model for each instance of a component. Synergy wraps the "model" that is returned from your components factory function in a standard JavaScript proxy, making it possible to intercept property changes and schedule a DOM update on the next animation frame. As such, read/write ops are efficiently batched, and we're simply leaning on the browsers built-in functionality to detect change and update efficiently. This is one of the ways that Synergy stays small in size, - by using whats already available in the browser rather than reinventing the wheel.

///

Memory usage is low because we're decorating the DOM nodes rather than maintaining a separate data structure elsewhere. Walking the complete tree for every update surely isn't the _fastest_ approach, but any other solution would necessitate trading time for space, and premature optimisation is a sure project killer, so I'll happily deal with micro-optimisations just as soon as anybody can show a genuine use case proving it as an real requirement but not a minute before.
