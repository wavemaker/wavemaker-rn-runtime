import axios from 'axios';
import { HttpClientService } from '@wavemaker/variables/src/types/http-client.service';
import { WS_CONSTANTS } from '@wavemaker/app-rn-runtime/variables/utils/variable.constants';
import { get } from 'lodash';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import injector from '@wavemaker/app-rn-runtime/core/injector';

export class HttpService implements HttpClientService {

  send(options: any, variable: any) {
    const serviceInfo = variable.serviceInfo;
    let headers: any = options.headers,
      requestBody: any = options.data,
      isProxyCall = isWebPreviewMode() ? get(serviceInfo, 'proxySettings.web') :  get(serviceInfo, 'proxySettings.mobile'),
      url: string = isProxyCall ? '.' + options.url : options.url;
    variable.cancelTokenSource = axios.CancelToken.source();
    if (!isWebPreviewMode() 
        && !(url.startsWith('http://') || url.startsWith("https://"))) {
        url = variable.config.baseUrl + '/' + url;
    }
    const methodType: string = serviceInfo.methodType;
    const isNonDataMethod: boolean = WS_CONSTANTS.NON_DATA_AXIOS_METHODS.indexOf(methodType.toUpperCase()) > -1;
    const axiosConfig = {
      headers: headers,
      cancelToken: variable.cancelTokenSource.token,
      withCredentials: ''
    };
    return new Promise((resolve, reject) => {
      // @ts-ignore
      axios[methodType].apply(variable, ( isNonDataMethod ? [url, axiosConfig] : [url, requestBody || {}, axiosConfig]))
        .then((result: any) => {
         resolve(result);
        }, (err: any) => {
          reject(err);
        })
    })
  }

  sendCall(requestParams: any, variable: any) {
    return new Promise((resolve, reject) => {
      this.send(requestParams, variable).then((response: any) => {
          resolve(response);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getLocale() {
    const appConfig = injector.get<AppConfig>('APP_CONFIG');
    return appConfig.appLocale.messages;
  }

  cancel(variable: any) {
    variable.cancelTokenSource.cancel();
  }
}

const httpService = new HttpService();

export default httpService;
