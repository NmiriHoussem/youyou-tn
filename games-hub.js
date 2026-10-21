const hubGrid = document.getElementById('hubGrid');

if (hubGrid) {
  const chipWrap = document.getElementById('hubChips');
  const emptyMsg = document.getElementById('hubEmpty');
  const statusLine = document.getElementById('hubStatus');
  let active = 'all';

  const star = on => `<svg viewBox="0 0 24 24" width="19" height="19" fill="${on ? '#fff' : 'none'}" stroke="#fff" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8L12 3Z"/></svg>`;
  const starRow = earned => `<span class="stars">${[0, 1, 2].map(i => star(i < earned)).join('')}</span>`;
  const PLAY = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;

  // games with a photo show it; the rest show their icon on a darkened plate,
  // because the icons are white and would vanish on a white one
  function face(g, cls) {
    if (g.photo) {
      return `<span class="${cls}"><img src="${g.photo}" alt=""></span>`;
    }
    return `<span class="${cls} plate">${GAME_ICONS[g.icon] || ''}</span>`;
  }

  // the most recently played game leads the grid; before anything is played,
  // the first playable game takes the slot
  function featuredId(progress) {
    const live = YOUYOU_GAMES.filter(g => g.status === 'live');
    if (!live.length) return null;
    const at = g => (progress[g.id] || {}).at || 0;
    return live.slice().sort((a, b) => at(b) - at(a))[0].id;
  }

  function tileHTML(g, progress, i) {
    const style = `style="--c:${g.color};animation-delay:${i * 45}ms"`;

    if (g.status !== 'live') {
      return `<div class="tile wrapped" ${style}>
        ${face(g, 'tile-face')}
        <span class="tile-name">${g.title}</span>
        <span class="tile-lock">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z"/></svg>
          قريبًا
        </span>
      </div>`;
    }

    const rec = progress[g.id];
    const played = rec && rec.best;
    const earned = starsFor(g, rec && rec.best);

    return `<a class="tile" href="${g.href}" ${style}>
      ${face(g, 'tile-face')}
      <span class="tile-name">${g.title}</span>
      ${played ? starRow(earned) : ''}
      <span class="tile-go">${PLAY} ${played ? 'استمر' : 'العب'}</span>
    </a>`;
  }

  function render() {
    const progress = loadProgress();
    const lead = featuredId(progress);
    const list = YOUYOU_GAMES.filter(g => active === 'all' || g.cat === active);
    // the lead game sorts to the front of its own grid, no separate banner
    const ordered = list.slice().sort((a, b) => (b.id === lead) - (a.id === lead));

    hubGrid.innerHTML = ordered.map((g, i) => tileHTML(g, progress, i)).join('');
    emptyMsg.hidden = ordered.length > 0;
    const playable = ordered.filter(g => g.status === 'live').length;
    statusLine.textContent = `${ordered.length} ألعاب معروضة، ${playable} منها متاحة للعب الآن.`;
  }

  GAME_CATS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hub-chip' + (c.id === active ? ' on' : '');
    b.textContent = c.label;
    b.setAttribute('aria-pressed', c.id === active);
    b.setAttribute('aria-controls', 'hubGrid');
    b.onclick = () => {
      active = c.id;
      chipWrap.querySelectorAll('.hub-chip').forEach(x => {
        x.classList.remove('on');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('on');
      b.setAttribute('aria-pressed', 'true');
      render();
    };
    chipWrap.appendChild(b);
  });

  document.getElementById('hubReset').onclick = function () {
    if (!confirm('هل تريد حذف كل النقاط والنجوم من هذا الجهاز؟')) return;
    clearProgress();
    render();
  };

  render();
}
