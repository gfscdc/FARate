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

    console.log('DOM загружен, ratingScroll:', ratingScroll);

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
        console.log('Создание кнопок рейтинга...');
        
        // Очищаем контейнер
        ratingScroll.innerHTML = '';
        
        for (let i = -5; i <= 5; i++) {
            const button = document.createElement('button');
            let ratingClass = '';
            
            if (i < 0) {
                ratingClass = 'negative';
            } else if (i > 0) {
                ratingClass = 'positive';
            } else {
                ratingClass = 'zero';
            }
            
            button.className = `rating-btn ${ratingClass}`;
            button.textContent = i > 0 ? `+${i}` : i.toString();
            button.dataset.rating = i;
            button.title = `Оценка: ${i}`;
            
            button.addEventListener('click', function() {
                setRating(i);
            });
            
            ratingScroll.appendChild(button);
            console.log('Создана кнопка:', i);
        }
        
        setRating(0);
        console.log('Все кнопки созданы, всего:', ratingScroll.children.length);
    }

    function setRating(rating) {
        console.log('Установка рейтинга:', rating);
        
        // Убираем активный класс со всех кнопок
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс выбранной кнопке
        const selectedBtn = document.querySelector(`.rating-btn[data-rating="${rating}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            console.log('Активная кнопка найдена:', selectedBtn);
        } else {
            console.log('Кнопка не найдена для рейтинга:', rating);
        }
        
        currentRating = rating;
        
        // Прокручиваем к выбранному рейтингу
        if (selectedBtn) {
            selectedBtn.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // ... остальной код без изменений ...

    // Инициализация
    function init() {
        console.log('Инициализация приложения...');
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
        
        console.log('Приложение инициализировано');
    }

    // В функции init() после createRatingButtons() добавьте:
function init() {
    console.log('Инициализация приложения...');
    createRatingButtons();
    
    // Проверка видимости рейтинга
    setTimeout(() => {
        const ratingContainer = document.querySelector('.rating-container');
        const ratingButtons = document.querySelectorAll('.rating-btn');
        
        console.log('Контейнер рейтинга:', ratingContainer);
        console.log('Кнопки рейтинга:', ratingButtons.length);
        console.log('Стили контейнера:', {
            display: ratingContainer.style.display,
            visibility: ratingContainer.style.visibility,
            opacity: ratingContainer.style.opacity,
            zIndex: ratingContainer.style.zIndex,
            position: ratingContainer.style.position
        });
        
        // Принудительно делаем видимым
        if (ratingContainer) {
            ratingContainer.style.display = 'block';
            ratingContainer.style.visibility = 'visible';
            ratingContainer.style.opacity = '1';
        }
    }, 1000);
    
    // ... остальной код инициализации
}

    // Запуск приложения
    init();
});