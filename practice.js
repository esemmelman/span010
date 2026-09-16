const questionBank = [
  { before: 'Carlos ', after: ' compra flores a su esposa.', translation: 'Carlos buys flowers for his wife.', answer: 'le' },
  { before: '¿', after: ' puedes prestar tu lápiz a mí?', translation: 'Can you lend me your pencil?', answer: 'me' },
  { before: 'La abuela ', after: ' cuenta un cuento a los niños.', translation: 'Grandmother tells the children a story.', answer: 'les' },
  { before: 'Yo ', after: ' preparo el desayuno a ti.', translation: 'I prepare breakfast for you.', answer: 'te' },
  { before: 'El médico ', after: ' da consejos a nosotros.', translation: 'The doctor gives us advice.', answer: 'nos' },
  { before: 'Mis amigos ', after: ' mandan una postal a mí.', translation: 'My friends send me a postcard.', answer: 'me' },
  { before: 'La camarera ', after: ' trae agua a los clientes.', translation: 'The server brings water to the customers.', answer: 'les' },
  { before: 'Marta ', after: ' escribe un correo a su jefe.', translation: 'Marta writes an email to her boss.', answer: 'le' },
  { before: 'Papá ', after: ' lee un libro a nosotros.', translation: 'Dad reads us a book.', answer: 'nos' },
  { before: 'Yo ', after: ' explico el problema a ti.', translation: 'I explain the problem to you.', answer: 'te' },
  { before: 'El guía ', after: ' muestra el museo a ustedes.', translation: 'The guide shows the museum to you all.', answer: 'les' },
  { before: 'Sofía ', after: ' cocina una sopa a su abuelo.', translation: 'Sofía cooks soup for her grandfather.', answer: 'le' },
  { before: '¿Quién ', after: ' compra los boletos a nosotros?', translation: 'Who buys the tickets for us?', answer: 'nos' },
  { before: 'Siempre ', after: ' digo la verdad a ti.', translation: 'I always tell you the truth.', answer: 'te' },
  { before: 'El profesor ', after: ' recomienda esta novela a mí.', translation: 'The teacher recommends this novel to me.', answer: 'me' },
  { before: 'Lucía ', after: ' sirve café a sus padres.', translation: 'Lucía serves coffee to her parents.', answer: 'les' },
  { before: 'Andrés ', after: ' presta su bicicleta a Elena.', translation: 'Andrés lends his bicycle to Elena.', answer: 'le' },
  { before: 'Nuestra vecina ', after: ' regala tomates a nosotros.', translation: 'Our neighbor gives us tomatoes.', answer: 'nos' },
  { before: 'Mañana ', after: ' devuelvo las llaves a ti.', translation: 'Tomorrow I return the keys to you.', answer: 'te' },
  { before: 'El director ', after: ' ofrece un trabajo a mí.', translation: 'The director offers me a job.', answer: 'me' }
];

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

function chooseQuestions() {
  const previousIds = JSON.parse(localStorage.getItem('span010-last-set') || '[]');
  const preferred = questionBank.filter((_, index) => !previousIds.includes(index));
  let selectedIds = shuffled(preferred).slice(0, 5).map(question => questionBank.indexOf(question));
  if (selectedIds.length < 5) {
    const remaining = questionBank.filter((_, index) => !selectedIds.includes(index));
    selectedIds = selectedIds.concat(shuffled(remaining).slice(0, 5 - selectedIds.length).map(question => questionBank.indexOf(question)));
  }
  localStorage.setItem('span010-last-set', JSON.stringify(selectedIds));
  return selectedIds.map(index => questionBank[index]);
}

function renderNewSet() {
  currentQuestions = chooseQuestions();
  questionsElement.replaceChildren();
  scoreElement.textContent = '';
  currentQuestions.forEach((question, index) => {
    const article = document.createElement('article');
    const label = document.createElement('label');
    label.lang = 'es';
    label.htmlFor = `answer-${index + 1}`;
    label.append(document.createTextNode(question.before));
    const input = document.createElement('input');
    input.id = `answer-${index + 1}`;
    input.name = input.id;
    input.autocomplete = 'off';
    input.autocapitalize = 'none';
    input.setAttribute('aria-label', `Missing indirect object pronoun in sentence ${index + 1}`);
    label.append(input, document.createTextNode(question.after));
    const translation = document.createElement('p');
    translation.textContent = question.translation;
    const feedback = document.createElement('output');
    feedback.className = 'feedback';
    feedback.id = `feedback-${index + 1}`;
    article.append(label, translation, feedback);
    questionsElement.append(article);
  });
  questionsElement.querySelector('input').focus();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  let correct = 0;
  currentQuestions.forEach((question, index) => {
    const input = document.querySelector(`#answer-${index + 1}`);
    const feedback = document.querySelector(`#feedback-${index + 1}`);
    const isCorrect = input.value.trim().toLocaleLowerCase('es') === question.answer;
    input.className = isCorrect ? 'correct' : 'incorrect';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? 'Correct.' : `Correct answer: ${question.answer}`;
    if (isCorrect) correct++;
  });
  scoreElement.textContent = `Score: ${correct} out of ${currentQuestions.length}`;
  scoreElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

newSetButton.addEventListener('click', () => {
  renderNewSet();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

renderNewSet();
