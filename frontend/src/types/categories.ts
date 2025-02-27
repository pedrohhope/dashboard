export interface Category {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface GetCategoriesDto {
    page: number;
    limit: number;
    search?: string;
}

export interface GetCategoriesResponse {
    categories: Category[];
}