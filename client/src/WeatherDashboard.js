import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';

function WeatherDashboard() {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const response = await fetch('/api/weather');
        const data = await response.json();
        let temp = data.list[0].main.temp;
        let description = data.list[0].weather[0].description;
        let cityName = data.city.name;
        let humidity = data.list[0].main.humidity;

        let resObj = {
            city: cityName,
            temperature: temp,
            condition: description,
            humidity: humidity
        }

        setWeatherData(resObj);
    };
  
    fetchData();
}, []);

  return (
    <div>
        <WeatherCard city={weatherData.city} temperature={weatherData.temperature} condition={weatherData.condition} humidity={weatherData.humidity} />
    </div>
  );
}

export default WeatherDashboard;