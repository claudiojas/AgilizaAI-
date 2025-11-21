import { FastifyInstance } from "fastify";
import { ICreateCategory } from "../interfaces/categorie.interface";
import CategorieUseCases from "../usecases/CategorieUseCases";
import ProductUseCases from "../usecases/ProductUseCases";

export async function categorieRoutes(app: FastifyInstance) {


    app.post<{ Body: ICreateCategory }>('/categorie', async (request, reply) => {

        try {
            const categorie = await CategorieUseCases.createCategorie(request.body)
            return reply.status(201).send(categorie);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
                return reply.status(409).send({
                    success: false,
                    error: "A category with this name already exists."
                });
            }
            console.error("Error creating category:", error);
            return reply.status(400).send({ 
                success: false,
                error: "Invalid data for category creation."
            });
        }
    });

    app.get('/categories', async (_, reply) =>{
        const categories = await CategorieUseCases.getCategories();
        return await reply.status(200).send(categories);
    })

    app.get<{ Params: { id: string } }>('/categories/:id/products', async (request, reply) => {
        const { id } = request.params;
        try {
            const products = await ProductUseCases.getProductsByCategoryId(id);
            return reply.status(200).send(products);
        } catch (error) {
            console.error(`Error fetching products for category ${id}:`, error);
            return reply.status(500).send({
                success: false,
                error: "Unable to search for products."
            });
        }
    });

};