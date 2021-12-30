import express from "express"
import fs from "fs-extra"
import hljs from "highlight.js"
import MarkdownIt from "markdown-it"
import { wrap } from "./shell.js"
import { navigation } from "./navigation.js"

const flatNav = navigation.flatMap(
  ({ children }) => children
)

let md = new MarkdownIt({
  html: true,
  highlight: function (str, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, {
            language,
            ignoreIllegals: true,
          }).value +
          "</code></pre>"
        )
      } catch (__) {}
    }
    return (
      '<pre class="hljs"><code>' +
      md.utils.escapeHtml(str) +
      "</code></pre>"
    )
  },
})

const app = express()
const PORT = 3000

app.use(express.static("public"))

async function initialise() {
  function parseMarkdown(md) {
    let fm = md.match(/^---([^---]+)/m)?.[1]

    if (fm) {
      let index = md.slice(3).indexOf("---") + 6
      let markdown = md.slice(index)

      let frontMatter = fm
        ?.split("\n")
        .map((v) =>
          v.split(":").map((v) => v.trim())
        )
        .reduce((o, [k, v]) => {
          k && (o[k] = v)
          return o
        }, {})
      return {
        markdown,
        frontMatter,
      }
    }

    return {
      markdown: md,
    }
  }

  app.use(async function (req, res, next) {
    let route = req.originalUrl.split("?")[0]
    let navItem =
      flatNav.find(
        ({ href }) => href === route
      ) || {}
    let fp = `./pages${
      route === "/" ? "/index" : route
    }.md`

    const { frontMatter = {}, markdown } =
      await fs
        .readFile(fp, "utf8")
        .then(parseMarkdown)
        .catch((e) => {
          // console.log(e);
          return {}
        })

    if (markdown) {
      res.send(
        wrap(
          md.render(markdown),
          navItem,
          frontMatter
        )
      )
    } else {
      next()
    }
  })

  app.use(async function (req, res, next) {
    let route = req.originalUrl.split("?")[0]
    let categoryItem = navigation.find(
      ({ href }) => href === route
    )

    if (!categoryItem) return next()

    let { label, children } = categoryItem

    res.send(
      wrap(
        `
        <div class="category-listing">
      <h1>${label}</h1>
      <ul>
        ${children
          .map(
            ({ label, href }) =>
              `<li><a href="${href}">${label}</a></li>`
          )
          .join("")}
      </ul>
      </div>
    `,
        categoryItem,
        {}
      )
    )
  })

  app.listen(PORT, () => {
    console.log(
      `Example app listening at http://localhost:${PORT}`
    )
  })
}

initialise()
