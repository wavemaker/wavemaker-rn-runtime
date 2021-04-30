import React from 'react';
import { Text, View } from 'react-native';
import AppConfig from '../core/AppConfig';
import injector from './injector';
import App from './App';
import { BaseComponent, BaseProps } from '../core/base.component';
import BASE_THEME, { Theme } from '../styles/theme';

export interface FragmentProps extends BaseProps {
  
}

export default class BaseFragment extends BaseComponent<FragmentProps> {
    public App: App;
    public onReady: Function = () => {};

    public Widgets: any = {};
    public Variables: any = {};
    private theme: Theme = BASE_THEME;
    private startUpVariables: string[] = [];
    private autoUpdateVariables: string[] = [];
    public Actions: any = {};
    public appConfig = injector.get<AppConfig>('APP_CONFIG');
    public cleanup: Function[] = [];

    constructor(props: FragmentProps) {
        super(props);
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

    getStyle(classes: string) {
      return this.theme.getStyle(classes);
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


