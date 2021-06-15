import React from 'react';
import {Text, View} from "react-native";
import {Menu, ToggleButton} from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSwitchProps from './switch.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSwitchStyles } from './switch.styles';

export class WmSwitchState extends BaseComponentState<WmSwitchProps> {
  dataItems: any;
}

export default class WmSwitch extends BaseComponent<WmSwitchProps, WmSwitchState, WmSwitchStyles> {
  constructor(props: WmSwitchProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSwitchProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'dataset':
        this.setDataItems($new);
        break;
      case 'datavalue':
        //this.updateState({datavalue: $new} as WmSwitchState);
        //this.state.props.datavalue = $new;
        break;
    }
  }

  setDataItems(dataset: any = this.state.props.dataset) {
    const name = this.props.name;
    let dataItems: any = [];
    if (typeof dataset === 'string') {
      dataItems = dataset.split(',').map((s, i) => {
        return {
          key: `${name}_item${i}`,
          displayfield: s,
          datafield: s
        };
      });
    } else if (dataset) {
      dataItems = (dataset as any[]).map((d, i) => {
        return {
          key: `${name}_item${i}`,
          displayfield: d[this.state.props.displayfield],
          datafield: d[this.state.props.datafield]
        };
      });
    }
    this.updateState({dataItems: dataItems} as WmSwitchState);
  }

  onChange(value: any) {
    //this.updateState({datavalue: value} as WmSwitchState);
    //this.state.props.datavalue = value;
    // @ts-ignore
    this.updateState((S)=> {S.props.datavalue = value;return S;},
      ()=>this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.state.props.datavalue ]));

  }

  renderChild(item: any) {
    const switchWidth = this.styles.root.width;
    let childWidth: any;
    // @ts-ignore
    if (switchWidth?.toString().indexOf('%') > -1) {
      // @ts-ignore
      childWidth = parseInt(switchWidth.toString().split('%')[0])/this.state.dataItems.length + '%';
    } else { // @ts-ignore
      if (switchWidth?.toString().indexOf('px') > -1) {
        // @ts-ignore
        childWidth = parseInt(switchWidth.toString().split('px')[0])/this.state.dataItems.length + 'px';
      } else {
        // @ts-ignore
        childWidth = parseInt(switchWidth)/this.state.dataItems.length + 'px';
      }
    }
    return (
      <ToggleButton style={[this.styles.root, {width: childWidth}]} icon={()=><View><Text>{item.displayfield}</Text></View>} key={item.key} value={item.datafield} />
    );
  }

  renderWidget(props: WmSwitchProps) {
    const items = this.state.dataItems;
    return (<ToggleButton.Row style={this.styles.root} onValueChange={this.onChange.bind(this)} value={props.datavalue}>
      {items && items.length ?
        items.map((item: any) => this.renderChild(item)): null}
    </ToggleButton.Row>);
  }
}
