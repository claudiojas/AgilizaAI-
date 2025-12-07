import { prisma } from "../BD/prisma.config";
import { ITableMethods } from "../interfaces/methods.interface";
import { ICreateTable, ITable } from "../interfaces/table.interface";

class TableRepository {
    async createTable(data: ICreateTable): Promise<ITable> {
        const table = await prisma.table.create({
            data: {
                number: data.number
            }
        });
        return table;
    }

    async findById(id: string): Promise<ITable | null> {
        const table = await prisma.table.findUnique({
            where: { id },
        });
        return table;
    }

    async getAllTables(): Promise<ITable[]> {
        const tables = await prisma.table.findMany({
            where: { isActive: true },
        });
        return tables;
    }

    async archiveMany(ids: string[]): Promise<void> {
        await prisma.table.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                isActive: false,
            },
        });
    }
}

export default new TableRepository();
