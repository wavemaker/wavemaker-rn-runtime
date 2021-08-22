import { isEqual } from 'lodash';
import React, { ReactNode } from 'react';
import { Linking } from 'react-native';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPage from '@wavemaker/app-rn-runtime/components/page/page.component';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import NavigationService, { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';

import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';

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
    
    constructor(props: PageProps) {
      super(props);
      this.pageName = props.route.params.pageName;
      this.pageParams = props.route.params;
      this.appConfig.currentPage = this;
      this.appConfig.drawer?.setContent(null);
      this.serviceDefinitions = this.App.serviceDefinitions;
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

    setDrawerContent(content: React.ReactNode, drawerType: string) {
      this.hasDrawer = true;
      setTimeout(() => {
        if (this.appConfig.currentPage === this) {
          this.appConfig.drawer?.setContent((
            <NavigationServiceProvider value={this}>
             {content}
            </NavigationServiceProvider>));
          this.appConfig.drawer?.setAnimation(drawerType);
        }
      }, 10);
    }

    onFragmentReady() {
      return super.onFragmentReady().then(() => {
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
      if (pageName !== this.pageName || !isEqual(params, this.pageParams)) {
        if (pageName === this.pageName) {
          navigation.push(pageName, params);
        } else {
          navigation.navigate(pageName, params);
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
      (this.props as PageProps).navigation.goBack();
      return Promise.resolve();
    }

    openUrl(url: string) {
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
        } else if (isWebPreviewMode()) {
          window.open(url, '_blank');
        } else {
          return Linking.openURL(url);
        }
      }
      return Promise.resolve();
    }

    abstract renderPage(): ReactNode;

    renderWidget(props: PageProps) {
      return this.renderPage();
    }
}