// import { Observable, from } from 'rxjs';

// import { AbstractHttpService } from '@wm/core';
// import { NetworkService } from '@wm/mobile/core';

// import { ChangeLogService } from '../services/change-log.service';
// import { LocalDBManagementService } from '../services/local-db-management.service';
// import { WM_LOCAL_OFFLINE_CALL } from './utils';
// import {extend, get, isEmpty, trim} from "lodash-es";

// const NUMBER_REGEX = /^\d+(\.\d+)?$/;
// let isOfflineBehaviourAdded = false;
// export class NamedQueryExecutionOfflineBehaviour {

//     constructor(
//         private changeLogService: ChangeLogService,
//         private httpService: AbstractHttpService,
//         private localDBManagementService: LocalDBManagementService,
//         private networkService: NetworkService
//     ) {

//     }

//     public add () {
//         if (isOfflineBehaviourAdded) {
//             return;
//         }
//         isOfflineBehaviourAdded = true;
//         const orig = this.httpService.sendCallAsObservable;
//         this.httpService.sendCallAsObservable = (reqParams: any, params?: any): Observable<any> => {
//             if (!params && get(reqParams, 'url')) {
//                 params = {url: reqParams.url};
//             }
//             if (!this.networkService.isConnected() && params.url.indexOf('/queryExecutor/') > 0) {
//                 return from(this.executeLocally(params));
//             } else {
//                 return orig.call(this.httpService, reqParams, params);
//             }
//         };
//     }

//     private executeLocally(params: any): Promise<any> {
//         const url = params.url,
//             hasUrlParams = url.indexOf('?') > 0,
//             dbName = this.substring(url, 'services/', '/queryExecutor'),
//             queryName = this.substring(url, 'queries/', hasUrlParams ? '?' : undefined),
//             urlParams = hasUrlParams ? this.getHttpParamMap(this.substring(url, '?', undefined)) : {},
//             dataParams = this.getHttpParamMap(params.dataParams),
//             queryParams = extend(urlParams, dataParams);
//         return this.localDBManagementService.executeNamedQuery(dbName, queryName, queryParams)
//             .then(result => {
//                 const rows = result.rows;
//                 if (result.rowsAffected) {
//                     return this.changeLogService.add('WebService', 'invokeJavaService', params)
//                         .then(() => result.rowsAffected);
//                 } else {
//                     return {
//                         type: WM_LOCAL_OFFLINE_CALL,
//                         body: {
//                             totalPages: rows && rows.length > 0 ? 1 : 0,
//                             totalElements: rows.length,
//                             first: true,
//                             sort: null,
//                             numberOfElements: rows.length,
//                             last: true,
//                             size: params.size,
//                             number: 0,
//                             content: rows
//                         }
//                     };
//                 }
//             });
//     }

//     private substring(source: string, start: string, end: string): string {
//         if (start) {
//             const startIndex = source.indexOf(start) + start.length,
//                 endIndex = end ? source.indexOf(end) : undefined;
//             return source.substring(startIndex, endIndex);
//         }
//         return undefined;
//     }

//     private getHttpParamMap(str: string): any {
//         const result = {};
//         if (str) {
//             str = decodeURIComponent(str);
//             str.split('&').forEach(c => {
//                 const csplits = c.split('=');
//                 if (isEmpty(trim(csplits[1])) || !NUMBER_REGEX.test(csplits[1])) {
//                     result[csplits[0]] = csplits[1];
//                 } else {
//                     result[csplits[0]] = parseInt(csplits[1], 10);
//                 }
//             });
//         }
//         return result;
//     }
// }
