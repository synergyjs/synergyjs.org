export const sitemap = {
  pages: [
    {
      title:
        "Synergy | The tiny runtime library for building user interfaces with Web Components",
      slug: "/",
      pathname: "/",
      name: "home",
    },
  ],
  sections: [
    {
      title: "learn",
      summary: "",
      slug: "learn",
      pages: [
        {
          title: "Introduction",
          slug: "introduction",
        },
        {
          title: "Hello World!",
          slug: "hello-world",
        },
      ],
    },
    {
      title: "docs",
      summary: "",
      slug: "docs",
      pages: [
        {
          title: "Install",
          slug: "install",
        },
        {
          title: "API",
          slug: "api",
        },
        {
          title: "Templates",
          slug: "templates",
        },
        {
          title: "Class & Style",
          slug: "class-and-style",
        },
        {
          title: "Repeated Blocks",
          slug: "repeated-blocks",
        },
        {
          title: "Events",
          slug: "events",
        },
        {
          title: "Forms",
          slug: "forms",
        },
        // {
        //   title: 'CLI',
        //   slug: 'cli',
        // },
      ],
    },
  ].map((section) => {
    return {
      ...section,
      pathname: `/${section.slug}`,
      pages: section.pages.map((page) => ({
        ...page,
        pathname: `/${section.slug}/${page.slug}`,
      })),
    };
  }),
};

export const pages = sitemap.pages.concat(
  sitemap.sections.reduce((a, section) => {
    return a.concat(section.pages);
  }, [])
);

export function withPaginationData(locationPathname) {
  let currentIndex = pages.findIndex(
    ({ pathname }) => pathname === locationPathname
  );

  let currentPage =
    pages[currentIndex] ||
    sitemap.sections.find(
      ({ pathname }) => pathname === locationPathname
    );

  let previousPage = currentIndex > 1 && pages[currentIndex - 1]; // omit prev link to home page

  let nextPage = pages[currentIndex + 1];

  return {
    sitemap,
    pages,
    currentPage,
    previousPage,
    nextPage,
  };
}
