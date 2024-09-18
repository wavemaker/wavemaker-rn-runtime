import React from 'react';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPartial from '@wavemaker/app-rn-runtime/components/page/partial/partial.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import { ReactNode } from 'react';
import BasePrefab from './base-prefab.component';
import { Watcher } from './watcher';
import { View } from 'react-native';
import WmLottie from '../components/basic/lottie/lottie.component';

export interface PartialProps extends FragmentProps {
  serviceDefinitions: any;
  prefab: any;
  parent: any;
  onLoad?: Function;
  parentWatcher: Watcher;
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
        this.watcher = props.parentWatcher.create();
    }

    onFragmentReady() {
      return super.onFragmentReady().then(() => {
        this.onContentReady();
        this.invokeEventCallback('onLoad', [this]);
      });
    }

    get prefabname() {
      return this.Prefab?.props.prefabname;
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

    componentDidUpdate(prevProps: Readonly<PartialProps>, prevState: Readonly<PartialState>, snapshot?: any): void {
      super.componentDidUpdate(prevProps, prevState, snapshot);
      const parent: any = this.props.parent;
      if (parent) {
        parent.pageParams = (this as any).pageParams;
        parent.partialParams  = (this as any).pageParams;
        parent.Widgets = this.Widgets;
        parent.Variables = this.fragmentVariables;
      }
    }
 
    getDefaultStyles() {
        return 'app-partial';
    }

    
    abstract renderPartial(): ReactNode;

    renderWidget(props: PartialProps) {
      return this.renderPartial();
    }
}
