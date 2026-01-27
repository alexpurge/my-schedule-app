const DEFAULT_DB_NAME = 'pipeline-stage-store';
const DEFAULT_CHUNK_SIZE = 500;
const STORE_CHUNKS = 'chunks';
const STORE_META = 'meta';

const requestToPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transactionDone = (transaction) =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

export const createStageStore = ({ dbName = DEFAULT_DB_NAME, chunkSize = DEFAULT_CHUNK_SIZE } = {}) => {
  let dbPromise = null;

  const openDb = () => {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_CHUNKS)) {
            db.createObjectStore(STORE_CHUNKS, { keyPath: ['stage', 'index'] });
          }
          if (!db.objectStoreNames.contains(STORE_META)) {
            db.createObjectStore(STORE_META, { keyPath: 'stage' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return dbPromise;
  };

  const getStageMeta = async (stage) => {
    const db = await openDb();
    const transaction = db.transaction(STORE_META, 'readonly');
    const store = transaction.objectStore(STORE_META);
    const meta = await requestToPromise(store.get(stage));
    await transactionDone(transaction);
    return meta || { stage, count: 0, nextIndex: 0 };
  };

  const setStageMeta = async (meta, transaction) => {
    const store = transaction.objectStore(STORE_META);
    store.put(meta);
  };

  const appendRows = async (stage, rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return;
    const db = await openDb();
    const transaction = db.transaction([STORE_CHUNKS, STORE_META], 'readwrite');
    const chunkStore = transaction.objectStore(STORE_CHUNKS);
    const metaStore = transaction.objectStore(STORE_META);
    const existingMeta = (await requestToPromise(metaStore.get(stage))) || { stage, count: 0, nextIndex: 0 };
    let { count, nextIndex } = existingMeta;

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      chunkStore.put({ stage, index: nextIndex, rows: chunk });
      nextIndex += 1;
      count += chunk.length;
    }

    await setStageMeta({ stage, count, nextIndex }, transaction);
    await transactionDone(transaction);
  };

  const iterateRows = async (stage, onChunk) => {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_CHUNKS, 'readonly');
      const store = transaction.objectStore(STORE_CHUNKS);
      const range = IDBKeyRange.bound([stage, 0], [stage, Number.MAX_SAFE_INTEGER]);
      const request = store.openCursor(range);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          resolve();
          return;
        }
        Promise.resolve(onChunk(cursor.value.rows))
          .then(() => cursor.continue())
          .catch(reject);
      };
      request.onerror = () => reject(request.error);
    });
  };

  const getStageCount = async (stage) => {
    const meta = await getStageMeta(stage);
    return meta.count || 0;
  };

  const readAllRows = async (stage) => {
    const rows = [];
    await iterateRows(stage, (chunk) => {
      if (Array.isArray(chunk) && chunk.length) rows.push(...chunk);
    });
    return rows;
  };

  const clearStage = async (stage) => {
    const db = await openDb();
    const transaction = db.transaction([STORE_CHUNKS, STORE_META], 'readwrite');
    const chunkStore = transaction.objectStore(STORE_CHUNKS);
    const metaStore = transaction.objectStore(STORE_META);
    const range = IDBKeyRange.bound([stage, 0], [stage, Number.MAX_SAFE_INTEGER]);

    await new Promise((resolve, reject) => {
      const request = chunkStore.openCursor(range);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          resolve();
          return;
        }
        cursor.delete();
        cursor.continue();
      };
      request.onerror = () => reject(request.error);
    });

    metaStore.delete(stage);
    await transactionDone(transaction);
  };

  const clearAll = async () => {
    const db = await openDb();
    const transaction = db.transaction([STORE_CHUNKS, STORE_META], 'readwrite');
    transaction.objectStore(STORE_CHUNKS).clear();
    transaction.objectStore(STORE_META).clear();
    await transactionDone(transaction);
  };

  return {
    appendRows,
    iterateRows,
    getStageCount,
    readAllRows,
    clearStage,
    clearAll,
  };
};
