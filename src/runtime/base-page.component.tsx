import { clone, isEqual } from 'lodash';
import React, { ReactNode } from 'react';
import { CommonActions } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPage from '@wavemaker/app-rn-runtime/components/page/page.component';
import NavigationService, { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';
import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseVariable } from '@wavemaker/app-rn-runtime/variables/base-variable';

import AppSecurityService from './services/app-security.service';
import AppSpinnerService from './services/app-spinner.service';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import { Watcher } from './watcher';
import { setCurrentPageInAppLayout } from '../core/utils';
import { ScreenCaptureProtectionConsumer, ScreenCaptureProtectionContextType } from '../core/screen-capture-protection.service';
import { Alert } from 'react-native';

declare const window: any;

export interface PageProps extends FragmentProps {
  route: any;
  navigation: any;
  destroyMe: Function;
}

export interface PageState extends FragmentState<PageProps> {
}

export default abstract class BasePage extends BaseFragment<PageProps, PageState> implements NavigationService {
    private pageName = null as unknown as string;
    private pageParams: any = {};
    private hasDrawer = false;
    private hasTabbar = false;
    private drawerContent = null as React.ReactNode;
    private drawerType = '';
    private screenCaptureContext: ScreenCaptureProtectionContextType | null = null;

    constructor(props: PageProps) {
      super(props);
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 300);
      this.pageName = props.route.name;
      this.pageParams = props.route.params;
      this.appConfig.currentPage = this;
      this.appConfig.drawer?.setContent(null);
      this.serviceDefinitions = this.App.serviceDefinitions;
      this.watcher = Watcher.ROOT.create();
      
      
      AppSecurityService.canUserAccessPage(this.pageName)
        .then(flag => {
          if (!flag) {
            this.cache = false;
            AppSecurityService.redirectToLogin(this.toHashURL());
          }
        });
      if (this.App.appConfig.diagnostics.pageStartTime < 0) {
        this.App.appConfig.diagnostics.pageStartTime = Date.now();
      }

      setCurrentPageInAppLayout(props.route.name);
      
      // Initialize network state - default to connected
      this.state = {
          ...this.state,
          isConnected: true
      } as PageState;
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      super.onComponentInit(w);
      if (w instanceof WmPage) {
        this.targetWidget = w;
        const props = w.props as any;
        this.cache = !(props.cache === false);
        this.refreshdataonattach = !(props.refreshdataonattach === false);
      }
    }

    private hasHttpBasedVariables(): boolean {
        
        const isHttpVariable = (variable: any) => {
            if (variable?.config?.serviceType && 
                BasePage.HTTP_SERVICE_TYPES.includes(variable.config.serviceType)) {
                return true;
            }
            if (variable?.category === 'wm.LiveVariable') {
                return true;
            }
            
            return false;
        }
        if (Object.values(this.startUpVariables).some(isHttpVariable)) {
            return true;
        }
        for (const fragmentKey in this.fragments) {
            const fragment = this.fragments[fragmentKey];
            
            if (fragment) {
                if (Object.values(fragment.startUpVariables).some(isHttpVariable)) {
                    return true;
                }
            }
        }
        return false;
    }
   
    private setupNetworkMonitoring(): void {
        if (isWebPreviewMode() || !this._hasHttpVariables) {
            return;
        }
        this._unsubscribeNetworkState = NetworkService.notifier.subscribe('onNetworkStateChange', (networkState: any) => {
            const connected = networkState.isConnected && networkState.isNetworkAvailable;
            if (this.state.isConnected !== connected) {
                this.setState({ ...this.state, isConnected: connected } as PageState);
            }
        });
        const currentState = NetworkService.getState();
        if (currentState) {
            const connected = currentState.isConnected && currentState.isNetworkAvailable;
            this.setState({ ...this.state, isConnected: connected } as PageState);
        }
    }

    private cleanupNetworkMonitoring(): void {
        if (this._unsubscribeNetworkState) {
            this._unsubscribeNetworkState();
            this._unsubscribeNetworkState = null;
        }
    }
    
    handleChildFragmentCriticalFailure(): void {
      if(this.state.isConnected) {
        this.setState({ ...this.state, isConnected: false } as PageState);
      }
    }

    toggleDrawer() {
      (this.props as PageProps).navigation.toggleDrawer();
    }

    setDrawerContent(content = this.drawerContent, drawerType = this.drawerType) {
      if (!content) {
        return;
      }
      this.drawerContent = content;
      this.drawerType = drawerType;
      this.hasDrawer = true;
      setTimeout(() => {
        if (this.appConfig.currentPage === this 
          || this.appConfig.currentPage.proxy === this) {
          this.appConfig.drawer?.setContent(null);
          setTimeout(() => {
            this.appConfig.drawer?.setContent((
              <NavigationServiceProvider value={this}>
              {content}
              </NavigationServiceProvider>));
          }, 500);
          this.appConfig.drawer?.setAnimation(drawerType);
        }
      }, 10);
    }

    onAttach() {
      super.onAttach();
      this.setDrawerContent();
      this.App.appConfig.diagnostics.pageReadyTime = Date.now();
      this.App.notify('pageAttached', this);
    }

    onFragmentReady() {
      return super.onFragmentReady().then(() => {
        this._hasHttpVariables = this.hasHttpBasedVariables();
        this.setupNetworkMonitoring();
        
        this.onContentReady();
        this.App.triggerPageReady(this.pageName, this.proxy as BasePage);
        this.App.appConfig.diagnostics.pageReadyTime = Date.now(); 
        this.App.notify('pageReady', this);
        AppSpinnerService.hide();
        this.cleanup.push((this.props as PageProps).navigation.addListener('focus', () => {
          if (this.appConfig.currentPage !== this) {
            this.appConfig.currentPage = this;
            this.onAttach();
            this.appConfig.refresh();
          }
          if (this.screenCaptureContext && this.appConfig.screenCaptureProtection?.enabled) {
            this.screenCaptureContext.enableProtection();
          }
        }));
        
        this.cleanup.push((this.props as PageProps).navigation.addListener('blur', () => {
          if (this.screenCaptureContext && this.appConfig.screenCaptureProtection?.enabled) {
            this.screenCaptureContext.disableProtection();
          }
        }));
      });
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.cleanupNetworkMonitoring();
      this.App.notify('pageDestroyed', this);
    }

    async canNavigate (currentPage: string, nextPage: string) {
      let navigate = true;
      navigate = await this.onBeforePageLeave(currentPage, nextPage);
      if(navigate !== false){
        navigate = await this.App.onBeforePageLeave(currentPage, nextPage);
      }

      if(navigate !== false) navigate = true;

      return navigate; 
    }

    async onBeforePageLeave(currentPage: string, nextPage: string) {
      //method can be override by the user from studio;
      return true;
    }

    async goToPage(pageName: string, params: any, clearCahe = false) {
      const isNavigable = await this.canNavigate(this.pageName, pageName)
      if(!isNavigable){
        return Promise.resolve();
      }

      const navigation = (this.props as PageProps).navigation;
      const _params = clone(params);
      _params && delete _params['pageName'];
      this.App.appConfig.diagnostics.pageStartTime = Date.now();
      if (pageName !== this.pageName || !isEqual(_params || null, this.pageParams || null)) {
        if (pageName === this.pageName) {
          navigation.push(pageName, _params);
        } else if (clearCahe) {
          navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
              { name: pageName, params: params }
            ]}));
        } else {
          navigation.navigate(pageName, _params);
        }
        if (this.cache) {
          this.onDetach();
        } else {
          this.props.destroyMe();
        }
      } else {
        (this.props as PageProps).navigation.closeDrawer();
      }
      return Promise.resolve();
    }

    public navigateToLandingPage() {
      AppSecurityService.navigateToLandingPage();
    }

    public toHashURL() {
      const hash = `#/${this.pageName}`;
      const paramStr = Object.keys(this.pageParams || [])
        .map(k => k && `${k}=${this.pageParams[k]}`)
        .join('&');
      return hash + (paramStr ? `?${paramStr}` : '');
    }

    async goBack() {
      const navigation = (this.props as PageProps).navigation;
      const routes = navigation.getState()?.routes;
      let isNavigable = true;

      if(navigation.canGoBack()){
        isNavigable = await this.canNavigate(this.pageName, routes[routes.length - 2].name)
      }
      if(!isNavigable){
        return Promise.resolve();
      }

      this.App.appConfig.diagnostics.pageStartTime = Date.now();
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else if (window && window.history) {
        window.history.back();
      }
      return Promise.resolve();
    }

    openUrl(url: string, params = {} as any) {
      if (url) {
        if (url.startsWith('#')) {
          url = url.substring(1);
          url = url.startsWith('/') ? url.substring(1) : url;
          const splits = url.split('?');
          const pageName = splits[0];
          let params = {} as any;
          if (splits.length > 1) {
            splits[1].split('&')
              .map(p => p.split('='))
              .forEach(p => params[p[0]] = p[1]);
          }
          return this.goToPage(pageName, params);
        } else {
          this.App.openBrowser(url, params);
        }
      }
      return Promise.resolve();
    }

    isActiveTabbarItem({label, link, links}: {label: string, link: string, links: string[]}) {
      const pageName = this.pageName;
      const possibleLinks = [pageName, '#' + pageName, '#/' + pageName];
      return links && links.find(l => possibleLinks.includes(l));
    }

    abstract renderPage(): ReactNode;

    renderWidget(props: PageProps) {
      return (
        <ScreenCaptureProtectionConsumer>
          {(context: ScreenCaptureProtectionContextType | null) => {
            if (!context) return this.renderPage();
            this.screenCaptureContext = context;
            return this.renderPage();
          }}
        </ScreenCaptureProtectionConsumer>
      );
    }
}
