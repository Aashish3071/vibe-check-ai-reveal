import { supabase } from "@/common/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface SyncQueueItem {
  id: string;
  table: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  data: Record<string, unknown>;
  timestamp: number;
}

class SyncService {
  private queue: SyncQueueItem[] = [];
  private isSyncing = false;
  private queryClient = useQueryClient();

  constructor() {
    // Initialize IndexedDB for offline storage
    this.initializeOfflineStorage();

    // Listen for network status changes
    window.addEventListener("online", () => this.sync());

    // Listen for Supabase auth state changes
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        this.sync();
      }
    });
  }

  private async initializeOfflineStorage() {
    // Initialize IndexedDB
    const request = indexedDB.open("vibeCheckDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores for each table
      db.createObjectStore("user_preferences", { keyPath: "id" });
      db.createObjectStore("quiz_results", { keyPath: "id" });
      db.createObjectStore("journal_entries", { keyPath: "id" });
      db.createObjectStore("analysis_history", { keyPath: "id" });
      db.createObjectStore("sync_queue", { keyPath: "id" });
    };
  }

  public async queueOperation(
    table: string,
    operation: "INSERT" | "UPDATE" | "DELETE",
    data: Record<string, unknown>
  ) {
    const item: SyncQueueItem = {
      id: crypto.randomUUID(),
      table,
      operation,
      data,
      timestamp: Date.now(),
    };

    this.queue.push(item);
    await this.saveToOfflineStorage(item);

    if (navigator.onLine) {
      this.sync();
    }
  }

  private async saveToOfflineStorage(item: SyncQueueItem) {
    const db = await this.openDatabase();
    const transaction = db.transaction("sync_queue", "readwrite");
    const store = transaction.objectStore("sync_queue");
    await store.add(item);
  }

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("vibeCheckDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async sync() {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;

    try {
      const db = await this.openDatabase();
      const transaction = db.transaction("sync_queue", "readwrite");
      const store = transaction.objectStore("sync_queue");

      // Get all items from the store
      const request = store.getAll();
      const items = await new Promise<SyncQueueItem[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      for (const item of items) {
        try {
          switch (item.operation) {
            case "INSERT":
              await supabase.from(item.table).insert(item.data);
              break;
            case "UPDATE":
              await supabase
                .from(item.table)
                .update(item.data)
                .eq("id", item.data.id);
              break;
            case "DELETE":
              await supabase.from(item.table).delete().eq("id", item.data.id);
              break;
          }

          // Remove from queue after successful sync
          await store.delete(item.id);

          // Invalidate relevant queries
          this.queryClient.invalidateQueries({ queryKey: [item.table] });
        } catch (error) {
          console.error(`Failed to sync ${item.operation} operation:`, error);
          // Keep the item in the queue if sync fails
        }
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncService = new SyncService();
