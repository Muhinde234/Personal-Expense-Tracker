let expenses = [];
let currentEditId = null;

const API_URL = "http://localhost/personal_ExpenseTracker/api/expense.php";


async function loadExpenses() {
  try {
    const res = await fetch(API_URL);
    expenses = await res.json();
    renderExpenses();
  } catch (error) {
    alert("Failed to load expenses");
    console.error(error);
  }
}


function renderExpenses(expenseList = expenses) {
  const tableBody = document.querySelector("#expense-table tbody");
  tableBody.innerHTML = "";

  expenseList.forEach((expense) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${expense.description}</td>
      <td>${expense.amount}</td>
      <td data-category="${expense.category}">${expense.category}</td>
      <td>${expense.expense_date || expense.date}</td>
      <td>
        <button onclick="editExpense(${expense.id})">Edit</button>
        <button onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}


function clearForm() {
  document.getElementById("expense-description").value = "";
  document.getElementById("expense-amount").value = "";
  document.getElementById("expense-category").value = "Food";
  document.getElementById("expense-date").value = "";
  document.getElementById("add-expense-btn").textContent = "Add Expense";
  currentEditId = null;
}


async function addExpense(event) {
  event.preventDefault();

  const description = document.getElementById("expense-description").value.trim();
  const amount = document.getElementById("expense-amount").value;
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;

  const today = new Date().toISOString().split("T")[0];

  
  if (!description) {
    alert("Description is required");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  if (date > today) {
    alert("Date cannot be in the future");
    return;
  }

  const payload = {
    description,
    amount,
    category,
    date
  };

  try {
    if (currentEditId) {
      
      payload.id = currentEditId;

      await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
     
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    clearForm();
    loadExpenses();
  } catch (error) {
    alert("Failed to save expense");
    console.error(error);
  }
}


function editExpense(expenseId) {
  const expense = expenses.find((exp) => exp.id === expenseId);

  if (!expense) return;

  document.getElementById("expense-description").value = expense.description;
  document.getElementById("expense-amount").value = expense.amount;
  document.getElementById("expense-category").value = expense.category;
  document.getElementById("expense-date").value =
    expense.expense_date || expense.date;

  document.getElementById("add-expense-btn").textContent = "Update Expense";
  currentEditId = expenseId;
}


async function deleteExpense(expenseId) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: expenseId })
    });

    loadExpenses();
  } catch (error) {
    alert("Failed to delete expense");
    console.error(error);
  }
}


function filterExpenses() {
  const category = document.getElementById("filter-category").value;
  const startDate = document.getElementById("filter-start-date").value;
  const endDate = document.getElementById("filter-end-date").value;

  let filtered = [...expenses];

  if (category) {
    filtered = filtered.filter(exp => exp.category === category);
  }

  if (startDate) {
    filtered = filtered.filter(exp =>
      (exp.expense_date || exp.date) >= startDate
    );
  }

  if (endDate) {
    filtered = filtered.filter(exp =>
      (exp.expense_date || exp.date) <= endDate
    );
  }

  renderExpenses(filtered);
}


document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expense-date").setAttribute("max", today);

  loadExpenses();

  document.getElementById("expense-form").addEventListener("submit", addExpense);
  document.getElementById("filter-btn").addEventListener("click", filterExpenses);
  document.getElementById("reset-filter-btn").addEventListener("click", () => {
    document.getElementById("filter-category").value = "";
    document.getElementById("filter-start-date").value = "";
    document.getElementById("filter-end-date").value = "";
    renderExpenses();
  });
});
