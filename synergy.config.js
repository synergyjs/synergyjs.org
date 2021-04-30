import fs from 'fs';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

import { sitemap, withPaginationData } from './data/sitemap.js';
import idHeadings from './headings.js';

const STATIC = 1;
const HYDRATE = 2;
const ENHANCE = 3;

export default {
  components: {
    'x-headings': HYDRATE,
  },
  routes: [
    {
      match: '/',
      component: 'x-home',
      getStaticProps: async () => {
        return { props: withPaginationData('/') };
      },
    },
    {
      match: '[section]',
      component: 'x-branch',
      getStaticPaths: async () => {
        let paths = sitemap.sections.map(({ pathname }) => ({
          params: {
            section: pathname,
          },
        }));

        return {
          paths,
        };
      },
      getStaticProps: async ({ section }) => {
        return {
          props: {
            ...withPaginationData(section),
            section: sitemap.sections.find(({ pathname }) => pathname === section),
          },
        };
      },
    },
    {
      match: '[section]/[id]',
      component: 'x-leaf',
      getStaticPaths: async (v) => {
        let paths = [];

        for (let section of sitemap.sections) {
          for (let page of section.pages) {
            paths.push({
              params: {
                section: section.slug,
                id: page.slug,
              },
            });
          }
        }

        return { paths };
      },
      getStaticProps: async ({ section, id }) => {
        let pathname = `/${section}/${id}`;

        let md = new MarkdownIt({
          html: true,
          highlight: function (str, language) {
            if (language && hljs.getLanguage(language)) {
              try {
                return (
                  '<pre class="hljs"><code>' +
                  hljs.highlight(str, { language, ignoreIllegals: true }).value +
                  '</code></pre>'
                );
              } catch (__) {}
            }
            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
          },
        });

        let markdownContent = await fs.promises
          .readFile(`./markdown${pathname}.md`, 'utf8')
          .then((v) => md.render(v));

        let { html, headings } = idHeadings(markdownContent);

        return {
          props: {
            ...withPaginationData(pathname),
            markdownContent: {
              value: html,
            },
            headings,
          },
        };
      },
    },
  ],
};
