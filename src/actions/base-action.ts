import { BaseVariable, VariableConfig } from "@wavemaker/app-rn-runtime/variables/base-variable";
import {merge} from "lodash";

export interface ActionConfig extends VariableConfig {

}

export class BaseAction<T extends ActionConfig> extends BaseVariable<T> {

    constructor(config: T) {
        super(config);
    }

    setData(dataSet: any) {
        // @ts-ignore
        this.dataSet = merge(this.config.paramProvider(), dataSet);
    }
}
