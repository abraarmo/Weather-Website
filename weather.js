const input = document.querySelector(".city-input");
const btn = document.querySelector(".search-btn");
const tempBox = document.querySelector(".tempBox");
const rainBox = document.querySelector(".rainBox");
const windBox = document.querySelector(".windBox");
const humidityBox = document.querySelector(".humidityBox");
const weatherIcon = document.getElementById("weatherIcon");
const cityName = document.getElementById("cityName");
const toggleBtn = document.querySelector(".mbtn");
const mainContainer = document.querySelector(".mainContainer");

// Map weathercode to your own icon paths
function mapWeatherCodeToIcon(code) {
  if (code === 0) return "assets/assets/weather/clear.svg";
  if ([1, 2, 3].includes(code)) return "assets/assets/weather/clouds.svg";
  if ([45, 48].includes(code)) return "assets/assets/weather/atmosphere.svg";
  if ([51, 53, 55].includes(code)) return "assets/assets/weather/drizzle.svg";
  if ([61, 63, 65].includes(code)) return "assets/assets/weather/rain.svg";
  if ([71, 73, 75].includes(code)) return "assets/assets/weather/snow.svg";
  if ([95, 96, 99].includes(code))
    return "assets/assets/weather/thunderstorm.svg";
  return "assets/assets/weather/clouds.svg";
}

btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city === "") return;

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

  fetch(geoUrl)
    .then((res) => res.json())
    .then((geoData) => {
      if (!geoData.results || geoData.results.length === 0) {
        cityName.textContent = "City Not Found";
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];
      cityName.textContent = name;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,weathercode&hourly=relative_humidity_2m,precipitation&timezone=auto`;

      fetch(weatherUrl)
        .then((res) => res.json())
        .then((data) => {
          // Main 4 widgets
          const current = data.current_weather;
          const humidity = data.hourly.relative_humidity_2m[0];
          const rain = data.hourly.precipitation[0];
          const iconPath = mapWeatherCodeToIcon(current.weathercode);

          tempBox.textContent = `Temp: ${current.temperature}°C`;
          windBox.textContent = `Wind: ${current.windspeed} km/h`;
          humidityBox.textContent = `Humidity: ${humidity}%`;
          rainBox.textContent = `Rain: ${rain} mm`;
          weatherIcon.src = iconPath;

          // 7-day forecast
          const forecast = data.daily;
          for (let i = 0; i < 7; i++) {
            const el = document.querySelector(`.day${i + 1}`);
            if (!el) continue;

            const date = new Date(forecast.time[i]);
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dayTemp = Math.round(forecast.temperature_2m_max[i]);
            const dayIcon = mapWeatherCodeToIcon(forecast.weathercode[i]);

            el.querySelector(".day-name").textContent = dayName;
            el.querySelector(".day-temp").textContent = `${dayTemp}°C`;
            el.querySelector(".day-icon").src = dayIcon;
          }
        });
    });
});

// Allow "Enter" key to trigger search
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

// Toggle 7-day forecast visibility
toggleBtn.addEventListener("click", () => {
  mainContainer.classList.toggle("expanded");
});
