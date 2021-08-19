import React from 'react';

import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import PartialService, { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';
import WmPrefabContainer from '@wavemaker/app-rn-runtime/components/prefab/prefab-container.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import axios from 'axios';


export interface PrefabProps extends FragmentProps {
  prefabname: string;
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
    private showPrefab = false;
    
    constructor(props: PrefabProps, defualtProps: PrefabProps, private partialService: PartialService) {
      super(props, defualtProps);
      this.App = this.appConfig.app;
      this.Actions = {};
      this.Variables = {};
      this.appUrl = this.appConfig.url;
      this.baseUrl = `${this.baseUrl}/prefabs/${props.prefabname}`;
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

    componentDidMount() {
      super.componentDidMount();
      this.showPrefab = true;
      this.invokeEventCallback('onLoad', [null, this]);
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.invokeEventCallback('onDestroy', [null, this]);
    }

    abstract renderPrefab(): React.ReactNode;

    renderWidget(props: PrefabProps) {
      Object.keys(this.props).forEach(k => {
        //@ts-ignore
        this[k] = this.state.props[k] || this.props[k];
      });
      return (
        <PartialProvider value={this.partialService}>
          {this.showPrefab ? this.renderPrefab() : null}
        </PartialProvider>
      );
    }
}