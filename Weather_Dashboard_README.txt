# Weather Dashboard

## Overview

The Weather Dashboard is a responsive web application that provides real-time weather information, a 5-day weather forecast, and a chat feature powered by the Gemini API. Users can search for weather data by entering a city name, and they can also interact with Gemini for additional queries.

## Features

- **Current Weather Data**: Displays temperature, humidity, wind speed, and weather description.
- **5-Day Weather Forecast**: Shows daily weather forecasts including temperature and conditions.
- **Charts**: Visualizes temperature and weather conditions using Chart.js.
- **Chat with Gemini**: Enables users to chat with the Gemini AI for assistance.

## Technologies Used

- **HTML**: Structure of the web application.
- **CSS**: Styling with Tailwind CSS for responsive design.
- **JavaScript**: Client-side scripting to fetch weather data and handle chat functionality.
- **APIs**:
  - **OpenWeatherMap API**: For fetching current weather data and forecasts.
  - **Gemini API**: For enabling chat functionality.


   ```

3. Open `index.html` in your web browser.

## Usage

1. **Get Weather**:
   - Enter a city name in the input field and click the "Get Weather" button.
   - The current weather data and 5-day forecast will be displayed.

2. **Chat with Gemini**:
   - Type your message in the chat input field and click "Send."
   - Receive responses from the Gemini API based on your input.

## API Keys

- To use the OpenWeatherMap API, sign up at [OpenWeatherMap](https://openweathermap.org/api) and obtain an API key.
- To use the Gemini API, sign up at [Gemini](https://www.gemini.com) and obtain an API key.

Replace the API keys in the JavaScript code as follows:

```javascript
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const myGeminiApiKey = 'YOUR_GEMINI_API_KEY';
```

## Project Structure

```
/weather-dashboard
|-- index.html          # Main HTML file
|-- script.js           # JavaScript file for weather and chat functionality
|-- logo.png            # Application logo
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is open-source and available 







Website URL:https://badarfaisal01.github.io/WeatherApp/
