import React from 'react';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPage from '@wavemaker/app-rn-runtime/components/page/page.component';
import BaseFragment, { FragmentProps } from './base-fragment.component';

export interface PageProps extends FragmentProps {
  route: any;
  navigation: any;
  destroyMe: Function;
}

export default class BasePage extends BaseFragment<PageProps> {
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
      this.cleanup.push((this.props as PageProps).navigation.addListener('focus', () => {
        this.appConfig.currentPage = this;
        this.refresh();
        this.onAttach();
      }));
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

    setTabbarContent(content: React.ReactNode) {
      this.hasTabbar = true;
      setTimeout(() => {
        if (this.appConfig.currentPage === this) {
          this.appConfig.setTabbarContent && this.appConfig.setTabbarContent(content);
        }
      }, 10);
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.appConfig.setDrawerContent && this.appConfig.setDrawerContent(null);
      this.appConfig.setTabbarContent && this.appConfig.setTabbarContent(null);
    }

    goToPage(pageName: string, params: any) {
      const navigation = (this.props as PageProps).navigation;
      navigation.navigate(pageName, params);
      if (this.cache) {
        this.onDetach();
      } else {
        this.props.destroyMe();
      }
    }

    goBack() {
      (this.props as PageProps).navigation.goBack();
    }
}