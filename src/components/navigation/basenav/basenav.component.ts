import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { BaseNavProps } from './basenav.props';
import { DEFAULT_CLASS, BaseNavStyles } from './basenav.styles';
import { isArray } from 'lodash-es';

export interface NavigationDataItem {
  key: string;
  label: string;
  icon?: string;
  link?: string;
  badge?: string;
  isactive?: string;
  childnavigation?: any;
}

export class BaseNavState <T extends BaseNavProps> extends BaseComponentState<T> {
  dataItems = [] as NavigationDataItem[];
}

export abstract class BaseNavComponent< T extends BaseNavProps, S extends BaseNavState<T>, L extends BaseNavStyles> extends BaseComponent<T, S, L> {

  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultProps, defaultState);
  }

  getValue(item: any, val?: string | ((item: any) => string)) {
    if (typeof val === 'string') {
      return item[val];
    } else if (typeof val === 'function') {
      return val(item);
    }
    return null;
  }

  setDataItems(dataset: any = this.state.props.dataset) {
    const name = this.props.name;
    let dataItems = [] as NavigationDataItem[];
    if (typeof dataset === 'string') {
      dataItems = dataset.split(',').map((s, i) => {
        return {
          key: `${name}_item${i}`,
          label: s,
        } as NavigationDataItem;
      });
    } else if (dataset) {
      if (!isArray(dataset)) {
        dataset = [dataset];
      }
      dataItems = (dataset as any[]).map((d, i) => {
        return {
          key: `${name}_item${i}`,
          label: this.getValue(d, this.state.props.itemlabel),
          icon: this.getValue(d, this.state.props.itemicon),
          link: this.getValue(d, this.state.props.itemlink),
          badge: this.getValue(d, this.state.props.itembadge),
          isactive: this.getValue(d, this.state.props.isactive),
          childnavigation: this.state.props.itemchildren ? d[this.state.props.itemchildren] : null
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
      case 'itemchildren':
        this.setDataItems();
        break;
    }
  }
}
