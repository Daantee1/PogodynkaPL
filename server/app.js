const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  next()
});

// Otwieramy bazę danych
const db = new sqlite3.Database('./database.db');

// Tworzymy tabelę, jeśli jeszcze jej nie ma
db.run(`
  CREATE TABLE IF NOT EXISTS cities (
    city TEXT
  );
`);

// Ustawiamy middleware do obsługi danych wejściowych w formacie JSON
app.use(express.json());

// Tworzymy endpoint do dodawania nowych miast
app.post('/cities', (req, res) => {
  // Pobieramy miasto z danych wejściowych
  const city = req.body.city;

  // Wstawiamy miasto do bazy danych
  db.run(`
    INSERT INTO cities (city)
    VALUES (?)
  `, city, (err) => {
    if (err) {
      return res.send({
        error: 'Wystąpił błąd podczas dodawania miasta do bazy danych.'
      });
    }

    // Zwracamy informację o sukcesie
    res.send({
      message: 'Miasto zostało dodane do bazy danych.'
    });
  });
});

// Tworzymy endpoint do pobierania wszystkich miast z bazy danych
app.get('/cities', (req, res) => {
  // Pobieramy wszystkie miasta z bazy danych
  db.all(`
    SELECT *
    FROM cities
  `, (err, rows) => {
    if (err) {
      return res.send({
        error: 'Wystąpił błąd podczas pobierania danych z bazy.'
      });
    }

    // Zwracamy pobrane dane
    res.send(rows);
  });
});

// Nasłuchujemy na porcie
app.listen(port, () => {
  console.log(`Serwer uruchomiony na porcie ${port}`);
});