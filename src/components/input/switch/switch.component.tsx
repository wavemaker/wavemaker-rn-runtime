import React, { useRef } from 'react';
import {DimensionValue, LayoutChangeEvent, Text, View} from "react-native";
import { isEqual, find } from 'lodash';

import WmSwitchProps from './switch.props';
import { DEFAULT_CLASS, WmSwitchStyles } from './switch.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { BaseDatasetComponent, BaseDatasetState } from '../basedataset/basedataset.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmSwitchState extends BaseDatasetState<WmSwitchProps> {}

export default class WmSwitch extends BaseDatasetComponent<WmSwitchProps, WmSwitchState, WmSwitchStyles> {
  constructor(props: WmSwitchProps) {
    super(props, DEFAULT_CLASS, new WmSwitchProps());
  }

  onChange(value: any) {
    if (!value) {
      return;
    }
    const oldVal = this.state.props.datavalue;
    this.validate(value);
    if (value === oldVal) {
      return;
    }
    if (this.state.props.datafield === 'All Fields') {
      const selectedItem = find(this.state.dataItems, (item) => isEqual(item.key, value));
      value = selectedItem && selectedItem.dataObject;
    }
    // @ts-ignore
    this.updateState({props: {datavalue: value}, isDefault: false},
      () => {
      if (!this.props.invokeEvent) {
        this.invokeEventCallback('onChange', [undefined, this.proxy, value, oldVal]);
      }
      });
  }

  onTap(event: any, item: any) {
    const value = this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield;
    this.onChange(value);
    this.invokeEventCallback('onTap', [ event, this.proxy ]);
  }

  public renderSkeleton(props: WmSwitchProps): React.ReactNode {
    const items = this.state.dataItems;
    let skeletonWidth:any, skeletonHeight:any;
    if(this.props.skeletonwidth == "0") {
      skeletonWidth = 0
    } else {
      skeletonWidth = this.props.skeletonwidth || this.styles.root?.width
    }

    if(this.props.skeletonheight == "0") {
      skeletonHeight = 0
    } else {
      skeletonHeight = this.props.skeletonheight || this.styles.root?.height;
    }
    
    const createSkeletonFun = (skeletonWidth:any, skeletonHeight:any,skeletonStyles:any) => {
      return (
        createSkeleton(this.theme, skeletonStyles, {
          ...this.styles.root,
          width: skeletonWidth as DimensionValue,
          height: skeletonHeight as DimensionValue
        }))} 

    return (items && items.length ?
      <View style={{display:'flex', flexDirection:'row'}}>{items.map((item: any, index: any) => 
        index === 0 ?createSkeletonFun(skeletonWidth, skeletonHeight,{root: {
          width:64,
          height: 40,
          paddingLeft: 16,
          paddingRight: 16,
          borderTopLeftRadius:18,
          borderBottomLeftRadius:18,
       }})
        : index === items.length-1 ? createSkeletonFun(skeletonWidth, skeletonHeight,{root: {
          width:64,
          height: 40,
          paddingLeft: 16,
          paddingRight: 16,
          borderTopRightRadius:18,
          borderBottomRightRadius:18,
       }})
        : createSkeletonFun(skeletonWidth, skeletonHeight,this.styles.skeleton)
      )}</View>   : null)
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
      <Tappable
        {...this.getTestPropsForAction('button'+index)}
        accessibilityProps={{...getAccessibilityProps(AccessibilityWidgetType.SWITCH, {selected: isSelected, hint: props?.hint})}}
        onTap={this.state.props.disabled ? undefined : this.onTap.bind(this, null, item)}
        styles={[
          this.styles.button,
          this.styles[btnClass],
          isSelected ? this.styles.selectedButton : null]}
          key={item.key}>
        {this.state.props.iconclass ?
            (<WmIcon
              id={this.getTestId('icon' + index)}
              styles={this.styles.loadingIcon}
              iconclass={item.icon}
              caption={displayText}></WmIcon>)
            : (<View>
                <Text
                  {...this.getTestPropsForLabel('label' + index)}
                  style={[ isSelected ?  this.styles.selectedButtonText : this.styles.text,
                    {color: isSelected ? this.styles.selectedButton.color : this.styles.button.color }]}>
                  {displayText}
                </Text>
              </View>)}
      </Tappable>
    );
  };

  renderWidget(props: WmSwitchProps) {
    const items = this.state.dataItems;
    return (<View style={this.styles.root}>
      {items && items.length ?
        items.map((item: any, index: any) => this.renderChild(item, index)): null}
    </View>);
  }
}
