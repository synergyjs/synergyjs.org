export default (_, node) => ({
  connectedCallback() {
    let head = document.querySelector('head');
    let child;

    while ((child = node.children[0])) {
      head.appendChild(child);
    }

    node.remove();
  },
});
