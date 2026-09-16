const sentences = [
  { english: 'I give her a book.', words: ['Yo', 'le', 'doy', 'un libro'] },
  { english: 'You send me a photo.', words: ['Tú', 'me', 'mandas', 'una foto'] },
  { english: 'She tells us a story.', words: ['Ella', 'nos', 'cuenta', 'una historia'] },
  { english: 'We bring you a coffee.', words: ['Nosotros', 'te', 'traemos', 'un café'] },
  { english: 'They show them the picture.', words: ['Ellos', 'les', 'muestran', 'la foto'] }
];
const columns = ['subject', 'indirect', 'verb', 'object'];
const bank = document.querySelector('.word-bank');
const sentenceArea = document.querySelector('#sentences');
const score = document.querySelector('#score');
let selected = null;

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clearFeedback() {
  score.textContent = '';
  document.querySelectorAll('.feedback').forEach(item => item.textContent = '');
  document.querySelectorAll('.slot').forEach(item => item.classList.remove('correct', 'incorrect'));
}

function place(word, slot) {
  if (!word || !slot || word.dataset.column !== slot.dataset.column) return;
  const oldSlot = document.querySelector(`.slot[data-word-id="${word.id}"]`);
  if (oldSlot) {
    oldSlot.textContent = oldSlot.dataset.label;
    oldSlot.dataset.wordId = '';
    oldSlot.classList.remove('filled');
  }
  if (slot.dataset.wordId) document.getElementById(slot.dataset.wordId).classList.remove('used');
  slot.dataset.wordId = word.id;
  slot.textContent = word.textContent;
  slot.classList.add('filled');
  word.classList.add('used');
  if (selected) selected.classList.remove('selected');
  selected = null;
  clearFeedback();
}

function render() {
  selected = null;
  score.textContent = '';
  sentenceArea.replaceChildren();
  columns.forEach((column, columnIndex) => {
    const list = bank.querySelector(`[data-column="${column}"] .word-list`);
    list.replaceChildren();
    shuffled(sentences.map((sentence, index) => ({ text: sentence.words[columnIndex], index }))).forEach(({ text, index }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'word';
      button.id = `word-${column}-${index}`;
      button.dataset.column = column;
      button.draggable = true;
      button.textContent = text;
      button.addEventListener('click', () => {
        if (selected) selected.classList.remove('selected');
        selected = selected === button ? null : button;
        if (selected) selected.classList.add('selected');
      });
      button.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', button.id);
        event.dataTransfer.effectAllowed = 'move';
      });
      list.append(button);
    });
  });
  sentences.forEach((sentence, index) => {
    const article = document.createElement('article');
    const heading = document.createElement('h2');
    heading.textContent = `${index + 1}. ${sentence.english}`;
    const slots = document.createElement('div');
    slots.className = 'slots';
    columns.forEach((column, columnIndex) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'slot';
      slot.dataset.column = column;
      slot.dataset.label = ['Pronoun', 'Indirect pronoun', 'Verb', 'Object'][columnIndex];
      slot.dataset.wordId = '';
      slot.textContent = slot.dataset.label;
      slot.setAttribute('aria-label', `Sentence ${index + 1}: ${slot.dataset.label}`);
      slot.addEventListener('click', () => {
        if (selected) place(selected, slot);
        else if (slot.dataset.wordId) {
          document.getElementById(slot.dataset.wordId).classList.remove('used');
          slot.dataset.wordId = '';
          slot.textContent = slot.dataset.label;
          slot.classList.remove('filled');
          clearFeedback();
        }
      });
      slot.addEventListener('dragover', event => {
        if (event.dataTransfer.types.includes('text/plain')) event.preventDefault();
      });
      slot.addEventListener('drop', event => {
        event.preventDefault();
        place(document.getElementById(event.dataTransfer.getData('text/plain')), slot);
      });
      slots.append(slot);
    });
    const feedback = document.createElement('output');
    feedback.className = 'feedback';
    article.append(heading, slots, feedback);
    sentenceArea.append(article);
  });
}

document.querySelector('#check').addEventListener('click', () => {
  let correct = 0;
  [...sentenceArea.children].forEach((article, index) => {
    const slots = [...article.querySelectorAll('.slot')];
    const right = slots.every((slot, column) => slot.textContent === sentences[index].words[column] && slot.dataset.wordId);
    slots.forEach((slot, column) => {
      slot.classList.toggle('correct', slot.textContent === sentences[index].words[column] && !!slot.dataset.wordId);
      slot.classList.toggle('incorrect', slot.textContent !== sentences[index].words[column] || !slot.dataset.wordId);
    });
    const feedback = article.querySelector('.feedback');
    feedback.className = `feedback ${right ? 'correct' : 'incorrect'}`;
    feedback.textContent = right ? 'Correct.' : `Correct answer: ${sentences[index].words.join(' ')}.`;
    if (right) correct++;
  });
  score.textContent = `Score: ${correct} out of ${sentences.length}`;
});

document.querySelector('#reset').addEventListener('click', render);
render();
