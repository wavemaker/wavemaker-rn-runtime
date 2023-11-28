import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { find, forEach, isEqual } from 'lodash';
import { Checkbox } from 'react-native-paper';

import WmCheckboxsetProps from './checkboxset.props';
import {
  DEFAULT_CLASS,
  
  WmCheckboxsetStyles,
} from './checkboxset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState,
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmSkeleton, { createSkeleton } from '../../basic/skeleton/skeleton.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/utils';

export class WmCheckboxsetState extends BaseDatasetState<WmCheckboxsetProps> {
  isValid: boolean = true;
}

export default class WmCheckboxset extends BaseDatasetComponent<WmCheckboxsetProps, WmCheckboxsetState, WmCheckboxsetStyles> {
  constructor(props: WmCheckboxsetProps) {
    super(props, DEFAULT_CLASS, new WmCheckboxsetProps());
  }

  onPress(item: any) {
    this.invokeEventCallback('onTap', [null, this.proxy]);
    if (this.state.props.disabled || this.state.props.readonly) {
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
    this.validate(selectedValue);
    this.updateState({ props: { datavalue: selectedValue }} as WmCheckboxsetState,
      () => {
        this.computeDisplayValue();
        this.invokeEventCallback('onChange', [ undefined, this.proxy, selectedValue, oldValue ]);
      });
  }

  renderChild(item: any, index: any) {
    const props = this.state.props;
    const displayText = item.displayexp || item.displayfield;
    return (
      <TouchableOpacity {...this.getTestPropsForAction(index + '')}
        style={[this.styles.item, item.selected ? this.styles.checkedItem : null]}
        onPress={this.onPress.bind(this, item)} key={item.key}>
        <Checkbox.Android status={item.selected  ? 'checked' : 'unchecked'} color={this.styles.text.color as string} disabled={props.readonly || props.disabled} {...getAccessibilityProps(AccessibilityWidgetType.CHECKBOX, {...props, checked: item.selected})} accessibilityRole='checkbox' accessibilityLabel={`Checkbox for ${displayText}`}/>
        <Text {...this.getTestPropsForLabel(index + '')} {...getAccessibilityProps(AccessibilityWidgetType.CHECKBOX, {...props, checked: item.selected})} style={this.styles.checkboxLabel}>{displayText}</Text>
      </TouchableOpacity>)
  }

  computeDisplayValue() {
    this.updateState({
      props: {
        displayValue: ((this.state.dataItems || [] as any)
          .filter((item: any) => item.selected)
          .map((item: any) => item.displayexp || item.displayfield)) || ''
      }
    } as WmCheckboxsetState);
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmCheckboxsetState);
    return Promise.resolve();
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
      <View style={this.styles.root}>
        {props.groupby && this.renderGroupby()}
        {!props.groupby && this.renderCheckboxses(items)}
      </View>
    );
  }
}
