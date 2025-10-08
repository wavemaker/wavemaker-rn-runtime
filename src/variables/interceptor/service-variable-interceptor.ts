import { BaseInterceptor } from "@wavemaker/variables/src/interceptor";
import { ServiceVariable } from "../service-variable";
import { ServiceVariableContext } from "./intercept-context.impl";

export class ServiceVariableInterceptor extends BaseInterceptor<ServiceVariableContext> {

  private url: string;
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  
  constructor(options: {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
    match?: (ic: ServiceVariableContext) => boolean;
    intercept?: (context: ServiceVariableContext) => Promise<any>;
  }) {
    super({...options});
    this.url = options.url || '';
    this.method = options.method || 'GET';
  }

  match(ic: ServiceVariableContext) {
    if (!(ic.variable instanceof ServiceVariable)) {
      return false;
    }
    if (this.options.match) {
      return this.options.match(ic);
    }
    const serviceInfo = ic.variable.serviceInfo;
    const url = serviceInfo.directPath ||  serviceInfo.relativePath;
    const method = serviceInfo.httpMethod.toUpperCase();
    return url.endsWith(this.url) && method === this.method;
  }

  public async intercept(context: ServiceVariableContext) {
    if (this.options.intercept) {
      context.variable.dataSet = await  this.options.intercept(context);;
    } else {
      context.variable.dataSet = await context.proceed();
    }
    return context.variable.dataSet;
  }
}
