// 音效控制
const sounds = {
    rain: null,
    waves: null,
    forest: null,
    whitenoise: null
};

// 初始化音效
function initSounds() {
    sounds.rain = new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3'],
        loop: true,
        volume: 0.5
    });
    
    sounds.waves = new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3'],
        loop: true,
        volume: 0.5
    });
    
    sounds.forest = new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-forest-stream-with-birds-loop-1236.mp3'],
        loop: true,
        volume: 0.5
    });
    
    sounds.whitenoise = new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-loop-1235.mp3'],
        loop: true,
        volume: 0.5
    });
}

// 呼吸動畫控制
const breathingCircle = document.querySelector('.circle');
let breathingAnimation;

function startBreathingAnimation() {
    if (breathingAnimation) {
        breathingAnimation.kill();
    }
    
    breathingAnimation = gsap.timeline({repeat: -1})
        .to(breathingCircle, {
            scale: 1.5,
            duration: 4,
            ease: "power1.inOut"
        })
        .to(breathingCircle, {
            scale: 1.5,
            duration: 4,
            ease: "none"
        })
        .to(breathingCircle, {
            scale: 1,
            duration: 4,
            ease: "power1.inOut"
        });
}

// 音效按鈕控制
const soundButtons = document.querySelectorAll('.sound-btn');
soundButtons.forEach(button => {
    button.addEventListener('click', () => {
        const soundType = button.dataset.sound;
        if (button.classList.contains('active')) {
            sounds[soundType].fade(0.5, 0, 1000);
            setTimeout(() => sounds[soundType].pause(), 1000);
            button.classList.remove('active');
        } else {
            sounds[soundType].play();
            sounds[soundType].fade(0, 0.5, 1000);
            button.classList.add('active');
        }
    });
});

// 音量控制
const volumeSliders = document.querySelectorAll('.volume-slider');

volumeSliders.forEach(slider => {
    // 防止點擊滑桿時觸發按鈕的點擊事件
    slider.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 處理音量變化
    slider.addEventListener('input', (e) => {
        const soundType = e.target.dataset.sound;
        const volume = parseFloat(e.target.value) / 100;
        if (sounds[soundType]) {
            sounds[soundType].volume(volume);
        }
        
        // 更新音量圖標
        const volumeIcon = e.target.previousElementSibling;
        updateVolumeIcon(volumeIcon, volume);
    });
});

// 更新音量圖標
function updateVolumeIcon(icon, volume) {
    icon.className = 'fas';
    if (volume === 0) {
        icon.className += ' fa-volume-mute';
    } else if (volume < 0.3) {
        icon.className += ' fa-volume-off';
    } else if (volume < 0.7) {
        icon.className += ' fa-volume-down';
    } else {
        icon.className += ' fa-volume-up';
    }
}

// 計時器控制
let timerInterval;
let remainingTime;
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const timerDuration = document.getElementById('timer-duration');

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>開始計時';
        timerDuration.disabled = false;
        timerInterval = null;
        return;
    }

    remainingTime = parseInt(timerDuration.value);
    timerDuration.disabled = true;
    startTimerBtn.innerHTML = '<i class="fas fa-stop"></i>停止計時';

    timerInterval = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = formatTime(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>開始計時';
            timerDuration.disabled = false;
            
            // 漸進式停止所有音效
            Object.values(sounds).forEach(sound => {
                if (sound.playing()) {
                    sound.fade(0.5, 0, 5000);
                    setTimeout(() => sound.pause(), 5000);
                }
            });
            
            // 重置所有按鈕狀態
            soundButtons.forEach(button => button.classList.remove('active'));
        }
    }, 1000);
}

// 事件監聽器
startTimerBtn.addEventListener('click', startTimer);

// 當頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    initSounds();
    startBreathingAnimation();
    timerDisplay.textContent = formatTime(parseInt(timerDuration.value));
});