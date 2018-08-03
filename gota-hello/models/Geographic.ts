import {Entity} from "../gota-dao/index";
//@Entity([{name: 'latitude', type: Number}, {name: 'longitude', type: Number}])
@Entity()
export class Geographic{
    latitude: Number;
    longitude: Number;
}