import sqlite3 from "sqlite3";
import generateRecords from "./data-generator.js";

let db;

function initDb() {
  if (db) return db;

  db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      console.error("DB error:", err.message);
      return;
    }
    console.log("Connected to in-memory SQLite database.");

    db.run(
      `CREATE TABLE IF NOT EXISTS calorie_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        r_date TEXT, 
        r_meal TEXT, 
        r_food TEXT, 
        r_cal INTEGER
      )`,
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Table created.");

          const data = generateRecords();
          const stmt = db.prepare(
            "INSERT INTO calorie_records (r_date, r_meal, r_food, r_cal) VALUES (?, ?, ?, ?)"
          );

          data.forEach(({ date, meal, content, calories }) => {
            stmt.run(date, meal, content, calories);
          });

          stmt.finalize();
          console.log("Initial records inserted.");
        }
      }
    );
  });

  return db;
}

export default initDb();
