import './style.css';
import { initDB } from './db.js';

let db;

// HTML Elements
const form     = document.querySelector('#registerForm');
const output   = document.querySelector('#output');
const sqlInput = document.querySelector('#sqlInput');
const sqlResult= document.querySelector('#sqlResult');
const runBtn   = document.querySelector('#runSql');

// BroadcastChannel for tab sync
const bc = new BroadcastChannel('patient-db');

// 1. Initialize DB and render existing records
(async () => {
  db = await initDB();
  await renderPatients();
})();

// 2. Handle form submit: use db.query for parameterized INSERT
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name   = form.name.value.trim();
  const age    = parseInt(form.age.value, 10);
  const gender = form.gender.value;

  // INSERT with parameters via `.query()`
  await db.query(
    'INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3)',
    [name, age, gender]
  );
  console.log('Patient added:', { name, age, gender });

  broadcastChange();   // notify other tabs
  form.reset();
  await renderPatients();
});

// 3. Render patient list: `.query()` for SELECT
async function renderPatients() {
  const { rows } = await db.query('SELECT * FROM patients');
  console.log('Fetched patients:', rows);

  output.innerHTML = rows
    .map(p => `<li>${p.name}, ${p.age}, ${p.gender}</li>`)
    .join('');
}

// 4. Raw SQL execution (also via `.query()`)
runBtn.addEventListener('click', async () => {
  try {
    const { rows } = await db.query(sqlInput.value);
    sqlResult.textContent = JSON.stringify(rows, null, 2);
  } catch (err) {
    sqlResult.textContent = `Error: ${err.message}`;
  }
});

// 5. BroadcastChannel helpers
function broadcastChange() {
  bc.postMessage('refresh');
}

bc.onmessage = () => {
  renderPatients();
};
