import React from 'react';
import { Text, View } from 'react-native';
import { get, filter, isNil } from 'lodash';

import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { Formatter } from '@wavemaker/app-rn-runtime/core/formatters';
import { TestIdPrefixProvider, TextIdPrefixConsumer } from '@wavemaker/app-rn-runtime/core/testid.provider';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { toBoolean, toNumber, isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseComponent, BaseComponentState, BaseStyles, BaseProps, LifecycleListener, ParentContext } from '@wavemaker/app-rn-runtime/core/base.component';
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
import WmFormAction from '@wavemaker/app-rn-runtime/components/data/form/form-action/form-action.component';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';
import { WmSkeletonStyles } from '../components/basic/skeleton/skeleton.styles';

export class SkeletonAnimationProps extends BaseProps {
  skeletonanimationresource = "";
  skeletonanimationspeed = 1;
}

export class FragmentProps extends SkeletonAnimationProps {}

export interface FragmentState<T extends FragmentProps> extends BaseComponentState<T> {}

export type FragmentStyles = BaseStyles & {
  skeleton?: WmSkeletonStyles
};
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
    protected startUpVariablesLoaded = false;
    private startUpActions: string[] = [];
    private autoUpdateVariables: string[] = [];
    private cleanUpVariablesandActions: BaseVariable<any>[] = [];
    public fragmentVariables: any = {};
    public fragmentActions: any = {};
    public Actions: any = {};
    public appConfig = injector.get<AppConfig>('APP_CONFIG');
    public cache = false;
    public refreshdataonattach= true;
    public isReactNativeApp = true;
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
      let formWidgets: any, formFields: any, formActions: any;

      if (w instanceof WmForm) {
        if (!this.Widgets[id]) {
          this.Widgets[id] = w;
        }
        if (w.props.id) {
          const name: any = w.props.name;
          formWidgets = this.Widgets[name].formWidgets;
          formFields = this.Widgets[name].formFields;
          formActions = this.Widgets[name].buttonArray;
          this.Widgets[name].formFields = [];
          this.Widgets[name].buttonArray = [];
          this.Widgets[name].formWidgets = {};
        } else {
          formWidgets = this.Widgets[id].formWidgets;
          formFields = this.Widgets[id].formFields;
          formActions = this.Widgets[id].buttonArray;
        }
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
        w.registerFormActions(formActions);
        return;
      }
      if (w.props.formfield) {
        if (!this.Widgets[w.props.formRef]) {
          this.Widgets[w.props.formRef] = {formFields: [], formWidgets: {}};
        } else if (!this.Widgets[w.props.formRef].formFields) {
          this.Widgets[w.props.formRef].formFields = [];
        }
        if (!this.Widgets[w.props.formRef].formWidgets) {
          this.Widgets[w.props.formRef].formWidgets = {}
        }
        this.Widgets[w.props.formRef].formWidgets[w.props.name] = w;
        return;
      }
      if (w instanceof WmFormAction) {
        if (!this.Widgets[w.props.formKey]) {
          this.Widgets[w.props.formKey] = {};
        }
        if (!this.Widgets[w.props.formKey].buttonArray) {
          this.Widgets[w.props.formKey].buttonArray = [];
        }
        this.Widgets[w.props.formKey].buttonArray.push(w);
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
      if (isFullPathUrl(url)) {
        return url;
      }
      return this.appConfig.url + (url.startsWith('/') ? '' : '/') + url;
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

    getFormFieldStyles(formField: any, type: string){
      let suffix = ''
      switch(type){
        case 'label' :
          suffix = '_formLabel'
          break
        case 'commonField' :
          suffix = '-input'
          break
        default :
          ''
      }
      return formField?.classname?.trim()?.split(' ')?.map((s:string) => s.trim() + suffix).join(' ');
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
        return false;
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
              this.App.notify(VariableEvents.BEFORE_INVOKE, v);
              spinnerService.show({
                message: get(v, 'config.spinnerMessage'),
                spinner: this.App.appConfig.spinner
              });
            }))
      }));
      this.cleanup.push(...variables.map(v => {
        return ((v as BaseVariable<any>)
          .subscribe(VariableEvents.AFTER_INVOKE, () => {
            this.App.notify(VariableEvents.AFTER_INVOKE, v);
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
      .catch((error) => {
        // catch errors and show content
        console.error(error);
      })
      .then(() => {
        this.startUpVariablesLoaded = true;
        this.showContent = true;
        this.appConfig.refresh();
      });
    }

    onAttach() {
      this.isDetached = false;
      this.watcher.isActive = true;
      this.resetAppLocale();
      Object.values(this.fragments).forEach((f: any) => f.onAttach());
      this.cleanUpVariablesandActions.forEach((v: any) => v.unmute && v.unmute());
      this.targetWidget?.invokeEventCallback('onAttach', [null, this.proxy]);
      if (this.refreshdataonattach) {
        Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()));
      }
      Object.values(this.Widgets).forEach((w: any) => {
        w.componentWillAttach && w.componentWillAttach();
      });
    }

    onDetach() {
      this.isDetached = true;
      this.watcher.isActive = false;
      Object.values(this.fragments).forEach((f: any) => f.onDetach());
      this.cleanUpVariablesandActions.forEach((v: any) => v.mute && v.mute());
      this.targetWidget?.invokeEventCallback('onDetach', [null, this.proxy]);
      Object.values(this.Widgets).forEach((w: any) => {
        w.componentWillDetach && w.componentWillDetach();
      });
    }

    onDestroy() {
      this.cleanUpVariablesandActions.forEach((v: any) => v.destroy());
      this.watcher.destroy();
    }

    refresh() {
      (injector.get('AppConfig') as AppConfig).refresh();
    }

    forceUpdate() {
      super.forceUpdate();
      Object.values(this.fragments).forEach((f: any) => (f as BaseFragment<any, any>).forceUpdate());
    }

    generateTestIdPrefix() {
      const testId = this.getTestId();
      return testId && (testId.split('')
        .reduce((a, v, i) => a + (v.charCodeAt(0)  * (i + 1)), 0) + '');
    }

    render() {
      if (this.startUpVariablesLoaded) {
        this.autoUpdateVariables
          .forEach(value => this.Variables[value]?.invokeOnParamChange());
      }
      return this.isVisible() ? (
      <ParentContext.Consumer>
        {(parent) => {
        this.setParent(parent);
        this._showSkeleton = this.state.props.showskeleton !== false 
        && (this.parent?._showSkeleton || this.state.props.showskeleton === true);
        let theme = this.theme;
        return (
      <ParentContext.Provider value={this}>
        <ThemeProvider value={theme}>
          <TextIdPrefixConsumer>
              {(testIdPrefix) => {
                this.testIdPrefix = testIdPrefix || '';
                return (
                <TestIdPrefixProvider value={this.generateTestIdPrefix() || ''}>
                  <ToastConsumer>
                  {(toastService: ToastService) => {
                    this.toaster = toastService;
                    return this.renderWidget(this.props);
                  }}
                </ToastConsumer>
                </TestIdPrefixProvider>);
              }}
          </TextIdPrefixConsumer>
        </ThemeProvider>
      </ParentContext.Provider>);
      }}
      </ParentContext.Consumer>) : null;
    }


}


