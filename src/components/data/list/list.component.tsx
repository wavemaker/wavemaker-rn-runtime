import React from 'react';
import { SectionList, Text, View, TouchableWithoutFeedback } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { isArray } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import {getGroupedData, isDefined} from "@wavemaker/app-rn-runtime/core/utils";
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmListProps from './list.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmListStyles } from './list.styles';


export class WmListState extends BaseComponentState<WmListProps> {
  public selectedindex: any;
  groupedData: Array<any> = [];
}

export default class WmList extends BaseComponent<WmListProps, WmListState, WmListStyles> {

  private itemWidgets = [] as any[];
  private selectedItemWidgets = {} as any;
  private key = 1;

  constructor(props: WmListProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmListProps());
  }

  private onSelect($item: any, $index: number | string) {
    if (!this.state.props.disableitem($item, $index)) {
      this.selectedItemWidgets = this.itemWidgets[$index as number];
      this.updateState({
        props: { selecteditem: $item },
        selectedindex: $index
      } as WmListState, () => {
        this.invokeEventCallback('onSelect', [this.proxy, $item]);
      });
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
    this.updateState({
      props: { selecteditem: null },
      selectedindex: -1
    } as WmListState);
  }

  setGroupData(items: any) {
    const dataItems = items;
    const props = this.state.props;
    if (props.groupby) {
      const groupedData = dataItems && getGroupedData(dataItems, props.groupby, props.match, props.orderby, props.dateformat, this);
      this.updateState({
        groupedData: groupedData
      } as WmListState, () => {
        this.key +=  (items && items.length) || 0;
      });
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
          this.setGroupData($new);
        } else {
          const data = isArray($new) ? $new : (isDefined($new) ? [$new] : []);
          this.updateState({
            groupedData: (data[0] || props.direction === 'horizontal' ? [{
              key: '',
              data: data
            }] : [])
          } as WmListState, () => {
            this.key += ($new && $new.length) || 0;
          });
        }
        this.itemWidgets = [];
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

  getDefaultStyles() {
    const isHorizontal = this.state.props.direction === 'horizontal';
    return this.theme.getStyle(`${this.defaultClass} ${isHorizontal ? 'app-horizontal-list' : 'app-vertical-list'}`);
  }

  getIndex(item: any) {
    return this.state.props.dataset.indexOf(item);
  }

  private generateItemKey(item: any, index: number, props: WmListProps) {
    if (props.itemkey && item) {
      return props.itemkey(item, index);
    }
    return 'list_item_' +  (this.key + index);
  }

  private renderItem(item: any, index: number, props: WmListProps) {
    return (
        <TouchableWithoutFeedback onPress={() => this.onSelect(item, index)}>
          <View style={[
              this.styles.item,
              props.itemclass ? this.theme.getStyle(props.itemclass(item, index)) : null,
              this.state.selectedindex === index && this.state.props.selecteditem?._groupIndex === item._groupIndex ? this.styles.selectedItem : {}]}>
            {props.renderItem(item, index, this)}
            { this.state.selectedindex === index && this.state.props.selecteditem?._groupIndex === item._groupIndex ? (
              <WmIcon iconclass='wi wi-check-circle' styles={this.styles.selectedIcon} />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      );
  }

  private renderHeader(props: WmListProps, title: string) {
    return props.groupby ? (
      <Text style={this.styles.groupHeading}>{title}</Text>
    ) : (props.iconclass || props.title || props.subheading) ? (
      <View style={this.styles.heading}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <WmIcon styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
          <View>
            <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
            <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
          </View>
        </View>
      </View>) : null;
  }

  private renderEmptyMessage(props: WmListProps) {
    return (<WmLabel styles={this.styles.emptyMessage} caption={props.nodatamessage}></WmLabel>);
  }

  private renderLoadingIcon(props: WmListProps) {
    return (<WmIcon
      styles={this.styles.loadingIcon}
      iconclass={props.loadingicon}
      caption={props.loadingdatamsg}></WmIcon>)
  }

  private renderWithFlatList(props: WmListProps, isHorizontal = false) {
    return (
    <View style={this.styles.root}>
      {this.state.groupedData ? this.state.groupedData.map((v: any) => ((
          <View style={{marginBottom: 16}}>
            {this.renderHeader(props, v.key)}
            <FlatList
              keyExtractor={(item, i) => this.generateItemKey(item, i, props)}
              horizontal = {isHorizontal}
              data={v.data || []}
              ListEmptyComponent = {() => this.renderEmptyMessage(props)}
              renderItem={(itemInfo) => this.renderItem(itemInfo.item, itemInfo.index, props)}>
            </FlatList>
          </View>
        ))) : null
      }
    </View>);
  }

  private renderWithSectionList(props: WmListProps, isHorizontal = false) {
    return (
      <SectionList
        keyExtractor={(item, i) => this.generateItemKey(item, i, props)}
        horizontal = {isHorizontal}
        onEndReached={({distanceFromEnd}) => {
          this.invokeEventCallback('onEndReached', [null, this]);
        }}
        contentContainerStyle={this.styles.root}
        onEndReachedThreshold={0.3}
        sections={this.state.groupedData || []}
        renderSectionHeader={({section: {key, data}}) => {
          return this.renderHeader(props, key);
        }}
        renderSectionFooter={() => props.loadingdata ? this.renderLoadingIcon(props) : null}
        ListEmptyComponent = {() => this.renderEmptyMessage(props)}
        renderItem={(itemInfo) => this.renderItem(itemInfo.item, itemInfo.index, props)}>
      </SectionList>
    );
  }

  renderWidget(props: WmListProps) {
    this.invokeEventCallback('onBeforedatarender', [this, this.state.props.dataset]);
    const isHorizontal = (props.direction === 'horizontal');
    return (
      <View>
        {(isHorizontal) ?
          this.renderWithFlatList(props, isHorizontal)
        : this.renderWithSectionList(props, isHorizontal)}
      </View>);
  }
}
