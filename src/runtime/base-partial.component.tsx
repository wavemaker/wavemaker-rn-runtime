import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPartial from '@wavemaker/app-rn-runtime/components/page/partial/partial.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import { ReactNode } from 'react';
import BasePrefab from './base-prefab.component';

export interface PartialProps extends FragmentProps {
  serviceDefinitions: any;
  prefab: any;
  parent: any;
  onLoad?: Function;
}

export interface PartialState extends FragmentState<PartialProps> {}

export default abstract class BasePartial extends BaseFragment<PartialProps, PartialState> {
    private partialParams: any = {};
    Prefab: BasePrefab = null as any;

    constructor(props: PartialProps) {
        super(props);
        const isPartOfPrefab = !!this.props.prefab;
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, isPartOfPrefab ? {} : this.App.Actions);
        this.Variables = Object.assign({}, isPartOfPrefab ? {} : this.App.Variables);
        this.serviceDefinitions = this.props.serviceDefinitions;
        if (isPartOfPrefab) {
          this.Prefab = this.props.prefab;
          this.baseUrl =this.Prefab.baseUrl;
        }
    }

    onFragmentReady() {
      return super.onFragmentReady().then(() => {
        const parent: any = this.props.parent;
        if (parent) {
          parent.Widgets = this.Widgets;
          parent.Variables = this.fragmentVariables;
        }
        this.invokeEventCallback('onLoad', [this]);
      });
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      super.onComponentInit(w);
      if (w instanceof WmPartial) {
        this.targetWidget = w;
      }
    }

    onComponentDestroy(w: BaseComponent<any, any, any>): void {
      super.onComponentDestroy(w);
      const parent: any = this.props.parent;
      if (parent) {
        delete (parent as any).Widgets;
        delete (parent as any).Variables;
      }
    }

    abstract renderPartial(): ReactNode;

    renderWidget(props: PartialProps) {
      return this.renderPartial();
    }
}