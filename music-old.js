const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

let musicList = [
    {
        name: 'Vô Kỵ',
        singer: 'Cổ cầm hòa tấu sáo trúc',
        image: "./Pictures/Vo-Ky.jpg",
        path: "./Songs/Vo-Ky.mp3"
    },
    {
        name: 'Mạc Vấn Quy Kỳ',
        singer: 'Là Thất Thúc Đây',
        image: "./Pictures/Mac-Van-Quy-Ky.jpg",
        path: "./Songs/Mac-Van-Quy-Ky.mp3"
    },
    {
        name: 'Vô Tình',
        singer: 'Xesi x Hoaprox',
        image: "./Pictures/Vo-Tinh.jpg",
        path: "./Songs/Vo-Tinh.mp3"
    },
    {
        name: 'Head In The Clouds',
        singer: 'Hayd',
        image: "./Pictures/Head-In-The-Clouds.jpg",
        path: "./Songs/Head-In-The-Clouds.mp3"
    },
    {
        name: 'Somewhere Only We Know',
        singer: 'Keane - Cover by Rhianne',
        image: "./Pictures/Somewhere-Only-We-Know.jpg",
        path: "./Songs/Somewhere-Only-We-Know.mp3"
    },
    {
        name: 'Namida No Ato',
        singer: 'Aloniss',
        image: "./Pictures/Namida-No-Ato.jpg",
        path: "./Songs/Namida-No-Ato.mp3"
    }
]

/**
 * Vừa load trang xong:
 *      + Đưa ra bài hát mặc định
 *      + Không tự động phát nhưng có thể thao tác
 * Sau khi tìm và Enter thì nhạc tự động phát
 */

let lenList = musicList.length
let audio = $('audio')
let list = $('.list')

// Sort nhạc trong list ra HTML
const showMusic = () => {
    let playList = musicList.map( (song, index) => {
        return `
        <div class="song" index="${index}">
            <div class="thumb-list" style="background-image: url('${song.image}')"></div>
            <div class="song-body">
                <div class="song-name">${song.name}</div>
                <div class="singer">${song.singer}</div>
            </div>
        </div>
        `
    })
    list.innerHTML = playList.join('')
}
showMusic()

// // Lấy nhạc từ trong list thông qua index
const loadMusic = indexSong => {
    let song = musicList[indexSong]

    let name = $('.name-song')
    let image = $('.thumb img')
    let curSong = $('.current-song')
    let bgImg = $('html')

    name.innerText = song.name
    image.src = song.image
    audio.src = song.path
    audio.autoplay = true
    curSong.innerText = `${Number(indexSong)+1}/${lenList}`
}

// // Xử lí active
const active = newIndex => {
    // Xóa active cũ
    $('.active').classList.remove('active')
    // Set active mới
    let index = $$('.song')[Number(newIndex)]
    index.classList.add('active')
    loadMusic(index.getAttribute('index'))
}

// Chọn bài nhạc đầu tiên để có thuộc tính active cho active() xóa
$('.song').classList.add('active')
active(0)

// Xử lí chọn nhạc từ list
let song = $$('.song')
for (let i=0; i<lenList; i++) {
    song[i].onclick = () => active(i)
}
// Xử lí dừng nhạc bằng nút Space
document.onkeydown = (e) => {
    // console.log(e.which)
    switch (e.which) {
        case 32:
            if (isPlaying)  audio.pause()
            else audio.play()
            break
        case 37:
        case 38:
            prev.click()
            break
        case 39:
        case 40:
            next.click()
            break
        case 76:
            btnLoop.click()
            break
        case 77:
            audio.muted = !audio.muted
            break
    }
}

let btnPlay = $('.thumb img')
let playPause = $('.thumb')
let isPlaying = false
// Xử lý Play/Pause
btnPlay.onclick = () => {
    if (isPlaying) {
        audio.pause()
    } else {
        audio.play()
    }
}
audio.onplay = () => {
    isPlaying = true
    playPause.classList.add("playing")
    imgAnimate.play()
}
audio.onpause = () => {
    isPlaying = false
    playPause.classList.remove("playing")
    imgAnimate.pause()
}
// Xử lí khi nhạc ended
audio.onended = () => {
    if (audio.loop === false) {
        next.click()
    } else audio.load()
}

// Xử lí khi ấn Next bài
let next = $('.next ion-icon')
next.onclick = () => {
    let indexActive = $('.active').getAttribute('index')
    // Nếu đang active bài đầu tiên thì không thể lùi
    if (indexActive == lenList-1 ) {
        active(0)
    } else {
        let newIndexActive = Number(indexActive) + 1
        active(newIndexActive)
    }
}

// Xử lí khi ấn Prev bài
let prev = $('.back ion-icon')
prev.onclick = () => {
    let indexActive = $('.active').getAttribute('index')
    // Nếu đang active bài đầu tiên thì không thể lùi
    if (indexActive == 0) {
        audio.load()
    } else {
        let newIndexActive = Number(indexActive) - 1
        active(newIndexActive)
    }
}

let btnLoop = $('.loop ion-icon')
let loop = $('.loop')
// Xử lí Loop
btnLoop.onclick = () => {
    audio.loop = !audio.loop
    loop.classList.toggle("looping")
}

let img = $('img')
// Xử lí đĩa quay
const imgAnimate = img.animate([{transform: "rotate(360deg"}], {
    duration: 10000, // 10 seconds
    iterations: Infinity
})
imgAnimate.pause()
// Xử lí progress
let progress = $('.progress')
audio.ontimeupdate = () => {
    if (audio.duration) {
        const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
    }
};
// Xử lí tua nhạc
progress.onchange = e => {
    const seekTime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seekTime;
};