let sentences = [];
let currentIndex = 0;
let correctCount = 0;
let selected = null;

const columns = ['subject', 'indirect', 'verb', 'object'];
const labels = ['Pronoun', 'Indirect pronoun', 'Verb', 'Object'];
const bank = document.querySelector('.word-bank');
const sentenceArea = document.querySelector('#sentences');
const score = document.querySelector('#score');
const checkButton = document.querySelector('#check');
const nextButton = document.querySelector('#next');

function clearFeedback() {
  if (checkButton.disabled) return;
  score.textContent = '';
  sentenceArea.querySelector('.feedback').textContent = '';
  sentenceArea.querySelectorAll('.slot').forEach(slot => slot.classList.remove('correct', 'incorrect'));
}

function place(word, slot) {
  if (!word || !slot || checkButton.disabled || word.dataset.column !== slot.dataset.column) return;
  const oldSlot = sentenceArea.querySelector(`.slot[data-word-id="${word.id}"]`);
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

function renderQuestion() {
  selected = null;
  checkButton.disabled = false;
  checkButton.hidden = false;
  nextButton.hidden = true;
  score.textContent = '';
  sentenceArea.replaceChildren();

  columns.forEach((column, columnIndex) => {
    const list = bank.querySelector(`[data-column="${column}"] .word-list`);
    list.replaceChildren();
    SpanishSentences.shuffle(sentences.map((sentence, index) => ({ text: sentence.words[columnIndex], index }))).forEach(({ text, index }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'word';
      button.id = `word-${column}-${index}`;
      button.dataset.column = column;
      button.draggable = true;
      button.textContent = text;
      button.addEventListener('click', () => {
        if (checkButton.disabled) return;
        if (selected) selected.classList.remove('selected');
        selected = selected === button ? null : button;
        if (selected) selected.classList.add('selected');
      });
      button.addEventListener('dragstart', event => {
        if (checkButton.disabled) { event.preventDefault(); return; }
        event.dataTransfer.setData('text/plain', button.id);
        event.dataTransfer.effectAllowed = 'move';
      });
      list.append(button);
    });
  });

  const article = document.createElement('article');
  const heading = document.createElement('h2');
  heading.tabIndex = -1;
  heading.textContent = sentences[currentIndex].english;
  const slots = document.createElement('div');
  slots.className = 'slots';
  columns.forEach((column, columnIndex) => {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'slot';
    slot.dataset.column = column;
    slot.dataset.label = labels[columnIndex];
    slot.dataset.wordId = '';
    slot.textContent = slot.dataset.label;
    slot.setAttribute('aria-label', `${labels[columnIndex]} for ${sentences[currentIndex].english}`);
    slot.addEventListener('click', () => {
      if (checkButton.disabled) return;
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
      if (!checkButton.disabled && event.dataTransfer.types.includes('text/plain')) event.preventDefault();
    });
    slot.addEventListener('drop', event => {
      event.preventDefault();
      place(document.getElementById(event.dataTransfer.getData('text/plain')), slot);
    });
    slots.append(slot);
  });
  const feedback = document.createElement('output');
  feedback.className = 'feedback';
  feedback.setAttribute('aria-live', 'polite');
  article.append(heading, slots, feedback);
  sentenceArea.append(article);
}

function start(refresh = false) {
  sentences = SpanishSentences.get('exercise2', refresh);
  currentIndex = 0;
  correctCount = 0;
  bank.hidden = false;
  renderQuestion();
}

checkButton.addEventListener('click', () => {
  const slots = [...sentenceArea.querySelectorAll('.slot')];
  if (slots.some(slot => !slot.dataset.wordId)) {
    score.textContent = 'Fill all four spaces first.';
    return;
  }
  const answer = sentences[currentIndex].words;
  const right = slots.every((slot, column) => slot.textContent === answer[column]);
  slots.forEach((slot, column) => {
    slot.classList.toggle('correct', slot.textContent === answer[column]);
    slot.classList.toggle('incorrect', slot.textContent !== answer[column]);
  });
  const feedback = sentenceArea.querySelector('.feedback');
  feedback.className = `feedback ${right ? 'correct' : 'incorrect'}`;
  feedback.textContent = right ? 'Correct.' : `Correct answer: ${answer.join(' ')}.`;
  if (right) correctCount++;
  checkButton.disabled = true;
  checkButton.hidden = true;
  nextButton.hidden = false;
  nextButton.textContent = currentIndex === sentences.length - 1 ? 'See Score' : 'Next Sentence';
  score.textContent = `Score: ${correctCount} out of ${currentIndex + 1}`;
});

nextButton.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < sentences.length) {
    renderQuestion();
    sentenceArea.querySelector('h2').focus();
  } else {
    bank.hidden = true;
    sentenceArea.replaceChildren();
    checkButton.hidden = true;
    nextButton.hidden = true;
    score.textContent = `Final score: ${correctCount} out of ${sentences.length}`;
  }
});

document.querySelector('#reset').addEventListener('click', () => start(true));
start();
