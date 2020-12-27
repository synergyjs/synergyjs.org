let style = document.createElement('style');
style.id = 'toggled';
style.textContent = `
  [toggled] {
      display: none;
  }
  [toggled][enter] {
      display: inherit;
  }
`;
document.head.appendChild(style);
document.querySelector('html').classList.add('js');

function waitFrames(n = 1, callback, t = n) {
  if (t === 0) callback();
  requestAnimationFrame(() => {
    return waitFrames(n, callback, t - 1);
  });
}

const once = { once: true };

function waitForTransition(target) {
  return new Promise((resolve) => {
    let hasTransition = false;
    let runHandler = () => (hasTransition = true);
    target.addEventListener('transitionrun', runHandler, once);
    target.addEventListener('transitionend', resolve, once);
    waitFrames(2, () => {
      if (!hasTransition) {
        target.removeEventListener('transitionrun', runHandler, once);
        target.removeEventListener('transitionend', resolve, once);
        resolve();
      }
    });
  });
}

function wait(n) {
  return Promise((resolve) => waitFrames(n, resolve));
}

function clickHandler({ target }) {
  if (target.nodeName !== 'BUTTON') return;

  let expanded = target.getAttribute('aria-expanded');
  if (!expanded) return;
  //@TODO: support multiple idrefs
  let id = target.getAttribute('aria-controls');
  if (!id) return;
  let content = document.getElementById(id);
  if (!content) return;

  let opening = !(expanded === 'true');

  if (opening) {
    content.setAttribute('enter', '');
    target.setAttribute('aria-expanded', 'true');
    waitFrames(2, () => {
      if (target.getAttribute('aria-expanded') !== 'true') return;
      content.setAttribute('open', '');
    });
  } else {
    target.setAttribute('aria-expanded', 'false');
    waitForTransition(content).then(() => {
      if (target.getAttribute('aria-expanded') !== 'false') return;
      content.removeAttribute('enter');
    });
    content.removeAttribute('open');
  }
}

document.body.addEventListener('click', clickHandler);
