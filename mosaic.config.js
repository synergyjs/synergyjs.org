import path from 'path';
import prettier from 'prettier';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const name = (filepath) =>
  path.basename(filepath, path.extname(filepath));

const build = {
  //port: 4321,
  input: {
    pageHtml: './pages/*.html',
    pageMd: './pages/*.md',
    template: './template.html',
    blocks: './blocks/*.html',
  },
  output: [
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
