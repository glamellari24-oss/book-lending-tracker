"use strict";
const BookLibrary = (() => {
  const key = "book-lending-tracker-v1";
  const genres = ["Fiction", "Science", "History", "Technology"];
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value+"T12:00:00").getTime()) && new Date(value+"T12:00:00").getFullYear() > 0;
  let loans = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(saved)) loans = saved.filter(x => x && typeof x.id === "string" && ["title","author","borrower"].every(k => typeof x[k] === "string" && x[k].trim()) && validDate(x.due) && genres.includes(x.genre));
  } catch (_) {}
  function save() {
    try { localStorage.setItem(key, JSON.stringify(loans)); return true; }
    catch (_) { return false; }
  }
  function add(loan) { loans.push({...loan,id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`}); return save(); }
  function remove(id) { loans = loans.filter(loan => loan.id !== id); return save(); }
  return { today, validDate, add, remove, all: () => loans.slice() };
})();
const LoanApp = (() => {
  const form = document.getElementById("loan-form");
  const tbody = document.getElementById("loans");
  const message = document.getElementById("message");
  function error(name, text) {
    document.getElementById(`${name}-error`).textContent = text;
    form.elements[name].setAttribute("aria-invalid", String(Boolean(text)));
  }
  function validate(name) {
    const field = form.elements[name];
    let text = "";
    if (!field.value.trim()) text = name === "due" ? "Please select a due date." : `Please enter the ${name}.`;
    else if (name === "genre" && !["Fiction","Science","History","Technology"].includes(field.value)) text = "Please select a valid genre.";
    else if (name === "due" && (!BookLibrary.validDate(field.value) || field.validity.badInput)) text = "Please enter a valid date.";
    else if (field.maxLength > 0 && field.value.trim().length > field.maxLength) text = `Use at most ${field.maxLength} characters.`;
    error(name, text);
    return !text;
  }
  function render() {
    const loans = BookLibrary.all();
    tbody.replaceChildren();
    document.getElementById("total").textContent = loans.length;
    document.getElementById("overdue").textContent = loans.filter(x => x.due < BookLibrary.today()).length;
    if (!loans.length) {
      const row = tbody.insertRow(); const cell = row.insertCell();
      cell.colSpan = 7; cell.className = "empty";
      cell.textContent = "No loans yet. Add your first book above.";
    }
    loans.forEach(loan => {
      const row = tbody.insertRow();
      [loan.title, loan.author, loan.borrower, loan.due, loan.genre].forEach(value => { row.insertCell().textContent = value; });
      const late = loan.due < BookLibrary.today();
      const badge = document.createElement("span"); badge.className = `badge${late ? " late" : ""}`;
      badge.textContent = late ? "Overdue" : "On loan"; row.insertCell().append(badge);
      const button = document.createElement("button"); button.type = "button"; button.className = "button secondary";
      button.textContent = "Return"; button.setAttribute("aria-label", `Mark ${loan.title} as returned`);
      button.addEventListener("click", () => {
        const saved = BookLibrary.remove(loan.id); render();
        message.textContent = saved ? "Book marked as returned." : "Book returned for this session. Browser storage is unavailable.";
      });
      row.insertCell().append(button);
    });
  }
  function init() {
    ["title","author","borrower","due","genre"].forEach(name => {
      form.elements[name].addEventListener("input", () => { if(form.elements[name].getAttribute("aria-invalid") === "true") validate(name); });
    });
    form.addEventListener("submit", event => {
      event.preventDefault(); message.textContent = "";
      const results = ["title","author","borrower","due","genre"].map(name => ({name, valid:validate(name)}));
      const invalid = results.find(result => !result.valid);
      if (invalid) { form.elements[invalid.name].focus(); return; }
      const loan = Object.fromEntries(new FormData(form));
      ["title","author","borrower"].forEach(name => loan[name] = loan[name].trim());
      const saved = BookLibrary.add(loan); form.reset(); render(); form.elements.title.focus();
      message.textContent = saved ? "Loan added successfully." : "Loan added for this session. Browser storage is unavailable.";
    });
    window.addEventListener("focus", render);
    setInterval(render, 60000);
    render();
  }
  return { init };
})();
LoanApp.init();
