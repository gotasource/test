import {Model} from "../gota-dao/Model";
import {Entity} from "../gota-dao/decorator";

@Entity()
export class Category extends Model {
    siteId: String;
    name: String;
    avatars: String[];
    children: Category[];
    order: Number;
}