import { prisma } from "../BD/prisma.config";
import { ICreateTable } from "../interfaces/table.interface";
import { z } from "zod";
import TableRepository from "../repositories/TableRepository";

const tableCreateSchema = z.object({
  number: z.number().int().positive("Table number must be a positive integer"),
});

class TableUseCases {
    async createTable (data: ICreateTable) {
        const validatedData = tableCreateSchema.parse(data);
        return TableRepository.createTable(validatedData);
    }

    async getAllTables() {
        return TableRepository.getAllTables();
    }

    async archiveManyTables(ids: string[]) {
        const activeSessionCount = await prisma.session.count({
            where: {
                status: 'ACTIVE',
                tableId: { 
                    in: ids 
                } 
            },
        });

        if (activeSessionCount > 0) {
            throw new Error("Cannot archive tables with active sessions.");
        }

        return TableRepository.archiveMany(ids);
    }
};

export default new TableUseCases();