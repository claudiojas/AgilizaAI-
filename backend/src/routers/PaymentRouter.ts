import { FastifyInstance } from "fastify";
import PaymentUseCases from "../usecases/PaymentUseCases";
import { ICloseBill } from "../interfaces/payment.interface";

export async function paymentRoutes(app: FastifyInstance) {

    app.post<{ Body: ICloseBill }>('/payments/close-bill', async (request, reply) => {
        try {
            const { sessionId, paymentMethod } = request.body;
            if (!sessionId || !paymentMethod) {
                return reply.status(400).send({ error: "sessionId and paymentMethod are required." });
            }

            const result = await PaymentUseCases.closeBill({ sessionId, paymentMethod });
            return reply.status(200).send(result);

        } catch (error: any) {
            if (error.message.includes("No cash register is currently open")) {
                return reply.status(409).send({ error: error.message });
            }
            if (error.message.includes("No pending orders found")) {
                return reply.status(404).send({ error: error.message });
            }
            console.error("Error closing bill:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
