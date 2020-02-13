import { StoreService } from '../service/StoreService';
import {GotaApp, GotaBoot} from '../gota-boot';

@GotaApp({
    name: 'StoreApp',
    scanner: [ StoreService ],
    config: {
        hostName : 'localhost',
        port: 3001,
        devMode:true,
        database: {
            url: 'mongodb+srv://admin:klvpMybpkeVelyPv@cluster0-dnxsm.mongodb.net/test?retryWrites=true&w=majority',
            // host: 'localhost',
            // port: 27017,
            // user: 'admin',
            // password: 'klvpMybpkeVelyPv',
            // databaseName:'dtc'
        }
    }
})
export class StoreApp{};
GotaBoot(StoreApp);
