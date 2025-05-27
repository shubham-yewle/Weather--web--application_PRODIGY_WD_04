
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherDiv = document.getElementById("weatherInfo");

  if (!city) {
    weatherDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  // Step 1: Geocode city to lat/lon
  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    .then(res => res.json())
    .then(geoData => {
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found!");
      }

      const location = geoData.results[0];
      const lat = location.latitude;
      const lon = location.longitude;

      // Step 2: Fetch weather from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;

      return fetch(weatherUrl);
    })
    .then(res => res.json())
    .then(weatherData => {
      const temp = weatherData.current.temperature_2m;
      const wind = weatherData.current.wind_speed_10m;
      const time = weatherData.current.time;

      weatherDiv.innerHTML = `
        <h3>Weather Info</h3>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Wind Speed:</strong> ${wind} km/h</p>
      `;
    })
    .catch(error => {
      weatherDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    });
}
