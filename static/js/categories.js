document.addEventListener('DOMContentLoaded', () => {
    // Функционал боковой панели (перенесено из sidebar.js)
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const closeBtn = document.querySelector('.sidebar-close');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.add('visible');
        overlay.classList.add('visible');
    });

    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    function closeSidebar() {
        sidebar.classList.remove('visible');
        overlay.classList.remove('visible');
    }

    // Функционал модального окна и категорий
    const addCategoryBtn = document.querySelector('.add-category-btn');
    const modal = document.getElementById('category-modal');
    const modalClose = document.querySelector('.modal-close');
    const addCategoryForm = document.getElementById('add-category-form');

    // Открытие модального окна
    addCategoryBtn.addEventListener('click', () => {
        modal.classList.add('visible');
    });

    // Закрытие модального окна
    modalClose.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });

    // Обработка формы добавления категории
    addCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('category-type').value;
        const name = document.getElementById('category-name').value.trim();
        const color = document.getElementById('category-color').value;

        if (!name) return;

        addCategory(type, name, color);

        document.getElementById('category-name').value = '';
        modal.classList.remove('visible');
    });

    // Функция добавления категории
    function addCategory(type, name, color) {
        const categoriesList = type === 'income'
            ? document.getElementById('income-categories')
            : document.getElementById('expense-categories');

        const id = Date.now();

        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.id = id;

        categoryItem.innerHTML = `
            <span class="category-color" style="background: ${color};"></span>
            <span class="category-name">${name}</span>
            <button class="category-delete">Удалить</button>
        `;

        categoriesList.appendChild(categoryItem);

        categoryItem.querySelector('.category-delete').addEventListener('click', () => {
            removeCategory(categoryItem);
        });
    }

    // Функция удаления категории
    function removeCategory(element) {
        element.classList.add('removing');
        setTimeout(() => {
            element.remove();
        }, 300);
    }

    // Инициализация обработчиков удаления
    document.querySelectorAll('.category-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            removeCategory(this.closest('.category-item'));
        });
    });
});