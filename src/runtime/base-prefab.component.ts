import BaseFragment, { FragmentProps } from './base-fragment.component';

export interface PrefabProps extends FragmentProps {
}

export default class BasePrefab extends BaseFragment {
    private prefabParams: any = {};
    
    constructor(props: PrefabProps, defualtProps: PrefabProps) {
        super(props, defualtProps);
        this.App = this.appConfig.app;
        this.appConfig.currentPage = this;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
    }

    render() {
      const markup = super.render();
      Object.keys(this.props).forEach(k => {
        //@ts-ignore
        this[k] = this.state.props[k] || this.props[k];
      });
      return markup;
    }
}