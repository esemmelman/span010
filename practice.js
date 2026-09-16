const pronounOptions = ['me', 'te', 'le', 'nos', 'les'];

const form = document.querySelector('#practice-form');
const questionsElement = document.querySelector('#questions');
const scoreElement = document.querySelector('#score');
const newSetButton = document.querySelector('#new-set');
let currentQuestions = [];

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function renderNewSet(refresh = false) {
  currentQuestions = SpanishSentences.get('exercise1', refresh);
  questionsElement.replaceChildren();
  scoreElement.textContent = '';
  currentQuestions.forEach((question, index) => {
    const article = document.createElement('article');
    const label = document.createElement('label');
    label.lang = 'es';
    label.htmlFor = `answer-${index + 1}`;
    label.append(document.createTextNode(`${question.words[0]} `));
    const select = document.createElement('select');
    select.id = `answer-${index + 1}`;
    select.name = select.id;
    select.setAttribute('aria-label', `Choose the missing indirect object pronoun in sentence ${index + 1}`);
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = ' ';
    placeholder.selected = true;
    select.append(placeholder);
    shuffled(pronounOptions).forEach(pronoun => {
      const option = document.createElement('option');
      option.value = pronoun;
      option.textContent = pronoun;
      select.append(option);
    });
    label.append(select, document.createTextNode(` ${question.words[2]} ${question.words[3]}.`));
    const translation = document.createElement('p');
    translation.textContent = question.english;
    const feedback = document.createElement('output');
    feedback.className = 'feedback';
    feedback.id = `feedback-${index + 1}`;
    article.append(label, translation, feedback);
    questionsElement.append(article);
  });
  questionsElement.querySelector('select').focus();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  let correct = 0;
  currentQuestions.forEach((question, index) => {
    const input = document.querySelector(`#answer-${index + 1}`);
    const feedback = document.querySelector(`#feedback-${index + 1}`);
    const isCorrect = input.value === question.words[1];
    input.className = isCorrect ? 'correct' : 'incorrect';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? 'Correct.' : `Correct answer: ${question.words[1]}`;
    if (isCorrect) correct++;
  });
  scoreElement.textContent = `Score: ${correct} out of ${currentQuestions.length}`;
  scoreElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

newSetButton.addEventListener('click', () => {
  renderNewSet(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

renderNewSet();
