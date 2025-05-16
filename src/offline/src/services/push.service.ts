import { LVService } from '@wavemaker/variables';

import { Change, PushService } from './change-log.service';

export class PushServiceImpl implements PushService {

    // Returns a promise from the observable.
    private getPromiseFromObs(cb: any) {
        return new Promise((resolve, reject) => {
            cb.subscribe((response: any) => {
                if (response && response.type) {
                    resolve(response);
                }
            }, reject);
        });
    }

    public push(change: Change): Promise<any> {
        const params = change.params;
        switch (change.service) {
            case 'DatabaseService':
                switch (change.operation) {
                    case 'insertTableData':
                        return this.getPromiseFromObs(LVService.insertTableData(change.params, null, null));
                    case 'insertMultiPartTableData':
                        return this.getPromiseFromObs(LVService.insertMultiPartTableData(change.params, null, null));
                    case 'updateTableData':
                        return this.getPromiseFromObs(LVService.updateTableData(change.params, null, null));
                    case 'updateMultiPartTableData':
                        return this.getPromiseFromObs(LVService.updateMultiPartTableData(change.params, null, null));
                    case 'deleteTableData':
                        return this.getPromiseFromObs(LVService.deleteTableData(change.params, null, null));
                }
            case 'OfflineFileUploadService':
                if (change.operation === 'uploadToServer') {
                    // return this.deviceFileUploadService['uploadToServer'].call(
                    //     this.deviceFileUploadService,
                    //     params.serverUrl,
                    //     params.ftOptions.fileKey,
                    //     params.file,
                    //     params.ftOptions.fileName,
                    //     params.params,
                    //     params.headers);
                }
        }
        return Promise.reject( `${change.service} service with operation ${change.operation} is not supported for push.`);
    }
}
