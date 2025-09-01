import './style.css'
import { Questions } from "../question.js";

const app = document.querySelector('#app');
const startButton = document.querySelector('#start');
startButton.addEventListener('click', startQuiz);

function startQuiz() {
    let currentQuestion = 0;
    let score = 0;

    clean();
    displayQuestion(currentQuestion);

    function clean() {
        while (app.firstChild) {
            app.removeChild(app.firstChild);
        }
        const progresse = progressBarr(Questions.length-1, currentQuestion)
        app.appendChild(progresse)
    }

    function displayQuestion(index) {
        clean()
        const question = Questions[index];
        if (!question) {
            finishQuestion()
            return;
        }

        const title = getTitleElement(question.question);
        app.appendChild(title);

        const answerDiv = createAnswers(question.answers);
        app.appendChild(answerDiv);

        const submitButton = getSubmitButton();
        submitButton.addEventListener('click', submit);
        app.appendChild(submitButton);
    }

    function progressBarr(max, value){
        const progress = document.createElement('progress')
        progress.setAttribute('max',max)
        progress.setAttribute('value',value)
        return progress;
    }

    function finishQuestion() {
        const h1 = document.createElement('h1')
        h1.innerText = `Bravo  ! Tu as terminé le quiz.`
        const p = document.createElement('p')
        p.innerText= `Tu as eu ${score} sur ${Questions.length} points`
        app.appendChild(h1)
        app.appendChild(p)
    }

    function submit() {
        const selectedAnswer = app.querySelector('input[name="answer"]:checked');

        disableAllAnswer()
        if (!selectedAnswer) {
            alert("Veuillez choisir une réponse.");
            return;
        }

        const value = selectedAnswer.value;
        const question = Questions[currentQuestion];
        const isCorrect = question.correct === value;

        if (isCorrect) score++;

        showFeedback(isCorrect, question.correct, value);

        // Désactive le bouton pour éviter plusieurs clics
        const submitButton = app.querySelector("button");
        submitButton.disabled = true;

    }

function showFeedback(isCorrect, correct, answer) {
    const correctId = formatId(correct);
    const sanitizedId = correctId.replace(/['"]+/g, ''); // Supprime les guillemets
    const correctElement = document.querySelector(`label[for="${sanitizedId}"]`);
    const answerId = formatId(answer);
    const selectedElement = document.querySelector(`label[for="${answerId}"]`);

    if (selectedElement) {
        selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
        // Ajout animation selon la réponse
        if (isCorrect) {
            selectedElement.classList.add("bounce-correct");
        } else {
            selectedElement.classList.add("shake-incorrect");
        }
    }
    if (!isCorrect && correctElement) {
        correctElement.classList.add("correct");
    }

    const paragraph = document.createElement('p')
    paragraph.innerText= isCorrect ? "Bravo tu as gagné !" : `Desloé ! La bonne réponse est : ${correct}`;
    app.appendChild(paragraph);
    nextQuestion()
}
    
    function nextQuestion() {
        const TIMEOUT = 4000
        let timeremaining = TIMEOUT
        app.querySelector("button").remove()

        const getButtonText = ()=>`Suivant (${timeremaining/1000}s)`

        const nextButton = document.createElement('button')
        nextButton.innerText= getButtonText()
        app.appendChild(nextButton)
        
       const interval = setInterval(() => {
            timeremaining -= 1000
            nextButton.innerText= getButtonText()
            
        }, 1000);

         const timeOut = setTimeout(() => {
            handleNextQuestion()
        }, TIMEOUT);

        const handleNextQuestion = ()=>{
            clearInterval(interval)
            clearTimeout(timeOut)
            currentQuestion++
            displayQuestion(currentQuestion)
        }
        
       

        nextButton.addEventListener('click',()=>{
            handleNextQuestion()
        })
    }

    function disableAllAnswer() {
        const radioInputs = document.querySelectorAll('input[type="radio"]' )

        for(let radio of radioInputs) {
            radio.disabled=true;
        }
        
    }

    function createAnswers(answers) {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answers');

        for (const answer of answers) {
            const label = getElementAnswer(answer);
            answerDiv.appendChild(label);
        }
        return answerDiv;
    }
}

function getTitleElement(text) {
    const title = document.createElement('h2');
    title.innerText = text;
    return title;
}

function formatId(text) {
    return text.trim().replace(/\s+/g, '-').toLowerCase();
}

function getElementAnswer(text) {
    const label = document.createElement('label');
    const id = formatId(text);

    label.setAttribute("for", id);
    label.innerText = text;

    const input = document.createElement('input');
    input.id = id;
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'answer');
    input.setAttribute('value', text);

    label.prepend(input);
    return label;
}

function getSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.innerText = "Valider";
    return submitButton;
}



