// vite.config.js

export default {
    server: {
      port: 5173
    },
    assetsInclude: ['**/*.wasm'],
    optimizeDeps: {
      exclude: ['@electric-sql/pglite'] // optional but helps prevent transform errors
    }
  };
  