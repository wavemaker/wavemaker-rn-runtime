import React, { Children } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BaseComponent, BaseProps } from '@wavemaker/rn-runtime/core/base.component';

interface WmListProps extends BaseProps {
  repeat: string;
  children: any[];
  dataset: any[];
  onSelect: Function;
  renderItem:  Function;
}

export default class WmList extends BaseComponent<WmListProps> {

  selecteditem: any;

  constructor(props: WmListProps) {
    super(props);
  }

  private onSelect($event: any, $item: any) {
    this.selecteditem = $item;
    this.invokeEventCallback('onSelect', [$event, this.proxy, $item]);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <FlatList keyExtractor={(item, i) => 'list_item_' +  i} data={props.dataset} renderItem={(itemInfo) => (
        <TouchableOpacity onPress={(e) => this.onSelect(e, itemInfo.item)}>
          <View>
            {props.renderItem(itemInfo.item, itemInfo.index)}
          </View>
        </TouchableOpacity>
      )}></FlatList>
    );
  }
}

const styles = StyleSheet.create({
});
