
import {Product} from "../models/Product";
import {Service, ServiceMapping} from '../gota-service';
import {Autowired, Config} from '../gota-injection';
import {ProductDAO} from '../data-access/ProductDAO';

@Service({path:'/store-service'})
export class StoreService{
    @Config()
    private database: object;

    @Autowired
    private productDao: ProductDAO;


    constructor(){
    }

    @ServiceMapping({path:'/database-config'})// Only demo service
    getDatabaseConfig(): object{
        return this.database;
    }

    //
    // @ServiceMapping({path:'/products'})
    // getSearch(@QueryParameter name:string): Array<Product>{
    //     return name ?  data.filter(product => product.name.includes(name)) : data;
    // }
    //
    // @ServiceMapping({path:'/products/:id', requestMethod: RequestMethod.GET})
    // getProduct(@PathParameter id:number): Product | {}{
    //     return data.filter(product => product.id === id.valueOf())[0] || {}
    // }

}