import React from 'react';
import { View } from 'react-native';
import { merge } from 'lodash-es';

import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import PartialService, { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';
import WmPrefabContainer from '@wavemaker/app-rn-runtime/components/prefab/prefab-container.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import axios from 'axios';
import { Watcher } from './watcher';


export interface PrefabProps extends FragmentProps {
  prefabname: string;
  parentWatcher: Watcher;
}

export interface PrefabState extends FragmentState<PrefabProps> {}

export default abstract class BasePrefab extends BaseFragment<PrefabProps, PrefabState> {

    private static SERVICE_DEFINITION_CACHE = {} as any;

    public static getServiceDefinitions = (prefabName: string, url: string) => {
      const defs = BasePrefab.SERVICE_DEFINITION_CACHE[prefabName];
      if (defs) {
        return Promise.resolve(defs);
      } else {
        return axios.get(url + '/servicedefs')
          .catch(() => ({}))
          .then((response: any) => {
              const serviceDefinitions = response?.data?.serviceDefs || {};
              BasePrefab.SERVICE_DEFINITION_CACHE[prefabName] = serviceDefinitions;
              return Promise.resolve(serviceDefinitions);
          });
      }
    };

    private appUrl = '';
    private prefabParams: any = {};
    private _renderPrefab:() => React.ReactNode = null as any;

    constructor(props: PrefabProps, defualtProps: PrefabProps, private partialService: PartialService) {
      super(props, defualtProps);
      this.App = this.appConfig.app;
      this.Actions = {};
      this.Variables = {};
      this.appUrl = this.appConfig.url;
      this.resourceBaseUrl = `${this.baseUrl}/app/prefabs/${props.prefabname}`;
      this.baseUrl = `${this.baseUrl}/prefabs/${props.prefabname}`;
      this.watcher = props.parentWatcher.create();
    }

    getServiceDefinitions() {
      return BasePrefab.getServiceDefinitions(this.props.prefabname, `${this.appUrl}/services/prefabs/${this.props.prefabname}`);
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      super.onComponentInit(w);
      if (w instanceof WmPrefabContainer) {
        this.targetWidget = w;
      }
    }

    getDefaultStyles() {
        return 'app-prefab';
    }

    onFragmentReady(): Promise<void> {
      this._renderPrefab = () => {
        const component = this.renderPrefab();
        super.onFragmentReady()
        .then(() => {
          this.onContentReady();
          this.invokeEventCallback('onLoad', [null, this]);
        });
        this._renderPrefab = () => this.renderPrefab();
        return component;
      };
      this.refresh();
      return Promise.resolve();
    }

    resetAppLocale() {
      this.appLocale = merge({ }, this.appConfig.appLocale.messages, this.appConfig.appLocale.prefabMessages[this.props.prefabname]);
      Object.values(this.fragments).forEach((f: any) => (f as BaseFragment<any, any>).resetAppLocale());
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.invokeEventCallback('onDestroy', [null, this]);
    }

    abstract renderPrefab(): React.ReactNode;

    renderWidget(props: PrefabProps) {
      return (
        <PartialProvider value={this.partialService}>
          <View style={[{width: '100%'}, props.styles?.root]}>
            {this._renderPrefab ? this._renderPrefab(): null}
          </View>
        </PartialProvider>
      );
    }
}
