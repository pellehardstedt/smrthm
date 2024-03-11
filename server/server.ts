import express = require('express');
import axios from 'axios';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import sqlite3 from 'sqlite3';

const fetchAndStoreWeatherData = require('./fetchAndStoreWeatherData');

const getDb = require('./db.ts');

dotenv.config();

const app = express();
const port = 3000;

const db = getDb();

//api call for current
//https://api.openweathermap.org/data/2.5/weather?lat=55.53884677466315&lon=14.215951896226215&appid={appid}

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

setInterval(fetchAndStoreWeatherData, 20000);