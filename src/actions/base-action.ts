import { BaseVariable, VariableConfig } from "../variables/base-variable";

export interface ActionConfig extends VariableConfig {
    
}

export class BaseAction extends BaseVariable {

    constructor(config: VariableConfig) {
        super(config);
    }
}