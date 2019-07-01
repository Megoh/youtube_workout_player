const playlistIdInput = document.querySelector("#playlistIdInput");
const youtubeFrame = document.querySelector("#youtubeFrame");
const playButton = document.querySelector("#playButton");
const pauseButton = document.querySelector("#pauseButton");
const stopButton = document.querySelector("#stopButton");
const startTimerButton = document.querySelector("#startTimerButton");
const workoutTimeInput = document.querySelector("#workoutTimeInput");
const timerDisplay = document.querySelector(".display__time-left");

// 2. This code loads the IFrame Player API code asynchronously.
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
let minutesLeft = workoutTimeInput.value;

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft < 0) {
      pauseVideo();
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function startTimer() {
  const seconds = minutesLeft * 60;
  playVideo();
  timer(seconds);
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

playlistIdInput.addEventListener("input", setPlaylist);
playButton.addEventListener("click", playVideo);
pauseButton.addEventListener("click", pauseVideo);
stopButton.addEventListener("click", stopVideo);
startTimerButton.addEventListener("click", startTimer);
workoutTimeInput.addEventListener("input", () => {
  minutesLeft = workoutTimeInput.value;
});
