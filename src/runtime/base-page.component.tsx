import { clone, isEqual } from 'lodash';
import React, { ReactNode } from 'react';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPage from '@wavemaker/app-rn-runtime/components/page/page.component';
import NavigationService, { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';

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
      this.pageName = props.route.name;
      this.pageParams = props.route.params;
      this.appConfig.currentPage = this;
      this.appConfig.drawer?.setContent(null);
      this.serviceDefinitions = this.App.serviceDefinitions;
      this.watcher = Watcher.ROOT.create();
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
          this.appConfig.drawer?.setContent((
            <NavigationServiceProvider value={this}>
             {content}
            </NavigationServiceProvider>));
          this.appConfig.drawer?.setAnimation(drawerType);
        }
      }, 10);
    }

    onAttach() {
      super.onAttach();
      this.setDrawerContent();
    }

    onFragmentReady() {
      return super.onFragmentReady().then(() => {
        this.onContentReady();
        this.App.onPageReady(this.pageName, this.proxy as BasePage);
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

    goToPage(pageName: string, params: any) {
      const navigation = (this.props as PageProps).navigation;
      const _params = clone(params);
      _params && delete _params['pageName'];
      if (pageName !== this.pageName || !isEqual(_params, this.pageParams)) {
        if (pageName === this.pageName) {
          navigation.push(pageName, _params);
        } else {
          navigation.navigate(pageName, _params);
        }
        if (this.cache) {
          this.onDetach();
        } else {
          this.props.destroyMe();
        }
      }
      return Promise.resolve();
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

    isCurrentPage(link: string) {
      const pageName = this.pageName;
      return [pageName, '#' + pageName, '#/' + pageName].includes(link)
    }

    abstract renderPage(): ReactNode;

    renderWidget(props: PageProps) {
      return this.renderPage();
    }
}
