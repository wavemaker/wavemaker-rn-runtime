import React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';

import WmRadiosetProps from './radioset.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmRadiosetStyles } from './radioset.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';

export class WmRadiosetState extends BaseDatasetState<WmRadiosetProps> {
}

export default class WmRadioset extends BaseDatasetComponent<WmRadiosetProps, WmRadiosetState, WmRadiosetStyles> {

  constructor(props: WmRadiosetProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmRadiosetProps());
  }

  renderChild(item: any, index: any) {
    const displayText = item.displayexp || item.displayfield;
    return (
      <View style={this.styles.radioHead} key={item.key}>
          <RadioButton
            value={item.datafield}
            color={this.styles.root.color}
            disabled={this.state.props.readonly || this.state.props.disabled}
          />
          <Text style={this.styles.radioLabel}>{displayText}</Text>
    </View>)
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
    return(<RadioButton.Group onValueChange={this.onChange.bind(this)} value={props.datavalue}>
      {items && items.length ?
        items.map((item: any, index: any) => this.renderChild(item, index)): null}
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
