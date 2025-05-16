import { Change, Worker } from '../change-log.service';
import { isObject, mapValues} from "lodash-es";
import { LocalDBStore } from '../../models/local-db-store';

export class MultiPartParamTransformer implements Worker {

    constructor() {}

    public postCallSuccess(change: Change) {
        if (change && change.service === 'DatabaseService') {
            switch (change.operation) {
                case 'insertMultiPartTableData':
                case 'updateMultiPartTableData':
                    // clean up files
                    Object.values(change.params.data).forEach((v: any) => {
                        if (typeof v === 'object' && v.wmLocalPath) {
                            // this.deviceFileService.removeFile(v.wmLocalPath);
                        }
                    });
                    break;
            }
        }
    }

    public async transformParamsFromMap(change: Change, store?: LocalDBStore) {
        if (change && change.service === 'DatabaseService') {
            switch (change.operation) {
                case 'insertMultiPartTableData':
                case 'updateMultiPartTableData':
                    // construct Form data
                    const formData = await store!.deserialize(change.params.data);
                    change.params.data = formData;
            }
        }
    }

    public async transformParamsToMap(change: Change, store?: LocalDBStore) {
        if (change && change.service === 'DatabaseService') {
            store = store!;
            switch (change.operation) {
                case 'insertMultiPartTableData':
                case 'updateMultiPartTableData':
                    const map = await store.serialize(change.params.data);
                    change.params.data = map;
                    /**
                     * As save method called with FormData object, empty row is inserted.
                     * Since FormData is converted to map, update the record details now.
                     */
                    store.save(mapValues(map, function (v) {
                        // @ts-ignore
                        return (isObject(v) && v.wmLocalPath) || v;
                    }));
                    return map;
            }
        }
    }
}
