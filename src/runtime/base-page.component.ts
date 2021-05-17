import React from 'react';
import BaseFragment, { FragmentProps } from './base-fragment.component';

export interface PageProps extends FragmentProps {
    route: any;
    navigation: any;
}

export default class BasePage extends BaseFragment {
    private pageName;
    private pageParams: any = {};
    private drawerContent: any;
    private drawerType: string = 'back';
    
    constructor(props: PageProps) {
        super(props);
        this.pageName = props.route.params.pageName;
        this.pageParams = props.route.params;
        this.appConfig.currentPage = this;
        this.cleanup.push((this.props as PageProps).navigation.addListener('focus', () => {
          this.appConfig.currentPage = this;
          this.refresh();
        }));
    }

    toggleDrawer() {
      (this.props as PageProps).navigation.toggleDrawer();
    }

    setDrawerContent(content: React.ReactNode, drawerType: string) {
      this.drawerContent = content;
      this.drawerType = drawerType;
    }

    goToPage(pageName: string, params: any) {
      (this.props as PageProps).navigation.navigate(pageName, params);
    }

    goBack() {
      (this.props as PageProps).navigation.goBack();
    }
}