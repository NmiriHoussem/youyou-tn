const hubGrid = document.getElementById('hubGrid');

if (hubGrid) {
  const chipWrap = document.getElementById('hubChips');
  const emptyMsg = document.getElementById('hubEmpty');
  const catLabel = Object.fromEntries(GAME_CATS.map(c => [c.id, c.label]));
  let active = 'all';

  const STAR = on => `<svg viewBox="0 0 24 24" width="18" height="18" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8L12 3Z"/></svg>`;

  function gameIcon(g) {
    if (g.thumb && typeof BOOK_THUMB !== 'undefined') {
      return `<img class="hub-thumb" src="${BOOK_THUMB}" alt="">`;
    }
    return GAME_ICONS[g.icon] || '';
  }

  function cardHTML(g, progress) {
    const meta = `<div class="hub-meta">
        <span class="hub-pill">${g.ages} سنوات</span>
        <span class="hub-pill">${catLabel[g.cat]}</span>
      </div>`;

    if (g.status !== 'live') {
      return `<div class="hub-card locked">
        <div class="hub-ic">${gameIcon(g)}</div>
        <h3>${g.title}</h3>
        <p>${g.desc}</p>
        ${meta}
        <span class="hub-soon">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z"/></svg>
          قريبًا
        </span>
      </div>`;
    }

    const rec = progress[g.id];
    const earned = starsFor(g, rec && rec.best);
    const stars = `<div class="hub-stars">${[0, 1, 2].map(i => STAR(i < earned)).join('')}</div>`;
    const best = rec && rec.best
      ? `<div class="hub-best">أفضل نتيجة: <strong>${rec.best}</strong></div>`
      : `<div class="hub-best hub-best-new">لم تُلعب بعد</div>`;

    return `<a class="hub-card live" href="${g.href}" style="--c:${g.color}">
      <div class="hub-ic">${gameIcon(g)}</div>
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
      ${meta}
      <div class="hub-prog">${stars}${best}</div>
      <span class="hub-go">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        العب الآن
      </span>
    </a>`;
  }

  function render() {
    const progress = loadProgress();
    const list = YOUYOU_GAMES.filter(g => active === 'all' || g.cat === active);
    hubGrid.innerHTML = list.map(g => cardHTML(g, progress)).join('');
    emptyMsg.hidden = list.length > 0;
  }

  GAME_CATS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'hub-chip' + (c.id === active ? ' on' : '');
    b.textContent = c.label;
    b.onclick = () => {
      active = c.id;
      chipWrap.querySelectorAll('.hub-chip').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
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
