export default ({ sitemap = {} }) => ({
    sitemap,
    ariaCurrent(pathname) {
      return pathname === window.location.pathname ? 'page' : null;
    },
  });
  