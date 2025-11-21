import { ICategory, ICreateCategory } from "./categorie.interface";
import { IProductsCreate, IReturnProductsCreate } from "./products.interface";
import { ICreateSession, ISession } from "./session.interface";
import { IOrder } from "./order.interface";
import { ICreateTable, ITable } from "./table.interface";


export interface IProductsMethods {
    createProduct(data: IProductsCreate): Promise<IReturnProductsCreate>
    getProducts(): Promise<IReturnProductsCreate[]>;
    updateProduct(id: string, data: Partial<IProductsCreate>): Promise<IReturnProductsCreate>;
    findProductById(id: string): Promise<IReturnProductsCreate | null>;
    getProductsByCategoryId(id: string): Promise<IReturnProductsCreate[] | null>;
}

export interface ICategoryMethods {
    createCategory(data: ICreateCategory): Promise<ICategory>
    getCategory(): Promise<ICategory[]>
}

export interface ISessionMethods {
    createSession(data: ICreateSession): Promise<ISession>;
    findById(id: string): Promise<ISession | null>;
    findSessionByCode(code: string): Promise<ISession | null>;
    findActiveSessionByTableId(tableId: string): Promise<ISession | null>;
    getAllSessions(): Promise<ISession[]>;
    closeSession (id: string): Promise<ISession>
}

export interface IOrderMethods {
    createOrder(data: ICreateOrder): Promise<{order: IOrder, sessionId: string}>;
    findOrdersBySessionId(sessionId: string): Promise<IOrder[] | null>;
    findAllOrders(): Promise<IOrder[]>;
    deleteOrder(orderId: string): Promise<IOrder>;
}

export interface ITableMethods {
    createTable(data: ICreateTable): Promise<ITable>;
    getAllTables(): Promise<ITable[]>;
}