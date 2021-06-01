import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPartial from '@wavemaker/app-rn-runtime/components/page/partial/partial.component';
import BaseFragment, { FragmentProps } from './base-fragment.component';

export interface PartialProps extends FragmentProps {
}

export default class BasePartial extends BaseFragment<PartialProps> {
    private partialParams: any = {};
    
    constructor(props: PartialProps) {
        super(props);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
    }

    onWidgetInit(event: any, w: BaseComponent<any, any>) {
        super.onWidgetInit(event, w);
        if (w instanceof WmPartial) {
          this.targetWidget = w;
        }
      }
}