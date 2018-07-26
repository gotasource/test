import {Model} from "../gota-dao/Model";
import {Entity} from "../gota-dao/decorator";
import {Geographic} from "./Geographic";

//@Entity([{name: 'street', type: String}, {name: 'suite', type: String}, {name: 'city', type: String}, {name: 'zipcode', type: String}, {name: 'geographic', type: Geographic}])
@Entity()
export class Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geographic: Geographic
}