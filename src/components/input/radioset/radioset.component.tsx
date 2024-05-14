import React from 'react';
import { View, Text, DimensionValue, TouchableOpacity } from 'react-native';

import WmRadiosetProps from './radioset.props';
import { DEFAULT_CLASS, WmRadiosetStyles } from './radioset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { ScrollView } from 'react-native';
import WmSkeleton, { createSkeleton } from '../../basic/skeleton/skeleton.component';
import { find, forEach, isEqual } from 'lodash-es';
import { isEmpty } from 'lodash';

export class WmRadiosetState extends BaseDatasetState<WmRadiosetProps> {
  template: string = '';
}

export default class WmRadioset extends BaseDatasetComponent<WmRadiosetProps, WmRadiosetState, WmRadiosetStyles> {

  constructor(props: WmRadiosetProps) {
    super(props, DEFAULT_CLASS, new WmRadiosetProps());
  }

  onPress(item: any) {
    this.invokeEventCallback('onTap', [null, this.proxy]);
    if (this.state.props.disabled || this.state.props.readonly) {
      return;
    }
    item.selected = true;
    let selectedValue: any = "";
    const selectedItem = find(this.state.dataItems, d => isEqual(d.key, item.key));
    const oldValue = this.state.props.datavalue;
    selectedItem.selected = item.selected;
    selectedValue = selectedItem.selected ? selectedItem.datafield : null;
    this.validate(selectedValue);
    this.updateState({ props: { datavalue: selectedValue }} as WmRadiosetState,() => {
      this.computeDisplayValue();
      this.invokeEventCallback('onChange', [ undefined, this.proxy, selectedValue, oldValue ]);
    });
  }

  renderChild(item: any, index: any, colWidth: DimensionValue) {
    const displayText = item.displayexp || item.displayfield;
    const value = this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield;
    return (
      <TouchableOpacity style={[
        this.styles.item,
        item.selected ? this.styles.selectedItem : null,
        {width: colWidth}]} onPress={this.onPress.bind(this, item)} key={item.key} {...this.getTestPropsForAction()}>
          <WmIcon {...this.getTestProps('' + index)} iconclass="wi wi-fiber-manual-record" styles={item.selected ? this.styles.checkedRadio : this.styles.uncheckedRadio} disabled={this.state.props.readonly || this.state.props.disabled}></WmIcon>
          {!isEmpty(this.state.template) && this.props.renderitempartial ?
          this.props.renderitempartial(item.dataObject, index, this.state.template) : <Text style={this.styles.radioLabel} {...this.getTestPropsForLabel('caption')}>{displayText}</Text>}
      </TouchableOpacity>)
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
    return(
      <View style={noOfColumns === 1 ? {} : this.styles.group}>
        {items && items.length ?
          items.map((item: any, index: any) => this.renderChild(item, index, colWidth)): null}
      </View>)
  }

  renderWidget(props: WmRadiosetProps) {
    const items = this.state.dataItems;
    return (
      <ScrollView style={this.styles.root}>
        <ScrollView horizontal={true}>
          {props.groupby && this.renderGroupby()}
          {!props.groupby && this.renderRadioButtons(items)}
        </ScrollView>
      </ScrollView>
    );
  }
}
