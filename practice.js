const answers = ['le', 'me', 'les', 'te', 'nos'];
const form = document.querySelector('#practice-form');
const score = document.querySelector('#score');

form.addEventListener('submit', event => {
  event.preventDefault();
  let correct = 0;
  answers.forEach((answer, index) => {
    const input = document.querySelector(`#answer-${index + 1}`);
    const feedback = document.querySelector(`#feedback-${index + 1}`);
    const isCorrect = input.value.trim().toLocaleLowerCase('es') === answer;
    input.className = isCorrect ? 'correct' : 'incorrect';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? 'Correct.' : `Correct answer: ${answer}`;
    if (isCorrect) correct++;
  });
  score.textContent = `Score: ${correct} out of ${answers.length}`;
  score.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

form.addEventListener('reset', () => {
  requestAnimationFrame(() => {
    document.querySelectorAll('input').forEach(input => input.className = '');
    document.querySelectorAll('.feedback').forEach(feedback => {
      feedback.className = 'feedback';
      feedback.textContent = '';
    });
    score.textContent = '';
    document.querySelector('#answer-1').focus();
  });
});
