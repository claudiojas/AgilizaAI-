import { prisma } from "../BD/prisma.config";
import { ISessionMethods } from "../interfaces/methods.interface";
import { ICreateSession, ISession } from "../interfaces/session.interface";

class SessionRepositorie implements ISessionMethods {
    async createSession(data: ICreateSession): Promise<ISession> {
        const session = await prisma.session.create({
            data: {
                code: data.code,
                tableId: data.tableId
            }
        })
        return session
    }

    async findById(id: string): Promise<ISession | null> {
        const session = await prisma.session.findUnique({
            where: {
                id,
            }
        });
        return session;
    }

    async findSessionByCode(code: string): Promise<ISession | null> {
        const session = await prisma.session.findUnique({
            where: {
                code,
            },
            include: {
                orders: {
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        return session;
    }

    async findActiveSessionByTableId(tableId: string): Promise<ISession | null> {
        const session = await prisma.session.findFirst({
            where: {
                tableId: tableId,
                status: 'ACTIVE'
            }
        });
        return session;
    }

    async getAllSessions(): Promise<ISession[]> {
        const sessions = await prisma.session.findMany();
        return sessions;
    };

    async closeSession(id: string): Promise<ISession> {
        const session = await prisma.session.update({
            where: {
                id
            },
            data: {
                status: 'CLOSED'
            }
        });

        return session;
    }
};


export default new SessionRepositorie;