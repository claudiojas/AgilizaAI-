import fastify, { FastifyInstance } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { productRoutes } from "./routers/ProductRoutes";
import { categorieRoutes } from "./routers/CategorieRouter";
import { sessionRoutes } from "./routers/SessionRouter";
import { orderRoutes } from "./routers/OrderRoutes";
import { cashRegisterRoutes } from "./routers/CashRegisterRouter";
import { paymentRoutes } from "./routers/PaymentRouter";
import { tableRoutes } from "./routers/TableRouter";
import { overviewRoutes } from './routers/OverviewRouter';
import { reportsRoutes } from './routers/ReportsRouter';
import { WebSocketServer } from 'ws';
import { handleWebSocketConnections } from './routers/WebSocketRouter';


export class App {
    private app: FastifyInstance;
    PORT: number;
    constructor() {
        this.app = fastify()
        this.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
    }

    getServer(): FastifyInstance {
        return this.app;
    }

    listen() {
        this.app.listen({
            host: '0.0.0.0',
            port: this.PORT,
        }).then(() => {
            console.log(`HTTP Server running in port ${this.PORT}`);
            
            // Create WebSocket server and attach it to the HTTP server
            const wss = new WebSocketServer({ server: this.app.server });
            console.log('WebSocket Server attached to HTTP server.');

            // Handle incoming connections
            handleWebSocketConnections(wss);
        });
    };

    register() {
        this.app.register(fastifyCors, {
            origin: "*",
            methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH']
        });

        this.app.register(productRoutes);
        this.app.register(categorieRoutes);
        this.app.register(sessionRoutes);
        this.app.register(orderRoutes);
        this.app.register(cashRegisterRoutes);
        this.app.register(paymentRoutes);
        this.app.register(tableRoutes);
        this.app.register(overviewRoutes);
        this.app.register(reportsRoutes);
    }
}