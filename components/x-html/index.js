export default (_, node) => {
  return {
    connectedCallback() {
      node.outerHTML = node.textContent;
    },
  };
};
