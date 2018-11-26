import {QueryParameter, HeadersParameter, RequestMethod, Service, ServiceMapping, PathParameter, Body} from '../gota-service';
import {Config, Autowired} from '../gota-injection';
import {SiteInfo} from "../models/SiteInfo";
import {SiteInfoDAO} from "../data-access/SiteInfoDAO";
import {URL} from "url";
import {CategoryDAO} from "../data-access/CategoryDAO";
import {Category} from "../models/Category";
import {Product} from "../models/Product";
import {ProductDAO} from "../data-access/ProductDAO";
import {MongoConnection} from "../gota-dao/MongoConnection";

@Service({path:'/product-service' /*,models:[Category, Product]*/})
export class ProductService{
    @Autowired
    public categoryDAO: CategoryDAO;
    @Autowired
    public productDAO: ProductDAO;
    constructor(){}

    @ServiceMapping({path:'/products', requestMethod:RequestMethod.GET})
    getProducts(){
       // let products: Product = this.productDAO.
    }
}