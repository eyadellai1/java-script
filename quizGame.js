let currentQuestion = 0;
let currentSubject = '';
let scores = 0;
let timer = null;
let answerSelected = false;
let quizData; // Declare a variable to hold the quiz data

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Store the fetched data in the quizData variable
    quizData = data;

    // Modify the quizData to contain only 10 questions per subject
    Object.keys(quizData).forEach(subject => {
      quizData[subject] = shuffleArray(quizData[subject]).slice(0, 10);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  
function selectAnswer(selectedOption) {
  if (!answerSelected) {
    answerSelected = true;
    if (selectedOption === quizData[currentSubject][currentQuestion].correctAnswer) {
      scores += 10;
    }
    document.getElementById('continueBtn').disabled = false;
  }
}

function continueToNextQuestion() {
  if (answerSelected) {
    answerSelected = false;
    document.getElementById('continueBtn').disabled = true;
    nextQuestion();
  }
}

function startGame(subject) {
  currentSubject = subject;
  currentQuestion = 0;
  scores = 0;
  showGameScreen();
  displayQuestion();
  startTimer();
}
function startTimer() {
  clearInterval(timer);
  let seconds = 10;
  const countdown = document.getElementById('countdown');
  countdown.textContent = seconds;

  timer = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function showGameScreen() {
  document.getElementById('playerSelectionScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
}

function displayQuestion() {
  const questionContainer = document.getElementById('question');
  const optionsContainer = document.getElementById('options');
  const currentQuiz = quizData[currentSubject];

  if (currentQuestion >= currentQuiz.length) {
    endGame();
    return;
  }

  const currentQuizData = currentQuiz[currentQuestion];
  questionContainer.textContent = currentQuizData.question;

  optionsContainer.innerHTML = '';
  currentQuizData.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(button);
  });

  startTimer();
}

function selectAnswer(selectedOption) {
  if (selectedOption === quizData[currentSubject][currentQuestion].correctAnswer) {
    scores += 10;
  }
  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  displayQuestion();
}

function endGame() {
  const gameScreen = document.getElementById('gameScreen');
  const gameEndScreen = document.getElementById('gameEndScreen');
  gameScreen.style.display = 'none';
  gameEndScreen.style.display = 'block';

  const result = document.getElementById('result');
  result.textContent = `Your Score: ${scores}`;
}

function restartGame() {
  clearInterval(timer); // Clear the timer if it's running
  document.getElementById('gameEndScreen').style.display = 'none';
  document.getElementById('playerSelectionScreen').style.display = 'block';
}

// Function to simulate player answers (for demonstration purposes)
function getPlayerAnswer(subject, questionIndex) {
    // Simulated logic to randomly choose an answer (for demonstration purposes)
    return Math.floor(Math.random() * 4); // Assuming 4 options for each question
  }
  
  function reviewAnswers() {
    const reviewContainer = document.getElementById('gameEndScreen');
    reviewContainer.style.display = 'none';
  
    const reviewScreen = document.createElement('div');
    reviewScreen.classList.add('screen');
    reviewScreen.innerHTML = '<h1>Review Answers</h1>';
  
    const currentQuiz = quizData[currentSubject];
  
    currentQuiz.forEach((questionData, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question-review');
  
      const questionText = document.createElement('p');
      questionText.textContent = `Question ${index + 1}: ${questionData.question}`;
      questionElement.appendChild(questionText);
  
      const options = questionData.options;
      const correctAnswerIndex = questionData.correctAnswer;
  
      // Simulated player's selected answer (replace this with actual player answers)
      const playerAnswerIndex = getPlayerAnswer(currentSubject, index);
  
      const playerAnswerText = document.createElement('p');
      playerAnswerText.textContent = `Your Answer: ${options[playerAnswerIndex]}`;
      if (playerAnswerIndex === correctAnswerIndex) {
        playerAnswerText.classList.add('correct-answer'); // Apply a class for correct answers
      } else {
        playerAnswerText.classList.add('wrong-answer'); // Apply a class for wrong answers
      }
      questionElement.appendChild(playerAnswerText);
  
      const correctAnswerText = document.createElement('p');
      correctAnswerText.textContent = `Correct Answer: ${options[correctAnswerIndex]}`;
      questionElement.appendChild(correctAnswerText);
  
      reviewScreen.appendChild(questionElement);
    });

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
      window.location.reload(); // Reloads the page (you can modify this to navigate to the main page)
    };
    reviewScreen.appendChild(backButton);
    document.body.appendChild(reviewScreen);
  }
  