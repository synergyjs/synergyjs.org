export default ({ sitemap = {}, currentPage = '' }) => {
  return {
    sitemap,
    currentPage,
    fullTitle(title) {
      return title.includes('|') ? title : `${title} | Synergy: The Web Component Framework`;
    },
  };
};
