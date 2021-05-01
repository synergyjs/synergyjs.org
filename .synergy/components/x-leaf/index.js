export default ({ previousPage, nextPage, currentPage, markdownContent, sitemap, headings }) => {
  return {
    sitemap,
    markdownContent,
    previousPage,
    nextPage,
    currentPage,
    headings,
  };
};
