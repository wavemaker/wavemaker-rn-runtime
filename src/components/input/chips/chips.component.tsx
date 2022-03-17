import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';
import { clone, findIndex, isUndefined, pull, forEach, filter, find, isEqual, merge } from 'lodash';
import WmChipsProps from './chips.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmChipsStyles } from './chips.styles';
import WmSearch from '@wavemaker/app-rn-runtime/components/basic/search/search.component';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

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

  onPropertyChange(name: string, $new: any, $old: any): void {
      super.onPropertyChange(name, $new, $old);
      switch(name) {
        case 'datavalue':
          if (!$new || $new.length === 0) {
            this.updateState({
              chipsList : []
            } as WmChipsState);
          }
      }
  }

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

  selectChip(chipItem: any) {
    chipItem.selected = !chipItem.selected;
    const selectedValue: any = [];
    const selectedItem = find(this.state.dataItems, d => isEqual(d.key, chipItem.key));
    selectedItem.selected = chipItem.selected;
    forEach(this.state.dataItems, (item) => {
      if (item.selected) {
        selectedValue.push(item);
      }
    });
    this.setDatavalue(selectedValue);
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
    (this as any).searchRef.isDefaultQuery = false;
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

  private isDefaultView() {
    return !this.state.props.searchable && this.state.dataItems?.length <= 10;
  }

  renderChip(item: any, index: any) {
    const isSelected = this.isDefaultView() ? item.selected : true;
    return (
      <TouchableOpacity style={[this.styles.chip, isSelected ? this.styles.activeChip : null]}
        key={'chipitem_'+ index}
        onPress={() => {
          if (this.state.props.disabled) {
            return;
          }
          if (this.isDefaultView()) {
            this.selectChip(item);
          }
          this.invokeEventCallback('onChipclick', [null, this, item]);
          this.invokeEventCallback('onChipselect', [null, this, item]);
        }}>
        {isSelected && this.isDefaultView() ? <WmIcon iconclass={'wi wi-done'} iconsize={16} styles={merge({}, this.styles.doneIcon, {icon: {color: isSelected ? this.styles.activeChipLabel.color : null}})}></WmIcon> : null}
        <WmPicture styles={this.styles.imageStyles} picturesource={item.imgSrc} shape='circle'></WmPicture>
        <Text style={[this.styles.chipLabel, isSelected ? this.styles.activeChipLabel : null]}>{item.displayexp || item.displayfield}</Text>
        {!this.isDefaultView() && !this.state.props.disabled ? <WmIcon iconclass={'wi wi-clear'} iconsize={16} styles={this.styles.clearIcon} onTap={() => this.removeItem(item, index)}></WmIcon> : null}
      </TouchableOpacity>
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

  componentDidUpdate(prevProps: WmChipsProps, prevState: WmChipsState) {
    if (prevState.chipsList !== this.state.chipsList) {
      this.searchRef?.computePosition();
    }
  }

  renderWidget(props: WmChipsProps) {
    const chips = this.state.chipsList;
    this.updateDefaultQueryModel();
    return (<View style={this.styles.root}>

      <View style={this.styles.chipsWrapper}>
        {
          this.isDefaultView() ? this.state.dataItems.map((item: any, index: any) => this.renderChip(item, index)) : null
        }
        { props.searchable || !this.isDefaultView() ?
          <View style={this.styles.searchContainer}>
            <WmSearch
              styles={this.styles.search}
              placeholder={this.state.saturate ? this.maxSizeReached : props.placeholder}
              listener={this.listener}
              dataset={props.dataset}
              searchkey={props.searchkey}
              minchars={props.minchars}
              autofocus={props.autofocus}
              disabled={props.disabled || props.readonly || this.state.saturate}
              readonly={props.readonly}
              displayexpression={props.displayexpression}
              getDisplayExpression={props.getDisplayExpression}
              displayimagesrc={props.displayimagesrc}
              displayfield={props.displayfield}
              datafield={props.datafield}
              onSubmit={this.addItem.bind(this)}
              onChange={() => this.props.listener?.onComponentChange && this.props.listener?.onComponentChange(this)}
              showSearchIcon={false}
              showclear={false}
              type={props.minchars === 0 ? 'autocomplete' : 'search'}/>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                {chips && chips.length ?
                chips.map((item: any, index: any) => this.renderChip(item, index))
                : null}
              </View>
          </View>
           : null }
      </View>
    </View>);
  }
}
