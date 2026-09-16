let sentences = [];
let currentIndex = 0;
let correctCount = 0;
let selectedWords = [null, null, null, null];

const columns = ['subject', 'indirect', 'verb', 'object'];
const bank = document.querySelector('.word-bank');
const sentenceArea = document.querySelector('#sentences');
const score = document.querySelector('#score');
const checkButton = document.querySelector('#check');
const nextButton = document.querySelector('#next');

function renderQuestion() {
  selectedWords = [null, null, null, null];
  checkButton.hidden = false;
  nextButton.hidden = true;
  score.textContent = '';
  sentenceArea.replaceChildren();

  const heading = document.createElement('h2');
  heading.tabIndex = -1;
  heading.textContent = sentences[currentIndex].english;
  const feedback = document.createElement('output');
  feedback.className = 'feedback';
  feedback.setAttribute('aria-live', 'polite');
  sentenceArea.append(heading, feedback);

  columns.forEach((column, columnIndex) => {
    const list = bank.querySelector(`[data-column="${column}"] .word-list`);
    list.replaceChildren();
    SpanishSentences.shuffle(sentences.map(sentence => sentence.words[columnIndex])).forEach(word => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'word';
      button.textContent = word;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        if (checkButton.hidden) return;
        feedback.textContent = '';
        feedback.className = 'feedback';
        const previous = selectedWords[columnIndex];
        if (previous) {
          previous.classList.remove('selected');
          previous.setAttribute('aria-pressed', 'false');
        }
        selectedWords[columnIndex] = previous === button ? null : button;
        if (selectedWords[columnIndex]) {
          button.classList.add('selected');
          button.setAttribute('aria-pressed', 'true');
        }
      });
      list.append(button);
    });
  });
}

function start(refresh = false) {
  sentences = SpanishSentences.get('exercise2', refresh);
  currentIndex = 0;
  correctCount = 0;
  bank.hidden = false;
  renderQuestion();
}

checkButton.addEventListener('click', () => {
  if (selectedWords.some(button => !button)) {
    const feedback = sentenceArea.querySelector('.feedback');
    feedback.className = 'feedback prompt';
    feedback.textContent = 'Select one word in each column before scoring.';
    return;
  }
  const answer = sentences[currentIndex].words;
  const right = selectedWords.every((button, index) => button?.textContent === answer[index]);
  const heading = sentenceArea.querySelector('h2');
  heading.classList.add(right ? 'correct' : 'incorrect');
  columns.forEach((column, index) => {
    const list = bank.querySelector(`[data-column="${column}"] .word-list`);
    const correctButton = [...list.children].find(button => button.textContent === answer[index]);
    correctButton.classList.add('answer');
    if (selectedWords[index] && selectedWords[index] !== correctButton) selectedWords[index].classList.add('incorrect');
  });
  const feedback = sentenceArea.querySelector('.feedback');
  feedback.className = `feedback ${right ? 'correct' : 'incorrect'}`;
  feedback.textContent = right ? 'Correct.' : `Incorrect\n${answer.join(' ')}.`;
  if (right) correctCount++;
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
    nextButton.hidden = true;
    score.textContent = `Final score: ${correctCount} out of ${sentences.length}`;
  }
});

document.querySelector('#reset').addEventListener('click', () => start(true));
start(true);
