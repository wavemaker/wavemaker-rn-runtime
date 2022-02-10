import { ActionConfig, BaseAction } from "./base-action";
import { SecurityService } from "@wavemaker/app-rn-runtime/core/security.service";
import { get } from 'lodash';
export interface LoginActionConfig extends ActionConfig {
    securityService: () => SecurityService;
    baseURL: String;
    useDefaultSuccessHandler: boolean;
}
export class LoginAction extends BaseAction<LoginActionConfig> {
    constructor(config: LoginActionConfig) {
        super(config);
    }

    invoke(options: any, successcb?: Function, errorcb?: Function) {
      let params;
      if (!get(options, 'formData')) {
        params = this.config.paramProvider();
      }
      return this.config.securityService().appLogin(
        {
          baseURL: this.config.baseURL,
          formData: get(options, 'formData') || params,
          useDefaultSuccessHandler: this.config.useDefaultSuccessHandler
      })
        .then((data: any) => {
            this.config.onSuccess && this.config.onSuccess(this, get(data, 'userInfo'));
            successcb && successcb(data);
            if (this.config.useDefaultSuccessHandler) {
              this.config.securityService().navigateToLandingPage(data);
            }
        })
        .catch((error: any) => {
            this.config.onError && this.config.onError(this, error);
            errorcb && errorcb(error);
        });
    }
}
