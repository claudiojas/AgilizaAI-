export interface ICreateCategory {
    name: string,
    isActive: boolean
}

export interface ICategory {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}