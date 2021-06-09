import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPartial from '@wavemaker/app-rn-runtime/components/page/partial/partial.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import { ReactNode } from 'react';

export interface PartialProps extends FragmentProps {
}

export interface PartialState extends FragmentState<PartialProps> {}

export default abstract class BasePartial extends BaseFragment<PartialProps, PartialState> {
    private partialParams: any = {};
    
    constructor(props: PartialProps) {
        super(props);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      super.onComponentInit(w);
      if (w instanceof WmPartial) {
        this.targetWidget = w;
      }
    }

    abstract renderPartial(): ReactNode;

    renderWidget(props: PartialProps) {
      return this.renderPartial();
    }
}