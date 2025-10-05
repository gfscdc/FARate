document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const video = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const timeDisplay = document.getElementById('timeDisplay');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeLevel = document.getElementById('volumeLevel');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const controls = document.getElementById('controls');
    const swipeArea = document.getElementById('swipeArea');
    const swipeIndicator = document.getElementById('swipeIndicator');
    const ratingScroll = document.getElementById('ratingScroll');

    // Переменные для свайпа
    let startX = 0;
    let startY = 0;
    let isSwiping = false;
    const swipeThreshold = 50;
    const skipTime = 10;

    // Переменные для рейтинга
    let currentRating = 0;

    // Инициализация рейтинга
    function createRatingButtons() {
        for (let i = -5; i <= 5; i++) {
            const button = document.createElement('button');
            button.className = `rating-btn ${i < 0 ? 'negative' : i > 0 ? 'positive' : 'zero'}`;
            button.textContent = i > 0 ? `+${i}` : i.toString();
            button.dataset.rating = i;
            
            button.addEventListener('click', function() {
                setRating(i);
            });
            
            ratingScroll.appendChild(button);
        }
        
        setRating(0);
    }

    function setRating(rating) {
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`.rating-btn[data-rating="${rating}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        currentRating = rating;
        console.log('Выбран рейтинг:', rating);
        
        if (selectedBtn) {
            selectedBtn.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // Обработчики свайпа
    function handleTouchStart(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = true;
        e.preventDefault();
    }
    
    function handleTouchMove(e) {
        if (!isSwiping) return;
        
        const touch = e.touches[0];
        const diffX = touch.clientX - startX;
        const diffY = touch.clientY - startY;
        
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isSwiping = false;
            return;
        }
        
        e.preventDefault();
    }
    
    function handleTouchEnd(e) {
        if (!isSwiping) return;
        
        const touch = e.changedTouches[0];
        const diffX = touch.clientX - startX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                skipForward();
                showSwipeIndicator('⏩ +10 сек');
            } else {
                skipBackward();
                showSwipeIndicator('⏪ -10 сек');
            }
        }
        
        isSwiping = false;
    }
    
    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;
        isSwiping = true;
    }
    
    function handleMouseMove(e) {
        if (!isSwiping) return;
        
        const diffX = e.clientX - startX;
        const diffY = e.clientY - startY;
        
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isSwiping = false;
            return;
        }
    }
    
    function handleMouseUp(e) {
        if (!isSwiping) return;
        
        const diffX = e.clientX - startX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                skipForward();
                showSwipeIndicator('⏩ +10 сек');
            } else {
                skipBackward();
                showSwipeIndicator('⏪ -10 сек');
            }
        }
        
        isSwiping = false;
    }

    function skipForward() {
        video.currentTime = Math.min(video.duration, video.currentTime + skipTime);
    }
    
    function skipBackward() {
        video.currentTime = Math.max(0, video.currentTime - skipTime);
    }
    
    function showSwipeIndicator(text) {
        swipeIndicator.textContent = text;
        swipeIndicator.classList.add('show');
        
        setTimeout(() => {
            swipeIndicator.classList.remove('show');
        }, 1500);
    }

    // Управление видео
    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.textContent = '⏸️';
        } else {
            video.pause();
            playPauseBtn.textContent = '▶️';
        }
    }

    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
        
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);
        
        timeDisplay.textContent = 
            `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = video.duration;
        
        video.currentTime = (clickX / width) * duration;
        e.stopPropagation();
    }

    function toggleMute() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
        updateVolumeDisplay();
    }
    
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        
        video.volume = volume;
        video.muted = volume === 0;
        muteBtn.textContent = volume === 0 ? '🔇' : '🔊';
        updateVolumeDisplay();
        e.stopPropagation();
    }
    
    function updateVolumeDisplay() {
        const volume = video.muted ? 0 : video.volume;
        volumeLevel.style.width = `${volume * 100}%`;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Скрытие контролов
    let controlsTimeout;
    function showControls() {
        controls.style.opacity = '1';
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (!video.paused) {
                controls.style.opacity = '0';
            }
        }, 3000);
    }

    // Инициализация
    function init() {
        createRatingButtons();
        
        // Автовоспроизведение
        video.play().catch(e => console.log('Автовоспроизведение заблокировано'));
        
        // Свайп события
        swipeArea.addEventListener('touchstart', handleTouchStart, { passive: false });
        swipeArea.addEventListener('touchmove', handleTouchMove, { passive: false });
        swipeArea.addEventListener('touchend', handleTouchEnd);
        
        swipeArea.addEventListener('mousedown', handleMouseDown);
        swipeArea.addEventListener('mousemove', handleMouseMove);
        swipeArea.addEventListener('mouseup', handleMouseUp);
        swipeArea.addEventListener('mouseleave', handleMouseUp);
        
        // Управление видео
        playPauseBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        video.addEventListener('timeupdate', updateProgress);
        progressContainer.addEventListener('click', setProgress);
        
        // Громкость
        muteBtn.addEventListener('click', toggleMute);
        volumeSlider.addEventListener('click', setVolume);
        
        // Полноэкранный режим
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Скрытие контролов
        video.addEventListener('mousemove', showControls);
        controls.addEventListener('mousemove', showControls);
        
        // Инициализация громкости
        video.volume = 0.7;
        updateVolumeDisplay();
        
        video.addEventListener('ended', function() {
            playPauseBtn.textContent = '▶️';
        });
    }

    // Запуск приложения
    init();
});