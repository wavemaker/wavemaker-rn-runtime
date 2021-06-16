import React from 'react';
import {Text, View} from "react-native";
import {Menu, ToggleButton} from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSwitchProps from './switch.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSwitchStyles } from './switch.styles';
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";

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
          datafield: d[this.state.props.datafield],
          displayexp: this.state.props.displayexpression ? eval(this.state.props.displayexpression.replace(/\$/g, 'd')) : d[this.state.props.displayfield],
          icon: d[this.state.props.iconclass]
        };
      });
    }
    this.updateState({dataItems: dataItems} as WmSwitchState);
  }

  onChange(value: any) {
    if (!value) {
      return;
    }
    // @ts-ignore
    this.updateState((S)=> {S.props.datavalue = value;return S;},
      ()=>this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.state.props.datavalue ]));
  }

  onTap(event: any) {
    this.invokeEventCallback('onTap', [ event, this.proxy ]);
  }

  renderChild(item: any) {
    const switchWidth: any = this.styles.root.width;
    let childWidth: any;
    if (switchWidth?.toString().indexOf('%') > -1) {
      childWidth = parseInt(switchWidth.toString().split('%')[0])/this.state.dataItems.length + '%';
    } else if (switchWidth?.toString().indexOf('px') > -1) {
      childWidth = parseInt(switchWidth.toString().split('px')[0])/this.state.dataItems.length + 'px';
    } else {
      childWidth = parseInt(switchWidth)/this.state.dataItems.length + 'px';
    }
    const displayText = item.displayexp || item.displayfield;
    return (
      <ToggleButton onPress={this.onTap.bind(this)} disabled={this.state.props.disabled} style={[this.styles.buttonStyles, {width: childWidth, backgroundColor: this.state.props.datavalue === item.datafield ? this.styles.selectedButtonStyles.backgroundColor : this.styles.buttonStyles.backgroundColor}]} icon={()=>this.state.props.iconclass ?
        (<WmIcon styles={this.styles.loadingIcon} iconclass={item.icon} caption={displayText}></WmIcon>) : (<View><Text>{displayText}</Text></View>)} key={item.key} value={item.datafield} />
    );
  };

  renderWidget(props: WmSwitchProps) {
    const items = this.state.dataItems;
    return (<ToggleButton.Row style={this.styles.root} onValueChange={this.onChange.bind(this)} value={props.datavalue}>
      {items && items.length ?
        items.map((item: any) => this.renderChild(item)): null}
    </ToggleButton.Row>);
  }
}
