import React from 'react';
import { Text, View } from 'react-native';
import { find, forEach, isEqual } from 'lodash';
import { Checkbox } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import WmCheckboxsetProps from './checkboxset.props';
import {
  DEFAULT_CLASS,
  DEFAULT_STYLES,
  WmCheckboxsetStyles,
} from './checkboxset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState,
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';

export class WmCheckboxsetState extends BaseDatasetState<WmCheckboxsetProps> {
  isValid: boolean = true;
}

export default class WmCheckboxset extends BaseDatasetComponent<WmCheckboxsetProps, WmCheckboxsetState, WmCheckboxsetStyles> {
  constructor(props: WmCheckboxsetProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCheckboxsetProps());
  }

  computeDisplayValue() {
    this.updateState({
      props: {
        displayValue: (this.state.dataItems || [])
          .filter((item: any) => item.selected)
          .map((item: any) => item.displayfield)
      }
    } as WmCheckboxsetState);
  }

  onDataItemsUpdate() {
    super.onDataItemsUpdate();
    this.computeDisplayValue();
  }

  onPress(item: any) {
    this.invokeEventCallback('onTap', [null, this.proxy]);
    if (this.state.props.disabled) {
      return;
    }
    item.selected = !item.selected;
    const selectedValue: any = [];
    const selectedItem = find(this.state.dataItems, d => isEqual(d.key, item.key));
    const oldValue = this.state.props.datavalue;
    selectedItem.selected = item.selected;
    forEach(this.state.dataItems, (item) => {
        if (item.selected) {
          selectedValue.push(item.datafield);
        }
    });
    let isValid = true;
    if (this.props.required && !selectedValue.length) {
      isValid = false;
    }
    this.updateState({ props: { datavalue: selectedValue }, isValid: isValid} as WmCheckboxsetState,
      () => {
        this.computeDisplayValue();
        this.invokeEventCallback('onChange', [ undefined, this.proxy, selectedValue, oldValue ]);
      });
  }

  renderChild(item: any, index: any) {
    const props = this.state.props;
    const displayText = item.displayexp || item.displayfield;
    return (
      <TouchableOpacity style={this.styles.checkboxHead} onPress={this.onPress.bind(this, item)} key={item.key}>
        <Checkbox.Android status={item.selected  ? 'checked' : 'unchecked'} color={this.styles.text.color as string} disabled={props.readonly || props.disabled}/>
        <Text style={this.styles.checkboxLabel}>{displayText}</Text>
      </TouchableOpacity>)
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmCheckboxsetState);
  }

  check() {
    const isValid = this.props.required && !this.state.props.datavalue ? false : true;
    this.updateState({
      isValid: isValid
    } as WmCheckboxsetState);
  }

  renderGroupby() {
    const groupedData = this.state.groupedData;
    return (
      <View>
        {groupedData && groupedData.length
          ? groupedData.map((groupObj: any, index: any) => {
            return(
              <View key={groupObj.key}>
                <Text style={this.styles.groupHeaderTitle}>{groupObj.key}</Text>
                {this.renderCheckboxses(groupObj.data)}
              </View>)
          })
          : null}
      </View>
    );
  }

  renderCheckboxses(items: any) {
    const props = this.state.props;
    return(<View>
      {items && items.length
        ? items.map((item: any, index: any) => this.renderChild(item, index))
        : null}
    </View>)
  }

  renderWidget(props: WmCheckboxsetProps) {
    const items = this.state.dataItems;
    return (
      <View>
        {props.groupby && this.renderGroupby()}
        {!props.groupby && this.renderCheckboxses(items)}
      </View>
    );
  }
}
