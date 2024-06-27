import { clone, isEqual } from 'lodash';
import React, { ReactNode } from 'react';
import { CommonActions } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPage from '@wavemaker/app-rn-runtime/components/page/page.component';
import NavigationService, { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';

import AppSecurityService from './services/app-security.service';
import AppSpinnerService from './services/app-spinner.service';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';
import { Watcher } from './watcher';

declare const window: any;

export interface PageProps extends FragmentProps {
  route: any;
  navigation: any;
  destroyMe: Function;
}

export interface PageState extends FragmentState<PageProps> {}

export default abstract class BasePage extends BaseFragment<PageProps, PageState> implements NavigationService {
    private pageName = null as unknown as string;
    private pageParams: any = {};
    private hasDrawer = false;
    private hasTabbar = false;
    private drawerContent = null as React.ReactNode;
    private drawerType = '';

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

    getDefaultStyles() {
        return 'app-page';
    }

    onAttach() {
      super.onAttach();
      this.setDrawerContent();
    }

    onFragmentReady() {
      return super.onFragmentReady().then(() => {
        this.onContentReady();
        this.App.triggerPageReady(this.pageName, this.proxy as BasePage);
        AppSpinnerService.hide();
        this.cleanup.push((this.props as PageProps).navigation.addListener('focus', () => {
          if (this.appConfig.currentPage !== this) {
            this.appConfig.currentPage = this;
            this.onAttach();
            this.appConfig.refresh();
          }
        }));
      });
    }

    componentWillUnmount() {
      super.componentWillUnmount();
    }

    goToPage(pageName: string, params: any, clearCahe = false) {
      const navigation = (this.props as PageProps).navigation;
      const _params = clone(params);
      _params && delete _params['pageName'];
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

    goBack() {
      const navigation = (this.props as PageProps).navigation;
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
      return this.renderPage();
    }
}
