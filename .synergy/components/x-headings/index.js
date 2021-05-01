export default ({ items = [] }, element) => {
  return {
    items,
    isCurrent(slug) {
      return slug === this.current;
    },
    onIntersection(entries) {
      let firstEntry = entries[0];
      if (firstEntry.intersectionRatio === 1) {
        this.current = firstEntry.target.id;
      }
    },
    handleClick(slug) {
      this.current = slug;
      element.dispatchEvent(
        new CustomEvent("click-uri-fragment", {
          bubbles: true,
        })
      );
    },
    connectedCallback() {
      let options = {
        threshold: 1,
        rootMargin: "0% 0% -50% 0%",
      };
      let observer = new IntersectionObserver(
        (entries) => this.onIntersection(entries),
        options
      );
      document.querySelectorAll("h2,h3,h4,h5,h6").forEach((h) => {
        observer.observe(h);
      });
      element.addEventListener("click-uri-fragment", (e) => {
        if (e.target !== element) this.current = null;
      });
    },
  };
};
