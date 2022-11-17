import { BaseVariable, VariableConfig, VariableEvents } from './base-variable';
import { ModelVariable as _ModelVariable } from '@wavemaker/variables/src/model/variable/model-variable';

export class ModelVariable extends _ModelVariable {

  constructor(config: VariableConfig) {
    const variable = {
      name: config.name,
      dataSet: config.paramProvider(),
      isList: config.isList
    }
    super(variable);
    this.invoke();
  }

  invoke(params?: {}, onSuccess?: Function, onError?: Function) {
    return super.execute(params, onSuccess);
    // this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);
    //  return super.execute(params, onSuccess).then(() => {
    //      // this.dataSet = this.params;
    //      // this.config.onSuccess && this.config.onSuccess(this, this.dataSet);
    //      // onSuccess && onSuccess(this, this.dataSet);
    //      // this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
    //  }, () => {
    //      // this.notify(VariableEvents.ERROR, [this, this.dataSet]);
    //  }).then(() => {
    //      // this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
    //      return this;
    //  });

  }
}
