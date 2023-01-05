// Quiz variables of the different parameters
    let QuestionsData=[];
    let QuestionsCopy = [];
    let selectedAnswers = [];
    let timer;
    let quizzProgress = 0
    let score = 0;
    let counter = 0;
    let width = 0;
    let timerCounter = 0
    let timeInterval = 5;
    let currentRandomQuestion = {}
    let answersData = []
    let wrongAnswers = []
    let correctAnswers = []
    
//DOM objects
    let startBtn = document.getElementById('start-btn')
    let restartBtn = document.getElementById('restart-btn')
    let timerContainer = document.getElementById('timer')
    let questionsContainer = document.getElementById('questions-container')
    let questionsCardsContainer = document.getElementById('questions-cards-container')
    let informationContainer = document.getElementById('information-container')
    let resultsContainer = document.getElementById('results-container')
    let scoreText = document.getElementById('score-text')
    let stepProgress = document.getElementById('stepper-progress');
    let questionsBtns = Array.from(document.getElementsByClassName('card'))
    
//-------------------------------------------------------------------------------------------------------------------------------  
    function fetchQuestionsData(){
        fetch('questions_data.json')
        .then(res=>res.json())
        .then(data=>QuestionsData=[...data])
        .catch(error=>{
            console.error(error)
        })
    } 
    function fetchAnswersData(){
        fetch('answers_explanation_data.json')
        .then(res=>res.json())
        .then(data=>{
            checkAnswers(data)
        })
        .catch(error=>{
            console.error(error)
        })
    }

    function checkAnswers(data){
        data.forEach((answer,index)=>{
            const questionId = answer.questionId
            const questionIndex = selectedAnswers.findIndex(selectedAnswer=>selectedAnswer.id==questionId)
            const selectedAnswerObject = selectedAnswers[questionIndex]
            if(`choice${selectedAnswerObject.selectedAnswer}`==answer.answer) {
                correctAnswers.push({...selectedAnswerObject,'answer':answer.answer , 'explanation':answer.explanation})
                score++
            }
            else    {
                
                wrongAnswers.push({...selectedAnswerObject,'answer':answer.answer , 'explanation':answer.explanation})
            }
             
        })
       
    }

    function renderTimerCounter(){
        if(timerCounter<=timeInterval){
            timerContainer.innerText = `Time left : ${timerCounter}s`;
            timerCounter++;
        }else{
            timerCounter = 0;
             if(currentRandomQuestion) {
                setTimeout(()=>{
                    selectedAnswers.push({...currentRandomQuestion,'selectedAnswer':'none'})
                    generateNextQuestion();
    
                 }
                 ,100)
             }

        }
    }
    
    fetchQuestionsData();
    
    function GoToPage(pageNumber){
        if(pageNumber===1){
        counter = 0
        document.getElementById('stepper-progress').style.width = `${counter}%`
        
        questionsContainer.classList.add('hidden')
        informationContainer.classList.remove('hidden')
        resultsContainer.classList.add('hidden')
        document.getElementById('dot2').classList.add('pending')
        document.getElementById('dot3').classList.add('pending')
        document.getElementById('dot2').classList.remove('active')
        document.getElementById('dot3').classList.remove('active')

        }
        if(pageNumber===2){
        counter = 50
        document.getElementById('stepper-progress').style.width = `${counter}%`
        
        questionsContainer.classList.remove('hidden')
        informationContainer.classList.add('hidden')
        document.getElementById('dot2').classList.add('active')
        document.getElementById('dot2').classList.remove('pending')
        document.getElementById('dot3').classList.remove('active')
        document.getElementById('dot3').classList.add('pending')
        // alert('moved to page 2  ')

        }
        if(pageNumber===3){
            counter=100
            document.getElementById('stepper-progress').style.width = `${counter}%`
            questionsContainer.classList.add('hidden')
            informationContainer.classList.add('hidden')
            resultsContainer.classList.remove('hidden')
            document.getElementById('dot3').classList.add('active')
            document.getElementById('dot3').classList.remove('pending')
        }

    }
    
    function restartQuizz(){
        resetParameters()
        increaseProgress(0)
        resultsContainer.classList.add('hidden')

        startQuizz()
    }
    
    function startQuizz(){
        QuestionsCopy = [...QuestionsData]

        timer = setInterval(renderTimerCounter,1000)
        generateNextQuestion()
        GoToPage(2)
    }
    
    function generateNextQuestion(){
        increaseProgress(quizzProgress)
        quizzProgress++
        if(QuestionsCopy.length===0){
            fetchAnswersData()
            clearInterval(timer)
            setTimeout(()=>{

                scoreText.innerText=`your score is : ${score}/10`;
                
                printAnswers(correctAnswers)
                printAnswers(wrongAnswers)
                GoToPage(3);
            },500)
            return;
        }
        
        currentRandomQuestion = generateRandomQuestion()
        
        if(counter!=0) setTimeout(()=>renderQuestion(currentRandomQuestion), 500)
        else renderQuestion(currentRandomQuestion)
    }
    

    function generateRandomQuestion(){
        const randomIndex = Math.floor(Math.random()*QuestionsCopy.length)
        randomQuestion = QuestionsCopy[randomIndex];
        QuestionsCopy.splice(randomIndex,1)
        return randomQuestion
    }

    //render the data of each question on the UI
    function renderQuestion(randomQuestion){
        let questionHeading = document.getElementById('question-heading');
        
        questionHeading.innerHTML = randomQuestion.question
        questionsBtns.forEach(btn=>{
            const answer = btn.dataset.answer
            btn.innerText = randomQuestion[`choice${answer}`]
        })
        

        
    }
    
    //attach an onclick event listener to each button containing the choices for the questions
    questionsBtns.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            timerCounter = 0
            const selectedAnswer = `${e.target.dataset.answer}`;
            selectedAnswers.push({...currentRandomQuestion,'selectedAnswer':selectedAnswer})
            generateNextQuestion()

        })
    })
    
    
        function increaseProgress(progress){
            let progressRatio = (progress/QuestionsData.length)*100;
            document.querySelector('.progress-bar-inner').style.width = `${progressRatio}%`
            document.querySelector('#progress-text').innerText = `Your progress : ${progressRatio}%`
        }
    
        function printAnswers(answersArray){
            //rendering function for the results page
            let markup = ''
            answersArray.forEach(answer => {
                markup += `<div class=${answersArray == correctAnswers ? 'correct-answer' : 'wrong-answer'}>
                    <li><span class="first-word">Question</span> : ${answer.question}</li>
                    <hr>
                    <li><span class="first-word">Selected Answer</span> : ${answer.selectedAnswer}</li>
                    <li><span class="first-word">Answer</span> : ${answer.answer}</li>
                    <li><span class="first-word">Explanation</span> : ${answer.explanation}</li>
                </div>`
    
            })
            document.querySelector('.correct-answers-container').insertAdjacentHTML('beforeend',markup)
        }
       
        function resetParameters(){
            //reinitialize the state of the application
            score = 0
            counter = 0;
            quizzProgress = 0
            correctAnswers = []
            wrongAnswers = []
            selectedAnswers = []
            document.querySelector('.correct-answers-container').innerHTML = ''
            document.querySelector('#progress-text').innerText = '';
     
        }
    


   