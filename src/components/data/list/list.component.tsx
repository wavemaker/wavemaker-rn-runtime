import React from 'react';
import { ActivityIndicator, SectionList, Text, View, FlatList, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import { isArray, isEmpty, isNil, isNumber, round } from 'lodash-es';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { getGroupedData, getNumberOfEmptyObjects, isDefined } from "@wavemaker/app-rn-runtime/core/utils";
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { DefaultKeyExtractor } from '@wavemaker/app-rn-runtime/core/key.extractor';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Swipeable } from 'react-native-gesture-handler';
import WmListActionTemplate from './list-action-template/list-action-template.component';

import WmListProps from './list.props';
import { DEFAULT_CLASS, WmListStyles } from './list.styles';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';


export class WmListState extends BaseComponentState<WmListProps> {
  public selectedindex: any;
  groupedData: Array<any> = [];
  currentPage = 1;
  maxRecordsToShow = 20;
  loadingData = true;
}

export default class WmList extends BaseComponent<WmListProps, WmListState, WmListStyles> {

  private itemWidgets = [] as any[];
  private selectedItemWidgets = {} as any;
  private keyExtractor = new DefaultKeyExtractor();
  //private endThreshold = -1;
  // private loadingData = false;
  private hasMoreData = true;
  public leftActionTemplate?: WmListActionTemplate;
  public rightActionTemplate?: WmListActionTemplate;
  private flatListRefs: any = {};
  private selectedItems = [] as any[];
  private lastScrollTriggered:boolean = false



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

  private async onSelect($item: any, $index: number | string, $event?: any) {
    if(this.state.props.disableitemselect) {
      return; 
    }

    const props = this.state.props;
    let selectedItem = null as any;
    let eventName = 'onSelect';
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
          eventName = 'onDeselect';
        }
      } else {
        this.state.props.selecteditem && this.invokeEventCallback('onDeselect', [this.proxy, this.state.props.selecteditem]);
        selectedItem = $item;
      }
      this.selectedItems = selectedItem;
      this.selectedItemWidgets = this.itemWidgets[$index as number];
      let groupKey: string | null = null;

      if (props.direction === 'horizontal') {
        this.state.groupedData?.forEach((group) => {
          if (group.data.includes($item)) {
            groupKey = group.key;
          }
        });
      }

      return new Promise(resolve => {
        this.updateState({
          props: { selecteditem: selectedItem },
          selectedindex: $index
        } as WmListState, () => {
          if (props.direction === 'horizontal') {
            this.scrollToItem(groupKey, $index as number);
          }
          this.invokeEventCallback(eventName, [this.proxy, $item]);
          $event && this.invokeEventCallback('onTap', [$event, this.proxy]);
          resolve(null);
        });
      });

    } else {
      return Promise.resolve(null);
    }
  }

  private get loadDataOnDemand() {
    const navigation = this.state.props.navigation;
    return navigation === 'Scroll' || navigation === 'On-Demand';
  }

  renderLeftActions = () => {
    return this.leftActionTemplate ? (
      <>
        {this.leftActionTemplate.getTemplate()}
      </>
    ) : null;
  };

  renderRightActions = () => {
    return this.rightActionTemplate ? (
      <>
        {this.rightActionTemplate.getTemplate()}
      </>
    ) : null;
  };

  private loadData() {
    if (this.state.loadingData || !this.hasMoreData) {
     
      return;
    }
    if (isArray(this.state.props.dataset)
      && this.state.props.dataset.length > this.state.maxRecordsToShow) {
      this.updateState({
        loadingData: true,
        maxRecordsToShow: this.state.maxRecordsToShow + this.state.props.pagesize
      } as WmListState);
      setTimeout(() => {
        // Force a re-render by making a small state update
        this.updateState({
          loadingData: false,
        } as WmListState);
      }, 100);
    } else if (this.loadDataOnDemand) {
      const $list = this.proxy as any;
      $list.loadingdata = true;
      // Set loading state via updateState
      this.updateState({
        loadingData: true
      } as WmListState);
      this.props.getNextPageData && this.props.getNextPageData(null, this.proxy, this.state.currentPage + 1).then((data) => {
        if (isArray(data) && data.length > 0
          && isArray(this.state.props.dataset)) {
          $list.dataset = [...this.state.props.dataset, ...data];
          this.updateState({
            currentPage: this.state.currentPage + 1,
            maxRecordsToShow: this.state.maxRecordsToShow + this.state.props.pagesize,
          } as WmListState);
          this.lastScrollTriggered = false;
          this.hasMoreData = true;
          if((data as any)?.last === true) {
            this.hasMoreData = false;
          }
         
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
      const index = props.groupby ? '00' : 0;
      this.onSelect(props.dataset[0], index);
    }
  }

  clear = () => {
    this.updateState({
      groupedData: {},
    } as WmListState);
  }

  selectItem = (item: number | object) => {
    const dataset = this.state.props.dataset;
    if (isNumber(item)) {
      this.onSelect(dataset[item], item);
    }
    else {
      let index = dataset.indexOf(item);
      this.onSelect(dataset[index], index);
    }
  }

  getSelectedItems = () => {
    if (!this.props.multiselect) {
      return [this.selectedItems]
    }
    return this.selectedItems;
  }

  getItem = (index: number) => {
    const props = this.state.props;
    return this.props.dataset[index]
  }

  deselectItem = (item: number | object) => {
    const props = this.state.props;
    let selectedItem = props.selecteditem || null;
    let index = isNumber(item) ? item : props.dataset.indexOf(item);
    if (props.multiselect && index >= 0) {
      selectedItem = [...(props.selecteditem || [])];
      let selectedItemIndex = selectedItem.indexOf(props.dataset[index])
      if (selectedItemIndex >= 0) {
        selectedItem.splice(selectedItemIndex, 1);
      }
    }
    else {
      if (props.selecteditem === props.dataset[index]) {
        selectedItem = null;
      }
    }
    this.updateState({
      props: { selecteditem: selectedItem },

    } as WmListState, () => {
      this.invokeEventCallback('onDeselect', [this.proxy, item]);
    });
  }

  getWidgets = (widgetname: string, index: number) => {
    if(index >= 0 && index < this.itemWidgets.length){
      return this.itemWidgets[index][widgetname]
    }
    else {
      return this.itemWidgets.map(item => item[widgetname]).filter(widget => widget !== undefined);
    }
  }

  selectAll = () => {
    const props = this.state.props;
    const dataset = props.dataset;
    if (!props.multiselect || !isArray(dataset) || dataset.length === 0) {
      return;
    }
    const selectedItems = [...dataset];

    this.updateState({
      props: { selecteditem: selectedItems },
      selectedindex: -1
    } as WmListState);
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
    switch (name) {
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
          if (props.orderby) {
            const orderbyData = data && getGroupedData(data, props.groupby, props.match, props.orderby, props.dateformat, this);
            this.updateState({
              groupedData: (orderbyData[0] ? [{
                key: 'key',
                data: orderbyData[0].data
              }] : [])
            } as WmListState, () => {
              this.keyExtractor?.clear();
            });
          } else {
            this.updateState({
              groupedData: (data[0] || props.direction === 'horizontal' ? [{
                key: 'key',
                data: data
              }] : [])
            } as WmListState, () => {
              this.keyExtractor?.clear();
            });
          }
        }
        this.itemWidgets = [];
        if (props.selectfirstitem) {
          this.selectFirstItem();
        } else {
          this.deselectAll();
        }
        if (isArray($new)){
          setTimeout(() => {
            this.updateState({
              loadingData: false
            } as WmListState)
          }, 0)
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
        if($new != $old){
        this.updateState({
          loadingData: $new
        } as WmListState);}
        break;
      case 'selecteditem':
        if ($new != $old && isNumber($new)) {
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
     const scrollPosition = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const viewportHeight = event.nativeEvent.layoutMeasurement.height;
    
    // Calculate how far user has scrolled as a percentage
    const scrollPercentage = (scrollPosition + viewportHeight) / contentHeight;
    
    // Only trigger loadData when User reaches 70% of the list
    if (scrollPercentage >= 0.7 && 
        this.state.props.direction === 'vertical' && 
        !this.lastScrollTriggered) {
      this.lastScrollTriggered = true
      this.loadData();
    }
    });

    super.componentDidMount();
  }

  componentDidUpdate(prevProps: WmListProps, prevState: WmListState, snapshot?: any) {
    super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot);
    if (prevProps.triggeronrenderwhenhidden === true || this.showView()) {
      this.invokeEventCallback('onRender', [this, this.state.props.dataset]);
    }
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
    return 'list_item_' + this.keyExtractor.getKey(item, true);
  }

  private renderItem(item: any, index: number, props: WmListProps) {
    const cols = this.getNoOfColumns();
    const isHorizontal = (props.direction === 'horizontal');

    const styles = this._showSkeleton ? {
      ...this.styles.item,
      ...this.styles.skeleton.root
    } : this.styles.item as any

    const containerStyle = cols ? { width: round(100 / cols) + "%", flex: null } : {};

    return (index < this.state.maxRecordsToShow || (isHorizontal && this.state.props.horizontalondemandenabled === false)) ?
      !props.shouldswipe ? (
        <View style={containerStyle as any}>
          <View style={[
            styles,
            props.itemclass ? this.theme.getStyle(props.itemclass(item, index)) : null,
            this.isSelected(item) ? this.styles.selectedItem : {}]}>
            {styles.backgroundImage ? (
              <BackgroundComponent
                image={styles.backgroundImage}
                position={styles.backgroundPosition || 'center'}
                size={styles.backgroundSize || 'cover'}
                repeat={styles.backgroundRepeat || 'no-repeat'}
                resizeMode={styles.backgroundResizeMode || 'cover'}
                style={{ borderRadius: this.styles.item.borderRadius }}
              />
            ) : null}
            <Tappable
              {...this.getTestPropsForAction(`item${index}`)}
              disableTouchEffect={this.state.props.disabletoucheffect}
              onTap={($event) => this.onSelect(item, index, $event)}
              onLongTap={() => !this.state.props.disableitemselect && this.invokeEventCallback('onLongtap', [null, this.proxy])}
              onDoubleTap={() => !this.state.props.disableitemselect && this.invokeEventCallback('onDoubletap', [null, this.proxy])}
              styles={
                [{ display: 'flex', flexDirection: 'row' },
                cols ? {
                  width: '100%'
                } : null,
                (cols && cols > 1) || isHorizontal ? {
                  paddingRight: (isNil(this.styles.item.marginRight)
                    ? this.styles.item.margin : this.styles.item.marginRight) || 4
                } : null,
                this.styles.itemContainer
                ]
              }>
              {props.renderItem(item, index, this)}
              {this.isSelected(item) ? (
                <WmIcon id={this.getTestId('icon' + index)} iconclass='wi wi-check-circle' styles={this.styles.selectedIcon} />
              ) : null}
            </Tappable>
          </View>
        </View>
      ) :
        (
          <Swipeable
            renderLeftActions={() => this.renderLeftActions()}
            renderRightActions={() => this.renderRightActions()} containerStyle={containerStyle as any}>
            <View style={[
              styles,
              props.itemclass ? this.theme.getStyle(props.itemclass(item, index)) : null,
              this.isSelected(item) ? this.styles.selectedItem : {}]}>
              {styles.backgroundImage ? (
                <BackgroundComponent
                  image={styles.backgroundImage}
                  position={styles.backgroundPosition || 'center'}
                  size={styles.backgroundSize || 'cover'}
                  repeat={styles.backgroundRepeat || 'no-repeat'}
                  resizeMode={styles.backgroundResizeMode || 'cover'}
                  style={{ borderRadius: this.styles.item.borderRadius }}
                />
              ) : null}
              <Tappable
                {...this.getTestPropsForAction(`item${index}`)}
                disableTouchEffect={this.state.props.disabletoucheffect}
                onTap={($event) => this.onSelect(item, index, $event)}
                onLongTap={() => !this.state.props.disableitemselect && this.invokeEventCallback('onLongtap', [null, this.proxy])}
                onDoubleTap={() => !this.state.props.disableitemselect && this.invokeEventCallback('onDoubletap', [null, this.proxy])}
                styles={
                  [{ display: 'flex', flexDirection: 'row' },
                  cols ? {
                    width: '100%'
                  } : null,
                  (cols && cols > 1) || isHorizontal ? {
                    paddingRight: (isNil(this.styles.item.marginRight)
                      ? this.styles.item.margin : this.styles.item.marginRight) || 4
                  } : null,
                  this.styles.itemContainer
                  ]
                }>
                {props.renderItem(item, index, this)}
                {this.isSelected(item) ? (
                  <WmIcon id={this.getTestId('icon' + index)} iconclass={props.selecteditemicon ? props.selecteditemicon : 'wi wi-check-circle'} styles={this.styles.selectedIcon} />
                ) : null}
              </Tappable>
            </View>
          </Swipeable>
        ) : null
  }

  private renderHeader(props: WmListProps, title: string) {
    return props.groupby ? (
      <Text style={this.styles.groupHeading} accessibilityRole='header'>{title}</Text>
    ) : (props.iconclass || props.title || props.subheading) ? (
      <View style={this.styles.heading}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <WmIcon id={this.getTestId('icon')} styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
          <View>
            <WmLabel id={this.getTestId('title')} styles={this.styles.title} caption={props.title} accessibilityrole='header'></WmLabel>
            <WmLabel id={this.getTestId('subheading')} styles={this.styles.subheading} caption={props.subheading}></WmLabel>
          </View>
        </View>
      </View>) : null;
  }

  private renderEmptyMessage(isHorizontal: boolean, item: any, index: any, props: WmListProps) {
    return (<WmLabel id={this.getTestId('emptymsg')} styles={this.styles.emptyMessage} caption={props.nodatamessage}></WmLabel>);
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
    if (props.direction === 'vertical') {
      return props.itemsperrow.xs;
    }
    return 0;
  }

  

  private scrollToItem = (groupKey: string | null, itemIndex: number) => {
    const refKey = groupKey || 'main';
    if (this.flatListRefs[refKey]) {
      this.flatListRefs[refKey].scrollToIndex({
        index: itemIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  getCaption = (isHorizontal: boolean, vData: any[]): string => {
    const { nodatamessage, ondemandmessage } = this.state.props
    if (!isHorizontal) {
      return this.hasMoreData ? ondemandmessage : nodatamessage
    }
    return this.hasMoreData ? ondemandmessage : nodatamessage
  }

  private renderWithFlatList(props: WmListProps, isHorizontal = false) {

    return (
      <View style={this.styles.root} 
      //onLayout={e => this.onLayoutChange(e)}
      >
        {!isEmpty(this.state.groupedData) ? this.state.groupedData.map((v: any, i) => ((
          <View style={this.styles.group} key={v.key || this.keyExtractor.getKey(v, true)}>
            {this.renderHeader(props, v.key)}
            <FlatList
              ref={(ref) => { this.flatListRefs[v.key || 'main'] = ref; }}
              testID={this.getTestId('flat_list')}
              key={props.name + '_' + (isHorizontal ? 'H' : 'V') + props.itemsperrow.xs}
              keyExtractor={(item, i) => this.generateItemKey(item, i, props)}
              scrollEnabled={isHorizontal}
              horizontal={isHorizontal}
              data={this._showSkeleton ? [...getNumberOfEmptyObjects(this.props.numberofskeletonitems as number ?? 3)] : (isEmpty(v.data[0]) ? [] : v.data)}
              ListEmptyComponent={(itemInfo) => this.renderEmptyMessage(isHorizontal, itemInfo.item, itemInfo.index, props)}
              renderItem={(itemInfo) => this.renderItem(itemInfo.item, itemInfo.index, props)}
              {...(isHorizontal ? { showsHorizontalScrollIndicator: !props.hidehorizontalscrollbar } : { numColumns: this.getNoOfColumns() })}>
            </FlatList>
            {this.loadDataOnDemand || (v.data.length > this.state.maxRecordsToShow && props.navigation !== 'None') ?
              (this.state.loadingData ? this.renderLoadingIcon(props) :
                (<WmLabel id={this.getTestId('ondemandmessage')}
                  styles={this.styles.onDemandMessage}
                  caption={this.getCaption(isHorizontal, v.data)}
                  onTap={() => this.loadData()}></WmLabel>)) : null}
          </View>
        ))) : this.state.loadingData ? this.renderLoadingIcon(props) : this.renderEmptyMessage(isHorizontal, null, null, props)
        }
      </View>);
  }

  private getSectionListData(props: WmListProps) {
    if (this._showSkeleton) {
      return [{
        key: '',
        data: [...getNumberOfEmptyObjects(this.props.numberofskeletonitems as number ?? 3)]
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
      this.state.loadingData ? 
      this.renderLoadingIcon(props) :
      (  
        <SectionList
          keyExtractor={(item, i) => this.generateItemKey(item, i, props)}
          horizontal={isHorizontal}
          contentContainerStyle={this.styles.root}
          sections={this.getSectionListData(props)}
          renderSectionHeader={({ section: { key, data } }) => {
            return this.renderHeader(props, key);
          }}
          renderSectionFooter={() => props.loadingdata ? this.renderLoadingIcon(props) : null}
          ListEmptyComponent={(itemInfo) => this.renderEmptyMessage(isHorizontal, itemInfo.item, itemInfo.index, props)}
          renderItem={(itemInfo) => this.renderItem(itemInfo.item, itemInfo.index, props)}>
        </SectionList>
      )  
    );
  }

  renderWidget(props: WmListProps) {
    this.invokeEventCallback('onBeforedatarender', [this, this.state.props.dataset]);
    const isHorizontal = (props.direction === 'horizontal');

    return (
      <View
        style={isHorizontal ? null : { width: '100%' }}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        {(isHorizontal || !props.groupby) ?
          this.renderWithFlatList(props, isHorizontal)
          : this.renderWithSectionList(props, isHorizontal)}
      </View>
    );
  }
}
