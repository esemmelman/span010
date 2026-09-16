const SpanishSentences = (() => {
  const subjects = [
    { es: 'Yo', en: 'I' }, { es: 'Tú', en: 'You' },
    { es: 'Ella', en: 'She' }, { es: 'Nosotros', en: 'We' },
    { es: 'Ellos', en: 'They' }
  ];
  const recipients = [
    { es: 'me', en: 'me' }, { es: 'te', en: 'you' },
    { es: 'le', en: 'him' }, { es: 'nos', en: 'us' },
    { es: 'les', en: 'them' }
  ];
  const actions = [
    { verbs: ['doy', 'das', 'da', 'damos', 'dan'], english: ['give', 'give', 'gives', 'give', 'give'], object: 'un libro', objectEn: 'a book' },
    { verbs: ['envío', 'envías', 'envía', 'enviamos', 'envían'], english: ['send', 'send', 'sends', 'send', 'send'], object: 'una carta', objectEn: 'a letter' },
    { verbs: ['cuento', 'cuentas', 'cuenta', 'contamos', 'cuentan'], english: ['tell', 'tell', 'tells', 'tell', 'tell'], object: 'una historia', objectEn: 'a story' },
    { verbs: ['traigo', 'traes', 'trae', 'traemos', 'traen'], english: ['bring', 'bring', 'brings', 'bring', 'bring'], object: 'un café', objectEn: 'a coffee' },
    { verbs: ['muestro', 'muestras', 'muestra', 'mostramos', 'muestran'], english: ['show', 'show', 'shows', 'show', 'show'], object: 'una foto', objectEn: 'a photo' },
    { verbs: ['compro', 'compras', 'compra', 'compramos', 'compran'], english: ['buy', 'buy', 'buys', 'buy', 'buy'], object: 'una flor', objectEn: 'a flower' },
    { verbs: ['leo', 'lees', 'lee', 'leemos', 'leen'], english: ['read', 'read', 'reads', 'read', 'read'], object: 'un cuento', objectEn: 'a storybook' },
    { verbs: ['escribo', 'escribes', 'escribe', 'escribimos', 'escriben'], english: ['write', 'write', 'writes', 'write', 'write'], object: 'una nota', objectEn: 'a note' },
    { verbs: ['preparo', 'preparas', 'prepara', 'preparamos', 'preparan'], english: ['prepare', 'prepare', 'prepares', 'prepare', 'prepare'], object: 'la cena', objectEn: 'dinner' },
    { verbs: ['sirvo', 'sirves', 'sirve', 'servimos', 'sirven'], english: ['serve', 'serve', 'serves', 'serve', 'serve'], object: 'un jugo', objectEn: 'a juice' },
    { verbs: ['presto', 'prestas', 'presta', 'prestamos', 'prestan'], english: ['lend', 'lend', 'lends', 'lend', 'lend'], object: 'un lápiz', objectEn: 'a pencil' },
    { verbs: ['enseño', 'enseñas', 'enseña', 'enseñamos', 'enseñan'], english: ['teach', 'teach', 'teaches', 'teach', 'teach'], object: 'una canción', objectEn: 'a song' },
    { verbs: ['dibujo', 'dibujas', 'dibuja', 'dibujamos', 'dibujan'], english: ['draw', 'draw', 'draws', 'draw', 'draw'], object: 'un mapa', objectEn: 'a map' },
    { verbs: ['cocino', 'cocinas', 'cocina', 'cocinamos', 'cocinan'], english: ['cook', 'cook', 'cooks', 'cook', 'cook'], object: 'una sopa', objectEn: 'some soup' },
    { verbs: ['ofrezco', 'ofreces', 'ofrece', 'ofrecemos', 'ofrecen'], english: ['offer', 'offer', 'offers', 'offer', 'offer'], object: 'un vaso de agua', objectEn: 'a glass of water' }
  ];
  const all = subjects.flatMap((subject, s) => recipients.flatMap((recipient, r) => {
    if (s === r) return [];
    return actions.map((action, a) => ({
      id: `${s}-${r}-${a}`, subject: s, recipient: r, action: a,
      words: [subject.es, recipient.es, action.verbs[s], action.object],
      english: `${subject.en} ${action.english[s]} ${recipient.en} ${action.objectEn}.`
    }));
  }));
  const key = 'span010-sentence-sections-v2';
  const historyKey = 'span010-recent-sentences-v2';
  let memory = {};
  let memoryHistory = [];

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function read() {
    try { return JSON.parse(sessionStorage.getItem(key)) || {}; }
    catch { return memory; }
  }

  function save(sections) {
    memory = sections;
    try { sessionStorage.setItem(key, JSON.stringify(sections)); } catch { /* In-memory fallback. */ }
  }

  function readHistory() {
    try { return JSON.parse(localStorage.getItem(historyKey)) || []; }
    catch { return memoryHistory; }
  }

  function saveHistory(ids) {
    memoryHistory = ids;
    try { localStorage.setItem(historyKey, JSON.stringify(ids)); } catch { /* In-memory fallback. */ }
  }

  function makeSet(excluded) {
    for (let attempt = 0; attempt < 1000; attempt++) {
      const recipientOrder = shuffle([0, 1, 2, 3, 4]);
      if (recipientOrder.some((recipient, subject) => recipient === subject)) continue;
      const actionOrder = shuffle(actions.map((_, index) => index)).slice(0, 5);
      const picked = [0, 1, 2, 3, 4].map(subject =>
        all.find(item => item.subject === subject && item.recipient === recipientOrder[subject] && item.action === actionOrder[subject]));
      if (picked.every(item => item && !excluded.has(item.id))) return shuffle(picked);
    }
    return null;
  }

  function get(section, refresh = false) {
    const sections = read();
    if (!refresh && sections[section]) return sections[section].map(id => all.find(item => item.id === id));
    const usedElsewhere = new Set(Object.entries(sections).filter(([name]) => name !== section).flatMap(([, ids]) => ids));
    const history = readHistory();
    const picked = makeSet(new Set([...usedElsewhere, ...history])) || makeSet(usedElsewhere);
    sections[section] = picked.map(item => item.id);
    save(sections);
    saveHistory([...history, ...sections[section]].slice(-120));
    return picked;
  }

  return { get, shuffle };
})();
