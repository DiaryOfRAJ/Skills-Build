document.addEventListener('DOMContentLoaded', () => {
        const creatorSection = document.getElementById('creatorSection');
        const solverSection = document.getElementById('solverSection');
        const questionTextarea = document.getElementById('questionText');
        const optionsInputDiv = document.getElementById('optionsInput');
        const addOptionBtn = document.getElementById('addOptionBtn');
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        const startQuizBtn = document.getElementById('startQuizBtn');
        const questionsContainer = document.getElementById('questionsContainer');
        const submitQuizBtn = document.getElementById('submitQuizBtn');
        const quizResultDisplay = document.getElementById('quizResult');
        const createAgainBtn = document.getElementById('createAgainBtn');

        let quizQuestions = [];
        let currentOptionCount = 4;

        function addOptionInput(index) {
            const optionGroup = document.createElement('div');
            optionGroup.classList.add('option-group');
            optionGroup.innerHTML = `
                <span class="radio-label-text">Option ${index + 1}:</span>
                <input type="radio" name="correctOption" value="${index}" id="opt${index}">
                <input type="text" class="option-text" placeholder="Enter option text">
                <button class="remove-option-btn" title="Remove Option"><i class="fas fa-times"></i></button>
            `;
            optionsInputDiv.appendChild(optionGroup);

            optionGroup.querySelector('.remove-option-btn').addEventListener('click', () => {
                optionGroup.remove();
                reindexOptions(); // Re-index options after removal
            });
        }

        function reindexOptions() {
            const optionRadios = optionsInputDiv.querySelectorAll('input[type="radio"]');
            const optionTexts = optionsInputDiv.querySelectorAll('.option-text');
            const radioLabels = optionsInputDiv.querySelectorAll('.radio-label-text');

            optionRadios.forEach((radio, index) => {
                radio.value = index;
                radio.id = `opt${index}`;
            });
            optionTexts.forEach((textInput, index) => {
                textInput.placeholder = `Enter option text`;
            });
            radioLabels.forEach((span, index) => {
                span.textContent = `Option ${index + 1}:`;
            });
            currentOptionCount = optionRadios.length;
        }

        optionsInputDiv.querySelectorAll('.option-group').forEach((group, index) => {
            group.querySelector('.remove-option-btn').addEventListener('click', (e) => {
                e.target.closest('.option-group').remove();
                reindexOptions();
            });
            group.querySelector('.radio-label-text').textContent = `Option ${index + 1}:`;
        });


        addOptionBtn.addEventListener('click', () => {
            addOptionInput(currentOptionCount);
            currentOptionCount++;
        });

        addQuestionBtn.addEventListener('click', () => {
            const questionText = questionTextarea.value.trim();
            const optionInputs = optionsInputDiv.querySelectorAll('.option-text');
            const correctOptionRadio = optionsInputDiv.querySelector('input[name="correctOption"]:checked');

            if (!questionText) {
                alert('Please enter a question.');
                return;
            }
            if (!correctOptionRadio) {
                alert('Please select the correct option for the question.');
                return;
            }

            const options = Array.from(optionInputs).map(input => input.value.trim());
            if (options.some(opt => !opt)) {
                alert('Please fill in all option texts.');
                return;
            }

            const correctIndex = parseInt(correctOptionRadio.value);

            quizQuestions.push({
                question: questionText,
                options: options,
                correctAnswerIndex: correctIndex
            });

            alert(`Question added successfully! You have ${quizQuestions.length} questions in your quiz.`);
            // Clear form for next question
            questionTextarea.value = '';
            optionsInputDiv.querySelectorAll('.option-text').forEach(input => input.value = '');
            if (correctOptionRadio) correctOptionRadio.checked = false;
            
            // Reset to 4 options (or dynamically adjust based on needs)
            while (optionsInputDiv.children.length > 4) {
                optionsInputDiv.lastChild.remove();
            }
            reindexOptions(); // Ensure IDs and values are correct
        });

        startQuizBtn.addEventListener('click', () => {
            if (quizQuestions.length === 0) {
                alert('Please add at least one question before starting the quiz.');
                return;
            }
            creatorSection.style.display = 'none';
            solverSection.style.display = 'block';
            loadQuiz();
        });

        // --- Solver Section Functions ---

        function loadQuiz() {
            questionsContainer.innerHTML = ''; // Clear previous questions
            quizResultDisplay.textContent = ''; // Clear previous result
            quizResultDisplay.classList.remove('fail'); // Reset result styling

            quizQuestions.forEach((q, qIndex) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('quiz-question');
                questionDiv.innerHTML = `
                    <p>${qIndex + 1}. ${q.question}</p>
                    <div class="options">
                        ${q.options.map((option, optIndex) => `
                            <label>
                                <input type="radio" name="question${qIndex}" value="${optIndex}">
                                <span>${option}</span>
                            </label>
                        `).join('')}
                    </div>
                `;
                questionsContainer.appendChild(questionDiv);
            });
        }

        submitQuizBtn.addEventListener('click', () => {
            let score = 0;
            let totalQuestions = quizQuestions.length;

            quizQuestions.forEach((q, qIndex) => {
                const selectedOption = document.querySelector(`input[name="question${qIndex}"]:checked`);
                if (selectedOption && parseInt(selectedOption.value) === q.correctAnswerIndex) {
                    score++;
                }
            });

            quizResultDisplay.textContent = `You scored ${score} out of ${totalQuestions}!`;
            if (score < totalQuestions / 2) {
                quizResultDisplay.classList.add('fail');
            } else {
                quizResultDisplay.classList.remove('fail');
            }
        });

        createAgainBtn.addEventListener('click', () => {
            const confirmNewQuiz = confirm('Are you sure you want to create a new quiz? All current quiz data will be lost.');
            if (confirmNewQuiz) {
                quizQuestions = []; 
                quizResultDisplay.textContent = '';
                quizResultDisplay.classList.remove('fail');
                creatorSection.style.display = 'block';
                solverSection.style.display = 'none';
                questionTextarea.value = '';
                optionsInputDiv.innerHTML = `
                    <div class="option-group">
                        <span class="radio-label-text">Option 1:</span>
                        <input type="radio" name="correctOption" value="0" id="opt0">
                        <input type="text" class="option-text" placeholder="Enter option text">
                        <button class="remove-option-btn" title="Remove Option"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="option-group">
                        <span class="radio-label-text">Option 2:</span>
                        <input type="radio" name="correctOption" value="1" id="opt1">
                        <input type="text" class="option-text" placeholder="Enter option text">
                        <button class="remove-option-btn" title="Remove Option"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="option-group">
                        <span class="radio-label-text">Option 3:</span>
                        <input type="radio" name="correctOption" value="2" id="opt2">
                        <input type="text" class="option-text" placeholder="Enter option text">
                        <button class="remove-option-btn" title="Remove Option"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="option-group">
                        <span class="radio-label-text">Option 4:</span>
                        <input type="radio" name="correctOption" value="3" id="opt3">
                        <input type="text" class="option-text" placeholder="Enter option text">
                        <button class="remove-option-btn" title="Remove Option"><i class="fas fa-times"></i></button>
                    </div>
                `;
                currentOptionCount = 4;
                optionsInputDiv.querySelectorAll('.option-group').forEach((group, index) => {
                    group.querySelector('.remove-option-btn').addEventListener('click', (e) => {
                        e.target.closest('.option-group').remove();
                        reindexOptions();
                    });
                    group.querySelector('.radio-label-text').textContent = `Option ${index + 1}:`;
                });
            }
        });
    });