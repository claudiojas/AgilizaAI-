export interface ICreateTable {
    number: number;
}

export interface ITable {
    id: string;
    number: number;
}

export interface ITableUseCases {
    createTable(data: ICreateTable): Promise<ITable>;
    getAllTables(): Promise<ITable[]>;
    archiveManyTables(ids: string[]): Promise<void>;
}
