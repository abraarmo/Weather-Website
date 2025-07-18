
// Get the input and display the elements form the page
const input = document.querySelector(".city-input");
const btn = document.querySelector(".search-btn");
const tempBox = document.querySelector(".tempBox");
const rainBox = document.querySelector(".rainBox");
const windBox = document.querySelector(".windBox");
const humidityBox = document.querySelector(".humidityBox");
const weatherIcon = document.getElementById("weatherIcon");
const cityName = document.getElementById("cityName");


// Event Listner
btn.addEventListener("click", () => {
    // console.log("Button clicked");
  const city = input.value.trim();
  if (city === "") {
    return;
  }

  
// API Key Below
  const apiKey = "4459747ec2880509d41d7defa392f531";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  
  fetch(url)
//   Below changing data to json and reading it
    .then((res) => res.json()) 
    .then((data) => {

    // Naming the data appropriatley
      const temp = data.main.temp;
      const wind = data.wind.speed;
      const condition = data.weather[0].main.toLowerCase();
      const rain = data.rain ? data.rain["1h"] || data.rain["3h"] : 0;
      const humidity = data.main.humidity;



    //   Changing the text content of the fields with the relevant element
      tempBox.textContent = `Temp: ${temp}°C`;
      windBox.textContent = `Wind: ${wind} km/h`;
      rainBox.textContent = `Rain: ${rain} mm`;
      cityName.textContent = data.name;
      humidityBox.textContent = `Humidity: ${humidity}%`;


    //   Used ChatGPT for this section
      const rawCondition = data.weather[0].main.toLowerCase();
      const description = data.weather[0].description.toLowerCase(); // more precise

      let iconFile = "clouds.svg"; // default

    //   Making sure that the description form the json file can use based on the images i have. prevents something like slightly cloudy returning a broken image but instead getting it to use cloudy.svg
      if (description.includes("clear")) iconFile = "clear.svg";
      else if (description.includes("cloud")) iconFile = "clouds.svg";
      else if (description.includes("rain")) iconFile = "rain.svg";
      else if (description.includes("drizzle")) iconFile = "drizzle.svg";
      else if (description.includes("thunderstorm"))
        iconFile = "thunderstorm.svg";
      else if (description.includes("snow")) iconFile = "snow.svg";
      else if (description.includes("mist") || description.includes("fog"))
        iconFile = "atmosphere.svg";

      document.getElementById(
        "weatherIcon"
      ).src = `assets/assets/weather/${iconFile}`;
    })

    //   End of ChatGPT for this section

    // What happens if theres a error
    .catch((err) => {
      tempBox.textContent = "N/A";
      rainBox.textContent = "N/A";
      windBox.textContent = "N/A";
      weatherIcon.textContent = "error";
      cityName.textContent = "City Not Found";
      humidityBox.textContent = "N/A"
    });
});


// Getting a keydown to also act as an event listner
// ChatGPT use
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});
// End of ChatGPT use