document.addEventListener("DOMContentLoaded",function(){

    // store the song details
    // array of object

    const songs =[
        {
            title: "Drive breakbeat",
            duration: "1:49",
            thumbnail: "./assets/icons/music-icon.svg",
            src: "./data/track1.mp3",
            artist: "Rockot",
            year: 2023
        },
        {
            title: "Titanium",
            duration: "1:46",
            thumbnail: "./assets/icons/music-icon.svg",
            src: "./data/track2.mp3",
            artist: "AlisiaBeats",
            year: 2023 
        },
        {
            title: "Science Documentory",
            duration: "2:07",
            thumbnail: "./assets/icons/music-icon.svg",
            src: "./data/track3.mp3",
            artist: "Lexin_Music",
            year: 2023
        },
        {
            title: "Once In Paris",
            duration: "2:12",
            thumbnail: "./assets/icons/music-icon.svg",
            src: "./data/track4.mp3",
            artist: "Pumpupthemind",
            year: 2023
        }
    ]

    let currentSongIndex = 0;
    let audio = new Audio()

    // access to dom elements

    const songList = document.getElementById("song-List")
    const thumbnail = document.getElementById("thumbnail")
    const trackTitle = document.getElementById("player-title")
    const trackDescription = document.getElementById("player-description")
    const progress = document.getElementById("progress")
    const currTime = document.getElementById("current-time")
    const leftTime = document.getElementById("time-left")


    // song file should load
    // song image should appear
    // title should change
    // artist name should change
    // duration should be prepared
    // selected area song should be highlighted

    function loadSong(index){
        const currentSong = songs[index]
        // loaded the selected mp3 file into audio player
        audio.src = currentSong.src,
        thumbnail.src = currentSong.thumbnail,
        trackTitle.innerText = currentSong.title,
        trackDescription.innerText = currentSong.artist,
        currTime.textContent = "00:00"
        leftTime.textContent = "00:00"
        audio.addEventListener("loadedmetadata", function(){
            progress.max = audio.duration
        })
        updateCurrentSongHighLight(index) // highlighting(not yet created this function in future will create)
    }

    // to display list of songs in left
    function renderSongList(){
        songList.innerHTML = ""
        songs.forEach((song, index)=>{
            // for each song we create html elements dynamically

            // song container : <div class="item-container">  </div>
            const itemContainer = document.createElement("div")

            // image container
            const itemImg = document.createElement("div")
            // image element <img>
            const imgElement = document.createElement("img")

            // track data container: store: title, artist: <div> <p>Title</p> <p>Artist</p> </div>
            const trackDataContainer = document.createElement("div")
            const trackTitle = document.createElement("p")
            const trackArtist = document.createElement("p")

            // duration container: duration, year
            const trackDurationContainer = document.createElement("div")
            const trackDuration = document.createElement("p")
            const trackYear = document.createElement("p")


            // assign CSS class name
            itemContainer.classList.add("item-container");
            // store song position inside HTML and later used for highlighting current song
            itemContainer.setAttribute("data-index",index); // <div class="item-container" data-index="0"></div>
            itemImg.classList.add("item-img");
            trackDataContainer.classList.add("track-data-container");
            trackTitle.classList.add("track-title");
            trackArtist.classList.add("track-artist");
            trackDurationContainer.classList.add("track-duration-container");
            trackDuration.classList.add("track-duration");
            trackYear.classList.add("track-year")

            // click
            itemContainer.addEventListener("click",()=>{
                currentSongIndex = index,
                loadSong(currentSongIndex),
                audio.play()
                updatePlayPauseButton(); // not yet create
            })

            // add content
            imgElement.src="./assets/icons/outline.svg";
            trackTitle.textContent = song.title;
            trackArtist.textContent = song.artist || "Unknown Artist"
            trackDuration.textContent = song.duration;
            trackYear.textContent = song.year || "Unknown Year"

            // append elements to container
            itemImg.appendChild(imgElement);
            trackDataContainer.appendChild(trackTitle);
            trackDataContainer.appendChild(trackArtist);
            trackDurationContainer.appendChild(trackDuration);
            trackDurationContainer.appendChild(trackYear);

            itemContainer.appendChild(itemImg);
            itemContainer.appendChild(trackDataContainer);
            itemContainer.appendChild(trackDurationContainer);

            songList.appendChild(itemContainer);
        })
    }
     
    // HighLight the currently playing song
    function updateCurrentSongHighLight(){
        // select all song titles
        const titleElements = document.querySelectorAll(".track-title")
        // remove previous highLight
        titleElements.forEach((element)=>{
            element.classList.remove("current-song")
        })

        const currentSongTitleElement = document.querySelector(
            `.item-container[data-index="${currentSongIndex}"] .track-title`
        )

        // add highLight to current song
        if(currentSongTitleElement){
            currentSongTitleElement.classList.add("current-song")
        }
    }

    // controls
    const restartBtn = document.getElementById("restart");
    const playPauseBtn = document.getElementById("play-pause");
    const stopBtn = document.getElementById("stop");
    const volumeControl = document.getElementById("volume");

    // add event listener to element
    playPauseBtn.addEventListener("click",playPause);
    restartBtn.addEventListener("click",restart);
    stopBtn.addEventListener("click",stopTrack);

    progress.addEventListener("input", function(){
        audio.currentTime = progress.value
    })
    volumeControl.addEventListener("input",updateVolume)

    // audio time update : to move progress bar automatically
    audio.addEventListener("timeupdate",updateProgress)

    audio.addEventListener("play", () => updatePlayPauseButton(true));
    audio.addEventListener("pause", () => updatePlayPauseButton(false))

    const updatePlayPauseButton =(paused) =>{
        playPauseBtn.innerHTML = paused ?'<img src="./assets/icons/play.svg"/>'
        :'<img src="./assets/icons/pause.svg"/>'
    }

    // playpause
    function playPause(){
        if(audio.paused){
            // true
            audio.play();
            updatePlayPauseButton(audio.paused); // true
        }
        else{
            audio.pause();
            updatePlayPauseButton(audio.paused);false
        }
    }

    // updateProgress
    function updateProgress(){
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const remainingTime = duration - currentTime;
        progress.value = currentTime;
        currTime.textContent =`${formatTime(currentTime)}`;
        leftTime.textContent =`${
            "-" + (remainingTime>=0 ? formatTime(remainingTime):"00:00")
        }`
    }

    // formatTime
    // secs to min:sec
    // time = 189 sec
    // minutes = 189/60 => 3.15 => 3
    // seconds = 189%60 => 9
    function formatTime(time){
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time%60);
        return `${padZero(minutes)}:${padZero(seconds)}` // padZero(3):padZero(9)
    }

    // num<0 : 0num if no num // 3:9 => 03:09
    function padZero(number){
        return (number<10 ? "0" : "") + number // 03:09
    }

    // restart
    function restart(){
        audio.currentTime = 0;
        progress.value = 0;
    }

    // stopTrack
    function stopTrack(){
        audio.currentTime = 0;
        audio.pause()
    }

    // updateVolume
    function updateVolume(){
        audio.volume = volumeControl.value
    }


    renderSongList()
    loadSong(currentSongIndex)

})
