import { Model } from "../gota-dao/Model";
export declare class Product extends Model {
    categoryId: string;
    code: string;
    name: string;
    price: number;
    description: string;
    images: Array<{
        source: string;
        order: number;
    }>;
    order: number;
}
