import {ServerFilter} from "../filter/ServerFilter";
import {FileWrapper} from "../FileWrapper"
const encode = 'utf8';

async function runExecutor(request, response){
     try {
          let executorInformation = request.executorInformation;
          let execute = executorInformation.executor.method;
          let context =  executorInformation.executor.context;
          let argValues = request.argumentValues;

          let result = await Promise.resolve(execute.apply(context, argValues));
          response.result = result;
     }catch (err){
          console.log('Run Executor error: '+ err.message);
          console.log('class: '+ request.executorInformation.executor.context ? request.serviceExecutor.context.constructor.name:'');
          console.log('method: '+ request.executorInformation.executor.method ? request.serviceExecutor.method.name:'');
          console.log('\n'+ err.stack);
          console.log('\n');

          response.statusCode = 500;
          response.setHeader('Content-Type', 'text/plain');
          response.end('Internal Server Error\n');
          return;
     }
}

export class RunExecutorFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){
          await runExecutor(request, response);
          await next();
     }
}