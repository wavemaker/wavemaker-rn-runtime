import React from 'react';
import { ActivityIndicator, SectionList, Text, View, FlatList, LayoutChangeEvent } from 'react-native';
import { isArray, isEmpty, isNil, isNumber, round } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import {getGroupedData, isDefined} from "@wavemaker/app-rn-runtime/core/utils";
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { DefaultKeyExtractor } from '@wavemaker/app-rn-runtime/core/key.extractor';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

import WmListProps from './list.props';
import { DEFAULT_CLASS, WmListStyles } from './list.styles';


export class WmListState extends BaseComponentState<WmListProps> {
  public selectedindex: any;
  groupedData: Array<any> = [];
  currentPage = 1;
  maxRecordsToShow = 20;
}

export default class WmList extends BaseComponent<WmListProps, WmListState, WmListStyles> {

  private itemWidgets = [] as any[];
  private selectedItemWidgets = {} as any;
  private keyExtractor = new DefaultKeyExtractor();
  private endThreshold = -1;
  private loadingData = false;
  private hasMoreData = true;
  
  constructor(props: WmListProps) {
    super(props, DEFAULT_CLASS, new WmListProps(), new WmListState());
    this.updateState({
      maxRecordsToShow: this.state.props.pagesize
    } as WmListState);
  }

  private isSelected($item: any) {
    const selectedItem = this.state.props.selecteditem;
    if (isArray(selectedItem)) {
      return selectedItem.indexOf($item) >= 0;
    }
    return selectedItem === $item;
  }

  private onSelect($item: any, $index: number | string, triggerTapEvent = false) {
    const props = this.state.props;
    let selectedItem = null as any;
    if (props.disableitem !== true 
        && (typeof props.disableitem !== 'function' || !props.disableitem($item, $index))) {
      if (props.multiselect) {
        selectedItem = [...(props.selecteditem || [])];
        const index = selectedItem.indexOf($item);
        if (index < 0) {
          if ((!props.selectionlimit)
            || props.selectionlimit < 0
            || selectedItem.length < props.selectionlimit) {
            selectedItem.push($item);
          } else {
            this.invokeEventCallback('onSelectionlimitexceed', [null, this]);
          }
        } else {
          selectedItem.splice(index, 1);
        }
      } else {
        if (props.selecteditem === $item) {
          selectedItem = null;
        } else {
          selectedItem = $item;
        }
      }
      this.selectedItemWidgets = this.itemWidgets[$index as number];
      this.updateState({
        props: { selecteditem: selectedItem },
        selectedindex: $index
      } as WmListState, () => {
        this.invokeEventCallback('onSelect', [this.proxy, $item]);
        triggerTapEvent && this.invokeEventCallback('onTap', [null, this.proxy]);
      });
    }
  }

  private get loadDataOnDemand() {
    const navigation = this.state.props.navigation;
    return navigation === 'Scroll' || navigation === 'On-Demand';
  }

  private loadData() {
    if (this.loadingData) {
      return;
    }
    if (isArray(this.state.props.dataset) 
      && this.state.props.dataset.length > this.state.maxRecordsToShow) {
      this.updateState({
        maxRecordsToShow: this.state.maxRecordsToShow + this.state.props.pagesize
      } as WmListState);
    } else if (this.loadDataOnDemand) {
      const $list = this.proxy as any;
      $list.loadingdata = true;
      this.loadingData = true;
      this.props.getNextPageData && this.props.getNextPageData(null, this.proxy, this.state.currentPage + 1).then((data) => {
        if (isArray(data) && data.length > 0
          && isArray(this.state.props.dataset)) {
            $list.dataset = [...this.state.props.dataset, ...data];
            this.updateState({
              currentPage : this.state.currentPage + 1,
              maxRecordsToShow: this.state.maxRecordsToShow + this.state.props.pagesize
            } as WmListState);
            this.hasMoreData = true;
        } else {
          this.hasMoreData = false;
        }
      }).catch((err) => {
        console.error(err);
      }).then(() => {
        setTimeout(() => {
          $list.loadingdata = false;
        }, 1000);
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
  
  clear(){
    this.updateState({
      groupedData: {},
    } as WmListState);
  }

  selectItem(item: any){
    const dataset = this.state.props.dataset;
    if(isNumber(item)){
      this.onSelect(dataset[item], item);
    }
    else{
      let index = dataset.indexOf(item);
      this.onSelect(dataset[index], index);
    }
  }

  getItem(index: number){
    const props = this.state.props;
    return this.props.dataset[index]
  }

  deselect(item: any){
    const props = this.state.props;
    let selectedItem = null as any;
    let index = isNumber(item)?item:props.dataset.indexOf(item);
    if(props.multiselect && index >= 0){
      selectedItem = [...(props.selecteditem || [])];
      let selectedItemIndex = selectedItem.indexOf(props.dataset[index])
      if(selectedItemIndex >= 0){
        selectedItem.splice(selectedItemIndex, 1);
      }
    }
    else{
      if (props.selecteditem === props.dataset[index]) {
        selectedItem = null;
      }
    }
    this.updateState({
      props: { selecteditem: selectedItem },
      
    } as WmListState);
  }
  
  getWidgets(widgetname: string, index: number){
    if(index >= 0 && index < this.itemWidgets.length){
      return this.itemWidgets[index][widgetname]
    }
    else{
      return this.itemWidgets.map(item => item[widgetname]).filter(widget => widget !== undefined);
    }
  }

  private deselectAll() {
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
        this.keyExtractor?.clear();
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
          if (!($old && $old.length)
            && $new && $new.length
            && this.loadDataOnDemand) {
              this.updateState({
                props: {
                  dataset: [...$new]
                }
              } as WmListState);
          }
          const data = isArray($new) ? $new : (!isEmpty($new) && isDefined($new) ? [$new] : []);
          this.updateState({
            groupedData: (data[0] || props.direction === 'horizontal' ? [{
              key: 'key',
              data: data
            }] : [])
          } as WmListState, () => {
            this.keyExtractor?.clear();
          });
        }
        this.itemWidgets = [];
        if (props.selectfirstitem) {
          this.selectFirstItem();
        } else {
          this.deselectAll();
        }
      break;
      case 'groupby':
      case 'match':
        this.setGroupData(this.state.props.dataset);
        break;
      case 'multiselect':
        if ($new) {
          if (!isArray(this.state.props.selecteditem)) {
            this.state.props.selecteditem = this.state.props.selecteditem ? 
              [this.state.props.selecteditem] : [];
          }
        } else if (isArray(this.state.props.selecteditem)) {
          this.state.props.selecteditem = this.state.props.selecteditem.pop();
        }
        break;
      case 'loadingdata': 
        this.loadingData = $new && this.loadingData;
        break;
      case 'selecteditem':
        if($new != $old && isNumber($new)) {
          this.selectItem(this.state.props.dataset[$new])
        }
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
    this.subscribe('scroll', (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.y  + event.nativeEvent.layoutMeasurement.height;
      if (scrollPosition > this.endThreshold && this.state.props.direction === 'vertical') {
        this.loadData();
      }
    });
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
    if (props.itemkey && item && !this._showSkeleton) {
      return props.itemkey(item, index);
    }
    return 'list_item_' +  this.keyExtractor.getKey(item, true);
  }

  private renderItem(item: any, index: number, props: WmListProps) {
    const cols = this. getNoOfColumns();
    const isHorizontal = (props.direction === 'horizontal');
    return (index < this.state.maxRecordsToShow || isHorizontal) ? (  
      <View style={[
        this.styles.item,
        props.itemclass ? this.theme.getStyle(props.itemclass(item, index)) : null,
        this.isSelected(item) ? this.styles.selectedItem : {}]}>
        <Tappable
          {...this.getTestPropsForAction(`item${index}`)}
          onTap={() => this.onSelect(item, index, true)}
          onLongTap={() => this.invokeEventCallback('onLongtap', [null, this.proxy])}
          onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}
          styles={
            [
              cols ? {
                width: '100%'
              } : null,
              cols || isHorizontal ? {
                paddingRight: (isNil(this.styles.item.marginRight)
                  ? this.styles.item.margin : this.styles.item.marginRight) || 4
              } : null
            ]
          }>
          {props.renderItem(item, index, this)}
          {this.isSelected(item) ? (
            <WmIcon id={this.getTestId('icon' + index)} iconclass='wi wi-check-circle' styles={this.styles.selectedIcon} />
          ) : null}
        </Tappable>
      </View>
      ) : null;
  }

  private renderHeader(props: WmListProps, title: string) {
    return props.groupby ? (
      <Text style={this.styles.groupHeading} accessibilityRole='header'>{title}</Text>
    ) : (props.iconclass || props.title || props.subheading) ? (
      <View style={this.styles.heading}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <WmIcon id={this.getTestId('icon')} styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
          <View>
            <WmLabel id={this.getTestId('title')} styles={this.styles.title} caption={props.title} accessibilityrole='header'></WmLabel>
            <WmLabel id={this.getTestId('subheading')} styles={this.styles.subheading} caption={props.subheading}></WmLabel>
          </View>
        </View>
      </View>) : null;
  }

  private renderEmptyMessage(isHorizontal: boolean, item: any, index: any, props: WmListProps) {
    return (<WmLabel  id={this.getTestId('emptymsg')} styles={this.styles.emptyMessage} caption={props.nodatamessage}></WmLabel>);
  }

  private renderLoadingIcon(props: WmListProps) {
    return props.loadingicon ? (<WmIcon
      id={this.getTestId('loadingicon')}
      styles={this.styles.loadingIcon}
      iconclass={props.loadingicon}
      caption={props.loadingdatamsg}></WmIcon>)
      : (
        <ActivityIndicator color={this.styles.loadingIcon.text.color}></ActivityIndicator>
      );
  }

  public getNoOfColumns() {
    const props = this.state.props;
    if(props.direction === 'vertical') {
      return props.itemsperrow.xs;
    }
    return 0;
  }

  private onLayoutChange(e: LayoutChangeEvent) {
    const l = e.nativeEvent.layout;
    this.endThreshold = l.height + l.y - 100;
    if (!this.endThreshold) {
      this.endThreshold = -1;
    }
  }

  private renderWithFlatList(props: WmListProps, isHorizontal = false) {
    return (
    <View style={this.styles.root} onLayout={e => this.onLayoutChange(e)}>
      {!isEmpty(this.state.groupedData) ? this.state.groupedData.map((v: any, i) => ((
          <View style={this.styles.group} key={v.key || this.keyExtractor.getKey(v, true)}>
            {this.renderHeader(props, v.key)}
            <FlatList
              key={props.name + '_' + (isHorizontal ? 'H' : 'V') + props.itemsperrow.xs}
              keyExtractor={(item, i) => this.generateItemKey(item, i, props)}
              scrollEnabled={isHorizontal}
              horizontal = {isHorizontal}
              data={isEmpty(v.data[0]) ? []: v.data}
              ListEmptyComponent = {(itemInfo) => this.renderEmptyMessage(isHorizontal, itemInfo.item, itemInfo.index, props)}
              renderItem={(itemInfo) => this.renderItem(itemInfo.item, itemInfo.index, props)} 
              {...(isHorizontal ? {} : {numColumns : this.getNoOfColumns()})}> 
            </FlatList>
            {this.loadDataOnDemand || (v.data.length > this.state.maxRecordsToShow) ? 
              (this.loadingData ? 
                this.renderLoadingIcon(props) :
                (<WmLabel id={this.getTestId('ondemandmessage')}
                  styles={this.styles.onDemandMessage}
                  caption={this.hasMoreData && !isHorizontal ? props.ondemandmessage : props.nodatamessage}
                  onTap={() => this.loadData()}></WmLabel>))
              : null}
          </View>
        ))) : this.renderEmptyMessage(isHorizontal, null, null,props)
      }
    </View>);
  }

  private getSectionListData() {
    if (this._showSkeleton) {
      return [{
        key: '',
        data: [{}, {}, {}]
      }];
    } else if (this.state.groupedData 
        && this.state.groupedData[0] 
        && this.state.groupedData[0]['data'].length) {
      return this.state.groupedData;
    }
    return [];
  }

  private renderWithSectionList(props: WmListProps, isHorizontal = false) {  
    return (
      <SectionList
        keyExtractor={(item, i) => this.generateItemKey(item, i, props)}
        horizontal = {isHorizontal}
        contentContainerStyle={this.styles.root}
        sections={this.getSectionListData()}
        renderSectionHeader={({ section: {key, data}}) => {
          return this.renderHeader(props, key);
        }}
        renderSectionFooter={() => props.loadingdata ? this.renderLoadingIcon(props) : null}
        ListEmptyComponent = {(itemInfo) => this.renderEmptyMessage(isHorizontal, itemInfo.item, itemInfo.index, props)}
        renderItem={(itemInfo) => this.renderItem(itemInfo.item, itemInfo.index, props)}>
      </SectionList>
    );
  }

  renderWidget(props: WmListProps) {
    this.invokeEventCallback('onBeforedatarender', [this, this.state.props.dataset]);
    const isHorizontal = (props.direction === 'horizontal');
    return (
        <View style={isHorizontal ? null : { width: '100%' }}>
          {this._background}
          {(isHorizontal || !props.groupby) ?
            this.renderWithFlatList(props, isHorizontal)
          : this.renderWithSectionList(props, isHorizontal)}
      </View>);
  }
}
