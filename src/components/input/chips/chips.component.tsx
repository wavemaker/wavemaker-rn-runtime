import React from 'react';
import { View } from 'react-native';
import { LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';
import { clone, findIndex, isUndefined, pull, filter } from 'lodash';
import { Chip, Avatar } from 'react-native-paper';
import WmChipsProps from './chips.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmChipsStyles } from './chips.styles';
import WmSearch from '@wavemaker/app-rn-runtime/components/basic/search/search.component';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';

export class WmChipsState extends BaseDatasetState<WmChipsProps> {
  chipsList: any = [];
  saturate: any;
}

export default class WmChips extends BaseDatasetComponent<WmChipsProps, WmChipsState, WmChipsStyles> {
  constructor(props: WmChipsProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmChipsProps(), new WmChipsState());
  }

  private searchRef: WmSearch = null as any;
  private maxSizeReached = 'Max size reached';
  private isDefaultQuery: boolean = true;
  private prevDatavalue: any;

  private listener: LifecycleListener = {
    onComponentInit: (c) => {
      if (c instanceof WmSearch) {
        this.searchRef = c;
      }
    }
  };

  addItem($event: any, widget: any) {
    let newChipList = clone(this.state.chipsList),
      allowAdd;
    newChipList.push(widget.queryModel);

    if (this.isDuplicate(widget.queryModel)) {
      this.resetSearchModel();
      return;
    }

    allowAdd = this.invokeEventCallback('onBeforeadd', [null, this, widget.queryModel]);

    if (!isUndefined(allowAdd) && !this.toBoolean(allowAdd)) {
      return;
    }

    this.updateState({
      chipsList: newChipList
    } as WmChipsState);

    this.setDatavalue(newChipList);

    this.invokeEventCallback('onAdd', [null, this, widget.queryModel]);
    this.resetSearchModel();
  }

  setDatavalue(newChipList: any) {
    const dataValue = newChipList.map((item: any) => item.datafield);
    this.updateDatavalue(dataValue);
    this.updateMaxSize(newChipList.length);
    this.invokeEventCallback('onChange', [null, this, dataValue, this.prevDatavalue])
    this.prevDatavalue = dataValue;
  }

  toBoolean = (val: any) => ((val && val !== 'false') ? true  : false);

  // Prepare datavalue object from a string(junk) value when datafield is allFields.
  createCustomDataModel(val: string) {
     return {
        key: `${this.state.props.name}_item${this.state.chipsList.length}`,
        dataObject: val,
        displayfield: val,
        datafield: val,
        isCustom: true
     }
  }

  resetSearchModel() {
    this.searchRef.clearSearch();
  }

  isDuplicate(item: any) {
    return findIndex(this.state.chipsList, {key: item.key}) > -1;
  }

  // Check if max size is reached
  private updateMaxSize(chipListLength: number) {
    const saturate = this.state.props.maxsize > 0 && (chipListLength || this.state.chipsList.length) === this.state.props.maxsize;
    this.updateState({
      saturate: saturate
    } as WmChipsState);
  }

  removeItem(item: any, index: any) {
    let newChipList = clone(this.state.chipsList);
    newChipList = pull(newChipList, item);
    // prevent deletion if the before-remove event callback returns false
    const allowRemove = this.invokeEventCallback('onBeforeremove',[null, this, item]);
    if (!isUndefined(allowRemove) && !this.toBoolean(allowRemove)) {
      return;
    }
    this.updateState({
      chipsList: newChipList
    } as WmChipsState);
    this.setDatavalue(newChipList);
    this.invokeEventCallback('onRemove', [null, this, item]);
  }

  renderChip(item: any, index: any) {
    return (
      <Chip avatar={item.imgSrc ? <Avatar.Image size={29} source={item.imgSrc}/>: null}
            key={'chipitem_'+ index}
            style={this.styles.chip}
            textStyle={this.styles.chipText}
            onClose={() => this.removeItem(item, index)}
            onPress={() => {
              this.invokeEventCallback('onChipclick', [null, this, item]);
              this.invokeEventCallback('onChipselect', [null, this, item]);
            }}>
        {item.displayexp || item.displayfield}</Chip>
    )
  }

  updateDefaultQueryModel() {
      if (this.state.dataItems && this.state.dataItems.length && this.isDefaultQuery) {
          const selectedItems = filter(this.state.dataItems, (item) => item.selected);
          if (selectedItems.length) {
            this.updateState({
              chipsList: selectedItems
            } as WmChipsState);
          }
          this.isDefaultQuery = false;
      }
  }

  renderWidget(props: WmChipsProps) {
    const chips = this.state.chipsList;
    this.updateDefaultQueryModel();
    // @ts-ignore
    return (<View style={[this.styles.root, {flexDirection: props.inputwidth === 'default' ? 'row' : 'column'}]}>

      <View style={this.styles.chipsWrapper}>
        {chips && chips.length ?
         chips.map((item: any, index: any) => this.renderChip(item, index))
          : null
        }
      </View>

      {/*// @ts-ignore*/}
        <WmSearch
          placeholder={this.state.saturate ? this.maxSizeReached : props.placeholder}
          listener={this.listener}
          dataset={props.dataset}
          searchKey={props.searchkey}
          minchars={props.minchars}
          autofocus={props.autofocus}
          disabled={props.disabled || props.readonly || this.state.saturate}
          readonly={props.readonly}
          displayimagesrc={props.displayimagesrc}
          displayfield={props.displayfield}
          datafield={props.datafield}
          onSubmit={this.addItem.bind(this)}
          showSearchIcon={false}
          showclear={false}
          type={props.minchars === 0 ? 'autocomplete' : 'search'}/>

    </View>);
  }
}