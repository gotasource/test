import {Model,Entity} from "../gota-dao/index";


export class SiteInfo extends Model {
    public name:string;
    public phones: Array<string>;
    public email: string;
    public address: Array<string>;
    public facebook: string;
    public website: string;
    public introduction:string;
}