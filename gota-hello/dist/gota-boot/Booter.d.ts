import "reflect-metadata";
export default class Booter {
    private static buildServiceWrapper;
    private static buildMethodWrappers;
    private static buildMethodWrapper;
    private static buildParameterWrappers;
    private static getArguments;
    private static collectServiceInformation;
    private static bootAcollectionServiceItem;
    private static bootCollectionService;
    private static collectOptionsServiceInformation;
    private static buildAOptionSummary;
    private static bootSummaryService;
    static bootService(server: any, service: any): void;
    static bootModels(server: any, servicePath: string, models: any[]): void;
    private static bootAModel;
}
