const API_KEY = "your_api_key_here";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const historyList = document.getElementById("history");

// Elements to update
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

// =========================
// FETCH WEATHER
// =========================
async function getWeather(city) {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        showLoading();
        hideError();

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found");
            }
            throw new Error("Network error. Try again.");
        }

        const data = await response.json();
        displayWeather(data);
        saveToHistory(city);

    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

// =========================
// DISPLAY WEATHER
// =========================
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed} m/s`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;

    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherDisplay.classList.remove("hidden");
}

// =========================
// LOADING + ERROR
// =========================
function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}

function hideError() {
    error.classList.add("hidden");
}

// =========================
// LOCAL STORAGE (HISTORY)
// =========================
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    // Remove duplicate
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());

    // Add to beginning
    history.unshift(city);

    // Keep only last 5
    history = history.slice(0, 5);

    localStorage.setItem("weatherHistory", JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    historyList.innerHTML = "";

    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.classList.add("history-item");

        li.addEventListener("click", () => {
            getWeather(city);
        });

        historyList.appendChild(li);
    });
}

// =========================
// EVENTS
// =========================
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
        cityInput.value = "";
    }
});

// =========================
// INIT
// =========================
loadHistory();