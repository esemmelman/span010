const questionBank = [
  { before: 'Yo ', after: ' doy un libro a Ana.', translation: 'I give Ana a book.', answer: 'le' },
  { before: 'Ana ', after: ' da un lápiz a mí.', translation: 'Ana gives me a pencil.', answer: 'me' },
  { before: 'Mi madre ', after: ' compra una camisa a ti.', translation: 'My mother buys you a shirt.', answer: 'te' },
  { before: 'El profesor ', after: ' da la tarea a nosotros.', translation: 'The teacher gives us the homework.', answer: 'nos' },
  { before: 'Luis ', after: ' escribe una carta a sus padres.', translation: 'Luis writes a letter to his parents.', answer: 'les' },
  { before: 'Marta ', after: ' habla a su amiga.', translation: 'Marta talks to her friend.', answer: 'le' },
  { before: 'Mis amigos ', after: ' mandan una foto a mí.', translation: 'My friends send me a photo.', answer: 'me' },
  { before: 'Yo ', after: ' digo hola a ti.', translation: 'I say hello to you.', answer: 'te' },
  { before: 'Papá ', after: ' lee un libro a nosotros.', translation: 'Dad reads us a book.', answer: 'nos' },
  { before: 'La maestra ', after: ' explica la lección a los estudiantes.', translation: 'The teacher explains the lesson to the students.', answer: 'les' },
  { before: 'Carlos ', after: ' compra un regalo a su hermana.', translation: 'Carlos buys a gift for his sister.', answer: 'le' },
  { before: 'Mi abuela ', after: ' prepara comida a mí.', translation: 'My grandmother prepares food for me.', answer: 'me' },
  { before: 'El estudiante ', after: ' hace una pregunta a ti.', translation: 'The student asks you a question.', answer: 'te' },
  { before: 'La profesora ', after: ' enseña español a nosotros.', translation: 'The teacher teaches us Spanish.', answer: 'nos' },
  { before: 'Yo ', after: ' doy agua a mis perros.', translation: 'I give water to my dogs.', answer: 'les' },
  { before: 'Sofía ', after: ' muestra la foto a su madre.', translation: 'Sofía shows the photo to her mother.', answer: 'le' },
  { before: 'Mi hermano ', after: ' trae un café a mí.', translation: 'My brother brings me a coffee.', answer: 'me' },
  { before: 'Yo ', after: ' cuento una historia a ti.', translation: 'I tell you a story.', answer: 'te' },
  { before: 'La niña ', after: ' canta una canción a nosotros.', translation: 'The girl sings us a song.', answer: 'nos' },
  { before: 'El padre ', after: ' lee un cuento a sus hijos.', translation: 'The father reads a story to his children.', answer: 'les' }
];
const pronounOptions = ['me', 'te', 'le', 'nos', 'os', 'les'];

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
    label.append(select, document.createTextNode(question.after));
    const translation = document.createElement('p');
    translation.textContent = question.translation;
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
    const isCorrect = input.value === question.answer;
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
