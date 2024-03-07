// WeatherCard.js
import React from 'react';

function WeatherCard({ city, temperature, condition, humidity }) {
  return (
    <div className="weather-card">
      <h2>{city}</h2>
      <h3>{temperature}°C</h3>
      <p>{condition}</p>
      <p>Humidity: {humidity}%</p>
    </div>
  );
}

export default WeatherCard;