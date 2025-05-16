import { PGlite } from '@electric-sql/pglite';

export async function initDB() {
  const db = new PGlite('idb://patient-db');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      name TEXT,
      age INTEGER,
      gender TEXT
    )
  `);

  return db;
}
