import { BaseVariable, VariableConfig } from "@wavemaker/app-rn-runtime/variables/base-variable";

export interface ActionConfig extends VariableConfig {
    
}

export class BaseAction extends BaseVariable {

    constructor(config: VariableConfig) {
        super(config);
    }
}