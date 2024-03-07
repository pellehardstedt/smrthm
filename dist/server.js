"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express();
const port = 3000;
app.get('/weather', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('http://api.openweathermap.org/data/2.5/forecast', {
            params: {
                iq: 524901,
                appid: process.env.OPEN_WEATHER_API_KEY
            }
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).send(error.toString());
    }
}));
app.listen(port, () => {
    console.log('Environment variables: ');
    console.log(process.env.OPEN_WEATHER_API_KEY);
    console.log(`Server is running on http://localhost:${port}`);
});
