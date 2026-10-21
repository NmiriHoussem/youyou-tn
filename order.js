/* Order modal. No backend: the order is written to the clipboard and the
   customer pastes it into Messenger, because m.me links cannot carry a
   prefilled message the way wa.me can. */

const ORDER_CONFIG = {
  // TODO: your Facebook page username, the part after facebook.com/
  messengerPage: 'REPLACE_WITH_PAGE',
  // TODO: prices in TND. Leave null to show "السعر عند التأكيد" instead.
  prices: { standard: null, gift: null },
};

const PACKS = {
  standard: {
    label: 'باك عادي',
    desc: 'الكتاب، كتيّب الأنشطة، البطاقات، واللعبة الرقمية.',
  },
  gift: {
    label: 'باك هدية',
    desc: 'نفس محتوى الباك العادي، مع هدايا صغيرة إضافية مجانية وتغليف خاص للإهداء.',
  },
};

const modal = document.getElementById('orderModal');

if (modal) {
  const openBtn = document.getElementById('orderBtn');
  const form = document.getElementById('orderForm');
  const errBox = document.getElementById('orderErr');
  const hint = document.getElementById('orderHint');
  let lastFocus = null;

  function priceText(id) {
    const p = ORDER_CONFIG.prices[id];
    return p == null ? 'السعر عند التأكيد' : p + ' د.ت';
  }

  modal.querySelectorAll('.pack-opt').forEach(opt => {
    const id = opt.querySelector('input').value;
    opt.querySelector('.pack-price').textContent = priceText(id);
    opt.querySelector('.pack-desc').textContent = PACKS[id].desc;
  });

  function open() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('input[name="packType"]:checked').focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    errBox.hidden = true;
    document.getElementById('orderDone').hidden = true;
    document.getElementById('orderStep1').hidden = false;
    if (lastFocus) lastFocus.focus();
  }

  openBtn.addEventListener('click', open);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  // keep tabbing inside the dialog while it is open
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const items = [...modal.querySelectorAll('button, input, [href]')].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  function orderText(data, packId) {
    const lines = [
      'طلب جديد من موقع يويو',
      'المنتج: حروفي الأولى',
      'نوع المجموعة: ' + PACKS[packId].label,
      'السعر: ' + priceText(packId),
      'الاسم: ' + data.name,
      'الهاتف: ' + data.phone,
    ];
    if (data.address) lines.push('العنوان: ' + data.address);
    if (data.note) lines.push('ملاحظة: ' + data.note);
    return lines.join('\n');
  }

  const step1 = document.getElementById('orderStep1');
  const done = document.getElementById('orderDone');
  const summary = document.getElementById('orderSummary');
  const copyNote = document.getElementById('orderCopyNote');
  const goLink = document.getElementById('orderGo');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const packId = modal.querySelector('input[name="packType"]:checked').value;

    if (!data.name.trim() || !data.phone.trim()) {
      errBox.textContent = 'من فضلك اكتب الاسم ورقم الهاتف.';
      errBox.hidden = false;
      return;
    }
    if (!/^[0-9\s+]{8,}$/.test(data.phone.trim())) {
      errBox.textContent = 'رقم الهاتف غير صحيح.';
      errBox.hidden = false;
      return;
    }
    errBox.hidden = true;

    const text = orderText(data, packId);
    summary.textContent = text;

    // until the page name is filled in, send nobody to a dead m.me link
    const configured = ORDER_CONFIG.messengerPage && ORDER_CONFIG.messengerPage !== 'REPLACE_WITH_PAGE';
    goLink.hidden = !configured;
    if (configured) goLink.href = 'https://m.me/' + ORDER_CONFIG.messengerPage;

    // Messenger is opened by a real link click rather than window.open, so the
    // popup blocker cannot swallow it after the async clipboard write
    step1.hidden = true;
    done.hidden = false;
    (configured ? goLink : summary).focus();

    const pasteMsg = configured
      ? 'نسخنا تفاصيل طلبك. افتح ماسنجر والصقها في المحادثة.'
      : 'نسخنا تفاصيل طلبك. أرسلها لنا في رسالة على صفحة يويو على فيسبوك.';
    const manualMsg = configured
      ? 'انسخ التفاصيل التالية وأرسلها لنا في المحادثة.'
      : 'انسخ التفاصيل التالية وأرسلها لنا على صفحة يويو على فيسبوك.';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        copyNote.textContent = pasteMsg;
      }).catch(() => {
        copyNote.textContent = manualMsg;
      });
    } else {
      copyNote.textContent = manualMsg;
    }
  });

  document.getElementById('orderBack').addEventListener('click', function () {
    done.hidden = true;
    step1.hidden = false;
    form.querySelector('input[name="name"]').focus();
  });
}
