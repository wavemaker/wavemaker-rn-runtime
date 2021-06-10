import React from 'react';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { BaseComponent, BaseComponentState, BaseStyles, BaseProps, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME, { Theme, ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseVariable, VariableEvents } from '@wavemaker/app-rn-runtime/variables/base-variable'
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import Viewport, {EVENTS as viewportEvents} from '@wavemaker/app-rn-runtime/core/viewport';
import App from './App';

export interface FragmentProps extends BaseProps {

}

export interface FragmentState<T extends FragmentProps> extends BaseComponentState<T> {}

export type FragmentStyles = BaseStyles & {};

export default abstract class BaseFragment<P extends FragmentProps, S extends FragmentState<P>> extends BaseComponent<P, S, FragmentStyles> implements LifecycleListener {
    public App: App;
    public onReady: Function = () => {};
    public targetWidget = null as unknown as BaseComponent<any, any, any>;
    public Widgets: any = {};
    public Variables: any = {};
    public theme: Theme = BASE_THEME;
    private startUpVariables: string[] = [];
    private autoUpdateVariables: string[] = [];
    public Actions: any = {};
    public appConfig = injector.get<AppConfig>('APP_CONFIG');
    public cache = false;
    public refreshdataonattach= true;
    public fragments: any = {};
    public isDetached = false;

    constructor(props: P, defaultProps?: P) {
        super(props, undefined, undefined, defaultProps);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
        this.cleanup.push(Viewport.subscribe(viewportEvents.ORIENTATION_CHANGE, ($new: any, $old: any) => {
          !this.isDetached && this.targetWidget && this.targetWidget.invokeEventCallback('onOrientationchange', [null, this.proxy,
            {screenWidth: Viewport.width,
              screenHeight: Viewport.height}]);
        }));
        this.cleanup.push(Viewport.subscribe(viewportEvents.SIZE_CHANGE, ($new: any, $old: any) => {
          !this.isDetached && this.targetWidget && this.targetWidget.invokeEventCallback('onResize', [null, this.proxy,
            {screenWidth: $new.width,
              screenHeight: $new.height}]);
        }));
        this.cleanup.push(...Object.values({...this.Variables, ...this.Actions}).map(v => {
          return ((v as BaseVariable)
            .subscribe(VariableEvents.AFTER_INVOKE, () => this.App.refresh()));
        }));
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      this.Widgets[w.props.name] = w;
      if (w instanceof BaseFragment && w !== this) {
        this.fragments[w.props.name] = w;
      }
    }

    onComponentDestroy(w: BaseComponent<any, any, any>) {
      delete this.Widgets[w.props.name];
      if (w instanceof BaseFragment) {
        delete this.fragments[w.props.name];
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
      super.componentDidMount();
      this.onFragmentReady();
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.targetWidget && this.targetWidget.invokeEventCallback('onDestroy', [null, this.proxy]);
    }

    onFragmentReady() {
      return Promise.all(this.startUpVariables.map(s => this.Variables[s].invoke()))
      .then(() => {
        this.onReady();
        this.appConfig.refresh();
        this.targetWidget && this.targetWidget.invokeEventCallback('onLoad', [null, this.proxy]);
      });
    }

    onAttach() {
      this.isDetached = false;
      Object.values(this.fragments).forEach((f: any) => f.onAttach());
      this.targetWidget.invokeEventCallback('onAttach', [null, this.proxy]);
      if (this.refreshdataonattach) {
        Promise.all(this.startUpVariables.map(s => this.Variables[s].invoke()));
      }
    }

    onDetach() {
      this.isDetached = true;
      Object.values(this.fragments).forEach((f: any) => f.onDetach());
      this.targetWidget.invokeEventCallback('onDetach', [null, this.proxy]);
    }

    refresh() {
      (injector.get('AppConfig') as AppConfig).refresh();
    }

    forceUpdate() {
      super.forceUpdate();
      Object.values(this.fragments).forEach((f: any) => (f as BaseFragment<any, any>).forceUpdate());
    }

    render() {
      this.autoUpdateVariables.forEach(value => this.Variables[value].invokeOnParamChange());
      return (<ThemeProvider value={this.theme}>
        {this.renderWidget(this.props)}
      </ThemeProvider>);
    }
}


