import {Entity, Model} from '../gota-dao';


@Entity()
export class Price extends Model {
    unit: String;
    value: Number;
    effected: Date;
    expired: Date;
    constructor(obj?: object) {
        super(obj);
    }
}