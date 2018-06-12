
**Gota Framework** support developer build  services base on **NodeJS** Environment and **TypeScript** language.


# Create A Service Class

## Class Mapping
We use decorator *Service* before a class
Interface API:
```javascript
 function Service(mapping: {
    name?: string;
    path: string | Array<string>;
    config?: object;
    models?: Array<any>;
})
```

 - *name*: name of service, default is class name.
 - *path*: url(s) of service, default is **Hyphen(Dash)** case of class name. (https://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/)
 - *config*: dependency injection (more detail).
 - *models*: auto generate service  (more detail).

Example:
```javascript
@Service({path:'/user-service'})
export class UserService{
    ..........
}
```
## Method Mapping
We use decorator *Mapping* before a method.
**Return** data or **Awaited** data will be convert to JSON and response to client.
Interface API:
```javascript
function ServiceMapping(mapping: {
    path: string | Array<string>;
    requestMethod?: string | Array<string>;
})
```
 - *path*: url(s) of service, default is **Hyphen(Dash)** case of method name. 
 - *requestMethod*: method(s) GET | POST | PATCH | PUT | DELETE.

Example:
```javascript
@Service({path:'/user-service'})
export class UserService{
	...
    @ServiceMapping('/users')
    async readAll():Promise<User[]>{
        ...
    }
    
}
```

## Parameter Mapping
We use one of decorators: *PathParameter, Body, BodyParameter, Query, QueryParameter, Headers, HeadersParameter, Request, Response* before a parameter of method.
#### Body Mapping
####  Query Mapping
#### Header Mapping
# Start A Service Class
# Dependency injection
## Data Injection
## Singleton instance (of class)  Injection
