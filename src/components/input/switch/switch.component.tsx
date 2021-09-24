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
      case 'datavalue':
        this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old);
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
          displayfield: d[this.props.displayfield],
          datafield: this.state.props.datafield=== 'All Fields' ? d : d[this.state.props.datafield],
          displayexp: this.props.getDisplayExpression ? this.props.getDisplayExpression(d) : d[this.props.displayfield],
          icon: d[this.props.iconclass]
        };
      });
    }
    this.updateState({dataItems: dataItems} as WmSwitchState);
  }

  onChange(value: any) {
    value = this.state.props.datafield === 'All Fields' ? JSON.parse(value): value;
    if (!value) {
      return;
    }
    // @ts-ignore
    this.updateState({props: {datavalue: value}},
      ()=>this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.state.props.datavalue ]));
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmSwitchState);
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
    const isSelected = this.state.props.datafield === 'All Fields' ? JSON.stringify(props.datavalue) === JSON.stringify(item.datafield) : this.state.props.datavalue === item.datafield;
    return (
      <ToggleButton onPress={this.onTap.bind(this)}
                    disabled={this.state.props.disabled}
                    style={[this.styles[btnClass],
                      isSelected ? this.styles.selectedButton : this.styles.button]}
                    icon={()=>this.state.props.iconclass ?
                          (<WmIcon styles={this.styles.loadingIcon}
                                  iconclass={item.icon}
                                  caption={displayText}></WmIcon>)
                          : (<View><Text style={isSelected ? {color: this.styles.selectedButton.color} : {}}>{displayText}</Text></View>)}
                    key={item.key}
                    value={this.state.props.datafield === 'All Fields' ? JSON.stringify(item.datafield) : item.datafield} />
    );
  };

  renderWidget(props: WmSwitchProps) {
    const items = this.state.dataItems;
    return (<ToggleButton.Row style={this.styles.root}
                              onValueChange={this.onChange.bind(this)}
                              value={this.state.props.datafield === 'All Fields'? JSON.stringify(props.datavalue) : props.datavalue}>
      {items && items.length ?
        items.map((item: any, index: any) => this.renderChild(item, index)): null}
    </ToggleButton.Row>);
  }
}
