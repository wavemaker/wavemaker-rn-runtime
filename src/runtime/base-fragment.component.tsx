import React from 'react';
import { Text, View } from 'react-native';
import AppConfig from '../core/AppConfig';
import injector from './injector';
import App from './App';
import { BaseComponent, BaseProps } from '@wavemaker/rn-runtime/core/base.component';
import BASE_THEME, { Theme } from '@wavemaker/rn-runtime/styles/theme';
import { deepCopy } from '@wavemaker/rn-runtime/core/utils';

export interface FragmentProps extends BaseProps {
  
}

export default class BaseFragment extends BaseComponent<FragmentProps> {
    public App: App;
    public onReady: Function = () => {};

    public Widgets: any = {};
    public Variables: any = {};
    public theme: Theme = BASE_THEME;
    private startUpVariables: string[] = [];
    private autoUpdateVariables: string[] = [];
    public Actions: any = {};
    public appConfig = injector.get<AppConfig>('APP_CONFIG');
    public cleanup: Function[] = [];

    constructor(props: FragmentProps, defaultProps?: FragmentProps) {
        super(props, undefined, undefined, defaultProps);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
    }

    onWidgetInit(w: BaseComponent<any>) {
      this.Widgets[w.props.name] = w;
    }

    onWidgetDestroy(w: BaseComponent<any>) {
      delete this.Widgets[w.props.name];
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
      Promise.all(this.startUpVariables.map(s => this.Variables[s].invoke()))
      .then(() => {
        this.appConfig.refresh();
        this.onReady();
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      this.cleanup.forEach(c => c());
    }

    refresh() {
      (injector.get('AppConfig') as AppConfig).refresh();
    }
      
    render() {
      return (<View><Text>Loading...</Text></View>);
    }
}


