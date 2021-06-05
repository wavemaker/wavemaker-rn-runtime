import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

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
      <FlatList style={this.styles.root} keyExtractor={(item, i) => 'list_item_' +  i} data={props.dataset} renderItem={(itemInfo) => (
        <TouchableOpacity onPress={(e) => this.onSelect(e, itemInfo.item)}>
          <View>
            {props.renderItem(itemInfo.item, itemInfo.index)}
          </View>
        </TouchableOpacity>
      )}></FlatList>
    ): null; 
  }
}
