import fetch from "node-fetch"
import fs from "fs-extra"
import glob from "glob"

const OUT_DIR = "./output"

glob("./pages/**/*.md", async (err, files) => {
  let routes = files
    .map((v) => v.split("./pages")[1])
    .map((v) => v.slice(0, -3))
    .map((v) =>
      v.endsWith("index.md") ? v.slice(0, -8) : v
    )
    .concat(["/docs", "/learn"])

  await fs.copy("./public", OUT_DIR)

  for (let route of routes) {
    let html = await fetch(
      "http://localhost:3000" + route
    ).then((v) => v.text())

    let dir =
      OUT_DIR +
      route.split("/").slice(0, -1).join("/")

    await fs.ensureDir(dir)
    await fs.writeFile(
      OUT_DIR + route + ".html",
      html
    )
  }
})
