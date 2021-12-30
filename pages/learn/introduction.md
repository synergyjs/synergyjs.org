# Welcome to the tutorial

Web Components is a suite of different technologies available in all modern browsers, allowing you to create reusable UI components.

Web components are relatively low-level and, as such, require a non-trivial amount of imperative boilerplate code to achieve things like...

- change detection
- keeping your data and view in sync
- working with user input

## The Synergy.js Framework

Synergy.js provides a minimal abstraction to all of the above problems. Most importantly, it allows you to think more about _what_ your components should do, and less about _how_ they do it. In this sense it's no different from React or Vue, however there are some important advantages to using Web Components under the hood that we just couldn't access otherwise...

- significantly smaller runtime by leveraging the low-level API's of the browser rather than implementing those features from scratch
- greater interoperability with other frameworks and libraries via your Custom Elements public API: its attributes and properties.

## About this tutorial

In this tutorial, you'll learn Synergy.js by creating several small example components that, whilst not especially useful, will familiarise you with all the basic features provided by Synergy.js.

Let's get started!

> This tutorial assumes basic knowledge of HTML, CSS, and JavaScript. If you're totally new to frontend development, it might not be the best idea to jump right into a framework as your first step - grasp the basics then come back!
