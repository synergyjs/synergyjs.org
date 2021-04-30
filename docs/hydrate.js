

let componentBindings = {"x-headings":{"2":[{"uid":"id","path":"items","type":4}],"4":[{"uid":"id","path":"items","type":5}],"5":[{"name":"href","parts":[{"type":"value","value":"#"},{"type":"key","value":"items.*.slug","negated":false}],"type":1,"context":[{"prop":"items","valueIdentifier":"heading","key":"id"}]},{"type":"call","eventName":"click","method":"handleClick","args":["items.*.slug"]},{"name":"aria-current","parts":[{"type":"function","negated":false,"method":"isCurrent","args":["items.*.slug"]}],"type":1,"context":[{"prop":"items","valueIdentifier":"heading","key":"id"}]}],"6":[{"childIndex":0,"parts":[{"type":"key","value":"items.*.text","negated":false}],"type":2,"context":[{"prop":"items","valueIdentifier":"heading","key":"id"}]}],"7":[{"name":"items","parts":[{"type":"key","value":"items.*.children","negated":false}],"type":1,"context":[{"prop":"items","valueIdentifier":"heading","key":"id"}]}]}}

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

const setMeta = (tagName, element, meta) => {
  let k = 0;
  let bindings = componentBindings[tagName];

  walk(element, (node) => {
    if (k in meta) {
      node.$meta = {
        ...meta[k],
        rootNode: element,
        bindings: bindings[meta[k].index]
      };
    }
    k++;
  });
};

export default (hydrateData) => {
  Object.entries(hydrateData).forEach(([tagName, entries]) => {
    document.querySelectorAll(tagName).forEach((node, i) => {
      if(entries[i]) {
        let { $initData, $subscribe, meta } = entries[i];
        node.$initData = $initData;
        node.$subscribe = $subscribe; //@todo
        setMeta(tagName, node, meta)
      }
    })
  })
}
