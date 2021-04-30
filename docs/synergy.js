const ATTRIBUTE = 1;
const TEXT = 2;
const INPUT = 3;
const LIST = 4;
const LIST_ITEM = 5;

const isWhitespace = (node) =>
  node.nodeType === node.TEXT_NODE && node.nodeValue.trim() === '';

const walk = (node, callback) => {
  if (callback(node) === false) return;

  node = node.firstChild;

  while (node) {
    if (!isWhitespace(node)) walk(node, callback);
    node = node.nextSibling;
  }
};

const resolve = (path, ctx, target) => {
  let parts = path.split('.');
  let i = parts.length;
  while (i--) {
    if (parts[i].charAt(0) === '[') {
      let p = parts[i].slice(1, -1).replace(/:/g, '.');
      parts[i] = getValueAtPath(resolve(p, ctx), target);
    } else if (parts[i] === '*') {
      parts[i] = ctx[parts.slice(0, i).join('.')];
    }
  }

  return parts.join('.');
};

const last = (v = []) => v[v.length - 1];

const hasMustache = (v) => v.match(/({{[^{}]+}})/);

const typeOf = (v) => Object.prototype.toString.call(v).match(/\s(.+[^\]])/)[1];

const copy = (v) => v && JSON.parse(JSON.stringify(v));

const getTarget = (path, target) => {
  let parts = path.split('.');
  let t = parts.slice(0, -1).reduce((o, k) => o && o[k], target) || target;
  return [t, last(parts)];
};

const callFunctionAtPath = (path, target, args) => {
  let [a, b] = getTarget(path, target);
  return a[b].apply(a, args);
};

const setValueAtPath = (path, value, target) => {
  let [a, b] = getTarget(path, target);
  return (a[b] = value);
};

const getValueAtPath = (path, target) => {
  let [a, b] = getTarget(path, target);
  return a[b];
};

const removeNodes = (nodes) => nodes.forEach((node) => node.parentNode.removeChild(node));

const templateNode = (v) => {
  if (v.nodeName === 'TEMPLATE') return v;
  let tpl = document.createElement('template');
  tpl.innerHTML = v;
  return tpl;
};

const debounce = (fn) => {
  let t;
  return function () {
    if (t) return;
    t = requestAnimationFrame(() => {
      fn();
      t = null;
    });
  };
};

const pascalToKebab = (string) =>
  string.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + '-' + m[1].toLowerCase();
  });

const kebabToPascal = (string) =>
  string.replace(/[\w]-([\w])/g, function (m) {
    return m[0] + m[2].toUpperCase();
  });

const attributeToProp = (k, v) => {
  let name = kebabToPascal(k);
  if (v === '') v = true;
  if (k.startsWith('aria-')) {
    if (v === 'true') v = true;
    if (v === 'false') v = false;
  }
  return {
    name,
    value: v,
  };
};

const applyAttribute = (node, name, value) => {
  name = pascalToKebab(name);

  if (typeof value === 'boolean') {
    if (name.startsWith('aria-')) {
      value = '' + value;
    } else if (value) {
      value = '';
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    node.setAttribute(name, value);
  } else {
    node.removeAttribute(name);
  }
};

const isPrimitive = (v) => v === null || typeof v !== 'object';

let c = 0;

const add = (node, bindings) => {
  node.$meta.bindings.unshift(...bindings);
};

const resolveSquares = (str) => {
  let parts = str.split(/(\[[^\]]+\])/).filter((v) => v);
  return parts.reduce((a, part) => {
    let v = part.charAt(0) === '[' ? '.' + part.replace(/\./g, ':') : part;
    return a + v;
  }, '');
};

const convertIndex = (path, context) => {
  for (let { index, prop } of context) {
    if (path === index) return `#${prop}`;
  }
  return path;
};

const resolve$1 = (path, context) => {
  path = convertIndex(path, context);

  let isIndex = path.charAt(0) === '#';

  if (isIndex) path = path.slice(1);

  path = resolveSquares(path);

  let i = context.length;
  while (i--) {
    let { valueIdentifier, prop } = context[i];

    path = path
      .split('.')
      .map((v) => {
        let m = v.charAt(0) === '[';

        if (m) v = v.slice(1, -1);

        v = v.trim();

        if (v === valueIdentifier) v = prop + (m ? ':*' : '.*');

        return m ? `[${v}]` : v;
      })
      .join('.');
  }

  return isIndex ? `#${path}` : path;
};

const getParts = (value, context) =>
  value
    .trim()
    .split(/({{[^{}]+}})/)
    .filter((v) => v)
    .map((v) => {
      let match = v.match(/{{([^{}]+)}}/);

      if (match) {
        let m = match[1].trim();
        let negated = m.charAt(0) === '!';

        if (negated) m = m.slice(1);

        let fn = parseEventHandler(m, context);

        return fn
          ? {
              type: 'function',
              negated,
              ...fn,
            }
          : {
              type: 'key',
              value: resolve$1(m, context),
              negated,
            };
      }

      return {
        type: 'value',
        value: v,
      };
    });

let subscribers;

function parseElementNode(node, context) {
  let attrs = node.attributes;
  let i = attrs.length;
  while (i--) {
    parseAttributeNode(attrs[i], node, context);
  }
  return context;
}

const parseEventHandler = (value, context) => {
  let m = value.match(/(?:(\w+) => )?([^\(]+)(?:\(([^\)]*)\))/);

  if (!m) return;

  let event = m[1],
    method = m[2],
    args = m[3] && m[3].trim();

  args = args
    ? args
        .split(',')
        .filter((v) => v)
        .map((v) => v.trim())
        .map((k) => resolve$1(k, context))
    : null;

  return {
    event,
    method,
    args,
  };
};

const parseAttributeNode = ({ name, value }, node, context) => {
  if (name.startsWith('on')) {
    node.removeAttribute(name);
    let eventName = name.split('on')[1];

    subscribers.add(eventName);

    let { event, method, args } = parseEventHandler(value, context);

    add(node, [
      {
        type: 'call',
        eventName: eventName,
        event,
        method,
        args,
      },
    ]);

    return;
  }

  if (
    name === 'name' &&
    value &&
    (node.nodeName === 'INPUT' || node.nodeName === 'SELECT' || node.nodeName === 'TEXTAREA')
  ) {
    let path = resolve$1(value, context);

    subscribers.add('input');

    let binding = {
      type: INPUT,
      path,
    };

    add(node, [
      binding,
      {
        type: 'set',
        eventName: 'input',
        path,
      },
    ]);
  }

  if (hasMustache(value)) {
    node.removeAttribute(name);

    add(node, [
      {
        name,
        parts: getParts(value, context),
        type: ATTRIBUTE,
        context: context.slice(),
      },
    ]);
  }
};

const parseTextNode = (value, node, context) => {
  if (!hasMustache(value)) return;

  add(node, [
    {
      childIndex: Array.from(node.parentNode.childNodes).findIndex((v) => v === node),
      parts: getParts(value, context),
      type: TEXT,
      context: context.slice(),
    },
  ]);
};

function parseEach(node) {
  let each = node.getAttribute('each');
  let m = each && each.match(/(.+)\s+in\s+(.+)/);
  if (!m) return;
  let [_, left, right] = m;
  let parts = left.match(/\(([^\)]+)\)/);
  let [valueIdentifier, index] = (parts ? parts[1].split(',') : [left]).map((v) => v.trim());

  return {
    prop: right.trim(),
    valueIdentifier,
    index,
    key: node.getAttribute('key') || 'id',
  };
}

let listCount = 0;

const bind = (element, mountNode) => {
  subscribers = new Set();
  c = 0;

  let parse = () => {
    let stack = [];

    function dispatch(node) {
      node.$meta = {
        rootNode: mountNode,
        index: c++,
        bindings: [],
      };

      switch (node.nodeType) {
        case node.TEXT_NODE: {
          parseTextNode(node.nodeValue, node, stack);
          break;
        }
        case node.ELEMENT_NODE: {
          if (node.nodeName === 'TEMPLATE') {
            let each = parseEach(node);

            if (each) {
              stack.push(each);
              walk(node.content, dispatch);
              let { key, prop } = last(stack);
              let path = resolve$1(prop, stack);

              let binding = {
                uid: key,
                path,
              };

              node.$meta.listId = listCount;

              add(node, [
                {
                  ...binding,
                  type: LIST,
                },
              ]);

              let listNodeBinding = {
                ...binding,
                type: LIST_ITEM,
              };

              for (let child of node.content.children) {
                child.$meta.listId = listCount;
                add(child, [listNodeBinding]);
              }

              stack.pop();
              listCount++;
            }
          } else {
            parseElementNode(node, stack);
          }
        }
      }
    }

    walk(element, dispatch);

    return Array.from(subscribers);
  };

  return parse();
};

const inputValue = (node) => {
  if (node.hasAttribute('multiple') && node.nodeName === 'SELECT') {
    return Array.from(node.selectedOptions).map((node) => node.value);
  }
  let type = node.getAttribute('type') || 'text';

  switch (type) {
    case 'checkbox':
      return node.checked;
    case 'radio':
      return node.getAttribute('value');
    default:
      return node.value;
  }
};

const getEventBinding = (rootNode, type, node) => {
  if (!node) return;

  let binding =
    node.$meta?.rootNode === rootNode &&
    node.$meta.bindings.find(({ eventName }) => eventName === type);

  return binding || getEventBinding(rootNode, type, node.parentNode);
};

const subscribe = (rootNode, subscribers, proxy) => {
  subscribers.forEach((type) => {
    rootNode.addEventListener(
      type,
      (e) => {
        let binding = getEventBinding(rootNode, type, e.target);

        if (!binding) return;

        if (binding.type === 'call') {
          let args = binding.args
            ? binding.args
                .map((v) => resolve(v, binding.ctx, proxy))
                .map((v) => (v === binding.event ? e : getValueAtPath(v, proxy)))
            : [];

          let fn = proxy[binding.method](...args);

          if (fn) {
            requestAnimationFrame(fn);
          }
        }

        if (binding.type === 'set') {
          setValueAtPath(binding.realPath, inputValue(e.target), proxy);
        }
      },
      type === 'blur' || type === 'focus'
    );
  });
};

const flatten = (node) => {
  const res = [];
  walk(node, (x) => {
    res.push(x);
    if (x.nodeName === 'TEMPLATE') {
      res.push(...flatten(x.content));
    }
  });
  return res;
};

const cloneNode = (node) => {
  let newNode = node.cloneNode(true);

  let fa = flatten(node);
  let fb = flatten(newNode);

  let i = fa.length;
  while (i--) {
    fb[i].$meta = copy(fa[i].$meta);
    fb[i].$meta.rootNode = fa[i].$meta.rootNode;
  }

  return newNode;
};

const compareKeyedLists = (key = 'id', a = [], b = []) => {
  let delta = b.map((item, i) =>
    item[key] === undefined ? (i in a ? i : -1) : a.findIndex((v) => v[key] === item[key])
  );

  if (a.length !== b.length || !delta.every((a, b) => a === b)) return delta;
};

const getListItems = (template) => {
  let node = template.nextSibling;

  let nodes = [];

  while (node && node.$meta?.listId === template.$meta.listId) {
    nodes[node.$meta.blockIndex] = nodes[node.$meta.blockIndex] || [];
    nodes[node.$meta.blockIndex].push(node);
    node = node.nextSibling;
  }

  return nodes;
};

const updateList = (template, delta) => {
  let itemNodes = Array.from(template.content.children);
  let listItems = getListItems(template);
  let fragment = document.createDocumentFragment();

  listItems.forEach(removeNodes);

  delta.forEach((i, newIndex) => {
    let nodes = i === -1 ? itemNodes.map(cloneNode) : listItems[i];

    nodes.forEach((el) => {
      el.$meta.blockIndex = newIndex;
      fragment.appendChild(el);
    });
  });
  template.after(fragment);
};

let getPreviousValue = (node, binding) =>
  binding.type === ATTRIBUTE
    ? attributeToProp(binding.name, node.getAttribute(binding.name)).value
    : node.textContent;

const getValue = (part, ctx, target) => {
  let { value, negated } = part;

  if (value.charAt(0) === '#') {
    return ctx[value.slice(1)];
  }

  let v = getValueAtPath(resolve(value, ctx, target), target);

  return negated ? !v : v;
};

const parseStyles = (value) => {
  let type = typeof value;

  if (type === 'string')
    return value.split(';').reduce((o, value) => {
      const [k, v] = value.split(':').map((v) => v.trim());
      if (k) o[k] = v;
      return o;
    }, {});

  if (type === 'object') return value;

  return {};
};

const joinStyles = (value) =>
  Object.entries(value)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');

const convertStyles = (o) =>
  Object.keys(o).reduce((a, k) => {
    a[pascalToKebab(k)] = o[k];
    return a;
  }, {});

const applyComplexAttribute = (node, name, value) => {
  if (name === 'style') {
    value = joinStyles(
      convertStyles({
        ...parseStyles(node.getAttribute('style')),
        ...parseStyles(value),
      })
    );
  } else if (name === 'class') {
    switch (typeOf(value)) {
      case 'Array':
        value = value.join(' ');
        break;
      case 'Object':
        value = Object.keys(value)
          .reduce((a, k) => {
            if (value[k]) a.push(k);
            return a;
          }, [])
          .join(' ');
        break;
    }
  } else if (!isPrimitive(value)) {
    return (node[kebabToPascal(name)] = value);
  }

  applyAttribute(node, name, value);
};

const updateNode = (node, binding, newValue) =>
  binding.type === ATTRIBUTE
    ? applyComplexAttribute(node, binding.name, newValue)
    : (node.textContent = newValue);

const updateBinding = (binding, node, ctx, p, viewmodel) => {
  if (binding.eventName) {
    binding.ctx = copy(ctx);
    binding.path && (binding.realPath = resolve(binding.path, ctx)); // @delete
    return;
  }

  if (binding.type === LIST_ITEM) return (ctx[binding.path] = node.$meta.blockIndex);

  let oldValue = getPreviousValue(node, binding);

  if (binding.path) {
    const { path } = binding;
    const newValue = getValue({ value: path }, ctx, p);

    if (binding.type === LIST) {
      const delta = compareKeyedLists(binding.uid, node.$meta.blockData, newValue);
      node.$meta.blockData = newValue;
      return delta && updateList(node, delta);
    }

    if (oldValue === newValue) return;

    if (binding.type === INPUT) {
      if (node.hasAttribute('multiple') && node.nodeName === 'SELECT') {
        Array.from(node.querySelectorAll('option')).forEach((option) => {
          option.selected = newValue.includes(option.value);
        });
        return;
      }

      switch (node.getAttribute('type')) {
        case 'checkbox':
          node.checked = newValue;
          if (node.checked) {
            node.setAttribute('checked', '');
          } else {
            node.removeAttribute('checked');
          }
          break;
        case 'radio':
          node.checked = newValue === node.getAttribute('value');
          if (node.checked) {
            node.setAttribute('checked', '');
          } else {
            node.removeAttribute('checked');
          }
          break;
        default:
          node.setAttribute('value', (node.value = newValue || ''));
          break;
      }
      return;
    }
  }

  const newValue = binding.parts.reduce((a, part) => {
    let { type, value } = part;

    let v = value;

    if (type === 'key') {
      v = getValue(part, ctx, p);
    } else if (type === 'function') {
      let args = part.args.map((value) => getValue({ value }, ctx, p));
      v = callFunctionAtPath(part.method, viewmodel, args);
    }

    return a ? a + v : v;
  }, '');

  if (newValue === oldValue) return;

  updateNode(node, binding, newValue);
};

let prev;

const updater = (mountNode, viewmodel, updatedCallback = () => {}) => (rootNode) => {
  let ctx = {};
  let p = copy(viewmodel);

  walk(rootNode, (node) => {
    if (node.$meta?.rootNode !== mountNode) return;

    let bindings = node.$meta.bindings;

    if (bindings) {
      bindings.forEach((binding) => updateBinding(binding, node, ctx, p, viewmodel));
    }
  });

  if (prev) updatedCallback(prev);

  prev = p;
};

const wrapProxy = (root, callbackAny) => {
  let proxyCache = new WeakMap();

  function proxy(target, handler) {
    let proxy = proxyCache.get(target);
    if (proxy === undefined) {
      proxy = new Proxy(target, handler);
      proxyCache.set(target, proxy);
    }
    return proxy;
  }

  const handler = {
    get(target, property) {
      if (['Object', 'Array'].includes(typeOf(target[property]))) {
        return proxy(target[property], handler);
      } else {
        return Reflect.get(...arguments);
      }
    },
    set(target, property, value) {
      if (value === target[property]) return true;

      callbackAny();
      return Reflect.set(...arguments);
    },
    deleteProperty() {
      callbackAny();
      return Reflect.deleteProperty(...arguments);
    },
  };

  return new Proxy(root, handler);
};

const render = (mountNode, viewmodel, template, extras = {}) => {
  let vm, mounted;

  let update = updater(mountNode, viewmodel, (prev) => mounted && viewmodel.updatedCallback(prev));

  if (!mountNode.$initData) {
    template = templateNode(template).cloneNode(true).content;

    mountNode.$subscribe = bind(template, mountNode);

    update(template);

    extras.beforeMountCallback?.(template);

    for (let child of mountNode.children) {
      child.remove();
    }

    mountNode.appendChild(template);
  }

  vm = wrapProxy(
    viewmodel,
    debounce(() => update(mountNode))
  );

  subscribe(mountNode, mountNode.$subscribe, vm);

  mounted = true;

  return vm;
};

/* 

node {
  $initData,
  $subscribe,
  $meta: {
    rootNode,
    index,
    bindings,
    listId?,
    blockData?,
    blockIndex?
  }
}

*/

const childNodes = (node) => {
  let frag = document.createDocumentFragment();
  while (node.firstChild) {
    frag.appendChild(node.firstChild);
  }
  return frag;
};

const mergeSlots = (targetNode, sourceNode) => {
  let namedSlots = sourceNode.querySelectorAll('slot[name]');

  namedSlots.forEach((slot) => {
    let name = slot.attributes.name.value;
    let node = targetNode.querySelector(`[slot="${name}"]`);
    if (!node) {
      slot.parentNode.replaceChild(childNodes(slot), slot);
      return;
    }
    node.removeAttribute('slot');
    slot.parentNode.replaceChild(node, slot);
  });

  let defaultSlot = sourceNode.querySelector('slot:not([name])');

  if (defaultSlot) {
    defaultSlot.parentNode.replaceChild(
      childNodes(targetNode.innerHTML.trim() ? targetNode : defaultSlot),
      defaultSlot
    );
  }
};

const wrap = (target, property, fn) => {
  let o = target[property];
  target[property] = function () {
    fn(...arguments);
    o?.apply(target, arguments);
  };
};

const define = (name, factory, template, options = {}) => {
  customElements.define(
    name,
    class extends HTMLElement {
      async connectedCallback() {
        if (!this.initialised) {
          let observedProps = new Set();
          let self = this;

          if (this.$initData) Object.assign(this, this.$initData);

          let x = factory(
            new Proxy(
              {},
              {
                get(_, prop) {
                  let attr = pascalToKebab(prop);
                  observedProps.add(prop);
                  return (self.hasAttribute(attr) && self.getAttribute(attr)) || self[prop];
                },
              }
            ),
            this
          );

          this.$ = x instanceof Promise ? await x : x;

          observedProps = Array.from(observedProps);

          let observedAttributes = observedProps.map(pascalToKebab);

          let sa = this.setAttribute;
          this.setAttribute = (k, v) => {
            if (observedAttributes.includes(k)) {
              let { name, value } = attributeToProp(k, v);
              this.$[name] = value;
            }
            sa.apply(this, [k, v]);
          };

          let d = observedAttributes.reduce((o, name) => {
            let property = attributeToProp(name).name;

            let value;

            if (this.hasAttribute(name)) {
              value = this.getAttribute(name);
            } else {
              value = this[property] || this.$[property];
            }

            Object.defineProperty(this, property, {
              get() {
                return this.$[property];
              },
              set(v) {
                this.$[property] = v;

                if (isPrimitive(v)) {
                  applyAttribute(this, property, v);
                }
              },
            });

            this[property] = value;

            o[property] = value;
            return o;
          }, {});

          let extras = {};

          if (options.shadow) {
            this.attachShadow({
              mode: options.shadow,
            });
          } else {
            extras.beforeMountCallback = (frag) => mergeSlots(this, frag);
          }

          wrap(this.$, 'updatedCallback', () => {
            observedProps.forEach((k) => {
              let v = this.$[k];
              if (isPrimitive(v)) applyAttribute(this, k, v);
            });
          });

          this.$ = render(this.shadowRoot || this, this.$, template, extras);

          this.initialised = true;
          this.$initData = d;
        }

        this.$.connectedCallback?.(this.$);
      }
      disconnectedCallback() {
        this.$?.disconnectedCallback?.(this.$);
      }
    }
  );
};

export { define };
