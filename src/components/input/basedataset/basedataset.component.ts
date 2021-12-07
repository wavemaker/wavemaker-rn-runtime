import { BaseComponent, BaseComponentState } from "@wavemaker/app-rn-runtime/core/base.component";
import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';
import { find, isEqual,isEmpty, includes, get, forEach, isObject, isArray } from 'lodash';
import { getGroupedData, getOrderedDataset } from "@wavemaker/app-rn-runtime/core/utils";
import { DEFAULT_CLASS, DEFAULT_STYLES, BaseDatasetStyles } from "@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.styles";

export class BaseDatasetState <T extends BaseDatasetProps> extends BaseComponentState<T> {
  dataItems: any;
  groupedData: any;
}

export abstract class BaseDatasetComponent< T extends BaseDatasetProps, S extends BaseDatasetState<T>, L extends BaseDatasetStyles> extends BaseComponent<T, S, L> {

  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles, defaultProps, defaultState);

  }

  onPropertyChange(name: string, $new: any, $old: any) {
    const props = this.state.props;
    switch (name) {
      case 'dataset':
        this.setDataItems($new);
        break;
      case 'getDisplayExpression':
      case 'displayfield':
      case 'displaylabel':
      case 'datafield':
      case 'orderby':
        this.setDataItems(this.state.props.dataset);
        break;
      case 'groupby':
      case 'match':
        this.setGroupData(this.state.dataItems);
      case 'datavalue':
        this.setDataItems(this.state.props.dataset, { dataValue: $new });
        this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old);
    }
  }

  setGroupData(items: any) {
    const dataItems = items;
    const props = this.state.props;
    if (props.groupby) {
      const groupedData = dataItems && getGroupedData(dataItems, props.groupby, props.match, props.orderby, props.dateformat, 'dataObject');
      this.updateState({ groupedData: groupedData } as S);
    }
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value } } as S);
  }

  onValueChange(value: any) {
    if (this.state.props.datafield === 'All Fields') {
      const selectedItem = find(this.state.dataItems, (item) => isEqual(item.key, value));
      value = selectedItem && selectedItem.dataObject;
    }
    this.onChange(value);
  }

  getItemKey(value: any) {
      const selectedItem = find(this.state.dataItems, (item) => isEqual(item.dataObject, value));
      return selectedItem && selectedItem.key;
  }

  onChange(value: any) {
    const oldValue = this.state.props.datavalue;
    if (!value) {
      return;
    }
    this.updateDatavalue(value);
    this.invokeEventCallback('onChange', [ undefined, this.proxy, value, oldValue]);
  }
  setDataItems(dataset: any, propsObj?: { [key: string]: any }) {
    const name = this.props.name;
    const props = this.state.props;
    const datavalue = propsObj ? propsObj['dataValue'] : props.datavalue;
    let dataItems: any = [];
    let datavalueItems: any = [];
    if (typeof datavalue === 'string') {
      datavalueItems = datavalue.split(',');
      datavalueItems = datavalueItems.map((item: any) => item.trim());
    } else if (isArray(datavalue)) {
      datavalueItems = datavalue;
    }
    if (typeof dataset === 'string') {
      dataItems = dataset.split(',').map((s, i) => {
        s = s.trim();
        return {
          key: `${name}_item${i}`,
          dataObject: s,
          displayfield: s,
          datafield: s,
          selected: includes(datavalueItems, s) || datavalue === s ? true : false,
        };
      });
    } else if (dataset) {
      if (isObject(dataset) && !isArray(dataset)) {
        forEach(dataset, (value, key) => {
          dataItems.push({key: `${name}_item${key}`, displayfield: value, datafield: key, dataObject: dataset});
        });
      } else {
        dataItems = (dataset as any[]).map((d, i) => {
          return {
            key: `${name}_item${i}`,
            dataObject: d,
            displayfield: get(d, this.state.props.displayfield) ||  get(d, this.state.props.displaylabel),
            datafield: this.state.props.datafield === 'All Fields' ? d : get(d, this.state.props.datafield),
            displayexp: this.state.props.getDisplayExpression ? this.state.props.getDisplayExpression(d) : get(d, this.state.props.displayfield),
            selected: includes(datavalueItems, get(d, this.state.props.datafield)) || (this.state.props.datafield === 'All Fields' ? !isEmpty(datavalueItems) ? includes(datavalueItems, d) : isEqual(datavalue, d) : datavalue === get(d, this.state.props.datafield)),
            imgSrc: get(d, this.state.props.displayimagesrc)
          };
        });
      }

    }
    if (props.groupby) {
      this.setGroupData(dataItems);
    } else if (props.orderby) {
      this.updateState({ dataItems: getOrderedDataset(dataItems, props.orderby, 'dataObject')} as S);
    } else {
      this.updateState({ dataItems: dataItems } as S);
    }
  }
}
