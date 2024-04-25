const FPS = 100
const MAX_TRAILS = 15
const MAX_WIDTH = 75
const MAX_HEIGHT = 75
const MIN_WIDTH = 20
const MIN_HEIGHT = 20
const COMMENTS = [
    "NICE AND EASY",
    "OK",
    "OK COOL",
    "THIS ISNT THAT BAD",
    "WE GOT THIS",
    "WE GOT THIS",
    "UM",
    "THIS IS FINE",
    "SHIT",
    "OH SHIT",
    "FUCK",
    "FUCK FUCK",
    "FUCK FUCK FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
    "OH FUCKING FUCK",
]
const SOUNDS = []
let clock
let frame = 0
let points = 0
let dead = false
let topScore = 0

const playSound = (sound, loop = false) => {
    var audio = new Audio(`./mp3/${sound}.wav`)
    audio.loop = loop
    audio.play()
    SOUNDS.push(audio)
}

const onEnterFrame = () => {
    let prevY = mouseY
    let prevX = mouseX
    let clearScene = true

    const NUM_SQUARES = document.querySelectorAll(".square").length
    // Frame Always Marches On
    frame++

    //Update Comment

    comment.textContent = dead ? "WE FUCKED UP" : COMMENTS[NUM_SQUARES - 1]

    /*
     *   Square Related Functions
     */
    document.querySelectorAll(".square").forEach((square) => {
        square.style.transform = `rotate(${square.seed + frame}deg)`
        if (!dead) {
            let resetSquare = false
            switch (square.axis) {
                case 0:
                    square.style.top = `${(square.top += square.speed)}%`
                    resetSquare = square.top >= 100
                    break
                case 1:
                    square.top -= square.speed
                    square.style.top = `${square.top}%`
                    resetSquare = square.top <= 0
                    break
                case 2:
                    square.style.left = `${(square.left += square.speed)}%`
                    resetSquare = square.left >= 100
                    break
                case 3:
                    square.left -= square.speed
                    square.style.left = `${square.left}%`
                    resetSquare = square.left <= 0
                    break
            }
            if (resetSquare) {
                square.remove()
                renderSquare()
                points++
                //playSound("win")
                if (frame > 300 * NUM_SQUARES * 1.5) {
                    renderSquare()
                    points++
                }
            }
        }
    })

    /*
     *   Mice Related Functions
     */
    document.querySelectorAll(".mouse").forEach((mouse) => {
        const mouseTop = mouse.getBoundingClientRect().top + mouse.getBoundingClientRect().height / 2
        const mouseLeft = mouse.getBoundingClientRect().left + mouse.getBoundingClientRect().width / 2
        const diffY = mouseTop - prevY
        const diffX = mouseLeft - prevX
        const MAX_SQUARES = NUM_SQUARES * 1.5 > 12 ? 12 : NUM_SQUARES * 1.5
        const thirdY = (diffY / MAX_TRAILS) * MAX_SQUARES
        const thirdX = (diffX / MAX_TRAILS) * MAX_SQUARES
        const newY = mouseTop - thirdY
        const newX = mouseLeft - thirdX
        mouse.style.top = `${newY}px`
        mouse.style.left = `${newX}px`
        prevY = newY
        prevX = newX
        let inBounds = true
        if (mouseTop < game.getBoundingClientRect().top) {
            inBounds = false
        }
        if (mouseLeft < game.getBoundingClientRect().left) {
            inBounds = false
        }
        if (mouseLeft > game.getBoundingClientRect().left + game.getBoundingClientRect().width) {
            inBounds = false
        }
        if (mouseTop > game.getBoundingClientRect().top + game.getBoundingClientRect().height) {
            inBounds = false
        }
        document.querySelectorAll(".square").forEach((square) => {
            if (isColliding(mouse, square)) {
                inBounds = false
            }
        })

        mouse.classList.remove("dead")

        if (!inBounds) {
            mouse.classList.add("dead")
            clearScene = false
        }
    })
    // Finally Check if scene should reset
    if (clearScene && dead) {
        dead = false
        game.classList.remove("dead")
        reset()
    } else if (!clearScene && !dead) {
        game.classList.add("dead")
        dead = true
        renderScore()
    }
    // Show Points on game
    document.querySelectorAll(".square")
    score.textContent = points
    if (points > topScore && topScore > 0) {
        game.classList.add("highest")
    }
    count.textContent = `LEVEL ${document.querySelectorAll(".square").length}`
    clearTimeout(clock)
    clock = setTimeout(onEnterFrame, 1000 / FPS)
}

const reset = () => {
    //playSound("lose")
    points = 0
    frame = 0
    document.querySelectorAll(".square").forEach((square) => {
        square.remove()
    })
    renderSquare()
    game.classList.remove("highest")
}

// const initAudio = () => {
//     stage.addEventListener("click", function () {
//         var audioContext = new AudioContext()
//         var buffer = audioContext.createBuffer(1, 1, 22050)
//         var source = audioContext.createBufferSource()
//         source.buffer = buffer
//         source.connect(audioContext.destination)
//         source.start()
//     })
//     audioOn.addEventListener("click", () => {
//         stage.classList.add("audioEnabled")
//         playSound("song", true)
//     })
//     audioOff.addEventListener("click", () => {
//         stage.classList.remove("audioEnabled")
//         SOUNDS.forEach((sound) => {
//             sound.pause()
//         })
//     })
// }

const load = () => {
    if (window.location.host.indexOf("github.io") > -1 && window.location.protocol != "https:") {
        window.location.protocol = "https"
    }
    renderSquare()
    for (let mice = 0; mice < MAX_TRAILS; mice++) {
        renderMouse(mice + 1)
    }
    // initAudio()
    //initFullscreen()
    onEnterFrame()
}
// const initFullscreen = () => {
//     if (fullscreen) {
//         fullscreen.addEventListener("click", () => {
//             if (!document.fullscreenElement) {
//                 // Enter fullscreen
//                 const docElm = document.documentElement
//                 if (docElm && docElm.requestFullscreen) {
//                     docElm.requestFullscreen()
//                 } else if (docElm.mozRequestFullScreen) {
//                     /* Firefox */
//                     docElm.mozRequestFullScreen()
//                 } else if (docElm.webkitRequestFullscreen) {
//                     /* Chrome, Safari and Opera */
//                     docElm.webkitRequestFullscreen()
//                 } else if (docElm.msRequestFullscreen) {
//                     /* IE/Edge */
//                     docElm.msRequestFullscreen()
//                 }
//             } else {
//                 // Exit fullscreen
//                 if (document.exitFullscreen) {
//                     document.exitFullscreen()
//                 } else if (document.mozCancelFullScreen) {
//                     /* Firefox */
//                     document.mozCancelFullScreen()
//                 } else if (document.webkitExitFullscreen) {
//                     /* Chrome, Safari and Opera */
//                     document.webkitExitFullscreen()
//                 } else if (document.msExitFullscreen) {
//                     /* IE/Edge */
//                     document.msExitFullscreen()
//                 }
//             }
//         })
//     }
// }

// Render Functions
const renderScore = () => {
    if (points === 0) return
    const obj = document.createElement("li")
    const label = document.createElement("span")
    const title = document.createElement("span")
    const num = document.createElement("span")
    const total = document.createElement("span")
    label.classList.add("label")
    title.classList.add("title")
    total.classList.add("total")
    num.classList.add("num")
    num.textContent = points
    label.textContent = "score -"
    title.textContent = ` - ${getDate()}`
    total.textContent = ` - (level ${document.querySelectorAll(".square").length}) `
    obj.appendChild(label)
    obj.appendChild(num)
    obj.appendChild(total)
    obj.appendChild(title)
    document.querySelector("#high-scores ul").prepend(obj)
    let topItem = null
    topScore = 0
    document.querySelectorAll("#high-scores ul li span.num").forEach((item) => {
        const SCORE = parseInt(item.textContent, 10)
        if (SCORE > topScore) {
            topScore = SCORE
            topItem = item
        }
        item.classList.remove("highest")
    })
    highest.textContent = topScore
    topItem && topItem.classList.add("highest")
}

const renderSquare = () => {
    const obj = document.createElement("div")
    obj.classList.add("square")
    obj.axis = getRand(3)
    obj.seed = getRand(100)
    obj.style.transform = `rotate(${obj.seed}deg)`
    const randSpeed = 1 + getRand(points * 2)
    obj.speed = 0.4 + randSpeed / 100
    obj.speed = obj.speed > 1 ? 1 : obj.speed
    const RANGE = MAX_WIDTH - MIN_WIDTH
    const PERCENT_FAST = 100 - (100 / 0.75) * (obj.speed - 0.25)
    obj.style.width = `${(RANGE / 100) * PERCENT_FAST + MIN_WIDTH}px`
    obj.style.height = `${(RANGE / 100) * PERCENT_FAST + MIN_HEIGHT}px`
    if (obj.seed > 90) obj.seed = 90
    if (obj.seed < 10) obj.seed = 10

    switch (obj.axis) {
        case 0:
            obj.style.top = 0
            obj.top = 0
            obj.style.left = `${obj.seed}%`
            obj.left = obj.seed
            break
        case 1:
            obj.style.top = `100%`
            obj.top = 100
            obj.style.left = `${obj.seed}%`
            obj.left = obj.seed
            break
        case 2:
            obj.style.left = 0
            obj.left = 0
            obj.style.top = `${obj.seed}%`
            obj.top = obj.seed
            break
        case 3:
            obj.style.left = `100%`
            obj.left = 100
            obj.style.top = `${obj.seed}%`
            obj.top = obj.seed
            break
    }
    game.appendChild(obj)
}

const renderMouse = (num) => {
    const obj = document.createElement("div")
    obj.classList.add("mouse")
    obj.num = num
    obj.style.width = `${20 + MAX_TRAILS - num}px`
    obj.style.height = `${20 + MAX_TRAILS - num}px`
    document.body.appendChild(obj)
}

// Set Mouse Position
let mouseX = 0
let mouseY = 0

const mouseMove = (e) => {
    if (e.touches) {
        mouseX = e.touches[0].clientX
        mouseY = e.touches[0].clientY
    } else {
        mouseX = e.clientX
        mouseY = e.clientY
    }
}

// Utilities.js
const isColliding = (div1, div2) => {
    const rect1 = div1.getBoundingClientRect()
    const rect2 = div2.getBoundingClientRect()
    return !(rect2.left > rect1.right || rect2.right < rect1.left || rect2.top > rect1.bottom || rect2.bottom < rect1.top)
}

const getRand = (max) => {
    return Math.round(Math.random() * max)
}

const getDate = () => {
    const now = new Date()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = months[now.getMonth()]
    const day = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const formattedDate = `${month} ${day} ${hours}:${minutes}`
    return formattedDate
}

window.addEventListener("load", load)
document.addEventListener("mousemove", mouseMove)
document.addEventListener("touchmove", mouseMove)
