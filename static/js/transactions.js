document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    function openSidebar() {
        sidebar.classList.add('visible');
        sidebarOverlay.classList.add('visible');
        document.body.classList.add('no-scroll');
    }

    function closeSidebar() {
        sidebar.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
        document.body.classList.remove('no-scroll');
    }

    sidebarToggles.forEach(toggle => toggle.addEventListener('click', openSidebar));
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    function renderCategories() {
        const incomeContainer = document.getElementById('income-categories');
        const expenseContainer = document.getElementById('expense-categories');

        renderCategoryGroup(operations.income, incomeContainer);
        renderCategoryGroup(operations.expense, expenseContainer);
    }

    function renderCategoryGroup(categories, container) {
        container.innerHTML = '';

        categories.forEach(category => {
            const totalAmount = category.operations.reduce((sum, op) => sum + op.amount, 0);

            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-header">
                    <div class="category-color" style="background: ${category.color}"></div>
                    <div class="category-name">${category.category}</div>
                    <div class="category-total">${totalAmount} ₽</div>
                </div>
                <div class="chart-container">
                    <canvas class="category-chart"></canvas>
                </div>
                <div class="operations-list"></div>
            `;

            container.appendChild(card);

            const ctx = card.querySelector('.category-chart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: category.operations.map(op => op.name),
                    datasets: [{
                        data: category.operations.map(op => op.amount),
                        backgroundColor: generateColorVariants(category.color, category.operations.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw} ₽`;
                                }
                            }
                        }
                    }
                }
            });

            const operationsList = card.querySelector('.operations-list');
            category.operations.forEach(op => {
                const opElement = document.createElement('div');
                opElement.className = 'operation-item';
                opElement.innerHTML = `
                    <span class="operation-name">${op.name}</span>
                    <span class="operation-date">${formatDate(op.date)}</span>
                    <span class="operation-amount">${op.amount} ₽</span>
                `;
                operationsList.appendChild(opElement);
            });
        });
    }

    function generateColorVariants(baseColor, count) {
        // Генерируем варианты цвета на основе основного
        const variants = [];
        for (let i = 0; i < count; i++) {
            variants.push(lightenColor(baseColor, i * 10));
        }
        return variants;
    }

    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1)}`;
    }

    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    renderCategories();
});