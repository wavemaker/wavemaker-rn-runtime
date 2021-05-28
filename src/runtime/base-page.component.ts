import { isEqual } from 'lodash';
import React from 'react';
import { Linking } from 'react-native';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPage from '@wavemaker/app-rn-runtime/components/page/page.component';
import { isPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import NavigationService from '@wavemaker/app-rn-runtime/core/navigation.service';

import BaseFragment, { FragmentProps } from './base-fragment.component';

declare const window: any;

export interface PageProps extends FragmentProps {
  route: any;
  navigation: any;
  destroyMe: Function;
}

export default class BasePage extends BaseFragment<PageProps> implements NavigationService {
    private pageName = null as unknown as string;
    private pageParams: any = {};
    private hasDrawer = false;
    private hasTabbar = false;
    
    constructor(props: PageProps) {
      super(props);
      this.pageName = props.route.params.pageName;
      this.pageParams = props.route.params;
      this.appConfig.currentPage = this;
      this.appConfig.setDrawerContent && this.appConfig.setDrawerContent(null);
    }

    onWidgetInit(event: any, w: BaseComponent<any, any>) {
      super.onWidgetInit(event, w);
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
          this.appConfig.setDrawerContent && this.appConfig.setDrawerContent(content);
          this.appConfig.drawerType = drawerType;
        }
      }, 10);
    }

    componentDidMount() {
      this.onFragmentReady().then(() => {
        this.cleanup.push((this.props as PageProps).navigation.addListener('focus', () => {
          this.appConfig.currentPage = this;
          this.refresh();
          this.onAttach();
        }));
      });
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.appConfig.setDrawerContent && this.appConfig.setDrawerContent(null);
    }

    goToPage(pageName: string, params: any) {
      const navigation = (this.props as PageProps).navigation;
      if (pageName !== this.pageName && !isEqual(params, this.pageParams)) {
        navigation.navigate(pageName, params);
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
        } else if (isPreviewMode()) {
          window.open(url, '_blank');
        } else {
          return Linking.openURL(url);
        }
      }
      return Promise.resolve();
    }
}