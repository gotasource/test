import {ServerFilter} from "./ServerFilter";
import {FileWrapper} from "./FileWrapper"
const encode = 'utf8';

function getValueOfParam(buffer, param) {
     param +='="'; //Ex: name="userName"
     let value = undefined;
     let statIndex = buffer.indexOf(param, encode);
     if(statIndex > -1){
          statIndex += param.length;
          let endIndex = buffer.indexOf('"', statIndex);
          value = buffer.slice(statIndex, endIndex).toString(encode);
     }
     return value;
}

function getFileContentType(buffer) {
     let param = 'Content-Type: '; //Ex: name="userName"
     let value = undefined;
     let statIndex = buffer.indexOf(param, encode);
     if(statIndex > -1){
          statIndex += param.length;
          let endIndex = buffer.indexOf('\r\n\r\n', statIndex);
          value = buffer.slice(statIndex, endIndex).toString(encode);
     }
     return value;
}

function parseApplicationFormUrlEncoded(buffer){
     let body = {};
     let bufferLength = buffer.length;
     let sliceCharacters = '&';
     let components = buffer.toString(encode).split(sliceCharacters);
     components.forEach(component => {
          let name = component.split('=')[0];
          let value = component.split('=')[1];
          name = decodeURIComponent(name);
          value = decodeURIComponent(value);
          body[name] = value;
     });
     return body;
}


function parseMultiPartFormData(buffer){
     // https://www.stsbd.com/how-to-upload-large-images-optimally/
     // http://www.javascriptexamples.info/search/upload-file-to-server-javascript/1
     // http://igstan.ro/posts/2009-01-11-ajax-file-upload-with-pure-javascript.html
     let body = {};
     let bufferLength = buffer.length;
     let sliceCharacters = '\r\n------';
     while (bufferLength > 0) {
          let component = new Buffer(buffer.slice(0, buffer.indexOf(sliceCharacters)));
          buffer = new Buffer(buffer.slice(component.length + sliceCharacters.length));
          bufferLength = buffer.length;
          let name = getValueOfParam(component, 'name');
          if (name) {
               name = decodeURIComponent(name);
               // console.log('name:', name);
               let fileName = getValueOfParam(component, 'filename');
               if (fileName) {
                    // console.log('filename:', fileName);
                    let contentType = getFileContentType(component);
                    // console.log('contenttype:', contentType);
                    let content = new Buffer(component.slice((contentType + '\r\n\r\n').length + component.indexOf(contentType + '\r\n\r\n')));
                    // console.log('content:', content.toString(encode));

                    body[name] = new FileWrapper(fileName, contentType, content);

                    /*
                     fs.writeFile(fileName, content, "binary", function (err) {
                     if (err) {
                     console.log(err);
                     } else {
                     console.log("the file was saved!");
                     }
                     });
                     */
               } else {
                    let value = component.slice(component.indexOf('\r\n\r\n') + '\r\n\r\n'.length).toString(encode);
                    value = decodeURIComponent(value);
                    //console.log('value:', value);
                    body[name] = value;
               }
          }
     }
     return body;
}


function parseQuery(request){
     if(request.url.indexOf('?')>-1){
          let query = request.query || {};
          let components = request.url.substring(request.url.indexOf('?')+1);
          components = components.split('&');
          components.forEach(component =>{
               let name = component.split('=')[0];
               let value = component.split('=')[1];
               name = decodeURIComponent(name);
               value = decodeURIComponent(value);
               query[name] = value;
          });
          request.query = query
     }
}

function parseContent(request, response){
     let buffer = request.body;
     if(buffer.length>0){
          let body = buffer;
          let requestContentType = request.headers['content-type'];
          try {
               if(requestContentType){
                    if (requestContentType === 'application/x-www-form-urlencoded') {
                         body = parseApplicationFormUrlEncoded(buffer);
                    } else if (requestContentType.indexOf('multipart/form-data') > -1) {
                         body = parseMultiPartFormData(buffer);
                    } else if(requestContentType.indexOf('application/json') > -1){
                         body = buffer.toString(encode);
                         body = JSON.parse(body);
                    } else if(requestContentType.indexOf('text') > -1){
                         body = buffer.toString(encode);
                    }
               }
               request.body = body;
          } catch (err){
               response.statusCode = 400;
               response.setHeader('Content-Type', 'text/plain');
               response.end('Invalid Content Type\n');
               return;
          }
     }
}
export class ParseRequestBodyFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){
          parseQuery(request);
          parseContent(request, response);
          //
          await next();
     }
}