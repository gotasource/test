import "reflect-metadata";
export default class Booter {
    private static buildServiceWrapper(service);
    private static buildMethodWrappers(service);
    private static buildMethodWrapper(service, methodName);
    private static buildParameterWrappers(service, methodName);
    private static getArguments(request, response, parameterWrappers);
    private static collectServiceInformation(serviceWrapper);
    private static bootAcollectionServiceItem(server, serviceInformation);
    private static bootCollectionService(server, collectionService);
    private static collectOptionsServiceInformation(serviceInformationList);
    private static buildAOptionSummary(url, object);
    private static bootSummaryService(server, path, optionServiceInformationList);
    static bootService(server: any, service: any): void;
    static bootModels(server: any, servicePath: string, models: any[]): void;
    private static bootAModel(server, servicePath, model);
}
