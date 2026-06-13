document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegação de Páginas (Intro -> Principal)
    const targetButton = document.querySelector('.btn-action');
    if (targetButton) {
        targetButton.addEventListener('click', () => {
            window.location.href = 'page.html';
        });
    }

    // 2. Lógica do Carrossel de Fotos (Slider)
    const mainImg = document.getElementById('main-slider-img');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const counterLabel = document.getElementById('slider-counter');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    if (mainImg && thumbs.length > 0) {
        const imagesList = Array.from(thumbs).map(thumb => thumb.querySelector('img').src);
        let currentIndex = 0;

        const updateGallery = (index) => {
            currentIndex = index;
            mainImg.style.opacity = '0.3';
            setTimeout(() => {
                mainImg.src = imagesList[currentIndex];
                mainImg.style.opacity = '1';
            }, 100);

            if (counterLabel) {
                counterLabel.textContent = `${currentIndex + 1} / ${imagesList.length}`;
            }

            thumbs.forEach((t, i) => {
                t.classList.toggle('active', i === currentIndex);
            });
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        };

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                let index = currentIndex - 1;
                if (index < 0) index = imagesList.length - 1;
                updateGallery(index);
            });
            nextArrow.addEventListener('click', () => {
                let index = currentIndex + 1;
                if (index >= imagesList.length) index = 0;
                updateGallery(index);
            });
        }
    }

    // 3. Relógio Digital em Tempo Real (Timer)
    const timerElement = document.getElementById('live-timer');
    if (timerElement) {
        setInterval(() => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timerElement.textContent = `${hours} : ${minutes} : ${seconds}`;
        }, 1000);
    }

    // 4. Quiz Interativo com Perguntas em JSON
    const quizStart = document.getElementById('quiz-start');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionCard = document.getElementById('question-card');
    const quizResult = document.getElementById('quiz-result');
    const quizProgress = document.getElementById('quiz-progress');
    const questionText = document.getElementById('question-text');
    const quizOptions = document.getElementById('quiz-options');
    const quizScore = document.getElementById('quiz-score');
    const retryQuizBtn = document.getElementById('retry-quiz-btn');

    const fallbackQuestions = [
        {
            "id": 1,
            "question": "Quem falou o primeiro 'Eu te amo'?",
            "options": ["Eu", "Você", "Os dois", "Nenhum de nós"],
            "correctIndex": 1
        },
        {
            "id": 2,
            "question": "Onde foi o nosso primeiro encontro oficial?",
            "options": ["No cinema", "No shopping", "No parque", "Num café"],
            "correctIndex": 1
        },
        {
            "id": 3,
            "question": "Quando começamos a conversar e nos conhecer?",
            "options": ["19 de Março", "20 de Março", "21 de Março", "22 de Março"],
            "correctIndex": 2
        },
        {
            "id": 4,
            "question": "Quem é mais provável dormir no meio de um filme?",
            "options": ["Eu", "Você", "Os dois", "Nenhum de nós"],
            "correctIndex": 0
        },
        {
            "id": 5,
            "question": "Qual é o destino de viagem dos meus sonhos?",
            "options": ["França", "Chile", "Itália", "Alemanha"],
            "correctIndex": 3
        }
    ];

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    const showCard = (cardToShow) => {
        [quizStart, questionCard, quizResult].forEach(card => {
            if (!card) return;
            card.style.display = card === cardToShow ? 'block' : 'none';
        });
    };

    const renderQuestion = () => {
        const current = quizQuestions[currentQuestionIndex];
        if (!current) {
            return showResult();
        }

        quizProgress.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
        questionText.textContent = current.question;
        quizOptions.innerHTML = '';
        answered = false;

        current.options.forEach((optionText, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.type = 'button';
            optionBtn.className = 'quiz-option';
            optionBtn.textContent = optionBtn.innerText = optionText;
            optionBtn.dataset.index = String(index);
            optionBtn.addEventListener('click', () => selectAnswer(index));
            quizOptions.appendChild(optionBtn);
        });
    };

    const selectAnswer = (selectedIndex) => {
        if (answered) return;
        answered = true;

        const current = quizQuestions[currentQuestionIndex];
        const correctIndex = current.correctIndex;
        const buttons = Array.from(quizOptions.querySelectorAll('button'));

        buttons.forEach((button, index) => {
            const idx = Number(button.dataset.index);
            button.disabled = true;
            if (idx === correctIndex) {
                button.classList.add('correct');
            }
            if (idx === selectedIndex && idx !== correctIndex) {
                button.classList.add('incorrect');
            }
        });

        if (selectedIndex === correctIndex) {
            score += 1;
        }

        setTimeout(() => {
            currentQuestionIndex += 1;
            if (currentQuestionIndex < quizQuestions.length) {
                renderQuestion();
            } else {
                showResult();
            }
        }, 900);
    };

    const showResult = () => {
        showCard(quizResult);
        quizScore.textContent = `Acertaste ${score} de ${quizQuestions.length}!`;
        
        const prizeBox = document.getElementById('prize-box');
        if (prizeBox) {
            // Só libera o prémio se acertar mais de 2 questões (ou seja, 3, 4 ou 5)
            if (score > 2) {
                prizeBox.style.display = 'block';
            } else {
                prizeBox.style.display = 'none';
                quizScore.textContent += " Poxa, precisas de acertar mais de 2 para ganhar o prémio! Tenta novamente ❤️";
            }
        }
    };

    const initQuiz = (questions) => {
        quizQuestions = Array.isArray(questions) && questions.length > 0 ? questions : fallbackQuestions;
        currentQuestionIndex = 0;
        score = 0;
        showCard(quizStart);
    };

    startQuizBtn?.addEventListener('click', () => {
        showCard(questionCard);
        renderQuestion();
    });

    // Evento para o botão Tentar Novamente
    retryQuizBtn?.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        answered = false;
        
        const prizeBox = document.getElementById('prize-box');
        if (prizeBox) prizeBox.style.display = 'none';
        
        showCard(questionCard);
        renderQuestion();
    });

    fetch('quiz-questions.json')
        .then(response => response.ok ? response.json() : Promise.reject('Falha no fetch'))
        .then(data => initQuiz(data))
        .catch(() => initQuiz(fallbackQuestions));

    // 5. Reprodutor de Música Local (MP4 em assets/)
    const playMusicBtn = document.getElementById('play-music-btn');
    const musicFile = document.getElementById('music-file');
    let musicPlaying = false;

    const playMusic = () => {
        if (musicFile) {
            musicFile.play().catch(err => {
                console.log("O navegador bloqueou o autoplay inicial: ", err);
            });
        }
        if (playMusicBtn) {
            playMusicBtn.innerHTML = '<span class="play-icon">■</span> Parar música';
        }
        musicPlaying = true;
    };

    const stopMusic = () => {
        if (musicFile) {
            musicFile.pause();
        }
        if (playMusicBtn) {
            playMusicBtn.innerHTML = '<span class="play-icon">▶</span> Ouvir agora';
        }
        musicPlaying = false;
    };

    playMusicBtn?.addEventListener('click', () => {
        if (musicPlaying) {
            stopMusic();
        } else {
            playMusic();
        }
    });
});