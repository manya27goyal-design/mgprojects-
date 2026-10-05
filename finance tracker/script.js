const openBtn = document.getElementById("open-modal");
const closeBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-modal");
const modal = document.getElementById("modal-overlay");

const form = document.getElementById("transaction-form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const income = document.getElementById("income");
const category = document.getElementById("category");
const date = document.getElementById("date");
const notes = document.getElementById("notes");

const transactionList = document.getElementById("transaction-list");
const transactionFilter = document.getElementById("transaction-filter");
const chartPeriod = document.getElementById("chart-period");
const chartCanvas = document.getElementById("spendingChart");

const balance = document.querySelector(".balance-card h2");
const totalIncome = document.querySelector(".income-card h2");
const totalExpense = document.querySelector(".expense-card h2");
const savings = document.querySelector(".savings-card h2");
const balanceChange = document.getElementById("balance-change");
const incomeChange = document.getElementById("income-change");
const expenseChange = document.getElementById("expense-change");

const modalTitle = document.getElementById("modal-title");
const savingsRateElement=document.getElementById("savings-rate");
const editBudgetBtn = document.getElementById("edit-budget-btn");
const budgetModal = document.getElementById("budget-modal-overlay");
const closeBudgetModal = document.getElementById("close-budget-modal");
const cancelBudgetModal = document.getElementById("cancel-budget-modal");
const budgetForm = document.getElementById("budget-form");

let spendingChart = null;
let editingId = null;
let transactions = [];
const DEFAULT_BUDGETS = {
    Food: 5000,
    Transport: 3000,
    Shopping: 5000,
    Entertainment: 3000,
    miscellaneous: 2000
};
let budgets = { ...DEFAULT_BUDGETS };

function formatINR(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

// Prevents user text from being interpreted as HTML (XSS)
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// "YYYY-MM-DD" parsed as local time (new Date(str) would use UTC)
function parseDate(dateString) {
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function todayString() {
    const t = new Date();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${t.getFullYear()}-${mm}-${dd}`;
}

function saveBudgets() {
    localStorage.setItem("budgets", JSON.stringify(budgets));
}

function loadBudgets() {
    const saved = localStorage.getItem("budgets");
    if (saved) {
        budgets = { ...DEFAULT_BUDGETS, ...JSON.parse(saved) };
    }
}

function setGreeting() {
    const hour = new Date().getHours();
    const part = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
    document.querySelector(".welcome-section h1").textContent = `Good ${part}, Manya`;
}

openBtn.addEventListener("click", function () {
    editingId = null;
    form.reset();
    expense.checked = true;
    date.value = todayString();
    modalTitle.textContent = "Add Transaction";
    modal.classList.add("active");
});

closeBtn.addEventListener("click", function () {
    modal.classList.remove("active");
});

cancelBtn.addEventListener("click", function () {
    modal.classList.remove("active");
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!(Number(amount.value) > 0)) {
        alert("Please enter an amount greater than 0.");
        return;
    }
    if (!date.value) {
        alert("Please choose a date.");
        return;
    }
    if (editingId === null) {
        const transaction = {
            id: Date.now(),
            amount: Number(amount.value),
            type: expense.checked ? "Expense" : "Income",
            category: category.value,
            date: date.value,
            notes: notes.value
        };
        transactions.push(transaction);
        saveTransactions();
    }
    else {
        const transaction = transactions.find(function (transaction) {
            return transaction.id === editingId;
        });
        if (transaction) {
            transaction.amount = Number(amount.value);
            transaction.type = expense.checked ? "Expense": "Income";
            transaction.category = category.value;
            transaction.date = date.value;
            transaction.notes = notes.value;
            saveTransactions();
        }
    }
    renderTransactions();
    updateSummary();
    updateBudgets();
    updateChart();
    modal.classList.remove("active");
    form.reset();
    expense.checked = true;
    editingId = null;
    modalTitle.textContent = "Add Transaction";
});
 transactionFilter.addEventListener("change", function () {
    renderTransactions();
});

chartPeriod.addEventListener("change", function () {
    updateChart();
});

editBudgetBtn.addEventListener("click", function () {
    Object.keys(budgetInputs).forEach(function (name) {
        budgetInputs[name].value = budgets[name];
    });
    budgetModal.classList.add("active");
});

closeBudgetModal.addEventListener("click", function () {
    budgetModal.classList.remove("active");
});

cancelBudgetModal.addEventListener("click", function () {
    budgetModal.classList.remove("active");
});

const budgetInputs = {
    Food: document.getElementById("food-budget"),
    Transport: document.getElementById("transport-budget"),
    Shopping: document.getElementById("shopping-budget"),
    Entertainment: document.getElementById("entertainment-budget"),
    miscellaneous: document.getElementById("miscellaneous-budget")
};

budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const updated = {};
    for (const name of Object.keys(budgetInputs)) {
        const value = Number(budgetInputs[name].value);
        if (!(value > 0)) {
            alert("Each budget must be greater than 0.");
            return;
        }
        updated[name] = value;
    }
    budgets = updated;
    saveBudgets();
    updateBudgets();
    budgetModal.classList.remove("active");
});


function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
}

function isCurrentMonth(dateString) {
    const transactionDate = parseDate(dateString);
    const today = new Date();

    return (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
    );
}

function isLastMonth(dateString) {
    const transactionDate = parseDate(dateString);
    const today = new Date();
    let lastMonth = today.getMonth() - 1;
    let year = today.getFullYear();
    if (lastMonth < 0) {
        lastMonth = 11;
        year--;
    }
    return (
        transactionDate.getMonth() === lastMonth &&
        transactionDate.getFullYear() === year
    );
}

function calculatePercentageChange(current, previous) {
    if (previous === 0) {
        return 0;
    }
    return ((current - previous) / previous) * 100;
}

function updateChangeStyle(element, percentage) {
    element.classList.remove("positive", "negative");
    if (percentage >= 0) {
        element.classList.add("positive");
    } else {
        element.classList.add("negative");
    }
}

function updateSummary() {
    let incomeTotal = 0;
    let expenseTotal = 0;
    let previousIncome = 0;
    let previousExpense = 0;
    let allTimeBalance = 0;
    transactions.forEach(function (transaction) {
        allTimeBalance += transaction.type === "Income" ? transaction.amount : -transaction.amount;
        if (isCurrentMonth(transaction.date)) {
            if (transaction.type === "Income") {
                incomeTotal += transaction.amount;
            } else {
                expenseTotal += transaction.amount;
            }
        } else if (isLastMonth(transaction.date)) {
            if (transaction.type === "Income") {
                previousIncome += transaction.amount;
            } else {
                previousExpense += transaction.amount;
            }
        }
    });
    const currentBalance = incomeTotal - expenseTotal;
    const incomePercentage =
        calculatePercentageChange(incomeTotal, previousIncome);
    const expensePercentage =
        calculatePercentageChange(expenseTotal, previousExpense);
    totalIncome.textContent = formatINR(incomeTotal);
    totalExpense.textContent = formatINR(expenseTotal);
    balance.textContent = formatINR(allTimeBalance);
    savings.textContent = formatINR(Math.max(currentBalance, 0));
    let savingsRate = 0;
    if (incomeTotal > 0) {
        savingsRate = (currentBalance / incomeTotal) * 100;
    }
    savingsRateElement.textContent =
        `${savingsRate.toFixed(1)}% savings rate`;
    incomeChange.textContent =
        `${incomePercentage >= 0 ? "↑" : "↓"} ${Math.abs(incomePercentage).toFixed(1)}% from last month`;
    expenseChange.textContent =
        `${expensePercentage >= 0 ? "↑" : "↓"} ${Math.abs(expensePercentage).toFixed(1)}% from last month`;

    balanceChange.textContent =
        `${currentBalance >= 0 ? "↑" : "↓"} ${formatINR(Math.abs(currentBalance))} this month`;
    updateChangeStyle(incomeChange, incomePercentage);
    updateChangeStyle(expenseChange, -expensePercentage);
    updateChangeStyle(balanceChange, currentBalance);
}

function getCategoryExpenses() {
    const categoryTotals = {};
    transactions.forEach(function (transaction) {
        if (transaction.type === "Expense" &&
            isCurrentMonth(transaction.date)) {
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += transaction.amount;
        }
    });
    return categoryTotals;
}

function updateChart() {
    const selectedPeriod = chartPeriod.value;
    let categoryTotals = {};
    transactions.forEach(function (transaction) {
        if (transaction.type !== "Expense") {
            return;
        }
        const transactionDate = parseDate(transaction.date);
        const today = new Date();
        let includeTransaction = false;
        if (selectedPeriod === "current") {
            includeTransaction = isCurrentMonth(transaction.date);
        } else if (selectedPeriod === "previous") {
            includeTransaction = isLastMonth(transaction.date);
        } else if (selectedPeriod === "three-months") {
            const threeMonthsAgo = new Date(
                today.getFullYear(),
                today.getMonth() - 2,1
            );
            includeTransaction = transactionDate >= threeMonthsAgo;
        }
        if (includeTransaction) {
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += transaction.amount;
        }
    });
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
        if (labels.length === 0) {
    if (spendingChart) {
        spendingChart.destroy();
        spendingChart = null;
    }
    const ctx = chartCanvas.getContext("2d");
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    return;
}
    if (spendingChart) {
        spendingChart.destroy();
    }
    spendingChart = new Chart(chartCanvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
            data: values,

            backgroundColor: [
                "#9e35db", 
                "#A9D7FF",
                "#FF9E25", 
                "#dbe939", 
                "#17354E",
                "#E35D6A"
            ],

            borderColor: "#FFFFFF",
            borderWidth: 3,
            hoverOffset: 12
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 18
                    }
                },
    tooltip: {
        callbacks: {
            label: function(context) {
                return `${context.label}: ${formatINR(context.raw)}`;
            }
        }
    }
}
        }
    });
}

function updateBudgets() {
    const categoryTotals = getCategoryExpenses();
    Object.keys(budgets).forEach(function (categoryName) {
        const spent = categoryTotals[categoryName] || 0;
        const budget = budgets[categoryName];
        const percentage = (spent / budget) * 100;
        const budgetItem = document.querySelector(
            `.budget-item[data-category="${categoryName}"]`
        );
        if (!budgetItem) {
            return;
        }
        const amountText = budgetItem.querySelector(".budget-amount");
        const progress = budgetItem.querySelector(".progress");
        amountText.textContent =
            `${formatINR(spent)} / ${formatINR(budget)}`;
        progress.style.width =
            `${Math.min(percentage, 100)}%`;
        if (percentage >= 100) {
            budgetItem.classList.add("over-budget");
            budgetItem.classList.remove("near-budget");
        }
        else if (percentage >= 80) {
            budgetItem.classList.add("near-budget");
            budgetItem.classList.remove("over-budget");
        }
        else {
            budgetItem.classList.remove("near-budget");
            budgetItem.classList.remove("over-budget");
        }
    });
}

function renderTransactions() {
    transactionList.innerHTML = "";
    const filterValue = transactionFilter.value;
    const filteredTransactions = transactions.filter(function (transaction) {
        if (filterValue === "all") {
            return true;
        }
        return (
            transaction.type === filterValue ||
            transaction.category === filterValue
        );

    });
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `
            <p class="no-transactions">
                No transactions found.
            </p>
        `;
        return;
    }
   const recentTransactions = filteredTransactions.slice(-5).reverse();
    recentTransactions.forEach(function (transaction) {
        const newTransaction = document.createElement("div");
        newTransaction.className = "transaction";
        newTransaction.dataset.id = transaction.id;
        newTransaction.innerHTML = `
            <div class="transaction-icon">
                <i class="fa-solid fa-wallet"></i>
            </div>
            <div class="transaction-details">
                <h3>
                    ${escapeHtml(transaction.notes || transaction.category)}
                </h3>
                <p>
                    ${escapeHtml(transaction.category)} • ${escapeHtml(transaction.date)}
                </p>
            </div>
            <div class="transaction-actions">
                <span class="${
                    transaction.type === "Income" ? "income": "expense"
                }">
                    ${
                        transaction.type === "Income"? "+": "-"
                    }
                    ${formatINR(transaction.amount)}
                </span>
                <button
                    class="edit-btn"
                    data-id="${transaction.id}"
                    title="Edit transaction">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                    title="Delete transaction">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        transactionList.appendChild(newTransaction);
    });
}


transactionList.addEventListener("click", function (event) {
    const editButton = event.target.closest(".edit-btn");
    if (editButton) {
        const id = Number(editButton.dataset.id);
        editTransaction(id);
        return;
    }
    const deleteButton = event.target.closest(".delete-btn");
    if (deleteButton) {
        const id = Number(deleteButton.dataset.id);
        deleteTransaction(id);
    }
});


function editTransaction(id) {
    const transaction = transactions.find(function (transaction) {
        return transaction.id === id;
    });
    if (!transaction) {
        return;
    }
    editingId = id;
    amount.value = transaction.amount;
    category.value = transaction.category;
    date.value = transaction.date;
    notes.value = transaction.notes;
    if (transaction.type === "Income") {
        income.checked = true;
    }
    else {
        expense.checked = true;
    }
    modalTitle.textContent = "Edit Transaction";
    modal.classList.add("active");
}

function deleteTransaction(id) {
    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });
    saveTransactions();
    renderTransactions();
    updateSummary();
    updateBudgets();
    updateChart();
}



loadTransactions();
loadBudgets();
setGreeting();
renderTransactions();
updateSummary();
updateBudgets();
updateChart();