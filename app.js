const examples = [
  { category: 'GIVING', before: 'Yo ', pronoun: 'le', after: ' doy un libro a Ana.', english: 'I give Ana a book.', receiver: 'a Ana → le' },
  { category: 'WRITING', before: 'Mi hermano ', pronoun: 'me', after: ' escribe una carta.', english: 'My brother writes me a letter.', receiver: 'a mí → me' },
  { category: 'TELLING', before: 'La profesora ', pronoun: 'nos', after: ' cuenta una historia.', english: 'The teacher tells us a story.', receiver: 'a nosotros → nos' },
  { category: 'BUYING', before: '¿', pronoun: 'Te', after: ' compro un café?', english: 'Should I buy you a coffee?', receiver: 'a ti → te' },
  { category: 'SENDING', before: 'Ellos ', pronoun: 'les', after: ' mandan fotos a sus abuelos.', english: 'They send their grandparents photos.', receiver: 'a sus abuelos → les' },
  { category: 'EXPLAINING', before: 'El guía ', pronoun: 'os', after: ' explica la ruta.', english: 'The guide explains the route to you all (Spain).', receiver: 'a vosotros → os' }
];

const grid = document.querySelector('#example-grid');
examples.forEach(({ category, before, pronoun, after, english, receiver }) => {
  const card = document.createElement('article');
  card.className = 'example-card';
  card.innerHTML = `<span class="example-category">${category}</span><h3>${before}<strong>${pronoun}</strong>${after}</h3><p>${english}</p><span class="receiver">${receiver}</span><button class="speak" type="button" aria-label="Hear ${before + pronoun + after}" title="Hear Spanish sentence">♪</button>`;
  card.querySelector('.speak').addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(before + pronoun + after);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  });
  grid.append(card);
});

const receivers = {
  me: { pronoun: 'me', phrase: '', english: 'I give myself a book.', note: '“Me” means “to me.”' },
  te: { pronoun: 'te', phrase: '', english: 'I give you a book.', note: '“Te” is for one person you address informally.' },
  'le-ana': { pronoun: 'le', phrase: ' a Ana', english: 'I give Ana a book.', note: '“Le” points to Ana. Naming her makes the receiver clear.' },
  'le-usted': { pronoun: 'le', phrase: ' a usted', english: 'I give you a book (formal).', note: '“Le” is also used for formal singular “you.”' },
  nos: { pronoun: 'nos', phrase: '', english: 'I give us a book.', note: '“Nos” means “to us.”' },
  os: { pronoun: 'os', phrase: '', english: 'I give you all a book (Spain).', note: '“Os” is the informal plural form used mainly in Spain.' },
  les: { pronoun: 'les', phrase: ' a mis amigos', english: 'I give my friends a book.', note: '“Les” points to more than one receiver.' }
};
const receiverSelect = document.querySelector('#receiver');
function updateBuilder() {
  const { pronoun, phrase, english, note } = receivers[receiverSelect.value];
  document.querySelector('#built-spanish').innerHTML = `Yo <strong>${pronoun}</strong> doy un libro${phrase}.`;
  document.querySelector('#built-english').textContent = english;
  document.querySelector('#builder-explain').textContent = note;
}
receiverSelect.addEventListener('change', updateBuilder);
updateBuilder();

const questions = [
  { sentence: 'Yo ___ doy un regalo a María.', hint: 'I give María a gift.', options: ['me', 'le', 'nos'], answer: 'le', why: 'María is one receiver, so use “le.”' },
  { sentence: 'Mi amigo ___ escribe a mí.', hint: 'My friend writes to me.', options: ['me', 'te', 'les'], answer: 'me', why: 'The receiver is “me” (a mí), so use “me.”' },
  { sentence: 'La maestra ___ explica la tarea a nosotros.', hint: 'The teacher explains the homework to us.', options: ['le', 'nos', 'os'], answer: 'nos', why: 'The receiver is “us” (a nosotros), so use “nos.”' },
  { sentence: 'Yo ___ mando un mensaje a mis padres.', hint: 'I send my parents a message.', options: ['le', 'te', 'les'], answer: 'les', why: '“Mis padres” is plural, so use “les.”' },
  { sentence: '¿___ preparo la cena a ti?', hint: 'Should I make you dinner? (informal)', options: ['te', 'le', 'me'], answer: 'te', why: 'Informal singular “you” (a ti) takes “te.”' }
];
let questionIndex = 0;
let score = 0;
const questionEl = document.querySelector('#quiz-question');
const hintEl = document.querySelector('#quiz-hint');
const choicesEl = document.querySelector('#choices');
const feedbackEl = document.querySelector('#feedback');
const nextButton = document.querySelector('#next-button');

function showQuestion() {
  const question = questions[questionIndex];
  document.querySelector('#quiz-kicker').textContent = 'FILL IN THE BLANK';
  document.querySelector('#progress-label').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  document.querySelector('#progress-bar').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  questionEl.textContent = question.sentence;
  hintEl.textContent = question.hint;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextButton.hidden = true;
  choicesEl.replaceChildren();
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => {
      if (option === question.answer) score++;
      choicesEl.querySelectorAll('button').forEach(choice => {
        choice.disabled = true;
        if (choice.textContent === question.answer) choice.classList.add('correct');
      });
      if (option !== question.answer) button.classList.add('incorrect');
      feedbackEl.textContent = `${option === question.answer ? 'Exactly! ' : 'Not quite. '}${question.why}`;
      feedbackEl.className = `feedback ${option === question.answer ? 'success' : 'error'}`;
      nextButton.hidden = false;
      nextButton.focus();
    });
    choicesEl.append(button);
  });
}

nextButton.addEventListener('click', () => {
  if (questionIndex === questions.length) {
    questionIndex = 0;
    score = 0;
    nextButton.textContent = 'Next question →';
    showQuestion();
    return;
  }
  questionIndex++;
  if (questionIndex < questions.length) {
    showQuestion();
    return;
  }
  document.querySelector('#quiz-kicker').textContent = 'PRACTICE COMPLETE';
  document.querySelector('#progress-label').textContent = 'All 5 questions answered';
  questionEl.textContent = `You got ${score} out of ${questions.length}!`;
  hintEl.textContent = score === questions.length ? '¡Excelente! You know who receives the action.' : 'Nice work. Review the pronouns and give it another try.';
  choicesEl.replaceChildren();
  feedbackEl.textContent = '';
  nextButton.textContent = 'Try again ↗';
  nextButton.hidden = false;
});
showQuestion();
