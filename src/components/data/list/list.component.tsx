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

  renderWidget(props: WmListProps) {
    return (
      <View style={this.styles.root}>
        <FlatList
          keyExtractor={(item, i) => 'list_item_' +  i}
          ListHeaderComponent={() => {
            return (props.iconclass || props.title || props.subheading) ? (
              <View style={this.styles.heading}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <WmIcon styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
                  <View>
                    <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
                    <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
                  </View>
                </View>
              </View>) : null
          }}
          data={props.dataset}
          ListEmptyComponent = {() => <WmLabel styles={this.styles.emptyMessage} caption={props.nodatamessage}></WmLabel>}
          renderItem={(itemInfo) => (
          <TouchableOpacity onPress={(e) => this.onSelect(e, itemInfo.item)}>
            <View>
              {props.renderItem(itemInfo.item, itemInfo.index)}
            </View>
          </TouchableOpacity>
        )}></FlatList>
        {props.loadingdata ? 
          (<WmIcon styles={this.styles.loadingIcon}
            iconclass={props.loadingicon}
            caption={props.loadingdatamsg}></WmIcon>) : null}
      </View>
    ); 
  }
}
