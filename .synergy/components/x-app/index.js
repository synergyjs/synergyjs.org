export default ({ sitemap = {}, currentPage = "" }) => {
  return {
    sitemap,
    currentPage,
    fullTitle(title) {
      return title.includes("|")
        ? title
        : `${title} | Synergy: A JavaScript library for building Web Components`;
    },
  };
};
