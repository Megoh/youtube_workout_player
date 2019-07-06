// inputs
const playlistIdInput = document.querySelector("#playlist-id__input");
const workoutTimeInput = document.querySelector("#workout-time__input");
const breakTimeInput = document.querySelector("#break-time__input");

// buttons
const playButton = document.querySelector(".control-buttons__play-button");
const pauseButton = document.querySelector(".control-buttons__pause-button");
const stopButton = document.querySelector(".control-buttons__stop-button");
const startTimerButton = document.querySelector(".timer-buttons__start-button");
const stopTimerButton = document.querySelector(".timer-buttons__stop-button");

const timerDisplay = document.querySelector(".display__time-left");

// workout states
const WORKOUT = "workout";
const BREAK = "break";
const INACTIVE = "unstarted";
let workoutState = INACTIVE;

// workout times
let workoutTime;
let breakTime;

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "390",
    width: "640",
    playerVars: {
      listType: "playlist",
      list: "PLdKtPlG1-apjzv_SnWTcO__qtuwrgh3fE"
    },
    events: {
      onError: onPlayerError
    }
  });
}

function onPlayerReady(e) {
  e.target.playVideo();
}

function playVideo() {
  player.playVideo();
}

function pauseVideo() {
  player.pauseVideo();
}

function stopVideo() {
  player.stopVideo();
}

function setPlaylist() {
  // change playlist based on the input
}

let countdown;
let secondsSet;

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  displayTimeLeft(seconds);

  // start the timer
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft < 0) {
      // if workout time is over then start a break time and pause the video
      if (workoutState === WORKOUT) {
        workoutState = BREAK;
        secondsSet = breakTime;
        timer(secondsSet);
        pauseVideo();
        return;
      }
      // if break time is over then start a workout time and pause the video
      else if (workoutState === BREAK) {
        workoutState = WORKOUT;
        secondsSet = workoutTime;
        timer(secondsSet);
        playVideo();
        return;
      }
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function startTimer() {
  if (workoutState === WORKOUT) {
    secondsSet = workoutTime;
  } else if (workoutState === BREAK) {
    secondsSet = breakTime;
  } else if (workoutState === INACTIVE) {
    workoutState = WORKOUT;
    secondsSet = workoutTime;
  }
  // start the timer if the input time exists
  if (secondsSet) {
    timer(secondsSet);
    playVideo();
  } else {
    timerDisplay.innerHTML = `<span style="color:red;">You must enter a valid number!</span>`;
  }
}

function stopTimer() {
  stopVideo();
  clearInterval(countdown);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function onPlayerError(e) {
  switch (e.data) {
    // the video requested was not found
    case 100:
      player.nextVideo();
      break;

    // the owner of the requested video does not allow it to be played in embedded players
    case 101:
      player.nextVideo();
      break;

    // this error is the same as 101. It's just a 101 error in disguise!
    case 150:
      player.nextVideo();
      break;
  }
}

// inputs
playlistIdInput.addEventListener("input", setPlaylist);
breakTimeInput.addEventListener("input", () => {
  breakTime = breakTimeInput.value;
});
workoutTimeInput.addEventListener("input", () => {
  workoutTime = workoutTimeInput.value;
});

// buttons
playButton.addEventListener("click", playVideo);
pauseButton.addEventListener("click", pauseVideo);
stopButton.addEventListener("click", stopVideo);
startTimerButton.addEventListener("click", startTimer);
stopTimerButton.addEventListener("click", stopTimer);
