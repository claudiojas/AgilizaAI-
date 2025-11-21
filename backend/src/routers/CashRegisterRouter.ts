import { FastifyInstance } from "fastify";
import CashRegisterUseCases from "../usecases/CashRegisterUseCases";
import { IOpenCashRegister } from "../interfaces/cash-register.interface";

export async function cashRegisterRoutes(app: FastifyInstance) {

    app.post<{ Body: IOpenCashRegister }>('/cash-register/open', async (request, reply) => {
        try {
            const { initialValue } = request.body || {};
            const cashRegister = await CashRegisterUseCases.openCashRegister({ initialValue });
            return reply.status(201).send(cashRegister);
        } catch (error: any) {
            if (error.message === "A cash register is already open.") {
                return reply.status(409).send({ error: error.message });
            }
            console.error("Error opening cash register:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.post('/cash-register/close', async (request, reply) => {
        try {
            const cashRegister = await CashRegisterUseCases.closeCashRegister();
            return reply.status(200).send(cashRegister);
        } catch (error: any) {
            if (error.message === "No cash register is currently open.") {
                return reply.status(404).send({ error: error.message });
            }
            console.error("Error closing cash register:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.get('/cash-register/active-details', async (request, reply) => {
        try {
            const details = await CashRegisterUseCases.getActiveCashRegisterDetails();

            
            return reply.status(200).send(details);
        } catch (error: any) {
            if (error.message === "No cash register is currently open.") {
                return reply.status(404).send({ error: error.message });
            }
            console.error("Error getting active cash register details:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
