import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LifecycleListener } from '@wavemaker/app-rn-runtime/core/base.component';
import { clone, findIndex, get, isUndefined, pull, forEach, filter, find, isEqual, merge } from 'lodash';
import WmChipsProps from './chips.props';
import { DEFAULT_CLASS, WmChipsStyles } from './chips.styles';
import WmSearch from '@wavemaker/app-rn-runtime/components/basic/search/search.component';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/utils';

export class WmChipsState extends BaseDatasetState<WmChipsProps> {
  chipsList: any = [];
  saturate: any;
}

export default class WmChips extends BaseDatasetComponent<WmChipsProps, WmChipsState, WmChipsStyles> {
  constructor(props: WmChipsProps) {
    super(props, DEFAULT_CLASS, new WmChipsProps(), new WmChipsState());
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

  reset() {
    if (this.searchRef?.state.props.query) {
      this.searchRef.reset();
    }
  }

  onDataItemsUpdate() {
    super.onDataItemsUpdate();
    this.isDefaultQuery = true;
    this.updateDefaultQueryModel();
  }

  addItem($event: any, widget: any) {
    let newChipList = clone(this.state.chipsList),
      allowAdd;
    newChipList.push(widget.queryModel);
    const isFormFieldWidget = get(this.props, 'formfield');
    if (this.isDuplicate(widget.queryModel)) {
      this.resetSearchModel();
      return;
    }

    // @ts-ignore
    allowAdd = isFormFieldWidget ? this.props?.invokeEvent('onBeforeadd', [null, this, widget.queryModel]) : this.invokeEventCallback('onBeforeadd', [null, this, widget.queryModel]);

    if (!isUndefined(allowAdd) && !this.toBoolean(allowAdd)) {
      return;
    }

    this.updateState({
      chipsList: newChipList
    } as WmChipsState);

    this.setDatavalue(newChipList);

    // @ts-ignore
    isFormFieldWidget ? this.props?.invokeEvent('onAdd', [null, this, widget.queryModel]) : this.invokeEventCallback('onAdd', [null, this, widget.queryModel]);
    this.resetSearchModel();
  }

  computeDisplayValue() {
    this.updateState({
      props: {
        displayValue: ((this.state.dataItems || [] as any)
          .filter((item: any) => item.selected)
          .map((item: any) => item.displayexp || item.displayfield)) || ''
      }
    } as WmChipsState);
  }

  selectChip(chipItem: any) {
    if (!chipItem.selected && this.state.props.maxsize > 0 && (this.state.chipsList.length === this.state.props.maxsize)) {
      return;
    }
    chipItem.selected = !chipItem.selected;
    const newChipList: any = [];
    const selectedItem = find(this.state.dataItems, d => isEqual(d.key, chipItem.key));
    selectedItem.selected = chipItem.selected;
    forEach(this.state.dataItems, (item) => {
      if (item.selected) {
        newChipList.push(item);
      }
    });
    this.updateState({
      chipsList: newChipList
    } as WmChipsState);

    this.setDatavalue(newChipList);
  }

  setDatavalue(newChipList: any) {
    const dataValue = newChipList.map((item: any) => item.datafield);
    this.updateDatavalue(dataValue);
    this.updateMaxSize(newChipList.length);
    if (!this.props.invokeEvent) {
      this.invokeEventCallback('onChange', [null, this, dataValue, this.prevDatavalue])
    }
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
    return findIndex(this.state.chipsList, {datafield: item.datafield}) > -1;
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
    const isFormFieldWidget = get(this.props, 'formfield');
    newChipList = pull(newChipList, item);
    // prevent deletion if the before-remove event callback returns false
    // @ts-ignore
    const allowRemove = isFormFieldWidget ? this.props.invokeEvent('onBeforeremove',[null, this, item]) : this.invokeEventCallback('onBeforeremove',[null, this, item]);
    if (!isUndefined(allowRemove) && !this.toBoolean(allowRemove)) {
      return;
    }
    this.updateState({
      chipsList: newChipList
    } as WmChipsState);
    this.setDatavalue(newChipList);
    // @ts-ignore
    isFormFieldWidget ? this.props.invokeEvent('onRemove', [null, this, item]) : this.invokeEventCallback('onRemove', [null, this, item]);
  }

  private isDefaultView() {
    return !this.state.props.searchable && this.state.dataItems?.length <= 10;
  }

  renderChip(item: any, index: any) {
    const isSelected = this.isDefaultView() ? item.selected : true;
    return (
      <TouchableOpacity
        {...this.getTestPropsForAction('chip'+ index)}
        {...getAccessibilityProps(AccessibilityWidgetType.CHIPS, {...this.state.props, selected: isSelected})}
        style={[this.styles.chip, isSelected ? this.styles.activeChip : null]}
        key={'chipitem_'+ index}
        onPress={() => {
          if (this.state.props.disabled) {
            return;
          }
          if (this.isDefaultView()) {
            this.selectChip(item);
          }
          if (get(this.props, 'formfield')) {
            // @ts-ignore
            this.props.invokeEvent('onChipclick', [null, this, item]);
            // @ts-ignore
            this.props.invokeEvent('onChipselect', [null, this, item]);
          } else {
            this.invokeEventCallback('onChipclick', [null, this, item]);
            this.invokeEventCallback('onChipselect', [null, this, item]);
          }
        }}>
        {isSelected && this.isDefaultView() ? <WmIcon iconclass={'wm-sl-l sl-check'} iconsize={16} styles={merge({}, this.styles.doneIcon, {icon: {color: isSelected ? this.styles.activeChipLabel.color : null}})}></WmIcon> : null}
        <WmPicture id={this.getTestId('picture')} styles={this.styles.imageStyles} picturesource={item.imgSrc} shape='circle'></WmPicture>
        <Text {...this.getTestPropsForAction('chip'+ index+'label')}style={[this.styles.chipLabel, isSelected ? this.styles.activeChipLabel : null]}>{item.displayexp || item.displayfield}</Text>
        {!this.isDefaultView() && !this.state.props.disabled ? <WmIcon  id={this.getTestId('clearbtn')} iconclass={'wi wi-clear'} iconsize={16} styles={this.styles.clearIcon} onTap={() => this.removeItem(item, index)}></WmIcon> : null}
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

  componentDidMount(): void {
    super.componentDidMount();
    this.updateDefaultQueryModel();
  }

  componentDidUpdate(prevProps: WmChipsProps, prevState: WmChipsState) {
    super.componentDidUpdate(prevProps, prevState);
    if (prevState.chipsList !== this.state.chipsList) {
      this.searchRef?.computePosition();
    }
  }

  renderWidget(props: WmChipsProps) {
    const chips = this.state.chipsList;
    return (<View style={this.styles.root}>

      <View style={this.styles.chipsWrapper}>
        {
          this.isDefaultView() ? this.state.dataItems.map((item: any, index: any) => this.renderChip(item, index)) : null
        }
        { props.searchable || !this.isDefaultView() ?
          <View style={[this.styles.searchContainer, {flexDirection: props.inputposition === 'first' ? 'column' : 'column-reverse'}]}>
            <WmSearch
              id={this.getTestId('search')}
              name="app-chip-search"
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
              onChange={() => {
                this.isDefaultQuery = false;
                this.props.listener?.onComponentChange && this.props.listener?.onComponentChange(this)
              }}
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
