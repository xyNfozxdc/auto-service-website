// javascript.js - JavaScript для сайта автосервиса

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('EmailJS loaded:', typeof emailjs !== 'undefined');

    // Оптимизационные функции
    function optimizeImages() {
        const aboutImage = document.querySelector('.about-image img');
        if (aboutImage && window.innerWidth < 768) {
            aboutImage.src = 'https://avatars.mds.yandex.net/get-altay/1971563/2a0000016c93a28f058cfeff0370d62eb7d0/M';
        }
    }

    function addTouchOptimizations() {
        if ('ontouchstart' in window) {
            document.querySelectorAll('.btn, .service-card').forEach(el => {
                el.style.cursor = 'pointer';
            });
            
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }

    function adjustMapHeight() {
        const mapWrapper = document.querySelector('.map-wrapper');
        if (!mapWrapper) return;
        
        if (window.innerWidth < 576) {
            mapWrapper.style.height = '200px';
        } else if (window.innerWidth < 768) {
            mapWrapper.style.height = '250px';
        } else {
            mapWrapper.style.height = '300px';
        }
    }

    function fixViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Инициализация оптимизаций
    optimizeImages();
    addTouchOptimizations();
    adjustMapHeight();
    fixViewportHeight();

    // Обновление при изменении размера окна
    window.addEventListener('resize', function() {
        optimizeImages();
        adjustMapHeight();
        fixViewportHeight();
    });

    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Закрытие меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            let formattedValue = '+7 ';
            if (value.length > 0) {
                formattedValue += '(' + value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            e.target.value = formattedValue;
        });

        phoneInput.addEventListener('focus', function() {
            if (this.value === '' || this.value === '+7 ') {
                this.value = '+7 ';
            }
        });
    }

    // ОБНОВЛЕННЫЙ КОД ДЛЯ ОТПРАВКИ ФОРМЫ
    const appointmentForm = document.getElementById('appointmentForm');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Валидация
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!name) {
                showMessage('Пожалуйста, введите ваше имя', 'error');
                document.getElementById('name').focus();
                return;
            }
            
            if (!phone || phone === '+7 ' || phone.length < 16) {
                showMessage('Пожалуйста, введите корректный номер телефона', 'error');
                document.getElementById('phone').focus();
                return;
            }
            
            // Показываем загрузку
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            try {
                // Получаем текстовое значение услуги (русское название)
                const serviceSelect = document.getElementById('service');
                let serviceText = 'Не выбрано';
                if (serviceSelect.value) {
                    // Получаем текстовое значение выбранной опции
                    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
                    serviceText = selectedOption.text || 'Не выбрано';
                }
                
                // Подготовка данных для отправки - ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЕ КЛЮЧИ!
                const formData = {
                    name: name,
                    phone: phone,
                    car: document.getElementById('car').value.trim() || 'Не указано',
                    service: serviceText,
                    date: document.getElementById('date').value || 'Не указана',
                    message: document.getElementById('message').value.trim() || 'Нет сообщения',
                    timestamp: new Date().toLocaleString('ru-RU'),
                    page_url: window.location.href
                };
                
                console.log('Отправляемые данные:', formData);
                
                // РЕАЛЬНАЯ ОТПРАВКА ЧЕРЕЗ EMAILJS
                const serviceID = 'service_m1tvud4'; // Ваш Service ID
                const templateID = 'template_dugpg8r'; // Ваш Template ID
                const userID = 'iRdncC_hRzCn4lc7b'; // Ваш Public Key
                
                // Проверяем, инициализирован ли EmailJS
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS не загружен');
                }
                
                // Отправляем письмо
                const response = await emailjs.send(
                    serviceID,
                    templateID,
                    formData
                );
                
                console.log('Email успешно отправлен!', response.status, response.text);
                
                // Показываем сообщение об успехе
                showMessage('Заявка успешно отправлена! Мы свяжемся с вами в течение 30 минут', 'success');
                
                // Очищаем форму
                appointmentForm.reset();
                
            } catch (error) {
                console.error('Ошибка отправки формы:', error);
                
                // Подробная информация об ошибке
                let errorMessage = 'Ошибка отправки. ';
                
                if (error.text) {
                    console.error('Текст ошибки:', error.text);
                }
                
                if (error.status) {
                    console.error('Код ошибки:', error.status);
                }
                
                if (error.status === 0) {
                    errorMessage += 'Нет интернет-соединения. ';
                } else if (error.status === 400) {
                    errorMessage += 'Неверные параметры отправки. ';
                } else if (error.status === 401) {
                    errorMessage += 'Ошибка авторизации EmailJS. ';
                } else if (error.status === 500) {
                    errorMessage += 'Ошибка сервера EmailJS. ';
                }
                
                errorMessage += 'Пожалуйста, позвоните нам: 8 (915) 108-88-65';
                
                // Показываем сообщение об ошибке
                showMessage(errorMessage, 'error');
                
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Функция показа сообщений
    function showMessage(text, type) {
        const appointmentForm = document.getElementById('appointmentForm');
        if (!appointmentForm) return;
        
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();
        
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.innerHTML = `
            <div style="
                padding: 15px 20px;
                background: ${type === 'success' ? '#4CAF50' : '#f44336'};
                color: white;
                border-radius: 8px;
                margin-top: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: fadeIn 0.3s ease;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span style="flex: 1;">${text}</span>
                <button class="close-message" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                " onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        appointmentForm.appendChild(message);
        
        setTimeout(() => {
            if (message.parentElement) {
                message.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => message.remove(), 300);
            }
        }, 7000);
    }

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href;
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Добавляем стили для анимации
    function addStyles() {
        if (document.getElementById('dynamic-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            .fa-spin {
                animation: fa-spin 1s infinite linear;
            }
            
            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .form-message {
                animation: fadeIn 0.3s ease;
            }
            
            .close-message:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    addStyles();
});