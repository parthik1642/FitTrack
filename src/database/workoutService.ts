import { getDatabase } from "./db";
import { Workout } from "../types/workout";

export function addWorkout(workout: Omit<Workout, "id">) {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO workouts (title, category, duration, calories, date, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [workout.title, workout.category, workout.duration, workout.calories, workout.date, workout.notes ?? ""]
  );
}

export function getAllWorkouts(): Workout[] {
  const db = getDatabase();
  return db.getAllSync(`SELECT * FROM workouts ORDER BY id DESC`) as Workout[];
}

export function getWorkoutById(id: number): Workout | null {
  const db = getDatabase();
  const result = db.getAllSync(`SELECT * FROM workouts WHERE id = ?`, [id]) as Workout[];
  return result[0] ?? null;
}

export function deleteWorkout(id: number) {
  const db = getDatabase();
  db.runSync(`DELETE FROM workouts WHERE id = ?`, [id]);
}

export function updateWorkout(id: number, workout: Omit<Workout, "id">) {
  const db = getDatabase();
  db.runSync(
    `UPDATE workouts
     SET title = ?, category = ?, duration = ?, calories = ?, date = ?, notes = ?
     WHERE id = ?`,
    [workout.title, workout.category, workout.duration, workout.calories, workout.date, workout.notes ?? "", id]
  );
}