import { FastifyInstance } from "fastify";
import { z } from "zod";
import TableUseCases from "../usecases/TableUseCases";

export async function tableRoutes(app: FastifyInstance) {

    app.post('/tables', async (request, reply) => {
        const createTableSchema = z.object({
            number: z.number(),
        });
        try {
            const { number } = createTableSchema.parse(request.body);
            const table = await TableUseCases.createTable({ number });
            return reply.status(201).send(table);
        } catch (error) {
            console.error("Error creating table:", error);
            return reply.status(400).send({
                success: false,
                error: "Invalid data for table creation.",
            });
        }
    });

    app.get('/tables', async (request, reply) => {
        try {
            const tables = await TableUseCases.getAllTables();
            return reply.send(tables);
        } catch (error) {
            console.error("Error fetching all tables:", error);
            return reply.status(500).send({
                success: false,
                error: "Unable to fetch all tables."
            });
        }
    });

    app.post('/tables/archive', async (request, reply) => {
        const archiveTablesSchema = z.object({
            ids: z.array(z.string().cuid2()),
        });
        try {
            const { ids } = archiveTablesSchema.parse(request.body);
            await TableUseCases.archiveManyTables(ids);
            return reply.status(204).send();
        } catch (error: any) {
            if (error.message.includes("active sessions")) {
                return reply.status(409).send({ 
                    success: false, 
                    error: "Não é possível arquivar mesas com sessões ativas."
                });
            }
            console.error("Error archiving tables:", error);
            return reply.status(400).send({
                success: false,
                error: "Dados inválidos para arquivar mesas.",
            });
        }
    });
}