
## Introduction
This project is a Weather Dashboard application. It allows users to search for weather information by city name. The application fetches data from the OpenWeatherMap API and displays current weather details along with a 5-day forecast.

## Features
- Search weather information by city name.
- Display current weather details including temperature, wind speed, and humidity.
- Render a 5-day weather forecast.
- Save search history and allow quick access to previously searched locations.

## How to Use
1. **Start the Application**: Open the application in a web browser.
2. **Search for a City**: Enter a city name in the search input and submit the form.
3. **View Weather Details**: The current weather and a 5-day forecast for the searched city will be displayed.
4. **Utilize Search History**: Click on any previously searched city button to quickly view its weather again.

## Technical Details
- **Weather API**: The application uses the `OpenWeatherMap API` for weather data.
- **Search Form**: A form element captures the user input for city names.
- **Dynamic Content Rendering**: JavaScript is used to dynamically render weather data and search history on the page.
- **Local Storage**: Search history is stored in the browser's local storage for persistent access.

## Dependencies
- **OpenWeatherMap API**: Requires an API key (already included in the code).
- **Day.js**: Used for date formatting. Ensure this library is included.
- **Bootstrap**: For styling components.
- **Font Awesome**: Optional, for icons.

## Known Issues
- **API Limitations**: The free tier of OpenWeatherMap API may have limitations on the number of requests.

## License
This project is licensed under the [MIT License](LICENSE.md). 

## Deployed Application
https://chrisahn10.github.io/5-Day-Weather-Dashboard/

## Demo 
