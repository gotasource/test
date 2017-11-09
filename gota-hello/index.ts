import {GotaApp, GotaBoot} from "gota-boot";
import {Hello} from "./service/Hello";

@GotaApp({
    scanner: [Hello],
    config: {
        port: 3000
    }
})
class App{};

GotaBoot(App);
