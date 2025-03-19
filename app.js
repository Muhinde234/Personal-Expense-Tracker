let expenses = [];
let currentEditId = null;

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses(expenseList = expenses) {
  const tableBody = document.querySelector("#expense-table tbody");
  tableBody.innerHTML = "";

  expenseList.forEach(function (expense) {
    const tr = document.createElement("tr");

    const tdDesc = document.createElement("td");
    tdDesc.textContent = expense.description;
    tr.appendChild(tdDesc);

    const tdAmount = document.createElement("td");
    tdAmount.textContent = expense.amount;
    tr.appendChild(tdAmount);

    const tdCategory = document.createElement("td");
    tdCategory.textContent = expense.category;
    tdCategory.setAttribute("data-category", expense.category);
    tr.appendChild(tdCategory);

    const tdDate = document.createElement("td");
    tdDate.textContent = expense.date;
    tr.appendChild(tdDate);

    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function () {
      editExpense(expense.id);
    });
    tdActions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteExpense(expense.id);
    });
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdActions);
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

function addExpense(event) {
  event.preventDefault();

  const description = document.getElementById("expense-description").value;
  const amount = document.getElementById("expense-amount").value;
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;
  const today = new Date().toISOString().split("T")[0];

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }
  if (date > today) {
    alert("Date cannot be in the future.");
    return;
  }

  if (currentEditId) {
    expenses = expenses.map(function (exp) {
      if (exp.id === currentEditId) {
        return { id: currentEditId, description, amount, category, date };
      } else {
        return exp;
      }
    });
  } else {
    const newExpense = {
      id: Date.now(),
      description: description,
      amount: amount,
      category: category,
      date: date
    };
    expenses.push(newExpense);
  }

  saveExpenses();
  renderExpenses();
  clearForm();
}

function editExpense(expenseId) {
  const expenseToEdit = expenses.find(function (exp) {
    return exp.id === expenseId;
  });

  if (expenseToEdit) {
    document.getElementById("expense-description").value = expenseToEdit.description;
    document.getElementById("expense-amount").value = expenseToEdit.amount;
    document.getElementById("expense-category").value = expenseToEdit.category;
    document.getElementById("expense-date").value = expenseToEdit.date;
    document.getElementById("add-expense-btn").textContent = "Update Expense";
    currentEditId = expenseId;
  }
}

function deleteExpense(expenseId) {
  const confirmDelete = confirm("Are you sure you want to delete this expense?");
  if (confirmDelete) {
    expenses = expenses.filter(function (exp) {
      return exp.id !== expenseId;
    });
    saveExpenses();
    renderExpenses();
  }
}

function filterExpenses() {
  const filterCategory = document.getElementById("filter-category").value;
  const filterStartDate = document.getElementById("filter-start-date").value;
  const filterEndDate = document.getElementById("filter-end-date").value;

  let filteredExpenses = expenses;


  if (filterCategory) {
    filteredExpenses = filteredExpenses.filter(function (exp) {
      return exp.category === filterCategory;
    });
  }


  if (filterStartDate) {
    filteredExpenses = filteredExpenses.filter(function (exp) {
      return exp.date >= filterStartDate;
    });
  }

  if (filterEndDate) {
    filteredExpenses = filteredExpenses.filter(function (exp) {
      return exp.date <= filterEndDate;
    });
  }

  renderExpenses(filteredExpenses);
}


document.addEventListener("DOMContentLoaded", function () {

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expense-date").setAttribute("max", today);


  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
  }

  renderExpenses();


  document.getElementById("expense-form").addEventListener("submit", addExpense);
  document.getElementById("filter-btn").addEventListener("click", filterExpenses);
  document.getElementById("reset-filter-btn").addEventListener("click", function () {
    document.getElementById("filter-category").value = "";
    document.getElementById("filter-start-date").value = "";
    document.getElementById("filter-end-date").value = "";
    renderExpenses();
  });
});
