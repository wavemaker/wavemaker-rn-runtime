import injector from '@wavemaker/app-rn-runtime/core/injector';
import PartialService from '@wavemaker/app-rn-runtime/core/partial.service';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';

export class PartialServiceImpl implements PartialService {

    public constructor(private partials = null as any) {

    }

    get(partialName: string, params?: {isPrefab: boolean, name: string}) {
        if (!this.partials) {
            this.partials = injector.get<AppConfig>('APP_CONFIG').partials;
        }
        
        if(params?.isPrefab) {
            let prefabPartials;
            injector.get<AppConfig>('APP_CONFIG').prefabs?.partials?.forEach(item => {
                if(item.prefabName === params.name){
                    prefabPartials = item.partials;
                }
            })
            const targetPartial = prefabPartials && (prefabPartials as any).find((p: any) => p.name === partialName);
            return (targetPartial as any)?.component;
        }

        const partial = this.partials.find((p: any) => p.name === partialName);
        return partial?.component;
    }
}

export default new PartialServiceImpl();