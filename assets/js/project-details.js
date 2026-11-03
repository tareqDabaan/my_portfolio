/**
 * Renders project.html?id=<id> from window.PROJECTS (assets/js/projects-data.js).
 */
(function() {
  "use strict";

  const projects = window.PROJECTS || [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const index = projects.findIndex(p => p.id === id);
  const project = projects[index];

  // Small helper: create an element with a class and optional text (text is never parsed as HTML)
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name) {
    const i = el('i', 'bi bi-' + name);
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  const titleEl = document.querySelector('#project-title');
  const clientEl = document.querySelector('#project-client');
  const crumbEl = document.querySelector('#project-crumb');
  const iconEl = document.querySelector('#project-icon');
  const mainEl = document.querySelector('#project-main');
  const infoEl = document.querySelector('#project-info');
  const pagerEl = document.querySelector('#project-pager');

  if (!project) {
    document.title = 'Project not found | Tareq Dabaan';
    titleEl.textContent = 'Project not found';
    crumbEl.textContent = 'Not found';
    clientEl.textContent = "This project doesn't exist or the link is incorrect.";
    iconEl.remove();
    const back = el('a', 'btn-download-cv', 'Back to all projects');
    back.href = 'index.html#projects';
    mainEl.className = 'col-12 text-center';
    mainEl.replaceChildren(back);
    infoEl.closest('.col-lg-4').remove();
    pagerEl.remove();
    return;
  }

  // Page title section
  document.title = project.title + ' | Tareq Dabaan';
  titleEl.textContent = project.title;
  crumbEl.textContent = project.title;
  clientEl.textContent = project.eyebrow || project.client || '';
  iconEl.replaceChildren(icon(project.icon));

  // Main column: overview, highlights, contributions
  const main = [];

  main.push(el('h2', null, 'Overview'));
  project.overview.forEach(text => main.push(el('p', 'project-overview', text)));

  if (project.highlights && project.highlights.length) {
    const grid = el('div', 'project-highlights');
    project.highlights.forEach(h => {
      const item = el('div', 'highlight');
      item.append(el('span', 'highlight-value', h.value), el('span', 'highlight-label', h.label));
      grid.append(item);
    });
    main.push(grid);
  }

  const videos = project.videos || (project.video ? [project.video] : []);
  if (videos.length > 1) main.push(el('h2', 'project-videos-title', 'See it in action'));

  videos.forEach(v => {
    const isBrowser = v.frame === 'browser';
    const block = el('div', 'project-video' + (isBrowser ? ' is-browser' : ''));

    const frame = el('div', isBrowser ? 'browser-frame' : 'phone-frame');
    if (isBrowser) {
      const bar = el('div', 'browser-bar');
      bar.setAttribute('aria-hidden', 'true');
      bar.append(el('span'), el('span'), el('span'));
      frame.append(bar);
    }
    const video = el('video');
    video.src = v.src;
    if (v.poster) video.poster = v.poster;
    if (v.width && v.height) video.style.aspectRatio = v.width + ' / ' + v.height;
    video.controls = true;
    video.muted = !v.sound;      // silent recordings play muted; ones with speech keep their sound
    video.playsInline = true;    // play in place on iPhone instead of going fullscreen
    video.preload = 'metadata';  // don't download the whole file until the visitor presses play
    video.setAttribute('aria-label', 'Demo video: ' + (v.title || project.title));
    frame.append(video);

    const text = el('div', 'project-video-text');
    const label = el('span', 'project-video-label');
    label.append(icon(v.sound ? 'volume-up' : 'play-circle'), document.createTextNode(' ' + (v.title || 'Feature demo')));
    text.append(label);
    if (videos.length === 1) text.append(el('h2', null, 'See it in action'));
    if (v.caption) text.append(el('p', null, v.caption));

    // Wide desktop recordings sit under their description; phone recordings sit beside it
    if (isBrowser) block.append(text, frame); else block.append(frame, text);
    main.push(block);
  });

  main.push(el('h2', null, 'What I did'));
  const list = el('ul', 'contribution-list');
  project.contributions.forEach(text => {
    const li = el('li');
    li.append(icon('check2-circle'), el('span', null, text));
    list.append(li);
  });
  main.push(list);

  mainEl.replaceChildren(...main);

  // Side column: project info card
  const info = [el('h3', null, 'Project info')];
  const facts = el('ul', 'project-facts');
  [
    ['Client', project.client],
    ['My role', project.role],
    ['Company', project.company],
    ['Period', project.period],
    ['Type', project.type]
  ].forEach(([label, value]) => {
    if (!value) return;
    const li = el('li');
    li.append(el('strong', null, label), el('span', null, value));
    facts.append(li);
  });
  info.push(facts);

  info.push(el('h4', null, 'Tech stack'));
  const tags = el('ul', 'tag-list');
  project.tech.forEach(t => tags.append(el('li', null, t)));
  info.push(tags);

  if (project.link) {
    const a = el('a', 'btn-download-cv project-external', project.link.label + ' ');
    a.href = project.link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.append(icon('box-arrow-up-right'));
    info.push(a);
  }

  infoEl.replaceChildren(...info);

  // Previous / next navigation (wraps around)
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  function pagerLink(p, direction) {
    const a = el('a', 'pager-link pager-' + direction);
    a.href = 'project.html?id=' + encodeURIComponent(p.id);
    const label = el('span', 'pager-label');
    if (direction === 'prev') {
      label.append(icon('arrow-left'), document.createTextNode(' Previous'));
    } else {
      label.append(document.createTextNode('Next '), icon('arrow-right'));
    }
    a.append(label, el('span', 'pager-title', p.title));
    return a;
  }

  const all = el('a', 'pager-all');
  all.href = 'index.html#projects';
  all.append(icon('grid'), el('span', null, 'All projects'));

  pagerEl.replaceChildren(pagerLink(prev, 'prev'), all, pagerLink(next, 'next'));
})();
