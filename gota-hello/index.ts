import {Hello} from "./service/Hello";
import {GotaApp, GotaBoot} from "./gota-boot/index";

@GotaApp({
    name: 'Hello',
    scanner: [Hello],
    config: {
        port: 3000,
        devMode:true
    }
})
class App{};

GotaBoot(App);
