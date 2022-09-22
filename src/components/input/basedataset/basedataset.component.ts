import { BaseComponent, BaseComponentState } from "@wavemaker/app-rn-runtime/core/base.component";
import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';
import { find, isEqual,isEmpty, isFunction, includes, get, forEach, isObject, isArray, filter, trim, uniqBy, uniqWith } from 'lodash';
import { getGroupedData, getOrderedDataset, isDefined, validateField } from "@wavemaker/app-rn-runtime/core/utils";
import { DEFAULT_CLASS, DEFAULT_STYLES, BaseDatasetStyles } from "@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.styles";

export class BaseDatasetState <T extends BaseDatasetProps> extends BaseComponentState<T> {
  dataItems: any;
  groupedData: any;
  isDefault = false;
  isValid = true;
  errorType = '';
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
      case 'displayimagesrc':
      case 'datafield':
      case 'orderby':
        this.setDataItems(this.state.props.dataset);
        break;
      case 'groupby':
      case 'match':
        this.setGroupData(this.state.dataItems);
      case 'datavalue':
        this.setDataItems(this.state.props.dataset, { dataValue: $new });
        const isDefault = this.state.isDefault;
        if (isDefault) {
          this.updateState({ isDefault: false } as S, this.props.onFieldChange && this.props.onFieldChange.bind(this, 'datavalue', $new, $old, isDefault));
        } else {
          this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old, isDefault);
        }
    }
  }

  setGroupData(items: any) {
    const dataItems = items;
    const props = this.state.props;
    if (props.groupby) {
      const groupedData = dataItems && getGroupedData(dataItems, props.groupby, props.match, props.orderby, props.dateformat, this, 'dataObject');
      this.updateState({ groupedData: groupedData } as S, () => this.onDataItemsUpdate());
    }
  }

  validate(value: any) {
    const validationObj = validateField(this.state.props, value);
    this.setState({
      isValid: validationObj.isValid,
      errorType: validationObj.errorType
    } as S);
  }

  updateDatavalue(value: any) {
    return new Promise<void>((resolve) => {
      this.updateState({
        props: { datavalue: value }
       } as S,
       () => {
        this.computeDisplayValue();
        resolve();
       });
    });
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
    this.validate(value);
    this.updateDatavalue(value)
    .then(() => {
      if (value !== oldValue) {
        if (this.props.onFieldChange) {
          this.props.onFieldChange('datavalue', value, oldValue);
        } else {
          this.invokeEventCallback('onChange', [
            undefined,
            this.proxy,
            value,
            oldValue,
          ]);
        }
      }
    });
  }

  computeDisplayValue() {
    this.updateState({
      props: {
        displayValue: ((this.state.dataItems || [] as any)
          .filter((item: any) => item.selected)
          .map((item: any) => item.displayexp || item.displayfield))[0] || ''
      }
    } as S);
  }

  onDataItemsUpdate() {
    this.computeDisplayValue();
  }

  getUniqObjsByDataField(
    data: any,
    allowEmptyFields: boolean = true
  ) {
    let uniqData;
    const isAllFields = this.state.props.datafield === 'All Fields';

    uniqData = isAllFields ? uniqWith(data, isEqual) : uniqBy(data, 'datafield');

    if (!this.state.props.displayfield || allowEmptyFields) {
      return uniqData;
    }

    // return objects having non empty datafield and display field values.
    return filter(uniqData, (obj) => {
      if (isAllFields) {
        return trim(obj.displayfield);
      }
      return trim(obj.datafield) && trim(obj.displayfield);
    });
  }

  setDataItems(dataset: any, propsObj?: { [key: string]: any }, allowEmpty: boolean = true) {
    const name = this.props.name;
    const props = this.state.props;
    const datavalue = propsObj ? propsObj['dataValue'] : props.datavalue;
    let dataItems: any = [];
    let datavalueItems: any = [];
    if (typeof datavalue === 'string') {
      datavalueItems = datavalue.split(',');
      datavalueItems = allowEmpty ? datavalueItems : datavalueItems.map((item: any) => item.trim());
    } else if (isArray(datavalue)) {
      datavalueItems = datavalue;
    } else {
      if (isDefined(datavalue)) {
        datavalueItems = [datavalue];
      }
    }
    if (typeof dataset === 'string') {
      dataset = dataset.split(',');
    }
    if (isArray(dataset) && !isObject(dataset[0])) {
      dataItems = dataset.map((s, i) => {
        s = s.trim();
        return {
          key: `${name}_item${i}`,
          dataObject: s,
          displayfield: s.toString(),
          datafield: s,
          selected: includes(datavalueItems, s) || includes(datavalueItems, s.toString()) || datavalue === s ? true : false,
        };
      });
    } else if (dataset) {
      if (isObject(dataset) && !isArray(dataset)) {
        forEach(dataset, (value, key) => {
          if (isDefined(key) && key !== null) {
            dataItems.push({key: `${name}_item${key}`, displayfield: value, datafield: key, dataObject: dataset});
          }
        });
      } else {
        const isSelected = (item: any) => {
          if (datavalueItems.length) {
            let datafield = this.state.props.datafield;
            if (!datafield) {
              datafield = 'All Fields';
            }
            if (datafield === 'All Fields') {
              return includes(datavalueItems, item);
            }
            let df = get(item, datafield);
            if (isDefined(df) && df !== null) {
              return (includes(datavalueItems, df) || includes(datavalueItems, df.toString()));
            }
          }
          return false;
        };
        forEach(dataset as any[], (d, i) => {
          let datafieldValue = this.state.props.datafield === 'All Fields' ? d : get(d, this.state.props.datafield);
          if (isDefined(datafieldValue) && datafieldValue !== null) {
            dataItems.push({
              key: `${name}_item${i}`,
              dataObject: d,
              displayfield: (get(d, this.state.props.displayfield))?.toString() || (get(d, this.state.props.displaylabel))?.toString(),
              datafield: datafieldValue,
              displayexp: this.state.props.getDisplayExpression ? this.state.props.getDisplayExpression(d) : get(d, this.state.props.displayfield),
              selected: isSelected(d),
              imgSrc: isFunction(this.state.props.displayimagesrc) ? this.state.props.displayimagesrc(d) : get(d, this.state.props.displayimagesrc),
              icon: d[this.props.iconclass]
            });
          }
        });
      }
    }
    if (dataItems.length) {
      dataItems = this.getUniqObjsByDataField(dataItems, allowEmpty);
    }
    const isUpdated = !isEqual(dataItems, this.state.dataItems);
    if (props.groupby) {
      this.setGroupData(dataItems);
      this.updateState({ dataItems: dataItems } as S, () => isUpdated && this.onDataItemsUpdate());
    } else if (props.orderby) {
      this.updateState({ dataItems: getOrderedDataset(dataItems, props.orderby, 'dataObject')} as S, () => isUpdated && this.onDataItemsUpdate());
    } else {
      this.updateState({ dataItems: dataItems } as S, () => isUpdated && this.onDataItemsUpdate());
    }
  }
}
