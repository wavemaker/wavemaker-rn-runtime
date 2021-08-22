import React from 'react';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { Formatter } from '@wavemaker/app-rn-runtime/core/formatters';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { BaseComponent, BaseComponentState, BaseStyles, BaseProps, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME, { Theme, ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseVariable, VariableEvents } from '@wavemaker/app-rn-runtime/variables/base-variable'
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import Viewport, {EVENTS as viewportEvents} from '@wavemaker/app-rn-runtime/core/viewport';
import App from './App';
import WmFormField from "@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component";
import WmForm from "@wavemaker/app-rn-runtime/components/data/form/form.component";
import { isArray } from 'lodash-es';
import { ToastConsumer, ToastOptions, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';
import { SecurityConsumer, SecurityService } from '@wavemaker/app-rn-runtime/core/security.service';


export class FragmentProps extends BaseProps {

}

export interface FragmentState<T extends FragmentProps> extends BaseComponentState<T> {}

export type FragmentStyles = BaseStyles & {};

export default abstract class BaseFragment<P extends FragmentProps, S extends FragmentState<P>> extends BaseComponent<P, S, FragmentStyles> implements LifecycleListener {
    public App: App;
    public onReady: Function = () => {};
    public baseUrl = '';
    public targetWidget = null as unknown as BaseComponent<any, any, any>;
    public Widgets: any = {};
    public Variables: any = {};
    public theme: Theme = BASE_THEME;
    private startUpVariables: string[] = [];
    private startUpActions: string[] = [];
    private autoUpdateVariables: string[] = [];
    private cleanUpVariablesandActions: BaseVariable<any>[] = [];
    public fragmentVariables: any = {};
    public fragmentActions: any = {};
    public Actions: any = {};
    public appConfig = injector.get<AppConfig>('APP_CONFIG');
    public cache = false;
    public refreshdataonattach= true;
    public fragments: any = {};
    public isDetached = false;
    public _memoize = {} as any;
    private formWidgets: any = {};
    public toaster: any;
    public security: any;
    public formatters: Map<string, Formatter>;
    public serviceDefinitions = {} as any;

    constructor(props: P, defaultProps?: P) {
        super(props, undefined, undefined, defaultProps);
        this.App = this.appConfig.app;
        this.formatters = this.App.formatters;
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
        this.baseUrl = this.appConfig.url;
    }

    onComponentChange(w: BaseComponent<any, any, any>) {
      this.refresh();
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      const id = w.props.id || w.props.name;
      this.Widgets[id] = w;
      if (w instanceof WmForm) {
        this.Widgets[id].formWidgets = this.Widgets[id].formWidgets || {};
        // @ts-ignore
        var arr = this.formWidgets[w.props.id];
        if (arr) {
          for(var i = 0;i<arr.length;i++) {
            this.Widgets[id].formWidgets[arr[i].props.id] = arr[i];
          }
        }
      }
      if (w instanceof WmFormField) {
        if (this.Widgets[w.props.formRef]) {
          this.Widgets[w.props.formRef].formWidgets = this.Widgets[w.props.formRef].formWidgets || {};
          // @ts-ignore
          this.Widgets[w.props.formRef].formWidgets[w.props.id] = w;
        } else {
          this.formWidgets[w.props.formRef] = this.formWidgets[w.props.formRef] || [];
          this.formWidgets[w.props.formRef].push(w);
        }
      }
      if (w instanceof BaseFragment && w !== this) {
        this.fragments[id] = w;
      }
    }

    onComponentDestroy(w: BaseComponent<any, any, any>) {
      const id = w.props.id || w.props.name;
      delete this.Widgets[id];
      if (w instanceof BaseFragment) {
        delete this.fragments[id];
      }
      if (w instanceof WmForm) {
        delete this.formWidgets;
      }
    }

    handleUrl(url: string) {
      if (!url.startsWith('http') && !url.startsWith('file:')) {
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

    componentWillUnmount() {
      super.componentWillUnmount();
      this.targetWidget && this.targetWidget.invokeEventCallback('onDestroy', [null, this.proxy]);
    }

    memoize(key: string, o: any) {
      if (!this._memoize[key])  {
        this._memoize[key] = o;
      }
      return this._memoize[key];
    }

    onFragmentReady() {
      this.cleanup.push(...Object.values({...this.Variables, ...this.Actions}).map(v => {
        return ((v as BaseVariable<any>)
          .subscribe(VariableEvents.AFTER_INVOKE, () => this.App.refresh()));
      }));
      this.cleanUpVariablesandActions.push(...Object.values({...this.fragmentVariables, ...this.fragmentActions} as BaseVariable<any>));
      this.startUpActions.map(a => this.Actions[a] && this.Actions[a].invoke());
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
      this.cleanUpVariablesandActions.forEach((v: BaseVariable<any>) => v.resume());
      this.targetWidget.invokeEventCallback('onAttach', [null, this.proxy]);
      if (this.refreshdataonattach) {
        Promise.all(this.startUpVariables.map(s => this.Variables[s].invoke()));
      }
    }

    onDetach() {
      this.isDetached = true;
      Object.values(this.fragments).forEach((f: any) => f.onDetach());
      this.cleanUpVariablesandActions.forEach((v: BaseVariable<any>) => v.pause());
      this.targetWidget.invokeEventCallback('onDetach', [null, this.proxy]);
    }

    onDestroy() {
      this.cleanUpVariablesandActions.forEach((v: BaseVariable<any>) => v.destroy());
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
        <SecurityConsumer>
        {(securityService: SecurityService) => {
              this.security = securityService;
              if (securityService) {
                securityService.loggedInUser = this.Variables.loggedInUser;
              }
              return <ToastConsumer>
              {(toastService: ToastService) => {
                this.toaster = toastService;
                return this.renderWidget(this.props);
              }}
            </ToastConsumer>;
            }}
        </SecurityConsumer>
        
      </ThemeProvider>);
    }
}


