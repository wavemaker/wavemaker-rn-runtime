import React from 'react';
import { View, Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmRatingProps from './rating.props';
import { DEFAULT_CLASS, WmRatingStyles } from './rating.styles';
import { cloneDeep, isArray, isEmpty, isNumber, isString } from 'lodash-es';

export class WmRatingState extends BaseComponentState<WmRatingProps> {
  items: any[] = null as any;
  caption: any = null as any;
  selectedIndex = -1;
  isDefault = false;
}

export default class WmRating extends BaseComponent<WmRatingProps, WmRatingState, WmRatingStyles> {

  constructor(props: WmRatingProps) {
    super(props, DEFAULT_CLASS, new WmRatingProps());
  }

  get caption() {
    return this.state.caption;
  }

  prepareItems(props: WmRatingProps) {
    let items: any[] = [];
    if (!props.dataset && props.maxvalue) {
      items = Array.from(Array(+props.maxvalue).keys());
      items = items.map(v => v + 1);
    } else if (isString(props.dataset)) {
      items = props.dataset.split(',');
    } else {
      items = props.dataset as any[] || [];
    }
    if (isArray(items) && items[0] !== Object(items[0])) {
      items = items.map((v, i) => ({
        key: i + 1,
        value: v
      }));
    }
    let selectedIndex = -1;
    if (props.datavalue !== undefined && props.datavalue !== null) {
      selectedIndex = items.findIndex((item: any, k) => item[props.datafield as string] == props.datavalue);
      if (selectedIndex === -1 && isNumber(props.datavalue)) {
        selectedIndex = props.datavalue;
      }
    }
    let caption: any = '';
    if (selectedIndex > -1 && props.showcaptions) {
      const selectedItem = items[selectedIndex];
      if (selectedItem) {
        if (props.getDisplayExpression) {
          caption = props.getDisplayExpression(selectedItem);
        } else {
          caption = selectedItem[props.displayfield as string];
        }
      } else {
        caption = selectedIndex + 1;
      }
    }
    this.updateState({
      items: items,
      selectedIndex: selectedIndex,
      caption: caption
    } as WmRatingState);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'dataset' :
      case 'datafield' :
      case 'displayfield' :
      case 'maxvalue':
      case 'datavalue' :
        this.prepareItems(this.state.props);
        if (name === 'datavalue') {
          const isDefault = this.state.props.isdefault;
          if (isDefault) {
            this.updateState({ props: {isdefault: false} } as WmRatingState, this.props.onFieldChange && this.props.onFieldChange.bind(this, 'datavalue', $new, $old, isDefault));
          } else {
            this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old, isDefault);
          }
        }
        break;
      case 'readonly' :
        this.updateState({
          props: {
            disabled: $new
          }
        } as WmRatingState);
        break;
    }
  }

  changeValue(i: number) {
    const props = this.state.props;
    const oldValue = props.datavalue;
    if (!props.readonly) {
      let value = this.state.items[i] ? this.state.items[i][props.datafield || '']: i;
      this.updateState({
        props: {
          datavalue:  value
        }
      } as WmRatingState, () => {
        !this.props.onFieldChange && value !== oldValue && this.invokeEventCallback('onChange', [undefined, this.proxy, value, oldValue]);
      });
    }
  }

  renderWidget(props: WmRatingProps) {
    const maxValue = props.maxvalue ? +props.maxvalue : 5;
    const arr = Array.from(Array(maxValue).keys());

    let selectedIconStyles = this.styles.selectedIcon;
    if (props.iconcolor) {
      selectedIconStyles = cloneDeep(this.styles.selectedIcon);
      selectedIconStyles.text.color = props.iconcolor;
    }
    return (
    <View style={this.styles.root} onLayout={(event) => this.handleLayout(event)}>
      {this._background}
      {arr.map((v, i) => (
        (this.state.selectedIndex > -1 && i <= this.state.selectedIndex) ? <WmIcon
          id={this.getTestId('star' + i)}
          key={i}
          iconclass="wi wi-star"
          iconsize={props.iconsize}
          styles={selectedIconStyles}
          onTap={() => { this.changeValue(i)}}
        ></WmIcon> : null
      ))}
      {arr.map((v, i) => (
        (this.state.selectedIndex === -1 || i > this.state.selectedIndex) ? <WmIcon
          id={this.getTestId('star' + i)}
          key={i}
          iconclass="wi wi-star-border"
          iconsize={props.iconsize}
          styles={this.styles.icon}
          onTap={() => { this.changeValue(i)}}
        ></WmIcon> : null
      ))}
      { !!props.showcaptions ? (<Text style={this.styles.text}>{this.state.caption}</Text>) : null }
    </View>);
  }
}
