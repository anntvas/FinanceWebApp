document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const closeBtn = document.querySelector('.sidebar-close');

    // Элементы профиля
    const usernameInput = document.getElementById('username');
    const birthdayInput = document.getElementById('birthday');
    const profileName = document.querySelector('.profile-name');
    const profileBirthday = document.querySelector('.profile-birthday');
    const saveBtn = document.querySelector('.save-btn');

    // Открытие панели
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.add('visible');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    });

    // Закрытие панели
    function closeSidebar() {
        sidebar.classList.remove('visible');
        overlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Обновление данных профиля в реальном времени
    usernameInput.addEventListener('input', function() {
        profileName.textContent = this.value || 'Иван Иванов';
    });

    birthdayInput.addEventListener('change', function() {
        if (this.value) {
            const date = new Date(this.value);
            const formattedDate = date.toLocaleDateString('ru-RU');
            profileBirthday.textContent = `Дата рождения: ${formattedDate}`;
        }
    });

    // Сохранение данных профиля
    saveBtn.addEventListener('click', function() {
        // Здесь можно добавить AJAX-запрос для сохранения данных
        alert('Изменения сохранены!');

        // Форматирование даты для отображения
        if (birthdayInput.value) {
            const date = new Date(birthdayInput.value);
            const formattedDate = date.toLocaleDateString('ru-RU');
            profileBirthday.textContent = `Дата рождения: ${formattedDate}`;
        }
    });
});