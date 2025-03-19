import React from 'react';
import { View } from 'react-native';

import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import PartialService, { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';
import WmPrefabContainer from '@wavemaker/app-rn-runtime/components/prefab/prefab-container.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import { Watcher } from './watcher';


export interface CustomWidgetProps extends FragmentProps {
  widgetname: string;
  parentWatcher: Watcher;
}

export interface CustomWidgetState extends FragmentState<CustomWidgetProps> {}

export default abstract class BaseCustomWidget extends BaseFragment<CustomWidgetProps, CustomWidgetState> {

    private appUrl = '';
    private widgetParams: any = {};
    private _renderCustomWidget:() => React.ReactNode = null as any;

    constructor(props: CustomWidgetProps, defualtProps: CustomWidgetProps, private partialService: PartialService) {
      super(props, defualtProps);
      this.App = this.appConfig.app;
      this.Actions = {};
      this.Variables = {};
      this.appUrl = this.appConfig.url;
      this.resourceBaseUrl = `${this.baseUrl}/app/custom-widgets/${props.widgetname}`;
      this.baseUrl = `${this.baseUrl}/custom-widgets/${props.widgetname}`;
      this.watcher = props.parentWatcher.create();
    }
    onComponentInit(w: BaseComponent<any, any, any>) {
      super.onComponentInit(w);
      if (w instanceof WmPrefabContainer) {
        this.targetWidget = w;
      }
    }

    onFragmentReady(): Promise<void> {
      this._renderCustomWidget = () => {
        const component = this.renderCustomWidget();
        super.onFragmentReady()
        .then(() => {
          this.onContentReady();
          this.invokeEventCallback('onLoad', [null, this]);
        });
        this._renderCustomWidget = () => this.renderCustomWidget();
        return component;
      };
      this.refresh();
      return Promise.resolve();
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.invokeEventCallback('onDestroy', [null, this]);
    }

    abstract renderCustomWidget(): React.ReactNode;
    
    renderWidget(props: CustomWidgetProps) {
      return (
        <PartialProvider value={this.partialService}>
            {this._renderCustomWidget ? this._renderCustomWidget(): null}
        </PartialProvider>
      );
    }
}
