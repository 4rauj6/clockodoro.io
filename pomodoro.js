
let timerInterval = null;
let totalSeconds = 0;
let initialFocoSeconds = 0;
let isPaused = false;
let currentMode = 'foco'; 

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const timerStatus = document.getElementById('timer-status');
const userTimeInput = document.getElementById('user-time');
const timerSetupDiv = document.getElementById('timer-setup');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');

btnStart.addEventListener('click', () => {
    if (isPaused) {
        startCountdown(); 
        timerStatus.innerText = currentMode.includes('foco') ? 'Foco total!' : 'Hora de relaxar';
        toggleButtons(true);
        isPaused = false;
    } else {
        initPomodoro();
    }
});

function startApp() {
    const appSection = document.getElementById('pomodoro-app');
    const otherPages = document.querySelectorAll('.homepage, .about, .know-more');


    if (appSection.style.display === 'none' || appSection.style.display === '') {
        appSection.style.display = 'block';
        otherPages.forEach(page => page.style.display = 'none');
    } else {
        appSection.style.display = 'none';
        otherPages.forEach(page => page.style.display = 'block');
    }
}

function initPomodoro() {
    if (timerInterval && isPaused) {
        isPaused = false;
        startCountdown();
        toggleButtons(true);
        return;
    }

    const getTaskString = document.getElementById('task-input').value.trim();

    if(!getTaskString){
        alert('Por favor preencha todos os campos');
        return;
    }

    const timeValue = userTimeInput.value;
    if (!timeValue) return alert("Por favor, insira um tempo válido.");
    const [minutes, seconds] = timeValue.split(':').map(Number);
    
    totalSeconds = (minutes * 60) + seconds;

    if (totalSeconds === 0) {
        alert("Defina um tempo maior que 00:00!");
        return;
    }

    initialFocoSeconds = totalSeconds;
    currentMode = 'foco';
    timerStatus.innerText = "Foco total!";
    
    timerSetupDiv.style.display = 'none'; 
    toggleButtons(true);
    updateDisplay(totalSeconds); 
    startCountdown();
}

function updateDisplay(secondsToRender) {
    const mins = Math.floor(secondsToRender / 60);
    const secs = secondsToRender % 60;
    minutesDisplay.innerText = String(mins).padStart(2, '0');
    secondsDisplay.innerText = String(secs).padStart(2, '0');
}

function startCountdown() {
    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay(totalSeconds);
            checkTimeTriggers();
        } else {
            clearInterval(timerInterval);
            handleTimerEnd();
        }
    }, 1000);
}

function checkTimeTriggers() {
    if (currentMode === 'foco') {
        const metadeTempo = Math.floor(initialFocoSeconds / 2);
        
        if (totalSeconds === metadeTempo) {
            clearInterval(timerInterval);
            alert("Hora da pausa da metade! (15 minutos)");
            startBreak('pausa-metade');
        }
    }
}

function startBreak(type) {
    currentMode = type;
    timerStatus.innerText = "Hora de relaxar (Pausa de 15 min)";
    totalSeconds = 15 * 60; 
    updateDisplay(totalSeconds);
    startCountdown();
}


function handleTimerEnd() {
    if (currentMode === 'foco') {
        alert("Ciclo de foco completo! Pausa de 15 minutos iniciada.");
        startBreak('pausa-final');
    } else if (currentMode === 'pausa-metade') {
       
        alert("Pausa concluída! Voltando para o tempo restante de foco.");
        currentMode = 'foco';
        timerStatus.innerText = "Foco total (Segunda metade)!";
        totalSeconds = Math.floor(initialFocoSeconds / 2);
        updateDisplay(totalSeconds);
        startCountdown();
    } else {
        alert("Pomodoro completamente concluído! Bom trabalho.");
        resetTimer();
    }
}

function updateDisplay(secondsToRender) {
    const hrs = Math.floor(secondsToRender / 3600);
    const mins = Math.floor((secondsToRender % 3600) / 60);
    const secs = secondsToRender % 60;

    if (hrs > 0) {
        minutesDisplay.innerText = String(hrs * 60 + mins).padStart(2, '0');
    } else {
        minutesDisplay.innerText = String(mins).padStart(2, '0');
    }
    secondsDisplay.innerText = String(secs).padStart(2, '0');
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
    timerStatus.innerText = "Pausado";
    btnStart.style.display = 'inline-block';
    btnStart.innerHTML = 'Retomar <i class="fa fa-play"></i>';
    btnPause.style.display = 'none';
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    initialFocoSeconds = 0;
    isPaused = false;
    currentMode = 'foco';
    
    timerStatus.innerText = "Pronto para começar?";
    minutesDisplay.innerText = "00";
    secondsDisplay.innerText = "00";
    
    timerSetupDiv.style.display = 'block';
    toggleButtons(false);
}


function toggleButtons(running) {
    if (running) {
        btnStart.style.display = 'none';
        btnPause.style.display = 'inline-block';
        btnReset.style.display = 'inline-block';
    } else {
        btnStart.style.display = 'inline-block';
        btnStart.innerHTML = 'Iniciar Foco <i class="fa fa-play"></i>';
        btnPause.style.display = 'none';
        btnReset.style.display = 'none';
    }
}