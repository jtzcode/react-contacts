import { Table } from "reactstrap";
import { StringOrNull } from "./Types";

export interface ITableBuilder {
    WithDatabase(database: string): ITableBuilder;
    WithVersion(version: number): ITableBuilder;
    WithTableName(tableName: string): ITableBuilder;
    WithPrimaryField(primaryField: string): ITableBuilder;
    WithIndexName(indexName: string): ITableBuilder;
}

export interface ITable {
    Database(): string;
    Version(): number;
    TableName(): string;
    IndexName(): string;
    Build(database: IDBDatabase): void;
}

export class TableBuilder implements ITableBuilder, ITable {
    private database: StringOrNull;
    private tableName : StringOrNull;
    private primaryField : StringOrNull;
    private indexName : StringOrNull;
    private version : number = 1;

    public WithDatabase(database: string): ITableBuilder {
        this.database = database;
        return this;
    }
    public WithTableName(tableName: string): ITableBuilder {
        this.tableName = tableName;
        return this;
    }
    public WithPrimaryField(primaryField: string): ITableBuilder {
        this.primaryField = primaryField;
        return this;
    }
    public WithIndexName(indexName: string): ITableBuilder {
        this.indexName = indexName;
        return this;
    }
    public WithVersion(version: number): ITableBuilder {
        this.version = version;
        return this;
    }

    public Database(): string {
        return this.database!;
    }

    public Version(): number {
        return this.version;
    }

    public IndexName(): string {
        return this.indexName!;
    }

    public TableName(): string {
        return this.tableName!;
    }

    public Build(db: IDBDatabase): void {
        const parameters: IDBObjectStoreParameters = {
            keyPath: this.primaryField
        };
        const objectStore = db.createObjectStore(this.tableName!, parameters);
        objectStore!.createIndex(this.indexName!, this.primaryField!);
    }
}

export class PersonalDetailsTableBuilder {
    public Build(): TableBuilder {
        const tableBuilder: TableBuilder = new TableBuilder();
        tableBuilder.WithDatabase("react-contacts")
            .WithTableName("People")
            .WithPrimaryField("PersonId")
            .WithIndexName("personId")
            .WithVersion(1);
        return tableBuilder;
    }
}