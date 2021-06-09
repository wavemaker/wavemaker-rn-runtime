import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { BaseNavProps } from './basenav.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, BaseNavStyles } from './basenav.styles';

export interface NavigationDataItem {
  key: string;
  label: string;
  icon?: string;
  link?: string;
  badge?: string;
  isactive?: string;
}

export class BaseNavState <T extends BaseNavProps> extends BaseComponentState<T> {
  dataItems = [] as NavigationDataItem[];
}

export abstract class BaseNavComponent< T extends BaseNavProps, S extends BaseNavState<T>, L extends BaseNavStyles> extends BaseComponent<T, S, L> {

  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles, defaultProps, defaultState);
  }

  setDataItems(dataset: any = this.state.props.dataset) {
    const name = this.props.name;
    let dataItems = [] as NavigationDataItem[];
    if (typeof dataset === 'string') {
      dataItems = dataset.split(',').map((s, i) => {
        return {
          key: `${name}_item${i}`,
          label: s,
          icon: 'wi wi-' + s
        } as NavigationDataItem;
      });
    } else if (dataset) {
      dataItems = (dataset as any[]).map((d, i) => {
        return {
          key: `${name}_item${i}`,
          label: d[this.state.props.itemlabel],
          icon: d[this.state.props.itemicon],
          link: d[this.state.props.itemlink],
          badge: d[this.state.props.itembadge],
          isactive: d[this.state.props.isactive]
        } as NavigationDataItem;
      });
    }
    this.updateState({dataItems: dataItems} as S);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'dataset':
        this.setDataItems($new);
        break;
      case 'itemlabel':
      case 'itemicon':
      case 'itemlink':
        this.setDataItems();
        break;
    }
  }
}
