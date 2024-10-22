const apiKey = "dd02be2b392cc8fb17ed21445b9617d3";

document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const cityPattern = /^[a-zA-Z\s]+$/;
    if (!cityPattern.test(city)) {
        alert("Please enter a valid city name (letters and spaces only).");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching weather data:', error));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeatherForecast(data);
            updateCharts(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
});

function displayCurrentWeather(data) {
    if (data.cod !== 200) {
        alert("City not found!");
        return;
    }

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('weatherDescription').textContent = `Weather: ${data.weather[0].description}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    updateWidgetBackground(data.weather[0].description);
}

function updateWidgetBackground(description) {
    const weatherWidget = document.getElementById('weatherWidget');
    const weatherBackgrounds = {
        'clear sky': 'bg-blue-400',
        'few clouds': 'bg-gray-400',
        'scattered clouds': 'bg-gray-500',
        'broken clouds': 'bg-gray-600',
        'overcast clouds': 'bg-gray-700',
        'rain': 'bg-blue-700',
        'light rain': 'bg-blue-500',
        'thunderstorm': 'bg-indigo-900',
        'snow': 'bg-white',
        'mist': 'bg-gray-300'
    };

    weatherWidget.className = 'bg-white p-8 rounded-lg shadow-lg space-y-4';
    const backgroundClass = weatherBackgrounds[description.toLowerCase()] || 'bg-gray-200';
    weatherWidget.classList.add(backgroundClass);
}

function displayWeatherForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const forecastList = data.list.filter((_, index) => index % 8 === 0);
    const tableData = forecastList.map(forecast => ({
        date: new Date(forecast.dt_txt).toDateString(),
        temp: forecast.main.temp,
        weather: forecast.weather[0].description,
    }));

    tableData.forEach(forecast => {
        const forecastCard = document.createElement('div');
        forecastCard.className = "bg-white p-4 rounded-lg shadow-md";
        forecastCard.innerHTML = `
            <h4 class="font-bold">${forecast.date}</h4>
            <p>Temp: ${forecast.temp}°C</p>
            <p>${forecast.weather}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });

    populateForecastTable(tableData);
    setupPagination(tableData);
}

function populateForecastTable(data) {
    const tableBody = document.getElementById('forecastTable');
    tableBody.innerHTML = '';

    data.forEach(forecast => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 border">${forecast.date}</td>
            <td class="px-4 py-2 border">${forecast.temp}°C</td>
            <td class="px-4 py-2 border">${forecast.weather}</td>
        `;
        tableBody.appendChild(row);
    });
}

function setupPagination(data) {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.className = 'mx-1 bg-blue-500 text-white px-3 py-1 rounded-lg';
        button.addEventListener('click', () => {
            const start = (i - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            populateForecastTable(data.slice(start, end));
            highlightActivePage(button);
        });
        paginationContainer.appendChild(button);
    }
}

function highlightActivePage(activeButton) {
    const buttons = document.querySelectorAll('#pagination button');
    buttons.forEach(button => {
        button.classList.remove('bg-blue-700');
        button.classList.add('bg-blue-500');
    });
    activeButton.classList.remove('bg-blue-500');
    activeButton.classList.add('bg-blue-700');
}

function updateCharts(data) {
    const tempChartCtx = document.getElementById('tempChart').getContext('2d');
    const weatherConditionsChartCtx = document.getElementById('weatherConditionsChart').getContext('2d');
    const tempLineChartCtx = document.getElementById('tempLineChart').getContext('2d');

    const labels = data.list.map(forecast => new Date(forecast.dt_txt).toLocaleDateString());
    const temperatures = data.list.map(forecast => forecast.main.temp);
    const weatherConditions = data.list.map(forecast => forecast.weather[0].main);
    const conditionCounts = {};

    weatherConditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    const weatherConditionLabels = Object.keys(conditionCounts);
    const weatherConditionValues = Object.values(conditionCounts);

    
    new Chart(tempChartCtx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

   
    new Chart(weatherConditionsChartCtx, {
        type: 'doughnut',
        data: {
            labels: weatherConditionLabels,
            datasets: [{
                data: weatherConditionValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Weather Conditions'
                }
            }
        }
    });

   
    new Chart(tempLineChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('sendBtn').addEventListener('click', async function() {
    const chatInput = document.getElementById('chatInput').value;
    const city = 'New York'; 
    const chatWindow = document.getElementById('chatWindow');

    if (chatInput.trim() !== "") {
      
        chatWindow.innerHTML += `<p class="text-right text-gray-700"><strong>You:</strong> ${chatInput}</p>`;
        
       
        await getWeatherInfo(city, chatInput);

        
        document.getElementById('chatInput').value = '';
    }
});

async function getWeatherInfo(city, query) {
    const geminiApiKey = 'AIzaSyB8Aoc4wbIF4hn3BVxEEOFQ1pSzDgxW9LI'; 
    const apiKey = 'dd02be2b392cc8fb17ed21445b9617d3'; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
    
    try {
        
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherResponse.json();
        const forecastArray = getCityForcastData(weatherData.list);
      
        const body = {
            contents: [
                {
                    parts: [
                        {
                            text: query + ", this is the data where you have to respond the message: " + JSON.stringify(forecastArray)
                        }
                    ]
                }
            ]
        };

        
        const geminiResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const geminiData = await geminiResponse.json();

       
        const generatedText = geminiData.candidates[0].content.parts[0].text;
        const chatWindow = document.getElementById('chatWindow');
        chatWindow.innerHTML += `<p class="text-left text-gray-700"><strong>Gemini:</strong> ${generatedText}</p>`;

       
        chatWindow.scrollTop = chatWindow.scrollHeight;

    } catch (error) {
        console.error("Error in fetching data:", error);
    }
}


function getCityForcastData(list) {
   
    return list.map(item => ({
        date: item.dt_txt,
        temp: item.main.temp,
        weather: item.weather[0].description
    }));
}

