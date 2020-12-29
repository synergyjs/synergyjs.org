import path from 'path';
import prettier from 'prettier';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const name = (filepath) =>
  path.basename(filepath, path.extname(filepath));

/* @TODO auto parse .json */

const build = {
  //port: 4321,
  input: {
    pageHtml: './pages/*.html',
    pageMd: './pages/*.md',
    template: './template.html',
    blocks: './blocks/*.html',
    menuJSON: './menu.json',
  },
  output: [
    (v) => ({
      ...v,
      menuItems: JSON.parse(v.menuJSON.content)
        .items,
    }),
    (v) => {
      let { blocks, menuItems } = v;

      let block = {
        filepath: 'docs-menu',
        content: menuItems
          .filter(
            ({ section }) => section === 'docs'
          )
          .map(
            ({ title }) => `
          <li><a href="/${title.replace(
            /\s+/g,
            '-'
          )}">${title}</a></li>
        `
          )
          .join('\n'),
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
          filepath: filepath.replace(
            /.md$/,
            '.html'
          ),
          content: md.render(content),
        }))
      ),
    }),
    (v) => ({
      ...v,
      pages: v.pages.map(
        ({ filepath, content }) => ({
          filepath,
          content: v.template.content.replace(
            '<!-- {{ main-content }} -->',
            content
          ),
        })
      ),
    }),
    (v) => {
      let { pages, menuItems } = v;

      console.log(menuItems);

      pages = pages.map(
        ({ filepath, content }) => {
          let n = name(filepath).replace(
            /-/g,
            ' '
          );

          let i = menuItems.findIndex(
            ({ title, file }) => {
              return title === n || file === n;
            }
          );

          // console.log(n, i);

          let prev = menuItems[i - 1];
          let next = menuItems[i + 1];

          // console.log(n, prev, next);

          let html = '';

          if (prev) {
            html += `
          <a href="${prev.slug}" class="next">
            <span>< PREV</span>
            ${prev.title}
          </a>
          `;
          } else {
            html += '<span></span>';
          }

          if (next) {
            html += `
          <a href="${next.slug}" class="next">
            <span>NEXT ></span>
            ${next.title}
          </a>
          `;
          } else {
            html += '<span></span>';
          }

          return {
            filepath,
            content: content.replace(
              '<!-- {{ pagination }} -->',
              html
            ),
          };
        }
      );

      return {
        ...v,
        pages,
      };
    },
    ({ pages, blocks }) =>
      pages.map(({ filepath, content }) => {
        for (let block of blocks) {
          content = content.replace(
            `<!-- {{ ${name(
              block.filepath
            )} }} -->`,
            block.content
          );
        }
        return { filepath, content };
      }),
    (pages) =>
      pages.map(({ filepath, content }) => ({
        filepath: path.join(
          'docs',
          path.basename(filepath)
        ),
        content,
      })),
    (pages) =>
      pages.map(({ filepath, content }) => ({
        filepath,
        content: prettier.format(content, {
          parser: 'html',
        }),
      })),
  ],
};

export default { build };
