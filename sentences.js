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
    { verbs: ['envío', 'envías', 'envía', 'enviamos', 'envían'], english: ['send', 'send', 'sends', 'send', 'send'], object: 'una foto', objectEn: 'a photo' },
    { verbs: ['cuento', 'cuentas', 'cuenta', 'contamos', 'cuentan'], english: ['tell', 'tell', 'tells', 'tell', 'tell'], object: 'una historia', objectEn: 'a story' },
    { verbs: ['traigo', 'traes', 'trae', 'traemos', 'traen'], english: ['bring', 'bring', 'brings', 'bring', 'bring'], object: 'un café', objectEn: 'a coffee' },
    { verbs: ['muestro', 'muestras', 'muestra', 'mostramos', 'muestran'], english: ['show', 'show', 'shows', 'show', 'show'], object: 'la foto', objectEn: 'the picture' }
  ];
  const all = subjects.flatMap((subject, s) => recipients.flatMap((recipient, r) => {
    if (s === r) return [];
    return actions.map((action, a) => ({
      id: `${s}-${r}-${a}`, subject: s, recipient: r, action: a,
      words: [subject.es, recipient.es, action.verbs[s], action.object],
      english: `${subject.en} ${action.english[s]} ${recipient.en} ${action.objectEn}.`
    }));
  }));
  const key = 'span010-sentence-sections-v1';
  let memory = {};

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

  function get(section, refresh = false) {
    const sections = read();
    if (!refresh && sections[section]) return sections[section].map(id => all.find(item => item.id === id));
    const usedElsewhere = new Set(Object.entries(sections).filter(([name]) => name !== section).flatMap(([, ids]) => ids));
    const previous = new Set(sections[section] || []);
    let picked;
    if (section === 'exercise2') {
      // One distinct word from each category in every column.
      for (let attempt = 0; attempt < 100; attempt++) {
        const recipientOrder = shuffle([0, 1, 2, 3, 4]);
        const actionOrder = shuffle([0, 1, 2, 3, 4]);
        picked = [0, 1, 2, 3, 4].map(s => all.find(item => item.subject === s && item.recipient === recipientOrder[s] && item.action === actionOrder[s]));
        if (picked.every(item => item && !usedElsewhere.has(item.id) && !previous.has(item.id))) break;
        picked = null;
      }
    }
    if (!picked) {
      const eligible = shuffle(all.filter(item => !usedElsewhere.has(item.id) && !previous.has(item.id)));
      picked = eligible.slice(0, 5);
    }
    picked = shuffle(picked);
    sections[section] = picked.map(item => item.id);
    save(sections);
    return picked;
  }

  return { get, shuffle };
})();
