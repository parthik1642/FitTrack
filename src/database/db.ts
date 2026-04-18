import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync("fittrack.db");
  }
  return db;
}

export function initDatabase() {
  const database = getDatabase();

  database.execSync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      duration INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      date TEXT NOT NULL
    );
  `);
}