import React from 'react';
import { Text } from 'react-native';
import { get, filter, isNil } from 'lodash';

import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { Formatter } from '@wavemaker/app-rn-runtime/core/formatters';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { toBoolean, toNumber } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState, BaseStyles, BaseProps, LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME, { Theme, ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseVariable, VariableEvents } from '@wavemaker/app-rn-runtime/variables/base-variable';
import { default as _viewPort, EVENTS as viewportEvents } from '@wavemaker/app-rn-runtime/core/viewport';
import App from './App';
import WmFormField from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';
import WmForm from '@wavemaker/app-rn-runtime/components/data/form/form.component';
import { ToastConsumer, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';
import spinnerService from '@wavemaker/app-rn-runtime/runtime/services/app-spinner.service';

import AppI18nService from './services/app-i18n.service';
import { Watcher } from './watcher';

export class FragmentProps extends BaseProps {

}

export interface FragmentState<T extends FragmentProps> extends BaseComponentState<T> {}

export type FragmentStyles = BaseStyles & {};
export default abstract class BaseFragment<P extends FragmentProps, S extends FragmentState<P>> extends BaseComponent<P, S, FragmentStyles> implements LifecycleListener {
    public App: App;
    public onReady: Function = () => {};
    public baseUrl = '';
    public resourceBaseUrl = '';
    public targetWidget = null as unknown as BaseComponent<any, any, any>;
    public Widgets: any = {};
    public Variables: any = {};
    public theme: Theme = BASE_THEME;
    public appLocale: any = {};
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
    public toaster: any;
    public formatters: Map<string, Formatter>;
    public serviceDefinitions = {} as any;
    public Viewport = _viewPort;
    public loadingMessage = React.createElement(Text, [] as any, ['loading...']);
    public showContent = false;
    public notification = {
                            text: '',
                            title: '',
                            okButtonText: '',
                            cancelButtonText: '',
                            onOk: () => {},
                            onCancel: () => {},
                            onClose: () => {}
                          };
    public watcher: Watcher = null as any;
    constructor(props: P, defaultProps?: P) {
        super(props, null as any, defaultProps);
        this.App = this.appConfig.app;
        this.formatters = this.App.formatters;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
        this.cleanup.push(_viewPort.subscribe(viewportEvents.ORIENTATION_CHANGE, ($new: any, $old: any) => {
          !this.isDetached && this.targetWidget && this.targetWidget.invokeEventCallback('onOrientationchange', [null, this.proxy,
            {screenWidth: _viewPort.width,
              screenHeight: _viewPort.height}]);
        }));
        this.cleanup.push(_viewPort.subscribe(viewportEvents.SIZE_CHANGE, ($new: any, $old: any) => {
          !this.isDetached && this.targetWidget && this.targetWidget.invokeEventCallback('onResize', [null, this.proxy,
            {screenWidth: $new.width,
              screenHeight: $new.height}]);
        }));
        this.cleanup.push(() => this.theme?.destroy());
        this.baseUrl = this.appConfig.url;
        this.resourceBaseUrl = this.appConfig.url;
        this.cleanup.push(() => this.onDestroy());
    }

    onContentReady() {
      this.onReady();
      this.appConfig.refresh();
      this.targetWidget && this.targetWidget.invokeEventCallback('onLoad', [null, this.proxy]);
      this.onContentReady = () => {};
    }

    onComponentChange(w: BaseComponent<any, any, any>) {
      this.refresh();
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      const id = w.props.id || w.props.name;

      if (w instanceof WmForm) {
        if (!this.Widgets[id]) {
          this.Widgets[id] = w;
        }
        const formWidgets = this.Widgets[id].formWidgets;
        const formFields = this.Widgets[id].formFields;
        this.Widgets[id] = w;
        if (w.parentFormRef) {
          let pid = w.parentFormRef.props.id || w.parentFormRef.props.name;
          formFields.forEach((ff: any) => {
            const formKey = ff.props.formKey || ff.props.name;
            this.Widgets[pid].formFields.push(ff);
            this.Widgets[pid].formWidgets[formKey] = formWidgets[ff.props.name];
          });
        }
        w.registerFormFields(formFields, formWidgets);
        return;
      }
      if (w.props.formfield) {
        if (!this.Widgets[w.props.formRef]) {
          this.Widgets[w.props.formRef] = {formFields: [], formWidgets: {}};
        } else if (!this.Widgets[w.props.formRef].formFields) {
          this.Widgets[w.props.formRef].formFields = [];
        }
        this.Widgets[w.props.formRef].formWidgets[w.props.name] = w;
        return;
      }
      if (w instanceof WmFormField) {
        if (!this.Widgets[w.props.formRef]) {
          this.Widgets[w.props.formRef] = {};
        }
        if (!this.Widgets[w.props.formRef].formFields) {
          this.Widgets[w.props.formRef].formFields = [];
        }
        this.Widgets[w.props.formRef].formWidgets = this.Widgets[w.props.formRef].formWidgets || {};
        this.Widgets[w.props.formRef].formFields.push(w);
        return;
      }
      this.Widgets[id] = w;
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
        w.formWidgets = {};
        w.formFields = [];
        w.formfields = {};
      }
    }

    handleUrl(url: string) {
      if (!url.startsWith('http') && !url.startsWith('file:')) {
        return this.appConfig.url + (url.startsWith('/') ? '' : '/') + url;
      }
      return url;
    }

    getDateFormat(fmt?: string) {
      // getting formats from appLocale when app locale is loaded locally.
      return (fmt || AppI18nService.dateFormat || get(this.appConfig, 'appLocale.formats.date')).replace(/d/g, 'D').replace(/E/g, 'd').replace(/y/g, 'Y');
    }

    getTimeFormat(fmt?: string) {
      return fmt || AppI18nService.timeFormat || get(this.appConfig, 'appLocale.formats.time');
    }

    getDateTimeFormat(fmt?: string) {
      return (fmt || AppI18nService.dateTimeFormat || (get(this.appConfig, 'appLocale.formats.date') + ' ' + get(this.appConfig, 'appLocale.formats.time'))).replace(/d/g, 'D').replace(/E/g, 'd').replace(/y/g, 'Y');
    }

    getCurrencySymbol(fmt?: string) {
      return (fmt || AppI18nService.currencyCode || 'USD');
    }

    getStyle(classes: string, inlineStyles:any = {}) {
      if (classes && classes.trim().length > 0) {
        return this.theme.mergeStyle({}, this.theme.getStyle(classes), inlineStyles);
      }
      return inlineStyles;
    }

    resetAppLocale() {
      this.appLocale = this.appConfig.appLocale.messages;
      Object.values(this.fragments).forEach((f: any) => (f as BaseFragment<any, any>).resetAppLocale());
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

    toBoolean(val: any) {
      if (isNil(val)) {
        return val;
      }
      return toBoolean(val);
    }

    toNumber(val: any) {
      if (isNil(val)) {
        return val;
      }
      return toNumber(val);
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.targetWidget && this.targetWidget.invokeEventCallback('onDestroy', [null, this.proxy]);
    }

    componentDidMount(): void {
      this.resetAppLocale();
      super.componentDidMount();
    }

    memoize(key: string, o: any) {
      if (!this._memoize[key])  {
        this._memoize[key] = o;
      }
      return this._memoize[key];
    }

    initVariableSpinner() {
      let variables = filter(this.Variables, (v: BaseVariable<any>) => !!get(v, 'config.spinnerContext'));
      const actions = filter(this.Actions, (v: BaseVariable<any>) => !!get(v, 'config.spinnerContext'));
      variables = variables.concat(actions);
      if (!variables.length) {
        return;
      }
      this.cleanup.push(...variables.map(v => {
          return ((v as BaseVariable<any>)
            .subscribe(VariableEvents.BEFORE_INVOKE, () => {
              spinnerService.show({
                message: get(v, 'config.spinnerMessage')
              });
            }))
      }));
      this.cleanup.push(...variables.map(v => {
        return ((v as BaseVariable<any>)
          .subscribe(VariableEvents.AFTER_INVOKE, () => {
            spinnerService.hide();
          }));
      }));
    }

    onFragmentReady() {
      this.cleanup.push(...Object.values({...this.Variables, ...this.Actions}).map(v => {
        return ((v as BaseVariable<any>)
          .subscribe(VariableEvents.AFTER_INVOKE, () => this.App.refresh()));
      }));
      this.initVariableSpinner();
      this.cleanUpVariablesandActions.push(...Object.values({...this.fragmentVariables, ...this.fragmentActions} as BaseVariable<any>));
      this.startUpActions.map(a => this.Actions[a] && this.Actions[a].invoke());
      return Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()))
      .then(() => {
        this.showContent = true;
        this.appConfig.refresh();
      });
    }

    onAttach() {
      this.isDetached = false;
      this.watcher.isActive = true;
      this.resetAppLocale();
      Object.values(this.fragments).forEach((f: any) => f.onAttach());
      this.cleanUpVariablesandActions.forEach((v: BaseVariable<any>) => v.resume());
      this.targetWidget?.invokeEventCallback('onAttach', [null, this.proxy]);
      if (this.refreshdataonattach) {
        Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()));
      }
    }

    onDetach() {
      this.isDetached = true;
      this.watcher.isActive = false;
      Object.values(this.fragments).forEach((f: any) => f.onDetach());
      this.cleanUpVariablesandActions.forEach((v: BaseVariable<any>) => v.pause());
      this.targetWidget?.invokeEventCallback('onDetach', [null, this.proxy]);
    }

    onDestroy() {
      this.cleanUpVariablesandActions.forEach((v: BaseVariable<any>) => v.destroy());
      this.watcher.destroy();
    }

    refresh() {
      (injector.get('AppConfig') as AppConfig).refresh();
    }

    forceUpdate() {
      super.forceUpdate();
      Object.values(this.fragments).forEach((f: any) => (f as BaseFragment<any, any>).forceUpdate());
    }

    render() {
      this.autoUpdateVariables.forEach(value => this.Variables[value]?.invokeOnParamChange());
      return (<ThemeProvider value={this.theme}>
        <ToastConsumer>
            {(toastService: ToastService) => {
              this.toaster = toastService;
              return this.renderWidget(this.props);
            }}
          </ToastConsumer>

      </ThemeProvider>);
    }
}


