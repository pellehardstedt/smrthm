import axios from 'axios';

const getDb = require('./db.ts');
const db = getDb();

async function fetchAndStoreWeatherData(){
    try {
        const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: 55.53884677466315,
                lon: 14.215951896226215,
                units:"metric",
                appid: process.env.OPEN_WEATHER_API_KEY
            }
        });

        const data = response.data.list[0];
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const description = data.weather[0].description;
        const dt = data.dt;
        const feels_like = data.main.feels_like;
        const clouds_all = data.clouds.all;
        const wind_speed = data.wind.speed;
        const wind_deg = data.wind.deg;
        const wind_gust = data.wind.gust;
        const visibility = data.visibility;
        const pop = data.pop;

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const currentDate = new Date().toISOString();
        
        const dtDate = new Date(dt * 1000);
        const dtFormattedDate = dtDate.toISOString();

        db.run(`
            INSERT INTO weather (
                inputDate,
                inputTime,
                date,
                timestamp,
                temperature, 
                humidity,
                condition, 
                feels_like, 
                clouds_all, 
                wind_speed, 
                wind_deg, 
                wind_gust, 
                visibility, 
                pop
            ) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                currentDate,
                currentTimestamp,
                dtFormattedDate,
                dt,
                temp, 
                humidity,
                description, 
                feels_like, 
                clouds_all, 
                wind_speed, 
                wind_deg, 
                wind_gust, 
                visibility, 
                pop
            ], 
            (err) => {
                if (err) {
                    console.error(err.message);
                }
            }
        );
    } catch (error) {
        console.error(error.toString());
    }
}

module.exports = fetchAndStoreWeatherData;