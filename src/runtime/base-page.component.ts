import BaseFragment, { FragmentProps } from './base-fragment.component';

export interface PageProps extends FragmentProps {
    route: any;
    navigation: any;
}

export default class BasePage extends BaseFragment {
    private pageName;
    private pageParams: any = {};
    
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

    goToPage(pageName: string, params: any) {
      (this.props as PageProps).navigation.navigate(pageName, params);
    }

    goBack() {
      (this.props as PageProps).navigation.goBack();
    }
}