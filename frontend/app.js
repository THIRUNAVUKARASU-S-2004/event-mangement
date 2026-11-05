const API_URL = "http://localhost:3000";

const form = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const toggleLink = document.getElementById("toggle-link");
const toggleMsg = document.getElementById("toggle-msg");
const messageEl = document.getElementById("message");
const authCard = document.getElementById("auth-card");
const homeCard = document.getElementById("home-card");
const userEmailEl = document.getElementById("user-email");
const homeMessageEl = document.getElementById("home-message");
const logoutBtn = document.getElementById("logout-btn");

let isLoginMode = true;
let credentials = null;

// Toggle between Login and Register
toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    formTitle.textContent = isLoginMode ? "Login" : "Register";
    submitBtn.textContent = isLoginMode ? "Login" : "Register";
    toggleMsg.textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
    toggleLink.textContent = isLoginMode ? "Register" : "Login";

    // Show/hide register-only fields
    document.querySelectorAll(".register-only").forEach((el) => {
        el.classList.toggle("hidden", isLoginMode);
    });

    // Toggle required attribute on register-only inputs
    document.getElementById("name").required = !isLoginMode;
    document.getElementById("age").required = !isLoginMode;

    clearMessage();
});

logoutBtn.addEventListener("click", logout);

// Handle form submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();

    if (!email || !password) {
        showMessage("Please fill in both fields", "error");
        return;
    }

    if (!isLoginMode && (!name || !age)) {
        showMessage("Please fill in name and age", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Please wait...";

    try {
        if (isLoginMode) {
            await login(email, password);
        } else {
            await register(name, email, age, password);
        }
    } catch (err) {
        showMessage(err.message || "Something went wrong", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isLoginMode ? "Login" : "Register";
    }
});

async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // sends & receives cookies
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
    }

    const data = await res.json();

    // Backend logout requires email + password, so keep them in memory only.
    credentials = { email, password };

    userEmailEl.textContent = data.user.email;
    clearMessage();
    homeMessageEl.className = "message";
    homeMessageEl.textContent = "";

    authCard.classList.add("hidden");
    homeCard.classList.remove("hidden");
}

async function logout() {
    if (!credentials) {
        return;
    }

    logoutBtn.disabled = true;
    logoutBtn.textContent = "Logging out...";

    try {
        const res = await fetch(`${API_URL}/auth/logout`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(credentials),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Logout failed");
        }

        credentials = null;
        homeCard.classList.add("hidden");
        authCard.classList.remove("hidden");
        form.reset();
        clearMessage();
    } catch (err) {
        homeMessageEl.textContent = err.message || "Something went wrong";
        homeMessageEl.className = "message error";
    } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = "Logout";
    }
}

async function register(name, email, age, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, age, password }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
    }

    showMessage("Account created! You can now login.", "success");

    // Switch to login mode after successful registration
    setTimeout(() => {
        isLoginMode = true;
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        toggleMsg.textContent = "Don't have an account?";
        toggleLink.textContent = "Register";
    }, 1500);
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

function clearMessage() {
    messageEl.textContent = "";
    messageEl.className = "message";
}

