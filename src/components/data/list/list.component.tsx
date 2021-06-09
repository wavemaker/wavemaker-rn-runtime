import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmListProps from './list.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmListStyles } from './list.styles';


export class WmListState extends BaseComponentState<WmListProps> {

}

export default class WmList extends BaseComponent<WmListProps, WmListState, WmListStyles> {

  public selecteditem: any;

  constructor(props: WmListProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmListProps());
  }

  private onSelect($event: any, $item: any) {
    this.selecteditem = $item;
    this.invokeEventCallback('onSelect', [$event, this.proxy, $item]);
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <FlatList
        style={this.styles.root}
        keyExtractor={(item, i) => 'list_item_' +  i}
        ListHeaderComponent={() => {
          return (props.iconclass || props.title || props.subheading) ? (
            <View style={this.styles.heading}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <WmIcon themeToUse={props.themeToUse} styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
                <View>
                  <WmLabel themeToUse={props.themeToUse} styles={this.styles.title} caption={props.title}></WmLabel>
                  <WmLabel themeToUse={props.themeToUse} styles={this.styles.subheading} caption={props.subheading}></WmLabel>
                </View>
              </View>
            </View>) : null
        }}
        data={props.dataset} renderItem={(itemInfo) => (
        <TouchableOpacity onPress={(e) => this.onSelect(e, itemInfo.item)}>
          <View>
            {props.renderItem(itemInfo.item, itemInfo.index)}
          </View>
        </TouchableOpacity>
      )}></FlatList>
    ): null; 
  }
}
