import React from 'react';
import { View, Text, DimensionValue } from 'react-native';
import { RadioButton } from 'react-native-paper';

import WmRadiosetProps from './radioset.props';
import { DEFAULT_CLASS, WmRadiosetStyles } from './radioset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmSkeleton, { createSkeleton } from '../../basic/skeleton/skeleton.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/utils';

export class WmRadiosetState extends BaseDatasetState<WmRadiosetProps> {
}

export default class WmRadioset extends BaseDatasetComponent<WmRadiosetProps, WmRadiosetState, WmRadiosetStyles> {

  constructor(props: WmRadiosetProps) {
    super(props, DEFAULT_CLASS, new WmRadiosetProps());
  }

  onPress(value: any) {
    this.invokeEventCallback('onTap', [null, this.proxy]);
    this.onValueChange(value);
  }

  renderChild(item: any, index: any, colWidth: DimensionValue) {
    const displayText = item.displayexp || item.displayfield;
    const value = this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield;
    const selected = value === this.state.props.datavalue;
    return (
      <View style={[
        this.styles.item,
        selected ? this.styles.selectedItem : null,
        {width: colWidth}]} key={item.key}>
          <RadioButton.Android
            {...this.getTestProps('' + index)}
            value={value}
            color={this.styles.root.color as string}
            uncheckedColor={this.styles.root.color as string}
            {...getAccessibilityProps(AccessibilityWidgetType.CURRENCY, {...this.state.props, selected: this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield})}
            accessibilityLabel={`Radio button for ${displayText}`}
            disabled={this.state.props.readonly || this.state.props.disabled}
          />
          <Text style={this.styles.radioLabel}>{displayText}</Text>
    </View>)
  }

  renderGroupby() {
    const groupedData = this.state.groupedData;
    return (
      <View accessibilityRole='radiogroup'>
        {groupedData && groupedData.length
          ? groupedData.map((groupObj: any, index: any) => {
            return(
              <View key={groupObj.key}>
                <Text style={this.styles.groupHeaderTitle}>{groupObj.key}</Text>
                {this.renderRadioButtons(groupObj.data)}
              </View>)
          })
          : null}
      </View>
    );
  }

  renderRadioButtons(items: any) {
    const props = this.state.props;
    const noOfColumns = props.itemsperrow.xs || 1;
    const colWidth = Math.round(100/ noOfColumns) + '%' as DimensionValue;
    return(<RadioButton.Group onValueChange={this.onPress.bind(this)} value={this.state.props.datafield === 'All Fields'? this.getItemKey(props.datavalue) : props.datavalue}>
      <View style={this.styles.group}>
        {items && items.length ?
          items.map((item: any, index: any) => this.renderChild(item, index, colWidth)): null}
      </View>
    </RadioButton.Group>)
  }

  renderWidget(props: WmRadiosetProps) {
    const items = this.state.dataItems;
    return (
        <View style={this.styles.root}>
          {props.groupby && this.renderGroupby()}
          {!props.groupby && this.renderRadioButtons(items)}
        </View>
    );
  }
}
