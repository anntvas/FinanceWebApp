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

    const CURRENCY_API_URL = 'https://api.exchangerate-api.com/v4/latest/RUB';
    let exchangeRates = { RUB: 1, USD: 90, EUR: 100, CNY: 12 };

    async function loadExchangeRates() {
        try {
            const response = await fetch(CURRENCY_API_URL);
            const data = await response.json();
            exchangeRates.USD = 1 / data.rates.USD;
            exchangeRates.EUR = 1 / data.rates.EUR;
            exchangeRates.CNY = 1 / data.rates.CNY;
            console.log('Курсы обновлены:', exchangeRates);
        } catch (error) {
            console.error('Ошибка загрузки курсов:', error);
        }
    }
    loadExchangeRates();

    let operations = {
        income: [
            { category: 'Работа', amount: 0, color: '#4aafff' },
            { category: 'Фриланс', amount: 0, color: '#90EE90' }
        ],
        expense: [
            { category: 'Одежда', amount: 0, color: '#FFA500' },
            { category: 'Продукты', amount: 0, color: '#4CAF50' },
            { category: 'Машина', amount: 0, color: '#F44336' },
            { category: 'Развлечения', amount: 0, color: '#9C27B0' },
            { category: 'Обяз. платежи', amount: 0, color: '#2196F3' }
        ],
        transactions: []
    };

    const incomeNoData = document.getElementById('income-no-data');
    const expenseNoData = document.getElementById('expense-no-data');
    const operationType = document.getElementById('operation-type');
    const operationCategory = document.getElementById('operation-category');
    const operationForm = document.getElementById('operation-form');

    const incomeChart = new Chart(
        document.getElementById('income-chart').getContext('2d'),
        {
            type: 'doughnut',
            data: {
                labels: operations.income.map(i => i.category),
                datasets: [{
                    data: operations.income.map(i => i.amount),
                    backgroundColor: operations.income.map(i => i.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        }
    );

    const expenseChart = new Chart(
        document.getElementById('expense-chart').getContext('2d'),
        {
            type: 'doughnut',
            data: {
                labels: operations.expense.map(i => i.category),
                datasets: [{
                    data: operations.expense.map(i => i.amount),
                    backgroundColor: operations.expense.map(i => i.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        }
    );

    function checkData() {
        incomeNoData.style.display = operations.income.some(i => i.amount > 0) ? 'none' : 'block';
        expenseNoData.style.display = operations.expense.some(i => i.amount > 0) ? 'none' : 'block';
    }

    function updateCategories() {
        operationCategory.innerHTML = '';
        const categories = operationType.value === 'income'
            ? operations.income
            : operations.expense;

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = option.textContent = cat.category;
            operationCategory.appendChild(option);
        });
    }

    function updateOperationsList() {
        const incomeList = document.getElementById('income-operations');
        const expenseList = document.getElementById('expense-operations');

        incomeList.innerHTML = expenseList.innerHTML = '';

        operations.transactions.forEach(t => {
            const li = document.createElement('li');
            li.className = 'operation-item';

            li.innerHTML = `
                <span class="operation-name">${t.name}</span>
                <div><span class="operation-category">${t.category}</span></div>
                <span class="operation-amount ${t.type}-amount">
                    ${t.amount.toFixed(2)} ${t.currency}
                    ${t.currency !== 'RUB' 
                        ? `<span class="operation-amount-rub">(≈${t.amountInRub.toFixed(2)} RUB)</span>` 
                        : ''}
                </span>
            `;

            t.type === 'income'
                ? incomeList.appendChild(li)
                : expenseList.appendChild(li);
        });
    }
    operationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const type = operationType.value;
        const category = operationCategory.value;
        const name = document.getElementById('operation-name').value;
        const amount = parseFloat(document.getElementById('operation-amount').value);
        const currency = document.getElementById('operation-currency').value;
        const amountInRub = amount * exchangeRates[currency];

        const categoryData = operations[type].find(item => item.category === category);
        if (categoryData) categoryData.amount += amountInRub;

        operations.transactions.push({
            type, category, name, amount, currency, amountInRub,
            date: new Date().toISOString()
        });

        incomeChart.data.datasets[0].data = operations.income.map(i => i.amount);
        expenseChart.data.datasets[0].data = operations.expense.map(i => i.amount);
        incomeChart.update();
        expenseChart.update();

        updateOperationsList();
        checkData();
        operationForm.reset();
    });

    updateCategories();
    operationType.addEventListener('change', updateCategories);
    checkData();
});