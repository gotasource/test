import {Model, Entity} from "../gota-dao/index";
import {Price} from './Price';

@Entity()
export class Product extends Model {
    // categoryId: String;
    code: String;
    name:String;
    unit: String;
    prices:Array<Price>;
    description: String
    // images:Array<{source:String, order: Number}>;
    // order: number;
}