// Root URL and API Key for OpenWeatherMap API
var weatherAPIRootUrl = "https://api.openweathermap.org";
var weatherAPIKey = "5a8a8411ffa14b0fd2e6fedbb7e4df51";

// Initialize an empty array for storing search history
var searchHistory = [];

// DOM elements
var nameState = document.getElementById("today__name");
var searchformEl = document.getElementById("search__form");
var searchInputEl = document.getElementById("autoSizingInput");
var forecastContainer = document.getElementById("forecast__name");
var searchHistoryContainer = document.getElementById("history");

// Event listener for handling the search form submission
searchformEl.addEventListener("submit", testing);

// Function to handle the search form submission
function testing() {
    event.preventDefault();
    if (!searchInputEl.value) {
        return;
    }
    var searchTerm = searchInputEl.value.trim();
    // Construct the API URL with the search term
    var apiUrl = `${weatherAPIRootUrl}/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${weatherAPIKey}`;
    // Fetching geographical data from the API
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert("Location not found");
            } else {
                // Update the DOM with the received data
                nameState.textContent = `${data[0].name}, ${data[0].state}`;
                getWeather(data[0]);
                appendToHistory(searchTerm);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

// Function to fetch weather data for a specific location
function getWeather(data) {
    var { lat, lon } = data;
    var city = data.name;
    // Construct the API URL to fetch weather data
    var apiUrl = `${weatherAPIRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`;
    // Fetching weather data from the API
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            // Rendering weather and forecast data
            renderWeather(city, data.list[0]);
            renderForcast(data.list);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function renderWeather(city, weather) {
    var date = dayjs().format("M/D/YYYY");
    nameState.textContent += "  (" + date + ")" 
    console.log(date)

    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var heading = document.createElement("h2");
    var weatherIcon = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");

    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    heading.setAttribute("class", "h3 card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    weatherIcon.setAttribute("class", "weather-img");
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    nameState.append(card);

}

function renderForcast(dailyForecast) {
    const startDt = dayjs().add(1, "day").startOf("day").unix();
    const endDt = dayjs().add(6, "day").startOf("day").unix();

    const headingCol = document.createElement("div");
    headingCol.classList.add("col-12");

    const heading = document.createElement("h4");
    heading.textContent = "5-Day Forecast";

    headingCol.appendChild(heading);

    forecastContainer.innerHTML = "";
    forecastContainer.appendChild(headingCol);

    for (let i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                renderForecastCard(dailyForecast[i]);
            }
        }
    }
}


function renderForecastCard(forecast) {
    const { weather, main, wind, dt_txt } = forecast;
    const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
    const iconDescription = weather[0].description;
    const tempF = main.temp;
    const humidity = main.humidity;
    const windMph = wind.speed;

    const col = document.createElement("div");
    col.classList.add("col-md");

    const card = document.createElement("div");
    card.classList.add("card", "bg-info", "text-white");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = dayjs(dt_txt).format("M/D/YYYY");

    const weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    weatherIcon.classList.add("weather-icon");

    const tempEl = document.createElement("p");
    tempEl.classList.add("card-text", "temp-text");
    tempEl.textContent = `Temp: ${tempF} °F`;

    const windEl = document.createElement("p");
    windEl.classList.add("card-text", "wind-text");
    windEl.textContent = `Wind: ${windMph} MPH`;

    const humidityEl = document.createElement("p");
    humidityEl.classList.add("card-text", "humidity-text");
    humidityEl.textContent = `Humidity: ${humidity} %`;

    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
    card.append(cardBody);
    col.append(card);
    forecastContainer.append(col);
}



function initSearchHistory() {
    var storedHistory = localStorage.getItem("search-history");
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

function renderSearchHistory() {
    searchHistoryContainer.innerHTML = " ";

    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("aria-controls", "today forecast");
        btn.classList.add("history-btn", "btn-history");


        btn.setAttribute("data-search", searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
}

function appendToHistory(search) {

    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    renderSearchHistory();
}

function handleSearchHistoryClick(button) {
    if (!button.target.matches(".btn-history")) {
        console.log("button click does not match")
        return;
    }
    console.log("button click does match")
    var btn = button.target;
    var search = btn.getAttribute("data-search");
    console.log(search)
    testing1(search);
}

function testing1 (search) {
    event.preventDefault()
    var apiUrl = `${weatherAPIRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`
    console.log(apiUrl)
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)  
            if (!data[0]) {
                alert("Location not found");
            } else {
                console.log(`Lat: ${data[0].lat}`)
                console.log(`Long: ${data[0].lon}`)
                console.log(`Name and State: ${data[0].name}, ${data[0].state}`)
                nameState.textContent = `${data[0].name}, ${data[0].state}`
                getWeather(data[0]);
                appendToHistory(search);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

searchHistoryContainer.addEventListener("click", handleSearchHistoryClick);


initSearchHistory();