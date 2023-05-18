import axios from 'axios';
import { HttpClientService } from '@wavemaker/variables/src/types/http-client.service';
import { WS_CONSTANTS } from '@wavemaker/app-rn-runtime/variables/utils/variable.constants';
import { get, isEmpty } from 'lodash';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import injector from '@wavemaker/app-rn-runtime/core/injector';

export class HttpService implements HttpClientService {

  send(options: any, variable: any) {
    const serviceInfo = variable.serviceInfo;
    let headers: any = options.headers,
      requestBody: any = options.data,
      url: string = options.url;
      variable.cancelTokenSource = axios.CancelToken.source();
    if (!isWebPreviewMode() && (variable?.serviceInfo?.consumes||[])[0] === 'multipart/form-data') {
      headers['Content-Type'] = 'multipart/form-data';
      let formData = new FormData();
      (variable.serviceInfo.parameters||[]).forEach((p: any) => {
        const v = variable.dataBinding[p.name];
        if (v) {
          formData.append(p.name, variable.dataBinding[p.name]);
        }
      });
      requestBody = formData;
    }
    const methodType: string = serviceInfo.methodType;
    const isNonDataMethod: boolean = WS_CONSTANTS.NON_DATA_AXIOS_METHODS.indexOf(methodType.toUpperCase()) > -1;
    const axiosConfig = {
      headers: headers,
      cancelToken: variable.cancelTokenSource.token,
      withCredentials: true
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

  uploadFile(url: any, data: any, variable: any, options?: any) {
    const requestParams = {
      url: url,
      data: data
    }
    return new Promise((resolve, reject) => {
      return this.send(requestParams, variable).then((event: any) => {
        resolve(event.data);
      }, (error: any) => {
        reject(error);
      });
    });
  }
}

const httpService = new HttpService();

export default httpService;
