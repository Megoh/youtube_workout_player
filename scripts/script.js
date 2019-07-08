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

// playlist info
let playlistLink;
let playlistId;

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "390",
    width: "640",
    events: {
      onError: onPlayerError,
      onReady: onPlayerReady
    }
  });
}

function onPlayerReady() {
  cuePlaylist(playlistId);
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
  const playlistInput = this.value;
  if (playlistInput.includes("youtube")) {
    playlistLink = playlistInput;
    playlistId = youtubePlaylistParser(playlistLink);
  } else {
    playlistId = playlistInput;
  }

  // prepare the playlist to be played
  cuePlaylist(playlistId);
}

function cuePlaylist(playlist) {
  player.cuePlaylist({
    listType: "playlist",
    list: playlist
  });
}

function youtubePlaylistParser(link) {
  let reg = new RegExp("[&?]list=([a-z0-9_-]+)", "i");
  let match = reg.exec(link);

  if (match && match[1].length > 0) {
    return match[1];
  } else {
    return "failed to parse youtube playlist";
  }
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

function saveTimer() {
  localStorage.setItem("workoutTime", workoutTime.toString());
  localStorage.setItem("breakTime", breakTime.toString());
  localStorage.setItem("playlistId", playlistId);
}

function loadTimer() {
  workoutTime = parseInt(localStorage.getItem("workoutTime"));
  breakTime = parseInt(localStorage.getItem("breakTime"));
  playlistId = localStorage.getItem("playlistId");

  breakTimeInput.value = breakTime;
  workoutTimeInput.value = workoutTime;
  playlistIdInput.value = playlistId;
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
  if (secondsSet && breakTime) {
    timer(secondsSet);
    // save data to local storage here
    saveTimer();
    player.loadPlaylist({
      listType: "playlist",
      list: playlistId
    });
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

loadTimer();

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
