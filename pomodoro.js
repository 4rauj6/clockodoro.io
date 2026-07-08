let timerInterval = null;
let totalSeconds = 0;
let initialFocoSeconds = 0;
let isPaused = false;
let currentMode = "foco";
let pontos = 0;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const hoursDisplay = document.getElementById("hours");
const timerStatus = document.getElementById("timer-status");
const userTimeInput = document.getElementById("user-time");
const timerSetupDiv = document.getElementById("timer-setup");
const btnStart = document.getElementById("btn-start");
const btnPause = document.getElementById("btn-pause");
const btnReset = document.getElementById("btn-reset");

btnStart.addEventListener("click", () => {
  const userTask = document.getElementById("task-input").value.trim();

  if (isPaused) {
    startCountdown();
    timerStatus.innerText = currentMode.includes("foco")
      ? `Tarefa atual: ${userTask}`
      : "Hora de relaxar";
    toggleButtons(true);
    isPaused = false;
  } else {
    initPomodoro();
  }
});

function initPomodoro() {
  if (timerInterval && isPaused) {
    isPaused = false;

    startCountdown();
    toggleButtons(true);
    return;
  }

  const getTaskString = document.getElementById("task-input").value.trim();

  if (!getTaskString) {
    alert("Por favor preencha todos os campos");
    return;
  }

  const focusHours = Number(document.querySelector(".hours-focus").value);
  const focusMinutes = Number(document.querySelector(".minutes-focus").value);
  const focusSeconds = Number(document.querySelector(".seconds-focus").value);

  const getRestHours = Number(document.querySelector(".hours-rest").value);
  const getRestMinutes = Number(document.querySelector(".minutes-rest").value);
  const getRestSeconds = Number(document.querySelector(".seconds-rest").value);

  totalSeconds = focusHours * 3600 + focusMinutes * 60 + focusSeconds;

  const getRestValues =
    getRestHours * 3600 + getRestMinutes * 60 + getRestSeconds;

  if (totalSeconds <= 0) {
    Swal.fire({
      title: "Campos não preenchidos",
      titleColor: "red",
      icon: "warning",
      iconColor: "red",
      text: "Por favor defina um tempo válido ou maior",
      confirmButtonText: "OK",
      confirmButtonColor: "red",
      allowOutsideClick: false,
    });
    return;
  }

  ((restInputs = getRestHours), getRestMinutes, getRestSeconds);

  if (!getRestValues) {
    Swal.fire({
      title: "Campos não preenchidos",
      titleColor: "red",
      icon: "warning",
      iconColor: "red",
      text: "Por favor defina um tempo de descanso válido ou maior",
      confirmButtonText: "OK",
      confirmButtonColor: "red",
      allowOutsideClick: false,
    });
    return;
  }

  initialFocoSeconds = totalSeconds;
  currentMode = "foco";

  timerStatus.innerText = `Tarefa atual: ${getTaskString}`;
  timerSetupDiv.style.display = "none";

  toggleButtons(true);
  updateDisplay(totalSeconds);
  startCountdown();
}

function startCountdown() {
  clearInterval(timerInterval);

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
  if (currentMode === "foco") {
    const metadeTempo = Math.floor(initialFocoSeconds / 2);

    if (totalSeconds === metadeTempo) {
      clearInterval(timerInterval);
      startBreak("pausa-metade");
    }
  }
}

function startBreak() {
  const restHours = Number(document.querySelector(".hours-rest").value);
  const restMinutes = Number(document.querySelector(".minutes-rest").value);
  const restSeconds = Number(document.querySelector(".seconds-rest").value);

  const restTotalTImer = restHours * 3600 + restMinutes * 60 + restSeconds;

  currentMode = "pausa-metade";

  Swal.fire({
    title: "Hora de dar uma pausa!",
    text: "Aproveite para esticar as pernas e relaxar um pouco.",
    icon: "warning",
    iconColor: "red",
    confirmButtonText: "Confirrmar",
    confirmButtonColor: "red",
    allowOutsideClick: false,
    titleColor: "red",
  }).then((result) => {
    timerStatus.innerText = "Hora de relaxar";
    totalSeconds = restTotalTImer;
    updateDisplay(totalSeconds);
    startCountdown();
  });
}

function handleTimerEnd() {
  if (currentMode === "pausa-metade") {
    Swal.fire({
      title: "A pausa acabou!",
      text: "Está na hora de voltar ao foco",
      icon: "warning",
      iconColor: "red",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "red",
      titleColor: "red",
      allowOutsideClick: false,
    }).then(() => {
      currentMode = "foco";
      timerStatus.innerText = "Foco total";
      totalSeconds = Math.floor(initialFocoSeconds / 2);
      updateDisplay(totalSeconds);
      startCountdown();
      pontos += 10;
    });
  } else {
    Swal.fire({
      title: "Sessão concluída com sucesso!",
      text: `Muito bem, você manteve o foco e concluiu sua tarefa! ${pontos} pontos conquistados!`,
      icon: "success",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "red",
      textColor: "red",
      allowOutsideClick: false,
    }).then(() => {
      resetTimer();
    });
  }
}

function updateDisplay(secondsToRender) {
  const hrs = Math.floor(secondsToRender / 3600);
  const mins = Math.floor((secondsToRender % 3600) / 60);
  const secs = secondsToRender % 60;

  document.getElementById("hours").innerText = String(hrs).padStart(2, "0");

  minutesDisplay.innerText = String(mins).padStart(2, "0");

  secondsDisplay.innerText = String(secs).padStart(2, "0");
}

function pauseTimer() {
  const actualTask = document.getElementById("task-input").value;
  isPaused = true;
  clearInterval(timerInterval);
  timerStatus.innerText = `Tempo pausado. Sua tarefa atual é: ${actualTask}`;
  btnStart.style.display = "inline-block";
  btnStart.innerHTML = 'Retomar <i class="fa fa-play"></i>';
  btnPause.style.display = "none";
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = 0;
  initialFocoSeconds = 0;
  isPaused = false;
  currentMode = "foco";

  timerStatus.innerText = "Pronto para começar?";
  hoursDisplay.innerText = "00";
  minutesDisplay.innerText = "00";
  secondsDisplay.innerText = "00";
  timerSetupDiv.style.display = "flex";

  toggleButtons(false);
}

function toggleButtons(running) {
  if (running) {
    btnStart.style.display = "none";
    btnPause.style.display = "inline-block";
    btnReset.style.display = "inline-block";
  } else {
    btnStart.style.display = "inline-block";
    btnStart.innerHTML = 'Iniciar Foco <i class="fa fa-play"></i>';
    btnPause.style.display = "none";
    btnReset.style.display = "none";
  }
}

const sidebarTriggerBtn = document.querySelector(".open-sidebar");
const sidebarToOpen = document.querySelector(".navbar-desktop");
const icon = document.querySelector(".fa-bars");

sidebarTriggerBtn.addEventListener("click", function () {
  const isSidebarOpen = sidebarToOpen.classList.contains("active");

  if (isSidebarOpen) {
    sidebarToOpen.classList.add("close-trigger");

    setTimeout(() => {
      sidebarToOpen.classList.remove("active");
      sidebarToOpen.classList.remove("close-trigger");
    }, 200);
  } else {
    sidebarToOpen.classList.add("active");
  }

  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
});

const showHideElements = document.querySelector(".show-hide-elements");

showHideElements.addEventListener("click", () => {
  const timer = document.querySelector(".pomodoro-app");
  const hiddenElements = document.getElementById("ElementHided");

  hiddenElements.classList.toggle("active");
  timer.classList.toggle("active");
});

function openUserProfile() {
  const profileToShow = document.getElementById("profile-page");
  const hideOthersSection = document.querySelectorAll(
    ".pomodoro-app, .about, .know-more, .footer",
  );

  if (
    profileToShow.style.display === "none" ||
    profileToShow.style.display === ""
  ) {
    profileToShow.style.display = "block";
    hideOthersSection.forEach((page) => (page.style.display = "none"));
  } else {
    profileToShow.style.display = "none";
    hideOthersSection.forEach((page) => (page.style.display = "block"));
  }
}
