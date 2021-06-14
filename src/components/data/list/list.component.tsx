import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmListProps from './list.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmListStyles } from './list.styles';


export class WmListState extends BaseComponentState<WmListProps> {
  public selectedindex: any;
}

export default class WmList extends BaseComponent<WmListProps, WmListState, WmListStyles> {

  public selecteditem: any;

  constructor(props: WmListProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmListProps());
  }

  private onSelect($item: any, $index: number) {
    if (!this.state.props.disableitem) {
      this.selecteditem = $item;
      this.updateState({
        selectedindex: $index
      } as WmListState);
      this.invokeEventCallback('onSelect', [this.proxy, $item]);
    }
  }

  public onPropertyChange(name: string, $new: any, $old: any) {
    const props = this.state.props;
    switch(name) {
      case 'selectfirstitem':
        $new && props.dataset 
          && props.dataset.length
          && this.onSelect(props.dataset[0], 0);
      break;
      case 'dataset':
        props.selectfirstitem && this.onSelect(props.dataset[0], 0);
      break;
    }
  }

  renderWidget(props: WmListProps) {
    this.invokeEventCallback('onBeforedatarender', [this, this.state.props.dataset]);
    const list = (
        <FlatList
          style={this.styles.root}
          keyExtractor={(item, i) => 'list_item_' +  i}
          onEndReached={({distanceFromEnd}) => {
            this.invokeEventCallback('onEndReached', [null, this]);
          }}
          onEndReachedThreshold={0.3}
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
          ListFooterComponent={() => props.loadingdata ? 
              (<WmIcon styles={this.styles.loadingIcon}
                iconclass={props.loadingicon}
                caption={props.loadingdatamsg}></WmIcon>) : null}
          data={props.dataset}
          ListEmptyComponent = {() => <WmLabel styles={this.styles.emptyMessage} caption={props.nodatamessage}></WmLabel>}
          renderItem={(itemInfo) => (
          <Tappable onTap={(e) => this.onSelect(itemInfo.item, itemInfo.index)}>
            <View style={this.state.selectedindex === itemInfo.index ? this.styles.selectedItem : {}}>
              {props.renderItem(itemInfo.item, itemInfo.index)}
            </View>
          </Tappable>
        )}></FlatList>
    );
    setTimeout(() => this.invokeEventCallback('onRender', [this, this.state.props.dataset]));
    return list;
  }
}
