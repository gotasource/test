import {Model, Entity} from "../gota-dao/index";

@Entity()
export class Product extends Model {
    categoryId: String;
    code: String;
    name:String;
    price:Number;
    description: string
    images:Array<{source:String, order: Number}>;
    order: number;
}