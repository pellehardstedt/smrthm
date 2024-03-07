import express = require('express');
import axios from 'axios';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import sqlite3 from 'sqlite3';

dotenv.config();

const app = express();
const port = 3000;

const db = new sqlite3.Database('./weather.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

let sql = `
    CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inputTime INTEGER,
        inputDate TEXT,
        date TEXT,
        timestamp INTEGER,
        temperature REAL,
        condition TEXT,
        feels_like REAL,
        clouds_all INTEGER,
        wind_speed REAL,
        wind_deg INTEGER,
        wind_gust REAL,
        visibility INTEGER,
        pop REAL
    )
`;

//db.run(sql, (err) => {if (err) {console.error(err.message);}});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/weather', async (req, res) => {
    try {
        const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: 55.53884677466315,
                lon: 14.215951896226215,
                units:"metric",
                appid: process.env.OPEN_WEATHER_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

setInterval(async () => {
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
                condition, 
                feels_like, 
                clouds_all, 
                wind_speed, 
                wind_deg, 
                wind_gust, 
                visibility, 
                pop
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                currentDate,
                currentTimestamp,
                dtFormattedDate,
                dt,
                temp, 
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
}, 10000);
