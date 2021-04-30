import { JSDOM } from 'jsdom';

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function headings(html) {
  let dom = new JSDOM(html);
  let doc = dom.window.document;
  let res = [];
  let last = {};

  doc.querySelectorAll('h2,h3,h4,h5,h6').forEach((el) => {
    let name = el.nodeName;
    let level = name.slice(1);
    let text = el.textContent;
    let slug = slugify(text);
    el.setAttribute('id', slug);
    let parent = last[level - 1];
    let entry = {
      level,
      text,
      slug,
      children: [],
    };
    if (parent) {
      parent.children.push(entry);
    } else {
      res.push(entry);
    }
    last[level] = entry;
  });

  return {
    headings: res,
    html: doc.body.innerHTML,
  };
}

export default headings;
