import {Hello} from "./service/Hello";
import {GotaApp, GotaBoot} from "./gota-boot/index";

@GotaApp({
    scanner: [Hello],
    config: {
        port: 3000
    }
})
class App{};

GotaBoot(App);
