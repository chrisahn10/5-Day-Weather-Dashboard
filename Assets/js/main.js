var weatherAPIRootUrl = "https://api.openweathermap.org"
var weatherAPIKey = "5a8a8411ffa14b0fd2e6fedbb7e4df51"
var searchHistory = []

var nameState = document.getElementById("today__name")
var searchformEl = document.getElementById("search__form")
var searchInputEl = document.getElementById("autoSizingInput")

searchformEl.addEventListener("submit", testing)

function testing () {
    event.preventDefault()
    if (!searchInputEl.value) {
        return;
    }
    var searchTerm = searchInputEl.value.trim();
    var apiUrl = `${weatherAPIRootUrl}/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${weatherAPIKey}`
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
                getWeather(data[0])
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function getWeather (data) {
    var { lat } = data;
    var { lon } = data;
    var city = data.name;

    var apiUrl = `${weatherAPIRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`

    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(city, data);
            renderWeather(city, data.list[0]);
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