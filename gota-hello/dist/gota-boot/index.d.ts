import "reflect-metadata";
export declare function GotaApp(obj: {
    name?: string;
    scanner: Array<Function>;
    config: object;
}): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function GotaBoot(appClass: Function): void;
