import axios from 'axios';
import { HttpClientService } from '@wavemaker/variables/src/types/http-client.service';
import { WS_CONSTANTS } from '@wavemaker/app-rn-runtime/variables/utils/variable.constants';
import { get } from 'lodash';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class HttpService implements HttpClientService {

  send(options: any, variable: any) {
    const serviceInfo = variable.serviceInfo;
    let headers: any = options.headers,
      requestBody: any = options.data,
      isProxyCall = isWebPreviewMode() ? get(serviceInfo, 'proxySettings.web') :  get(serviceInfo, 'proxySettings.mobile'),
      url: string = isProxyCall ? '.' + options.url : options.url;
    const cancelTokenSource = axios.CancelToken.source();
    const methodType: string = serviceInfo.methodType;
    const isNonDataMethod: boolean = WS_CONSTANTS.NON_DATA_AXIOS_METHODS.indexOf(methodType.toUpperCase()) > -1;
    const axiosConfig = {
      headers: headers,
      cancelToken: cancelTokenSource.token,
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
}

const httpService = new HttpService();

export default httpService;
