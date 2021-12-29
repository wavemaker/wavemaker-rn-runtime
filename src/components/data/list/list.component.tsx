import React from 'react';
import { Text, TouchableWithoutFeedback, View} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { isArray } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { getGroupedData} from "@wavemaker/app-rn-runtime/core/utils";
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmListProps from './list.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmListStyles } from './list.styles';


export class WmListState extends BaseComponentState<WmListProps> {
  public selectedindex: any;
  groupedData: any;
}

export default class WmList extends BaseComponent<WmListProps, WmListState, WmListStyles> {

  public selecteditem: any;

  constructor(props: WmListProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmListProps());
  }

  private onSelect($item: any, $index: number | string) {
    if (!this.state.props.disableitem($item, $index)) {
      this.selecteditem = $item;
      this.updateState({
        selectedindex: $index
      } as WmListState);
      this.invokeEventCallback('onSelect', [this.proxy, $item]);
    }
  }

  private selectFirstItem() {
    const props = this.state.props;
    if (this.initialized
      && props.dataset
      && props.dataset.length) {
        const index = props.groupby ? '00': 0;
        this.onSelect(props.dataset[0], index);
      }
  }

  private deselect() {
    this.selecteditem = null;
    this.updateState({
      selectedindex: -1
    } as WmListState);
  }

  setGroupData(items: any) {
    const dataItems = items;
    const props = this.state.props;
    if (props.groupby) {
      const groupedData = dataItems && getGroupedData(dataItems, props.groupby, props.match, props.orderby, props.dateformat);
      this.updateState({ groupedData: groupedData } as WmListState);
    }
  }

  public onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    switch(name) {
      case 'selectfirstitem':
        if ($new) {
          this.selectFirstItem();
        }
      break;
      case 'dataset':
        if (this.state.props.groupby) {
          this.setGroupData(props.dataset);
        }
        if (props.selectfirstitem) {
          this.selectFirstItem();
        } else {
          this.deselect();
        }
      break;
      case 'groupby':
      case 'match':
        this.setGroupData(this.state.props.dataset);
        break;
    }
  }

  componentDidMount() {
    const props = this.state.props;
    if (this.state.props.selectfirstitem && props.dataset?.length) {
      setTimeout(() => {
        this.onSelect(props.dataset[0], 0);
      });
    }
    super.componentDidMount();
  }

  componentDidUpdate(prevProps: WmListProps, prevState: WmListState, snapshot?: any) {
    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot);
    this.invokeEventCallback('onRender', [this, this.state.props.dataset]);
  }

  // TODO try to optimize this, unable to track the oldProps and newProps to check if dataset has modified.
  shouldComponentUpdate(nextProps: WmListProps, nextState: WmListState, nextContext: any): boolean {
    super.shouldComponentUpdate(nextProps, nextState, nextContext);
    return true;
  }

  renderWidget(props: WmListProps) {
    this.invokeEventCallback('onBeforedatarender', [this, this.state.props.dataset]);
    const dataset = isArray(props.dataset) ? props.dataset : (props.dataset ? [props.dataset]: []);
    const list = (
        <View style={this.styles.root}>
          <FlatList
            keyExtractor={(item, i) => 'list_item_' +  i}
            horizontal = {props.direction === 'row'}
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
            data={props.groupby ? this.state.groupedData : dataset}
            ListEmptyComponent = {() => <WmLabel styles={this.styles.emptyMessage} caption={props.nodatamessage}></WmLabel>}
            renderItem={(itemInfo) =>
              this.props.groupby ? (
                  <View>
                    <Text style={this.styles.groupHeading}>{itemInfo.item.key}</Text>
                    <View style={{
                      flexDirection: props.direction === 'row' ? 'row' : 'column'
                    }}>
                    {
                      itemInfo.item.data && itemInfo.item.data.length
                        ? itemInfo.item.data.map((itemObj: any, index: any) =>
                          (<TouchableWithoutFeedback key={`${itemObj._groupIndex}${index}`} onPress={(e) => this.onSelect(itemObj, `${itemObj._groupIndex}${index}`)}>
                            <View style={[
                              props.itemclass ? this.theme.getStyle(props.itemclass(itemObj, index)) : null,
                              this.state.selectedindex === `${itemObj._groupIndex}${index}` ? this.styles.selectedItem : {}]}>
                              {props.renderItem(itemObj, index, this)}
                            </View>
                          </TouchableWithoutFeedback>)
                        ) : null
                    }
                    </View>
                  </View>) :
                (<TouchableWithoutFeedback onPress={(e) => this.onSelect(itemInfo.item, itemInfo.index)}>
                <View style={[
                    props.itemclass ? this.theme.getStyle(props.itemclass(itemInfo.item, itemInfo.index)) : null,
                    this.state.selectedindex === itemInfo.index ? this.styles.selectedItem : {}]}>
                  {props.renderItem(itemInfo.item, itemInfo.index, this)}
                </View>
            </TouchableWithoutFeedback>)
            }></FlatList>
        </View>
    );
    return list;
  }
}
