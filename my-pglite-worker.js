// my-pglite-worker.js
import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init() {
    // this PGlite instance will back all tabs
    return new PGlite('idb://patient-db');
  },
});
