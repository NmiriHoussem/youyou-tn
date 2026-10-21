/* Order modal. No backend: the order is written to the clipboard and the
   customer pastes it into Messenger, because m.me links cannot carry a
   prefilled message the way wa.me can. */

const ORDER_CONFIG = {
  // Facebook page username, the part after facebook.com/
  messengerPage: 'youyouworldtn',
  // TODO: WhatsApp number, digits only with country code (e.g. '21612345678').
  // Leave empty to hide the WhatsApp button.
  whatsapp: '',
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
  const waLink = document.getElementById('orderWa');
  const msgLink = document.getElementById('orderMsg');
  const copyBtn = document.getElementById('orderCopy');

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

    // both channels prefill the message, so the customer only presses send.
    // real link clicks, so no popup blocker and no window.open
    const encoded = encodeURIComponent(text);
    waLink.hidden = !ORDER_CONFIG.whatsapp;
    if (ORDER_CONFIG.whatsapp) {
      waLink.href = 'https://wa.me/' + ORDER_CONFIG.whatsapp + '?text=' + encoded;
    }
    msgLink.hidden = !ORDER_CONFIG.messengerPage;
    if (ORDER_CONFIG.messengerPage) {
      msgLink.href = 'https://m.me/' + ORDER_CONFIG.messengerPage + '?text=' + encoded;
    }

    copyBtn.textContent = 'انسخ التفاصيل';
    step1.hidden = true;
    done.hidden = false;
    (ORDER_CONFIG.whatsapp ? waLink : msgLink).focus();

  });

  // fallback for anyone who would rather send the order some other way
  copyBtn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summary.textContent)
        .then(() => { copyBtn.textContent = 'تم النسخ'; })
        .catch(() => { copyBtn.textContent = 'حدّد النص أعلاه وانسخه'; });
    } else {
      copyBtn.textContent = 'حدّد النص أعلاه وانسخه';
    }
  });

  document.getElementById('orderBack').addEventListener('click', function () {
    done.hidden = true;
    step1.hidden = false;
    form.querySelector('input[name="name"]').focus();
  });
}
