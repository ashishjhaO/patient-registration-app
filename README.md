# patient-registration-app
# Patient Registration App

A frontend-only patient registration application using PGlite (PostgreSQL in WASM) for in-browser data storage, synchronized across multiple tabs via a shared Web Worker.

---

## Features

* **Register Patients**: Add new patient records (name, age, gender).
* **Raw SQL Playground**: Execute custom SQL queries and view results in a table.
* **Persistent Storage**: Data is persisted across page refreshes using IndexedDB.
* **Multi-Tab Sync**: Reads and writes are synchronized across tabs using a shared PGlite Worker and BroadcastChannel.

---

## 📁 Repository Structure

```
patient-registration-app/
├── public/                   # (Optional) Static assets
├── src/
│   ├── shims/               # Stub modules for Node APIs
│   │   ├── empty.js
│   │   ├── nodefs.js
│   │   └── nodefs.promises.js
│   ├── my-pglite-worker.js  # Shared PGlite worker entrypoint
│   ├── db.js                # Initializes and exports `initDB()`
│   ├── main.js              # Frontend logic and UI bindings
│   ├── index.html           # HTML template
│   └── styles.css           # App styles
├── vite.config.js           # Vite configuration
├── package.json             # NPM dependencies and scripts
└── README.md                # This documentation
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js v16+
* npm (or yarn)

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/ashishjhaO/patient-registration-app.git
   cd patient-registration-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or yarn install
   ```

### Development

Run the Vite dev server with hot reload:

```bash
npm run dev
# or yarn dev
```

Open your browser at `http://localhost:5173`. The app will reload on file changes.

### Production Build

Compile and bundle for production:

```bash
npm run build
# or yarn build
```

The output will be in the `dist/` folder.

### Preview Production Build

You can preview the production build locally:

```bash
npm run preview
# or yarn preview
```

This serves the contents of `dist/` on `http://localhost:4173` by default.

---

## ⚙️ Configuration

* **Vite Config (`vite.config.js`)**

  * Serves on port `5173` in dev.
  * Stubs Node-only modules via `resolve.alias` for PGlite compatibility.
  * Includes `.wasm` assets and outputs ES module workers.

* **PGlite Shared Worker**

  * Entrypoint: `src/my-pglite-worker.js`
  * Initializes the `patients` table:

    ```sql
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      name TEXT,
      age INTEGER,
      gender TEXT
    )
    ```
  * Shared by all tabs for synchronized reads/writes.

---

## ☁️ Deployment

You can deploy to Vercel, Netlify, or similar static-hosting platforms:

### Vercel

1. Push to GitHub.
2. Import project in Vercel dashboard.
3. Set:

   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Deploy.

### Netlify

1. Push to GitHub.
2. Link repo in Netlify.
3. Configure:

   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist`
4. Deploy.

---

## 👩‍💻 Usage

1. **Register** a patient via the form.
2. **Run** custom SQL in the playground (e.g., `SELECT * FROM patients;`).
3. **Observe** that data persists across refreshes and syncs across tabs.

---

## 📝 License

MIT © <Your Name>

---

*Happy coding!*
