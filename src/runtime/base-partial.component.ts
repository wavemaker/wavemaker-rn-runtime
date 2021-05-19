import BaseFragment, { FragmentProps } from './base-fragment.component';

export interface PartialProps extends FragmentProps {
}

export default class BasePartial extends BaseFragment {
    private partialParams: any = {};
    
    constructor(props: PartialProps) {
        super(props);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
    }
}