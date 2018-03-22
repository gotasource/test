import { Model } from "./Model";
export declare class Category extends Model {
    siteId: string;
    name: string;
    avatars: string[];
    children: Category[];
    order: Number;
}
