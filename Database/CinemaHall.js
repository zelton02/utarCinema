const sqlite3 = require('sqlite3').verbose();

// Create or open the SQLite database
const db = new sqlite3.Database('cinema_hall.db');

// Create a table to store seat availability
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS seats (id INTEGER PRIMARY KEY AUTOINCREMENT, row INTEGER, col INTEGER, isBooked BOOLEAN)',
  );
});

// Function to initialize seat availability for a cinema hall
function initializeSeats(rows, cols) {
  db.serialize(() => {
    db.run('DELETE FROM seats'); // Clear existing seat data

    // Insert seat data for each row and column
    const stmt = db.prepare(
      'INSERT INTO seats (row, col, isBooked) VALUES (?, ?, ?)',
    );
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        stmt.run(row, col, false); // Initialize all seats as not booked
      }
    }
    stmt.finalize();
  });
}

// Initialize the seat availability for a cinema hall with 5 rows and 8 columns
initializeSeats(5, 8);

// Function to get seat availability
function getSeatAvailability() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM seats', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to book a seat
function bookSeat(row, col) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE seats SET isBooked = ? WHERE row = ? AND col = ?',
      [true, row, col],
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(`Seat at Row ${row}, Column ${col} booked successfully.`);
        }
      },
    );
  });
}

// Function to cancel a booked seat
function cancelSeat(row, col) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE seats SET isBooked = ? WHERE row = ? AND col = ?',
      [false, row, col],
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(`Seat at Row ${row}, Column ${col} canceled successfully.`);
        }
      },
    );
  });
}

// Close the database connection (usually done when your Node.js application exits)
// db.close();

module.exports = {
  getSeatAvailability,
  bookSeat,
  cancelSeat,
};
