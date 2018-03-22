import {QueryParameter, HeadersParameter, RequestMethod, Service, ServiceMapping, Config, Autowired, PathParameter, Body} from '../gota-service';
import {SiteInfo} from "../models/SiteInfo";
import {SiteInfoDAO} from "../data-access/SiteInfoDAO";
import {URL} from "url";
import {CategoryDAO} from "../data-access/CategoryDAO";
import {Category} from "../models/Category";

@Service({path:'/product-service', models:[Category]})
export class ProductService{
    @Autowired
    public categoryDAO: CategoryDAO;
    constructor(){

    }

    // }
}