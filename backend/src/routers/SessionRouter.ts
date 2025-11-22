import { FastifyInstance } from "fastify";
import { z } from "zod";
import SessionUseCases from "../usecases/SessionUseCases";
import { notificationHub } from "../utils/NotificationHub";

export async function sessionRoutes(app: FastifyInstance) {

    app.post('/sessions', async (request, reply) => {
        const createSessionSchema = z.object({
            tableId: z.string().cuid2(),
        });
        try {
            const { tableId } = createSessionSchema.parse(request.body);
            const session = await SessionUseCases.createSession({ tableId });
            return reply.status(201).send(session);
        } catch (error: any) {
            if (error.message.includes("already has an active session")) {
                return reply.status(409).send({ error: error.message });
            }
            console.error("Error creating session:", error);
            return reply.status(400).send({
                success: false,
                error: "Invalid data for session creation.",
            });
        }
    });

    app.get('/sessions/id/:id', async (request, reply) => {
        const getSessionSchema = z.object({
            id: z.string()
        })
        const { id } = getSessionSchema.parse(request.params)
        try {
            const session = await SessionUseCases.findSessionById(id);
            return reply.send(session)
        } catch (error: any) {
            if (error.message === "Session not found") {
                return reply.status(404).send({
                    success: false,
                    error: error.message
                });
            }
            console.error(`Error fetching session ${id}:`, error);
            return reply.status(500).send({
                success: false,
                error: "Unable to search for session."
            });
        }
    });

    app.get('/sessions/code/:code', async (request, reply) => {
        const getSessionSchema = z.object({
            code: z.string()
        })
        const { code } = getSessionSchema.parse(request.params)
        try {
            const session = await SessionUseCases.findSessionByCode(code);

            return reply.send(session)
        } catch (error: any) {
            if (error.message === "Session not found") {
                return reply.status(404).send({
                    success: false,
                    error: error.message
                });
            }
            console.error(`Error fetching session ${code}:`, error);
            return reply.status(500).send({
                success: false,
                error: "Unable to search for session."
            });
        }
    });

    app.get('/sessions/table/:tableId/active', async (request, reply) => {
        const getSessionSchema = z.object({
            tableId: z.string()
        })
        const { tableId } = getSessionSchema.parse(request.params)
        try {
            const session = await SessionUseCases.findActiveSessionByTableId(tableId);
            return reply.send(session);
        } catch (error: any) {
            if (error.message.includes("No active session found")) {
                return reply.status(404).send({
                    success: false,
                    error: error.message
                });
            }
            console.error(`Error fetching active session for table ${tableId}:`, error);
            return reply.status(500).send({
                success: false,
                error: "Unable to search for active session."
            });
        }
    });

    app.get('/sessions', async (request, reply) => {
        try {
            const sessions = await SessionUseCases.getAllSessions();
            return reply.send(sessions);
        } catch (error) {
            console.error("Error fetching all sessions:", error);
            return reply.status(500).send({
                success: false,
                error: "Unable to fetch all sessions."
            });
        }
    });

    app.patch('/sessions/:id/close', async (request, reply) => {
        const getSessionSchema = z.object({
            id: z.string()
        })
        const { id } = getSessionSchema.parse(request.params)
        try {
            const session = await SessionUseCases.closeSession(id);
            return reply.send(session)
        } catch (error: any) {
            if (error.message.includes("active orders pending")) {
                return reply.status(409).send({ error: error.message });
            }
            if (error.message === "Session not found") {
                return reply.status(404).send({ error: error.message });
            }
            console.error(`Error closing session ${id}:`, error);
            return reply.status(500).send({ error: "Unable to close session." });
        }
    });
}