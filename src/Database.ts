import { ITable, ITableBuilder } from "./TableBuilder";
import { RecordState } from "./Types";

export class Database<T extends RecordState> {
    private readonly indexDb: IDBFactory;
    private database: IDBDatabase | null = null;
    private readonly table: ITable;

    constructor(table: ITable) {
        this.table = table;
        this.indexDb = window.indexedDB;
        this.openDatabase();
    }

    private openDatabase(): void {
        const open = this.indexDb.open(this.table.Database(), this.table.Version());
        open.onupgradeneeded = (e: any) => {
            this.upgradDatabase(e.target.result);
        }
        open.onsuccess = (e: any) => {
            this.database = e.target.result;
        }
    }

    private upgradDatabase(database: IDBDatabase): void {
        this.database = database;
        this.table.Build(this.database);
    }

    private getObjectStore(): IDBObjectStore | null {
        try {
            const transaction: IDBTransaction = this.database!.transaction(this.table.TableName(), "readwrite");
            const dbStore: IDBObjectStore = transaction.objectStore(this.table.TableName());
            return dbStore;
        } catch (e) {
            return null;
        }
    }

    public Create(state: T): Promise<void> {
        return new Promise<void>((resolve) => {
            const dbStore = this.getObjectStore();
            const request: IDBRequest = dbStore!.add(state);
            request.onsuccess = (e: any) => {
                resolve();
            }
        });
    }

    public Read(): Promise<T[]> {
        return new Promise<T[]>((response) => {
            const dbStore = this.getObjectStore();
            const items: T[] = new Array<T>();
            const request: IDBRequest = dbStore!.openCursor();
            request.onsuccess = (e: any) => {
                const cursor: IDBCursorWithValue = e.target.result;
                if (cursor) {
                    const result: T = cursor.value;
                    if (result.IsActive) {
                        items.push(result);
                    }
                    cursor.continue();
                } else {
                    response(items);
                }
            }
        });        
    }

    public Update(state: T): Promise<void> {
        return new Promise<void>((resolve) => {
            const dbStore = this.getObjectStore();
            const innerRequest: IDBRequest = dbStore!.put(state);
            innerRequest.onsuccess = () => {
                resolve();
            }
        });
    }

    public Delete(index: number | null): Promise<void> {
        return new Promise<void>((resolve) => {
            const dbStore = this.getObjectStore();
            const request = dbStore!.delete(index!.toString());
            request.onsuccess = () => {
                resolve();
            }
        });
    }
}