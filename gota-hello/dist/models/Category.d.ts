import { Model } from "../gota-dao/Model";
export declare class Category extends Model {
    siteId: String;
    name: String;
    avatars: String[];
    children: Category[];
    order: Number;
}
