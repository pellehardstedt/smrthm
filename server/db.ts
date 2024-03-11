const sqlite3 = require('sqlite3').verbose();

let db;

function getDb() {
    if (!db) {
        db = new sqlite3.Database('./weather.sqlite3', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the SQLite database.');
        });
    }

    return db;
}

module.exports = getDb;