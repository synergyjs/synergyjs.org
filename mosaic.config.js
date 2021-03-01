import path from "path";
import prettier from "prettier";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

const name = (filepath) =>
  path.basename(filepath, path.extname(filepath));

const build = {
  //port: 4321,
  input: {
    pageHtml: "./pages/*.html",
    pageMd: "./pages/*.md",
    template: "./template.html",
    blocks: "./blocks/*.html",
    menuJSON: "./menu.json",
  },
  transform: [
    (v) => ({
      ...v,
      menuItems: JSON.parse(v.menuJSON.content).items,
    }),
    (v) => {
      let { blocks, menuItems } = v;

      let block = {
        filepath: "docs-menu",
        content: menuItems
          .filter(({ section }) => section === "docs")
          .map(
            ({ title }) => `
          <li><a href="/${title.replace(
            /\s+/g,
            "-"
          )}">${title}</a></li>
        `
          )
          .join("\n"),
      };

      return {
        ...v,
        blocks: v.blocks.concat(block),
      };
    },
    (v) => ({
      ...v,
      pages: v.pageHtml.concat(
        v.pageMd.map(({ filepath, content }) => ({
          filepath: filepath.replace(/.md$/, ".html"),
          content: md.render(content),
        }))
      ),
    }),
    (v) => ({
      ...v,
      pages: v.pages.map(({ filepath, content }) => ({
        filepath,
        content: v.template.content.replace(
          "<!-- {{ main-content }} -->",
          content
        ),
      })),
    }),

    (v) => {
      let pages = v.pages.map((page) => {
        let n = name(page.filepath);

        let index = v.menuItems.findIndex(({ slug, file }) => {
          return slug === n || file === n;
        });

        return {
          ...page,
          menuItem: {
            index,
            ...v.menuItems[index],
          },
        };
      });

      return {
        ...v,
        pages,
      };
    },
    (v) => {
      // let { pages, menuItems } = v;

      let pages = v.pages.map((page) => {
        let { filepath, content, menuItem } = page;
        let i = menuItem.index;
        let prev = v.menuItems[i - 1];
        let next = v.menuItems[i + 1];

        let html = "";

        if (prev) {
          html += `
          <a href="${prev.slug}" class="next">
            <span>< PREV</span>
            ${prev.title}
          </a>
          `;
        } else {
          html += "<span></span>";
        }

        if (next) {
          html += `
          <a href="${next.slug}" class="next">
            <span>NEXT ></span>
            ${next.title}
          </a>
          `;
        } else {
          html += "<span></span>";
        }

        return {
          ...page,
          content: content.replace("<!-- {{ pagination }} -->", html),
        };
      });

      return {
        ...v,
        pages,
      };
    },
    (v) => {
      let pages = v.pages.map((page) => {
        let { menuItem } = page;

        return {
          ...page,
          content: page.content.replace(
            "<!-- {{ title }} -->",
            menuItem.title
          ),
        };
      });

      return {
        ...v,
        pages,
      };
    },
    ({ pages, blocks }) =>
      pages.map(({ filepath, content }) => {
        for (let block of blocks) {
          content = content.replace(
            `<!-- {{ ${name(block.filepath)} }} -->`,
            block.content
          );
        }
        return { filepath, content };
      }),
    (pages) =>
      pages.map(({ filepath, content }) => ({
        filepath,
        content: prettier.format(content, {
          parser: "html",
        }),
      })),
  ],
  output: {
    map: (pages) =>
      pages.map(({ filepath, content }) => ({
        filepath: path.join("docs", path.basename(filepath)),
        content,
      })),
  },
};

export default { build };
