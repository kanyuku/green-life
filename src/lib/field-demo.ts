export type QueueKind = "voice" | "photo";

export type QueueItem = {
  id: string;
  kind: QueueKind;
  createdAt: string;
  village: string;
  note: string;
  latitude: number;
  longitude: number;
  attachment?: Blob;
  fileName?: string;
};

const databaseName = "field-demo-pulse";
const storeName = "pending-reports";
const queueUpdatedEvent = "field-demo-queue-updated";

function openQueueDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser does not support local offline storage."));
      return;
    }

    const request = window.indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open offline storage."));
    request.onblocked = () => reject(new Error("Offline storage is blocked by another open tab."));
  });
}

export async function listQueuedReports(): Promise<QueueItem[]> {
  const database = await openQueueDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll() as IDBRequest<QueueItem[]>;
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    request.onerror = () => reject(request.error ?? new Error("Could not read the offline queue."));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not read the offline queue."));
  });
}

export async function saveQueuedReport(report: QueueItem): Promise<void> {
  const database = await openQueueDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(report);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not save this report offline."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Saving this report offline was aborted."));
  }).finally(() => database.close());
  notifyQueueUpdated();
}

export async function deleteQueuedReport(id: string): Promise<void> {
  const database = await openQueueDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not remove the synced report."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Removing the synced report was aborted."));
  }).finally(() => database.close());
  notifyQueueUpdated();
}

export function notifyQueueUpdated(): void {
  window.dispatchEvent(new Event(queueUpdatedEvent));
}

export function onQueueUpdated(callback: () => void): () => void {
  window.addEventListener(queueUpdatedEvent, callback);
  return () => window.removeEventListener(queueUpdatedEvent, callback);
}
