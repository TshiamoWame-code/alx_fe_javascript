// Quotes array to hold quote objects
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

document.getElementById("exportBtn").addEventListener("click", exportQuotes);

// Function to show a random quote
function showRandomQuote() {
    const quoteBox = document.getElementById("quoteBox");
    if (quotes.length === 0) {
        quoteBox.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteBox.innerHTML = `"${quote.text}" - (${quote.category})`;
}

// Function to create the form to add a new quote
function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");

    const form = document.createElement("form");
    form.id = "addQuoteForm";

    const quoteLabel = document.createElement("label");
    quoteLabel.innerText = "Quote:";
    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.required = true;
    quoteInput.placeholder = "Enter quote text";

    const categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Category:";
    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.required = true;
    categoryInput.placeholder = "Enter category";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.innerText = "Add Quote";

    form.appendChild(quoteLabel);
    form.appendChild(quoteInput);
    form.appendChild(document.createElement("br"));

    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(document.createElement("br"));

    form.appendChild(submitBtn);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const newQuote = quoteInput.value.trim();
        const newCategory = categoryInput.value.trim();

        if (newQuote && newCategory) {
            quotes.push({ text: newQuote, category: newCategory });
            quoteInput.value = "";
            categoryInput.value = "";
            alert("Quote added!");
        }
    });

    formContainer.appendChild(form);
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    showRandomQuote();
    createAddQuoteForm();

    const refreshBtn = document.getElementById("newQuoteBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", showRandomQuote);
    }
});
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
