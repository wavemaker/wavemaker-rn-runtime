import React from 'react';
import { Text, View } from 'react-native';
import { forEach } from 'lodash';
import { Checkbox } from 'react-native-paper';

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

export class WmCheckboxsetState extends BaseDatasetState<WmCheckboxsetProps> {}

export default class WmCheckboxset extends BaseDatasetComponent<WmCheckboxsetProps, WmCheckboxsetState, WmCheckboxsetStyles> {
  constructor(props: WmCheckboxsetProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCheckboxsetProps());
  }

  onPress(item: any) {
    item.selected = !item.selected;
    const selectedValue: any = [];
    forEach(this.state.dataItems, (item) => {
        if (item.selected) {
          selectedValue.push(item.datafield);
        }
    });

    this.updateState({ props: { datavalue: selectedValue }} as WmCheckboxsetState,
      ()=>this.invokeEventCallback('onChange', [ undefined, this.proxy, selectedValue, this.state.props.datavalue ]));
  }

  renderChild(item: any, index: any) {
    const displayText = item.displayexp || item.displayfield;
    return (
      <View style={this.styles.checkboxHead} key={item.key}>
        <View style={this.styles.checkbox}>
          <Checkbox status={item.selected ? 'checked' : 'unchecked'} color={'blue'} onPress={() => {
            this.onPress(item);
          }} />
        </View>
        <View style={this.styles.checkboxLabel}>
          <Text>{displayText}</Text>
        </View>
      </View>
    );
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
