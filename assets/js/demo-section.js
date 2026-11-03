/**
 * "See it in action" section on the home page: one large player with a tab per project video.
 * Built from the videos in window.PROJECTS (assets/js/projects-data.js), so new videos appear automatically.
 * A video only downloads when the visitor presses play or picks its tab.
 */
(function() {
  "use strict";

  const section = document.querySelector('#demos');
  const mount = document.querySelector('#demo-player');
  if (!section || !mount) return;

  const demos = [];
  (window.PROJECTS || []).forEach(p => {
    (p.videos || (p.video ? [p.video] : [])).forEach(v => demos.push({ project: p, video: v }));
  });
  if (!demos.length) { section.remove(); return; }

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
  const titleOf = d => d.video.title || d.project.title;
  const labelOf = d => d.video.title ? d.project.title : (d.project.eyebrow || d.project.client || '');

  // ---------- Tabs ----------
  const tabs = el('div', 'demo-tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Demo videos');

  demos.forEach((d, i) => {
    const t = el('button', 'demo-tab');
    t.type = 'button';
    t.id = 'demo-tab-' + i;
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', 'demo-stage');
    t.append(icon(d.video.frame === 'browser' ? 'window' : 'phone'), el('span', null, titleOf(d)));
    if (d.video.duration) t.append(el('span', 'demo-tab-time', d.video.duration));
    t.addEventListener('click', () => select(i, true));
    tabs.append(t);
  });

  // arrow keys move between tabs
  tabs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const all = [...tabs.children];
    const i = all.indexOf(document.activeElement);
    if (i < 0) return;
    const next = all[(i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
    next.focus();
    e.preventDefault();
  });

  // ---------- Stage ----------
  const stage = el('div', 'demo-stage');
  stage.id = 'demo-stage';
  stage.setAttribute('role', 'tabpanel');
  const screen = el('div', 'demo-screen');
  const details = el('div', 'demo-details');
  stage.append(screen, details);

  mount.replaceChildren(tabs, stage);

  let video = null;

  function select(index, autoplay) {
    const d = demos[index];
    const v = d.video;
    const isBrowser = v.frame === 'browser';

    [...tabs.children].forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index));
      t.tabIndex = i === index ? 0 : -1;
    });
    stage.setAttribute('aria-labelledby', 'demo-tab-' + index);

    // stop and release the previous video
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }

    const frame = el('div', isBrowser ? 'browser-frame' : 'phone-frame');
    if (isBrowser) {
      const bar = el('div', 'browser-bar');
      bar.setAttribute('aria-hidden', 'true');
      bar.append(el('span'), el('span'), el('span'));
      frame.append(bar);
    }
    video = el('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.muted = !v.sound;
    if (v.poster) video.poster = v.poster;
    if (v.width && v.height) video.style.aspectRatio = v.width + ' / ' + v.height;
    video.src = v.src;
    video.setAttribute('aria-label', 'Demo video: ' + titleOf(d));
    frame.append(video);
    screen.classList.toggle('is-browser', isBrowser);
    screen.replaceChildren(frame);

    // details beside the player
    const meta = el('div', 'demo-meta');
    if (v.duration) {
      const m = el('span', 'demo-pill'); m.append(icon('clock'), document.createTextNode(' ' + v.duration)); meta.append(m);
    }
    const s = el('span', 'demo-pill');
    s.append(icon(v.sound ? 'volume-up' : 'volume-mute'), document.createTextNode(v.sound ? ' With sound' : ' No sound'));
    meta.append(s);

    const link = el('a', 'demo-link', 'View project details ');
    link.href = 'project.html?id=' + encodeURIComponent(d.project.id);
    link.append(icon('arrow-right'));

    details.replaceChildren(
      el('span', 'demo-label', labelOf(d)),
      el('h3', null, titleOf(d)),
      ...(v.caption ? [el('p', null, v.caption)] : []),
      meta,
      link
    );

    if (autoplay) {
      const started = video.play();
      if (started && started.catch) started.catch(() => {});   // if autoplay is blocked, the visitor presses play
    }
  }

  select(0, false);
})();
