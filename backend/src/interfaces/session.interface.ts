import { SessionStatus } from "@prisma/client";

export interface ICreateSession {
    code: string;
    tableId: string;
}

export interface ISession {
    id: string;
    code: string;
    tableId: string;
    status: SessionStatus;
    createdAt: Date;
    updatedAt: Date;
}
