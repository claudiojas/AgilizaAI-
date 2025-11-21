import { FastifyInstance } from "fastify";
import OverviewUseCases from "../usecases/OverviewUseCases";

export async function overviewRoutes(app: FastifyInstance) {

    app.get('/overview/sessions', async (request, reply) => {
        try {
            const activeSessions = await OverviewUseCases.getActiveSessionsOverview();
            return reply.send(activeSessions);
        } catch (error) {
            console.error("Error fetching active sessions overview:", error);
            return reply.status(500).send({
                success: false,
                error: "Unable to fetch active sessions overview."
            });
        }
    });

}