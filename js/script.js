// get all dynamin elements
let music_list = allMusic;

let musicImg = document.querySelector(".details_img"),
  musicName = document.querySelector(".song_name"),
  musicArtist = document.querySelector(".songer"),

  // note: audio element here means (audio source) not (clip) => like unity ;) 
  // (src) attr referes to the (clip)
  audio = document.querySelector(".audio_playing"),
  playPauseBtn = document.querySelector(".pause_play_icon"),

  nextBtn = document.querySelector(".next_icon"),
  prevBtn = document.querySelector(".prev_icon"),

  prog_bar = document.querySelector(".prog_bar"),
  bar_progress = document.querySelector(".bar_progress"),
  time_now = document.querySelector(".time_now"),
  time_length = document.querySelector(".time_length"),

  repeating_icon = document.querySelector(".shuffle_icon");


// let musicIndex = 0;
// window.onload = (() => {
//   loadMusic(musicIndex);
// });
let musicIndex = 0;
/*=========================== Audio Load ===========================*/
function loadMusic(musicIndex) {
  let song = music_list[musicIndex];
  musicName.innerHTML = song.name;
  musicImg.src = `images/${song.img}.jpg`
  musicArtist.innerHTML = song.artist;

  audio.src = `songs/${song.src}.mp3`
  audio.play();
  audio.classList.add("playing");
  playPauseBtn.classList.remove("uil-play");
  playPauseBtn.classList.add("uil-pause");
}

// audio.addEventListener("loadeddata", () => {
//   loadMusic(musicIndex);
// });

window.onload = (() => {
  loadMusic(musicIndex);
});

/*=========================== Play / Pause Audio ===========================*/
playPauseBtn.addEventListener('click', (e) => {
  let isplaying = audio.classList.contains("playing");
  if (isplaying) {
    audio.classList.remove("playing");
    audio.pause();
    playPauseBtn.classList.add("uil-play");
    playPauseBtn.classList.remove("uil-pause");
  } else {
    audio.classList.add("playing");
    audio.play()
    playPauseBtn.classList.add("uil-pause");
    playPauseBtn.classList.remove("uil-play");
  }
});

/*=========================== load next / prev Audio ===========================*/
function loadNextMusic() {
  if (musicIndex >= music_list.length - 1) {
    musicIndex = 0;
  } else {
    musicIndex++;
  }
  loadMusic(musicIndex);
}

function loadPrevMusic() {
  if (musicIndex <= 0) {
    musicIndex = music_list.length - 1;
  } else {
    musicIndex--;
  }
  loadMusic(musicIndex);
}

nextBtn.addEventListener("click", (e) => {
  loadNextMusic();
});
prevBtn.addEventListener("click", (e) => {
  loadPrevMusic();
});

function fixTimeFormate(t) {
  let mins = Math.floor(t / 60);
  let secs = Math.floor(t) % 60;
  if (secs < 10) secs = `0${secs}`
  return `${mins}:${secs}`;
}

/*=========================== Progress bar ===========================*/
// update progressbar width according to music current time
audio.addEventListener("loadeddata", () => {
  audio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting playing song currenttime
    const duration = e.target.duration; //getting playing total song duration
    let progressWidth = (currentTime / duration) * 100;


    bar_progress.style.width = `${progressWidth}%`;
    bar_progress.dataset.progress = `${Math.floor(progressWidth)}%`;

    // some fixes 
    if (bar_progress.dataset.progress == `NaN%`) bar_progress.dataset.progress = '0%';
    if (fixTimeFormate(duration) == `NaN:NaN`) time_length.innerHTML = '0:00';
    else time_length.innerHTML = fixTimeFormate(duration);

    time_now.innerHTML = fixTimeFormate(currentTime);

  });

  /*------------------- update on click progressbar offsetX -------------------*/
  prog_bar.addEventListener('click', (e) => {
    clicked_offsetX = e.offsetX;
    let totalWidth = prog_bar.clientWidth;

    audio.currentTime = (clicked_offsetX / totalWidth) * audio.duration;
  })
});


/*======== Change Icon Repeat - Loop - Shuffle ===============*/
const shulle_icon = "uil-arrow-random";
const loop_icon = "uil-sort-amount-down";
const repeat_icon = "uil-repeat";


repeating_icon.addEventListener('click', (e) => {
  let class_list = e.target.classList;

  console.log(class_list.contains(shulle_icon))
  // case shuffle => loop
  if (class_list.contains(shulle_icon)) {
    e.target.classList.remove(shulle_icon);
    e.target.classList.add(loop_icon);
  }
  // case loop => repeat
  else if (class_list.contains(loop_icon)) {
    e.target.classList.remove(loop_icon);
    e.target.classList.add(repeat_icon);
  }
  // case repeat => shuffle
  else if (class_list.contains(repeat_icon)) {
    e.target.classList.remove(repeat_icon);
    e.target.classList.add(shulle_icon);
  }
})

// above we just change icon, now let's work on what to do after song ended
audio.addEventListener('ended', (e) => {
  if (repeating_icon.classList.contains(shulle_icon)) {
    // NOTE: Math.random() returns a random number between 0 (inclusive),  and 1 (exclusive)
    let randIndex = Math.floor((Math.random() * music_list.length));
    while (musicIndex == randIndex && music_list.length > 1) {
      randIndex = Math.floor((Math.random() * music_list.length));
    }

    musicIndex = randIndex;
    loadMusic(musicIndex);
  }
  else if (repeating_icon.classList.contains(loop_icon)) {
    loadNextMusic();
  }
  else if (repeating_icon.classList.contains(repeat_icon)) {
    audio.currentTime = 0;
    loadMusic(musicIndex);
  }
});


/*=========================== Toggle Songs List ===========================*/
const closeIcon = document.querySelector(".close_icon"),
  listIcon = document.querySelector(".list_icon"),
  songsList = document.querySelector(".songs_list");

listIcon.addEventListener('click', (e) => {
  songsList.classList.toggle('show');
});
closeIcon.addEventListener('click', (e) => {
  songsList.classList.toggle('show');
});

/*============= create li for each element into song list =================*/
const ul_tag = document.querySelector(".list_content");

music_list.forEach((song, index) => {
  let li_tag = `<!------------------ Song List Item ------------------->
                <li>
                  <div class="data">
                    <p class="item_song_name">${song.name}</p>
                    <span class="item_songer">${song.artist}</span>
                  </div>
                  <span id="song_${index}" class="song_length"></span>
                </li> `;

  ul_tag.insertAdjacentHTML("beforeend", li_tag);

  let new_audio = document.createElement("audio");
  new_audio.src = `songs/${song.src}.mp3`;
  new_audio.addEventListener("loadeddata", () => {
    document.getElementById(`song_${index}`).innerHTML = fixTimeFormate(new_audio.duration);
  });
});

// play particular song from the list on click of li tag
let li_tags = document.querySelectorAll(".list_content li");
li_tags.forEach((e, i) => {
  e.addEventListener('click', () => {
    console.log(e, i);
    musicIndex = i;
    loadMusic(musicIndex);
    e.classList.add("active");
  })
})