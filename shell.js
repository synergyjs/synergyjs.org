import { navigation } from "./navigation.js";

const flatNav = navigation.flatMap(({ children }) => children);

function prevNext(href) {
  let index = flatNav.findIndex((v) => v.href === href);
  return {
    prev: flatNav[index - 1],
    next: flatNav[index + 1],
  };
}

const NEXT_ICON = /* HTML */ `
  <svg
    width="10"
    height="16"
    viewBox="0 0 10 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polyline
      fill="none"
      vector-effect="non-scaling-stroke"
      points="2,2 8,8 2,14"
    ></polyline>
  </svg>
`;

const PREV_ICON = /* HTML */ `
  <svg
    width="10"
    height="16"
    viewBox="0 0 10 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polyline
      fill="none"
      vector-effect="non-scaling-stroke"
      points="8,2 2,8 8,14"
    ></polyline>
  </svg>
`;

export const wrap = (content, { label, href }, frontMatter) => {
  const pn = prevNext(href);

  let prev = ``;
  let next = ``;

  if (pn.prev) {
    let { href, label } = pn.prev;
    prev = `<a href="${href}"><span>PREV</span>${label}${PREV_ICON}</a>`;
  }
  if (pn.next) {
    let { href, label } = pn.next;
    next = `<a href="${href}"><span>NEXT</span>${label}${NEXT_ICON}</a>`;
  }

  const title = `${label} | Synergy: A JavaScript Library for building Web Components`;

  return /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="${title}" />
        <meta property="og:url" content="https://synergyjs.org${href}" />
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/base16/tomorrow.min.css" integrity="sha512-5D/fcZ3y3nuaeHSxDbFwWDEy1Fvj5qQKsU0tilD7bhWAA+IN/Jl9fzGdUotzvA7wgXtsnZmafcuunH+6nyuA0A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="/index.css"></link>
      </head>
      <body>
      <div id="container">
      <div id="first-column">
      <a href="/" class="synergy">synergy</a>
        <nav id="top-nav">
          <ul>
          ${navigation
            .map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`)
            .join("")}</ul>
        </nav>
        <nav id="side-nav">
          
          <ul>
          ${navigation
            .map(
              ({ label, children }) => `
            <li>${label}
            <ul>
              ${children
                .map(
                  (item) => `
                <li><a href="${item.href}" ${
                    item.href === href ? `aria-current="page"` : ""
                  }>${item.label}</a></li>
              `
                )
                .join("")}
            </ul>
            </li>
          `
            )
            .join("")}

          </ul>
          
        </nav>
        <a
            href="https://github.com/defx/synergy"
            class="github"
            aria-label="Synergy.js on GitHub"
            rel="noopener noreferrer"
            target="_blank"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 17 16"
              fill="none"
            >
              <g clip-path="url(githublogo)">
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M8.18391.249268C3.82241.249268.253906 3.81777.253906 8.17927c0 3.46933 2.279874 6.44313 5.451874 7.53353.3965.0991.49563-.1983.49563-.3965v-1.3878c-2.18075.4956-2.67638-.9912-2.67638-.9912-.3965-.8922-.89212-1.1895-.89212-1.1895-.69388-.4957.09912-.4957.09912-.4957.793.0992 1.1895.793 1.1895.793.69388 1.2887 1.88338.8922 2.27988.6939.09912-.4956.29737-.8921.49562-1.0904-1.78425-.1982-3.5685-.8921-3.5685-3.96496 0-.89212.29738-1.586.793-2.08162-.09912-.19825-.3965-.99125.09913-2.08163 0 0 .69387-.19825 2.18075.793.59475-.19825 1.28862-.29737 1.9825-.29737.69387 0 1.38775.09912 1.98249.29737 1.4869-.99125 2.1808-.793 2.1808-.793.3965 1.09038.1982 1.88338.0991 2.08163.4956.59475.793 1.28862.793 2.08162 0 3.07286-1.8834 3.66766-3.66764 3.86586.29737.3965.59474.8921.59474 1.586v2.1808c0 .1982.0991.4956.5948.3965 3.172-1.0904 5.4518-4.0642 5.4518-7.53353-.0991-4.3615-3.6676-7.930002-8.02909-7.930002z"
                  clip-rule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="githublogo">
                  <path
                    fill="transparent"
                    d="M0 0h15.86v15.86H0z"
                    transform="translate(.253906 .0493164)"
                  ></path>
                </clipPath>
              </defs></svg
          ></a>
        </div>
        <div id="middle-column">
          <main>${content}</main>
          <div id="pager">${next}${prev}</div>
        </div>
       <div id="last-column"></div>
      </body>
    </html>`;
};
