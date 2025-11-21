import { ICreateCategory } from "../interfaces/categorie.interface";
import CategorieRepositorie from "../repositories/CategorieRepositorie";
import { IProductsCreate } from "../interfaces/products.interface";
import { z } from "zod";


const categorieCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    isActive: z.boolean()
});

class CategorieUsecases {
    async createCategorie (data: ICreateCategory) {
        const validatedData = categorieCreateSchema.parse(data);
        return CategorieRepositorie.createCategory(validatedData);
    };

    async getCategories () {
        return CategorieRepositorie.getCategory();
    }
};


export default new CategorieUsecases;