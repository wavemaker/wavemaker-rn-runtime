import React from 'react';
import { View, Text, DimensionValue, TouchableOpacity, Platform, AccessibilityRole } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import WmRadiosetProps from './radioset.props';
import { DEFAULT_CLASS, WmRadiosetStyles } from './radioset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmSkeleton, { createSkeleton } from '../../basic/skeleton/skeleton.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { find, forEach, isEqual } from 'lodash-es';
import { isEmpty } from 'lodash';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import { getNumberOfEmptyObjects } from '@wavemaker/app-rn-runtime/core/utils';

export class WmRadiosetState extends BaseDatasetState<WmRadiosetProps> {
  template: string = '';
}

export default class WmRadioset extends BaseDatasetComponent<WmRadiosetProps, WmRadiosetState, WmRadiosetStyles> {

  constructor(props: WmRadiosetProps) {
    super(props, DEFAULT_CLASS, new WmRadiosetProps());
  }

  onPress(item: any) {
    if (this.state.props.disabled || this.state.props.readonly) {
      return;
    }
    this.invokeEventCallback('onTap', [null, this.proxy]);
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

  renderChild(item: any, index: any, colWidth?: DimensionValue) {
    const displayText = item.displayexp || item.displayfield;
    const value = this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield;
    const itemStyle = colWidth  ? [{ width: colWidth }, this.styles.item]
    : [this.styles.noscrollitem];
    const accessibilityProps = { accessibilityLabel: displayText ,
      accessibilityRole: 'radio' as AccessibilityRole,
      accessibilityState: {
        disabled: this.props.readonly || this.props.disabled,
        selected: item.selected,
      }
    }
    return (
      <TouchableOpacity style={[
        itemStyle,
         item.selected ? this.styles.selectedItem : null]}
         onPress={this.onPress.bind(this, item)} key={item.key} {...this.getTestPropsForAction("radio"+index)} {...accessibilityProps}>
          <WmIcon id={this.getTestId('radiobutton' + index)} iconclass="wi wi-fiber-manual-record" styles={item.selected ? this.styles.checkedRadio : this.styles.uncheckedRadio} disabled={this.state.props.readonly || this.state.props.disabled} accessible={false}></WmIcon>
          {!isEmpty(this.state.template) && this.props.renderitempartial ?
          this.props.renderitempartial(item.dataObject, index, this.state.template) : <Text style={[this.styles.radioLabel, item.selected ? this.styles.selectedLabel : null, item.selected ? {color: this.styles.checkedRadio.text.color}: null]} {...this.getTestPropsForLabel('caption'+index)}>{displayText}</Text>}
      </TouchableOpacity>)
  }

  setTemplate(partialName: any) {
    this.updateState({ template: partialName } as WmRadiosetState);
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
    return props.radiosetscroll ? (
      <View style={noOfColumns === 1 ? {} : this.styles.group}>
        {items && items.length ?
          items.map((item: any, index: any) => this.renderChild(item, index, colWidth)): null}
      </View>
      ) : (
       <View style={[this.styles.group]}>
          {items && items.length ?
           items.map((item: any, index: any) => this.renderChild(item, index)): null}
       </View>
      )
  }

  public renderSkeleton(props: WmRadiosetProps): React.ReactNode {
    const noOfColumns = props.itemsperrow.xs || 1;
    const colWidth = Math.round(100/ noOfColumns) + '%' as DimensionValue;

    return [...getNumberOfEmptyObjects(props.numberofskeletonitems as number ?? 5)].map(_ => {
      return <View style={[this.styles.item, {width: colWidth}]}>
        <WmIcon styles={this.styles.checkedRadio}/>
        <WmLabel styles={{ skeleton: this.styles.skeleton }}/>
      </View>
    })

  }

  renderWidget(props: WmRadiosetProps) {
    const items = this.state.dataItems;
    return props.radiosetscroll ? (
      <ScrollView style={this.styles.root} onLayout={(event) => this.handleLayout(event)}>
        <ScrollView horizontal={true}
          style={this.isRTL && Platform.OS == 'android' ? { transform: [{ scaleX: -1 }] } : {}}
          contentContainerStyle={this.isRTL && Platform.OS == 'android' ? { transform: [{ scaleX: -1 }] } : {}}
          {...getAccessibilityProps(AccessibilityWidgetType.RADIOSET, this.props)}
        >
          {props.groupby && this.renderGroupby()}
          {!props.groupby && this.renderRadioButtons(items)}
        </ScrollView>
      </ScrollView>
    ) : (
      <View style={[this.styles.root]} onLayout={(event) => this.handleLayout(event)} {...getAccessibilityProps(AccessibilityWidgetType.RADIOSET, this.props)}>
        {props.groupby && this.renderGroupby()}
        {!props.groupby && this.renderRadioButtons(items)}
      </View>
    );
  }
}
