import React from 'react';
import { Text, View, TouchableOpacity, DimensionValue } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { find, forEach, isEqual,  isEmpty } from 'lodash';
import WmCheckboxsetProps from './checkboxset.props';
import {
  DEFAULT_CLASS,

  WmCheckboxsetStyles,
} from './checkboxset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState,
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { getNumberOfEmptyObjects } from '@wavemaker/app-rn-runtime/core/utils';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

export class WmCheckboxsetState extends BaseDatasetState<WmCheckboxsetProps> {
  isValid: boolean = true;
  template: string = "";
}

export default class WmCheckboxset extends BaseDatasetComponent<WmCheckboxsetProps, WmCheckboxsetState, WmCheckboxsetStyles> {
  constructor(props: WmCheckboxsetProps) {
    super(props, DEFAULT_CLASS, new WmCheckboxsetProps());
  }

  onPress(item: any) {
    if (this.state.props.disabled || this.state.props.readonly) {
      return;
    }
    this.invokeEventCallback('onTap', [null, this.proxy]);
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

  renderChild(item: any, index: any,colWidth: DimensionValue) {
    const props = this.state.props;
    const displayText = item.displayexp || item.displayfield;
    return (
      <TouchableOpacity {...this.getTestPropsForAction(index + '')}
        style={[this.styles.item, item.selected ? this.styles.checkedItem : null, {width: colWidth}]}
        onPress={this.onPress.bind(this, item)} key={item.key} {...getAccessibilityProps(AccessibilityWidgetType.CHECKBOX, {hint: props?.hint, checked: item.selected})} accessibilityRole='checkbox' accessibilityLabel={`Checkbox for ${displayText}`}>
        <WmIcon iconclass="wi wi-check" styles={item.selected? this.styles.checkicon : this.styles.uncheckicon} disabled={props.readonly || props.disabled} id={this.getTestId('item'+index)}/>
        {!isEmpty(this.state.template) && this.props.renderitempartial ?
           this.props.renderitempartial(item.dataObject, index, this.state.template) :
        <Text {...this.getTestPropsForLabel(index + '')} style={[this.styles.text, item.selected ? this.styles.selectedLabel: null]}>{displayText}</Text>}
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

  setTemplate(partialName: any) {
    this.updateState({ template: partialName} as WmCheckboxsetState);
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
    const noOfColumns = props.itemsperrow.xs || 1;
    const colWidth = Math.round(100/ noOfColumns) + '%' as DimensionValue;
    return(<View style = {noOfColumns === 1 ? {} : {flexWrap: 'wrap', flexDirection: 'row'}}>
      {items && items.length
        ? items.map((item: any, index: any) => this.renderChild(item, index, colWidth))
        : null}
    </View>)
  }

  public renderSkeleton(props: WmCheckboxsetProps): React.ReactNode {
    const noOfColumns = props.itemsperrow.xs || 1;
    const colWidth = Math.round(100/ noOfColumns) + '%' as DimensionValue;

    return [...getNumberOfEmptyObjects(props.numberofskeletonitems as number ?? 3)].map(_ => {
      return <View style={[this.styles.item, {width: colWidth}]}>
        <WmIcon styles={this.styles.checkicon}/>
        <WmLabel styles={{ root: this.styles.text }}/>
      </View>
    })
  }

  renderWidget(props: WmCheckboxsetProps) {
    const items = this.state.dataItems;
    return (
      <ScrollView style={this.styles.root}>
        <ScrollView horizontal={true}>
          {props.groupby && this.renderGroupby()}
          {!props.groupby && this.renderCheckboxses(items)}
        </ScrollView>
      </ScrollView>
    );
  }
}
