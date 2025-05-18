// main.js
import './style.css';
// main.js

import { initDB } from './db.js';
// main.js

import { PGliteWorker } from '@electric-sql/pglite/worker';

// 1️⃣ Launch the shared PGlite worker instance
const worker = new Worker(
  new URL('./my-pglite-worker.js', import.meta.url),
  { type: 'module' }
);

// 2️⃣ Proxy all DB calls through the worker
const db = new PGliteWorker(worker);

let lastQuery = ''; // store the last SQL query

// 3️⃣ Grab DOM elements
const form      = document.querySelector('#registerForm');
const sqlInput  = document.querySelector('#sqlInput');
const sqlResult = document.querySelector('#sqlResult');
const runBtn    = document.querySelector('#runSql');

// 4️⃣ Set up BroadcastChannel for cross-tab notifications
const bc = new BroadcastChannel('patient-db');
bc.onmessage = () => {
  if (lastQuery) {
    renderSQL(lastQuery);
  }
};

// 5️⃣ Handle form submission: insert a patient and notify other tabs
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name   = form.name.value.trim();
  const age    = parseInt(form.age.value, 10);
  const gender = form.gender.value;

  await db.query(
    'INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3)',
    [name, age, gender]
  );

  form.reset();
  bc.postMessage('refresh');
});

// 6️⃣ Handle “Execute” click: run the SQL, remember it, and render results
runBtn.addEventListener('click', () => {
  lastQuery = sqlInput.value.trim();
  renderSQL(lastQuery);
});

// 7️⃣ Helper to run a SQL query and render it as a table
async function renderSQL(query) {
  try {
    const { rows } = await db.query(query);

    if (rows.length === 0) {
      sqlResult.innerHTML = '<p>No results.</p>';
      return;
    }

    // Build table header
    const cols = Object.keys(rows[0]);
    let html = '<table class="sql-table"><thead><tr>';
    cols.forEach(col => {
      html += `<th>${col}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Build table body
    rows.forEach(row => {
      html += '<tr>';
      cols.forEach(col => {
        html += `<td>${row[col]}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';

    sqlResult.innerHTML = html;
  } catch (err) {
    sqlResult.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}
