import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';
import WmPrefabContainer from '@wavemaker/app-rn-runtime/components/prefab/prefab-container.component';
import BaseFragment, { FragmentProps, FragmentState } from './base-fragment.component';

export interface PrefabProps extends FragmentProps {
}

export interface PrefabState extends FragmentState<PrefabProps> {}

export default class BasePrefab extends BaseFragment<PrefabProps, PrefabState> {
    private prefabParams: any = {};
    
    constructor(props: PrefabProps, defualtProps: PrefabProps) {
        super(props, defualtProps);
        this.App = this.appConfig.app;
        this.Actions = Object.assign({}, this.App.Actions);
        this.Variables = Object.assign({}, this.App.Variables);
    }

    onComponentInit(w: BaseComponent<any, any, any>) {
      super.onComponentInit(w);
      if (w instanceof WmPrefabContainer) {
        this.targetWidget = w;
      }
    }

    componentDidMount() {
      super.componentDidMount();
      this.invokeEventCallback('onLoad', [null, this]);
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      this.invokeEventCallback('onDestroy', [null, this]);
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