import React from 'react';
import {Text, View} from "react-native";
import {Menu, ToggleButton} from 'react-native-paper';
import { isEqual, find } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSwitchProps from './switch.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSwitchStyles } from './switch.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { BaseDatasetComponent, BaseDatasetState } from '../basedataset/basedataset.component';

export class WmSwitchState extends BaseDatasetState<WmSwitchProps> {}

export default class WmSwitch extends BaseDatasetComponent<WmSwitchProps, WmSwitchState, WmSwitchStyles> {
  constructor(props: WmSwitchProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSwitchProps());
  }

  onChange(value: any) {
    if (!value) {
      return;
    }
    if (this.state.props.datafield === 'All Fields') {
      const selectedItem = find(this.state.dataItems, (item) => isEqual(item.key, value));
      value = selectedItem && selectedItem.dataObject;
    }
    // @ts-ignore
    this.updateState({props: {datavalue: value}},
      ()=>this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.state.props.datavalue ]));
  }

  onTap(event: any) {
    this.invokeEventCallback('onTap', [ event, this.proxy ]);
  }

  renderChild(item: any, index: any) {
    let btnClass = 'button';
    const props = this.state.props;
    if(index === 0) {
      btnClass = 'firstButton';
    } else if (index+1 === this.state.dataItems.length) {
      btnClass = 'lastButton';
    }
    const displayText = item.displayexp || item.displayfield;
    const isSelected = this.state.props.datafield === 'All Fields' ? isEqual(props.datavalue, item.datafield) : this.state.props.datavalue === item.datafield;
    return (
      <ToggleButton onPress={this.onTap.bind(this)}
                    disabled={this.state.props.disabled}
                    style={[this.styles.button, this.styles[btnClass],
                      isSelected ? this.styles.selectedButton : null]}
                    icon={()=>this.state.props.iconclass ?
                          (<WmIcon styles={this.styles.loadingIcon}
                                  iconclass={item.icon}
                                  caption={displayText}></WmIcon>)
                          : (<View><Text style={[this.styles.text, {color: isSelected ? this.styles.selectedButton.color : this.styles.button.color }]}>{displayText}</Text></View>)}
                    key={item.key}
                    value={this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield} />
    );
  };

  renderWidget(props: WmSwitchProps) {
    const items = this.state.dataItems;
    return (<ToggleButton.Row style={this.styles.root}
                              onValueChange={this.onChange.bind(this)}
                              value={this.state.props.datafield === 'All Fields'? this.getItemKey(props.datavalue) : props.datavalue}>
      {items && items.length ?
        items.map((item: any, index: any) => this.renderChild(item, index)): null}
    </ToggleButton.Row>);
  }
}
