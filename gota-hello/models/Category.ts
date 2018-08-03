import {Model,Entity} from "../gota-dao/index";

@Entity()
export class Category extends Model {
    siteId: String;
    name: String;
    avatars: String[];
    children: Category[];
    order: Number;
}