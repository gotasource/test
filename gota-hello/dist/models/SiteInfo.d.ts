import { Model } from "../gota-dao/Model";
export declare class SiteInfo extends Model {
    name: string;
    phones: Array<string>;
    email: string;
    address: Array<string>;
    facebook: string;
    website: string;
    introduction: string;
}
