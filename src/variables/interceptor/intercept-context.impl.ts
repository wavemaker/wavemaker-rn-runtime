import { InterceptContext } from "@wavemaker/variables/src/interceptor";
import { SessionStorageService, TemporaryStorageService } from "@wavemaker/variables/src/interceptor";
import networkService from "@wavemaker/app-rn-runtime/core/network.service";
import { ServiceVariable } from "../service-variable";
import { PersistentStorageService } from "./persistent.storage";

export abstract class InterceptContextImpl<V> extends InterceptContext<V> {

    private app: any;
    private securityInfo: any;
    
    constructor(variable: V, private readonly options: {
        keyPrefix: string;
        proceed: <C extends InterceptContext<V>> (context: C) => Promise<any>;
    }) {
        super(variable, {
            temp: TemporaryStorageService.getInstance(options.keyPrefix),
            session: SessionStorageService.getInstance(options.keyPrefix),
            persistent: PersistentStorageService.getInstance(options.keyPrefix)
        });
        this.app = (variable as any).appConfig.app;
    }

    public get isOnline() {
        return networkService.getState().isConnected;
    }

    private async _getSecurityInfo() {
        if (!this.securityInfo) {
            this.securityInfo = await this.app.getSecurityInfo();
        }
        return this.securityInfo;
    }

    public async getLoggedInUser() {
        return this._getSecurityInfo().then(securityInfo => securityInfo.userInfo);
    }

    public async getSecurityInfo() {
        return this._getSecurityInfo().then(securityInfo => securityInfo.isAuthenticated);
    }

    async proceed(): Promise<any> {
        return this.options.proceed(this);
    }
}

export class ServiceVariableContext extends InterceptContextImpl<ServiceVariable> {

    public readonly params: any;

    constructor(v: ServiceVariable,
        params: any,
        options: {
            keyPrefix: string;
            proceed: <ServiceVariableContext> (context: ServiceVariableContext) => Promise<any>;
        }) 
    {
      super(v, options);
      this.params = params;
    }

}
