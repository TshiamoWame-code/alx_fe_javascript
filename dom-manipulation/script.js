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

function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2); // Pretty JSON
    const blob = new Blob([dataStr], { type: "application/json" }); // Create file-like object
    const url = URL.createObjectURL(blob); // Generate a download link
}

// Populate dropdown with unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Display quotes filtered by category
function filterQuote() {
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(filtered);
}

// Render quotes on the page
function displayQuotes(quoteList) {
  quoteDisplay.innerHTML = "";
  quoteList.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote";
    div.innerHTML = `<strong>${q.category}:</strong> ${q.text}`;
    quoteDisplay.appendChild(div);
  });
}

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

  const API_URL = "https://example.com/api/quotes";
let = JSON.parse(localStorage.getItem("quotes")) || [];

// Fetch from server
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    const serverQuotes = await res.json();
    return serverQuotes;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

// Post a quote to server
async function postQuoteToServer(quote) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    console.log("Posted to server:", quote);
  } catch (error) {
    console.error("Post error:", error);
  }
}

// Conflict resolution: latest `updatedAt` wins
function resolveConflicts(local, server) {
  const merged = [...local];
  server.forEach(serverQuote => {
    const index = merged.findIndex(q => q.id === serverQuote.id);
    if (index === -1) {
      merged.push(serverQuote); // New from server
    } else {
      const localQuote = merged[index];
      if (new Date(serverQuote.updatedAt) > new Date(localQuote.updatedAt)) {
        merged[index] = serverQuote; // Server wins
      }
    }
  });
  return merged;
}

// Save to localStorage and re-render
function updateLocalStorage(updatedQuotes) {
  quotes = updatedQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));
  displayQuotes(quotes);
}

// Sync quotes from server with local
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const mergedQuotes = resolveConflicts(quotes, serverQuotes);
  updateLocalStorage(mergedQuotes);
  notify("Quotes synced with server.");
}

// Periodic sync every 60 seconds
setInterval(syncQuotes, 60000);

// Add new quote
async function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  const newQuote = {
    id: Date.now().toString(),
    text,
    category,
    updatedAt: new Date().toISOString()
  };

  quotes.push(newQuote);
  updateLocalStorage(quotes);
  await postQuoteToServer(newQuote);
  notify("Quote added and posted to server.");
}

// Simple notification
function notify(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style = "background: #dff0d8; padding: 10px; margin: 10px 0;";
  document.body.insertBefore(div, document.body.firstChild);
  setTimeout(() => div.remove(), 3000);
}
