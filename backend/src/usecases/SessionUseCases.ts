import { z } from "zod";
import { ICreateSession, ISession } from "../interfaces/session.interface";
import SessionRepository from "../repositories/SessionRepository";
import { customAlphabet } from 'nanoid';
import { notificationHub } from "../utils/NotificationHub";

const codeSchema = z.string();
import OrderRepository from "../repositories/OrderRepository";

import TableRepository from "../repositories/TableRepository";

class SessionUseCases {
    async createSession(data: ICreateSession): Promise<ISession> {
        // Valida se o tableId é um CUID
        const validatedTableId = z.string().cuid().parse(data.tableId);

        // Verifica se a mesa existe
        const table = await TableRepository.findById(validatedTableId);
        if (!table) {
            throw new Error('Table not found.');
        }

        // Verifica se já existe uma sessão ativa para esta mesa
        const existingActiveSession = await SessionRepository.findActiveSessionByTableId(validatedTableId);
        if (existingActiveSession) {
            throw new Error('This table already has an active session.');
        }

        // Gera um código único e aleatório para a sessão
        const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
        const sessionCode = nanoid();

        const sessionData = { tableId: table.id, code: sessionCode };
        return SessionRepository.createSession(sessionData);
    }

    async findSessionById(id: string) {
        const validatedId = z.string().cuid().parse(id);
        const session = await SessionRepository.findById(validatedId);
        if (!session) {
            throw new Error("Session not found")
        }
        return session;
    }

    async findSessionByCode(code: string) {
        const validatedCode = codeSchema.parse(code);
        const session = await SessionRepository.findSessionByCode(validatedCode);
        if (!session) {
            throw new Error("Session not found")
        }
        return session;
    }

    async findActiveSessionByTableId(tableId: string) {
        const validatedTableId = z.string().cuid().parse(tableId);
        const session = await SessionRepository.findActiveSessionByTableId(validatedTableId);
        if (!session) {
            return null;
        }
        return session;
    }

    async findActiveSessionByTableNumber(tableNumber: string) {
        const validatedTableNumber = z.string().parse(tableNumber);
        const session = await SessionRepository.findActiveSessionByTableNumber(validatedTableNumber);
        if (!session) {
            return null;
        }
        return session;
    }

    async getAllSessions() {
        return SessionRepository.getAllSessions();
    }

    async closeSession(id: string) {
        const validatedId = z.string().parse(id);

        const sessionExists = await SessionRepository.findById(validatedId);
        if (!sessionExists) {
            throw new Error("Session not found");
        }

        const hasActiveOrders = await OrderRepository.hasActiveOrders(validatedId);
        if (hasActiveOrders) {
            throw new Error("Cannot close session: There are active orders pending.");
        }

        const session = await SessionRepository.closeSession(validatedId);
        
        notificationHub.broadcastToKitchen({
            type: 'SESSION_CLOSED',
            payload: { sessionId: session.id }
        });

        return session;
    }
};


export default new SessionUseCases;