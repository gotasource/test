import { Model } from "../gota-dao/Model";
export declare class Category extends Model {
    siteId: string;
    name: string;
    avatars: string[];
    children: Category[];
    order: number;
}
