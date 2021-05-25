import React, { Fragment } from 'react';
import { Text, View } from 'react-native';
import AppConfig from '../core/AppConfig';
import injector from './injector';
import App from './App';
import { BaseComponent, BaseComponentState, BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME, { Theme } from '@wavemaker/app-rn-runtime/styles/theme';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import Viewport, {EVENTS as viewportEvents} from '@wavemaker/app-rn-runtime/core/viewport';

export interface FragmentProps extends BaseProps {
  
}

export default class BaseFragment<T extends FragmentProps> extends BaseComponent<T, BaseComponentState<T>> {
    public App: App;
    public onReady: Function = () => {};
    public targetWidget = null as unknown as BaseComponent<any, any>;
    public Widgets: any = {};
    public Variables: any = {};
    public theme: Theme = BASE_THEME;
    private startUpVariables: string[] = [];
    private autoUpdateVariables: string[] = [];
    public Actions: any = {};
    public appConfig = injector.get<AppConfig>('APP_CONFIG');
    public cache = false;
    public refreshdataonattach= true;
    public fragments = [] as BaseFragment<any>[];

    constructor(props: T, defaultProps?: T) {
        super(props, undefined, undefined, defaultProps);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
        this.cleanup.push(Viewport.subscribe(viewportEvents.ORIENTATION_CHANGE, ($new: any, $old: any) => {
          this.targetWidget && this.targetWidget.invokeEventCallback('onOrientationchange', [null, this.proxy, 
            {screenWidth: Viewport.width, 
              screenHeight: Viewport.height}]);
        }));
        this.cleanup.push(Viewport.subscribe(viewportEvents.SIZE_CHANGE, ($new: any, $old: any) => {
          this.targetWidget && this.targetWidget.invokeEventCallback('onResize', [null, this.proxy,
            {screenWidth: $new.width,
              screenHeight: $new.height}]);
        }));
    }

    onWidgetInit($event: any, w: BaseComponent<any, any>) {
      this.Widgets[w.props.name] = w;
      if (w instanceof BaseFragment) {
        this.fragments.push(w as BaseFragment<any>);
      }
    }

    onWidgetDestroy($event: any, w: BaseComponent<any, any>) {
      delete this.Widgets[w.props.name];
      if (w instanceof BaseFragment) {
        const i = this.fragments.findIndex(v => v === w);
        this.fragments.splice(i, 1);
      }
    }

    handleUrl(url: string) {
      if (!url.startsWith('http')) {
        return this.appConfig.url + (url.startsWith('/') ? '' : '/') + url;
      }
      return url;
    }

    getStyle(classes: string, inlineStyles:any = {}) {
      if (classes && classes.trim().length > 0) {
        return deepCopy({}, this.theme.getStyle(classes), inlineStyles);
      }
      return inlineStyles;
    }

    eval(fn: Function, failOnError = false) {
      try {
        return fn.call(this);
      } catch (e) {
        if (failOnError) {
          throw e;
        } else {
          return null;
        }
      }
    }

    componentDidMount() {
      this.onFragmentReady();
    }

    onFragmentReady() {
      return Promise.all(this.startUpVariables.map(s => this.Variables[s].invoke()))
      .then(() => {
        this.appConfig.refresh();
        this.onReady();
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      this.cleanup.forEach(c => c());
    }

    onAttach() {
      this.fragments.forEach(f => f.onAttach());
      this.targetWidget.invokeEventCallback('onAttach', [null, this.proxy]);
      if (this.refreshdataonattach) {
        Promise.all(this.startUpVariables.map(s => this.Variables[s].invoke()));
      }
    }

    onDetach() {
      this.fragments.forEach(f => f.onDetach());
      this.targetWidget.invokeEventCallback('onDetach', [null, this.proxy]);
    }

    refresh() {
      (injector.get('AppConfig') as AppConfig).refresh();
    }
      
    render() {
      return (<View><Text>Loading...</Text></View>);
    }
}


