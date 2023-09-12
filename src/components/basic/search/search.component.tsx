import React from 'react';
import { Keyboard, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { find, isNull } from 'lodash';

import WmSearchProps from './search.props';
import { DEFAULT_CLASS, WmSearchStyles } from './search.styles';
import { ModalConsumer, ModalOptions, ModalService} from "@wavemaker/app-rn-runtime/core/modal.service";
import { DataProvider } from '@wavemaker/app-rn-runtime/components/basic/search/local-data-provider';

import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { get, isArray, isEmpty, isObject } from "lodash-es";
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

export class WmSearchState extends BaseDatasetState<WmSearchProps> {
  isOpened: boolean = false;
  modalOptions = {} as ModalOptions;
  position = {
    top: 0,
    left: 0
  } as DropdownPosition;
  data: any = [];
}

export interface DropdownPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export default class WmSearch extends BaseDatasetComponent<WmSearchProps, WmSearchState, WmSearchStyles> {
  view: View = null as any;
  private prevDatavalue: any;
  private queryModel: any;
  private searchInputWidth: any;
  private isDefaultQuery: boolean = true;
  private dataProvider: DataProvider;
  public widgetRef: TextInput | null = null;
  private cursor: any = 0;
  private isFocused: boolean = false;
  private updateRequired: any;

  constructor(props: WmSearchProps) {
    super(props, DEFAULT_CLASS, new WmSearchProps(), new WmSearchState());
    this.dataProvider = new DataProvider();
    if (this.props.datavalue) {
      this.updateState({
        props: {
          query: this.props.datavalue
        }
      } as WmSearchState);
    }
  }

  computePosition = () => {
    return new Promise<void>((resolve) => {
      const position = {} as DropdownPosition;
      this.view.measure((x = 0, y = 0, width = 0, height = 0, px = 0, py = 0) => {
        position.left = px;
        position.top = py + height;
        this.updateState({ position: position } as WmSearchState, resolve);
      });
    });
  }

  clearSearch() {
    this.invokeEventCallback('onClear', [null, this]);
    this.hide();
    this.updateState({
      props: {
        query: ''
      },
      dataItems: this.state.dataItems ? this.state.dataItems.map((item: any) => {
        item.selected = false;
        return item;
      }) : []
    } as WmSearchState, () => {
      if (this.state.props.type === 'autocomplete') {
        this.updateFilteredData('');
      }
    });
  }

  updateFilteredData(queryText: string = '') {
    const props = this.state.props;
    const filterOptions = {
      query: queryText,
      props: props,
      entries: this.state.dataItems
    };
    let filteredData: Array<any> = [];
    if (props.minchars && queryText.length < props.minchars) {
      filteredData = [];
    } else if (props.type === 'search' && !queryText) {
      filteredData = [];
    } else {
      if (this.props.searchkey && this.updateRequired === undefined) {
        this.updateRequired = this.dataProvider.init(this);
      }
      // for service variables invoke the variable with params.
      if (this.props.searchkey && this.updateRequired && this.state.props.query !== queryText) {
        this.dataProvider.invokeVariable(this, queryText).then((response: any) => {
          if (response) {
            response = response.dataSet;
            if (isEmpty(response)) {
              filteredData = [];
            } else {
              if (isObject(response) && !isArray(response)) {
                response = [response];
              }
              this.setDataItems(response);
            }
          }
        }, () => {});
        return;
      }
      filteredData = this.dataProvider?.filter(filterOptions);
    }
    this.updateState({
      props: { result: filteredData?.map( (item: any) => item.dataObject), query: queryText },
      data: filteredData,
    } as WmSearchState);
    if (!this.state.isOpened && this.isFocused) {
      this.showPopover && this.showPopover();
    }
  }

  focus() {
    this?.widgetRef?.focus();
  }

  onChange(value: any) {
    this.isDefaultQuery = false;
    const prevQuery = this.state.props.query;
    if (this.state.props.searchon === 'onsearchiconclick') {
      this.updateState({
        props: {result: [], query: value},
        data: []
      } as WmSearchState);
    } else {
      this.updateFilteredData(value);
    }
    if (value === '') {
      this.validate(value);
      this.updateState({
        props: {
          datavalue: '',
        },
      } as WmSearchState);
      if (value === prevQuery) {
        return;
      }
    }
    if (this.props.invokeEvent) {
      this.props.invokeEvent('onChange', [undefined, this.proxy, value, prevQuery]);
    }
     this.invokeEventCallback('onChange', [ undefined, this.proxy, value, prevQuery ]);
  }

  invokeChange(e: any) {
    if (Platform.OS === 'web') {
      this.cursor = e.target.selectionStart;
      this.updateState({ props: { query: e.target.value } } as WmSearchState);
    }
  }

  onFocus() {
    this.isFocused = true;
    if (!this.state.props.disabled && this.state.props.type === 'autocomplete') {
      this.cursor = this.state.props.query?.length || 0;
      this.updateFilteredData(this.state.props.query || '');
    }
    this.invokeEventCallback('onFocus', [null, this]);
  }

  onBlur() {
    this.isFocused = false;
    this.validate(this.state.props.datavalue);
    if (!this.state.props.datavalue) {
      setTimeout(() => {
        this.props.triggerValidation && this.props.triggerValidation();
      })
    }
    this.invokeEventCallback('onBlur', [null, this]);
  }

  public showPopover = () => {
    this.computePosition().then(() => {
      this.updateState({ isOpened: true } as WmSearchState);
    });
  };

  public hide = () => {};

  prepareModalOptions(content: React.ReactNode, styles: WmSearchStyles, modalService: ModalService) {
    const o = this.state.modalOptions;
    const modalContentSTyles = {
      width: this.searchInputWidth - 2 * (styles.modalContent.borderWidth || 0),
      left: (this.state.position.left || 0) + 2 * (styles.modalContent.borderWidth || 0) };
    o.modalStyle = {...styles.modal};
    o.contentStyle = {...styles.modalContent, ...this.state.position, ...modalContentSTyles};
    o.content = content;
    o.isModal = true;
    o.onClose = () => {
      this.hide = () => {};
      Keyboard.dismiss();
      if (this.state.isOpened) {
        this.setState({isOpened: false, modalOptions: {} as ModalOptions} as WmSearchState);
      }
    };
    this.hide = () => {
      modalService.hideModal(this.state.modalOptions);
      if (this.state.isOpened) {
        this.setState({ isOpened: false, modalOptions: {} as ModalOptions } as WmSearchState);
      }
    }
    return o;
  }

  searchIconPress() {
    this.isFocused = false;
    if (this.state.props.searchon === 'onsearchiconclick') {
      this.updateFilteredData(this.state.props.query);
    } else {
      this.onItemSelect(this.state.data[0]);
    }
  }

  onItemSelect(item: any) {
    this.isFocused = false;
    this.updateState({ props: {
        query: item.displayexp || item.displayfield
      }
    } as WmSearchState);
    this.validate(item.datafield);
    this.updateDatavalue(item.datafield);
    this.prevDatavalue = item.datafield;
    this.queryModel = item;
    if (get(this.props, 'formfield')) {
      // @ts-ignore
      this.props.invokeEvent('onSelect', [null, this, item.datafield]);
      // @ts-ignore
      this.props.invokeEvent('onSubmit', [null, this]);
    } else {
      this.invokeEventCallback('onSelect', [null, this, item.datafield]);
      this.invokeEventCallback('onSubmit', [null, this]);
    }
    this.hide();
  }

  renderSearchBar() {
    const props = this.state.props;
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.props.query || '';
    return(
      /*
       * onLayout function is required.
       * https://github.com/naoufal/react-native-accordion/pull/19/files
       */
      <View style={this.styles.root} ref={ref => {this.view = ref as View}} onLayout={() => {}}>
        <View style={this.styles.searchInputWrapper}>
          <TextInput style={[this.styles.text, this.state.isValid ? {} : this.styles.invalid, this.state.isOpened && this.state.dataItems?.length > 0? this.styles.focusedText : null]}
           ref={ref => {this.widgetRef = ref;
             // @ts-ignore
             if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
               // @ts-ignore
               ref.selectionStart = ref.selectionEnd = this.cursor;
             }}}
            placeholderTextColor={this.styles.placeholderText.color as any}
            placeholder={props.placeholder || 'Search'}
            autoFocus={props.autofocus}
            editable={props.disabled || props.readonly ? false : true}
            onChangeText={this.onChange.bind(this)}
            onChange={this.invokeChange.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onLayout={e => {this.searchInputWidth = e.nativeEvent.layout.width}}
            onBlur={this.onBlur.bind(this)}
            {...opts}>
         </TextInput>
         {props.showclear && this.state.props.query ? <WmButton onTap={this.clearSearch.bind(this)}
                   styles={this.styles.clearButton} iconclass={'wi wi-clear'}></WmButton> : null}
       </View>
        {props.showSearchIcon && props.type === 'search' ? <WmButton styles={this.styles.searchButton}
                  iconclass={'wm-sl-l sl-search'} onTap={this.searchIconPress.bind(this)}></WmButton> : null}
      </View>
    );
  }

  reset() {
    if (this.state.props.query) {
      this.updateState({
        props: {
          query: ''
        }
      } as WmSearchState);
    }
  }

  renderSearchItem(item: any, index: number) {
    const props = this.state.props;
    const imageStyles = { root: {height:props.imagewidth, width:props.imagewidth}}
    return (
      <Tappable onTap={this.onItemSelect.bind(this, item)}>
        <View  style={this.styles.searchItem}>
          <WmPicture styles={imageStyles} name={props.name + '_image'}  picturesource={item.imgSrc}></WmPicture>
          <Text style={this.styles.searchItemText}>{item.displayexp || item.displayfield}</Text>
        </View>
      </Tappable>
    );
  }

  updateDefaultQueryModel() {
    if (this.state.dataItems && this.state.dataItems.length && this.isDefaultQuery) {
        const selectedItem = find(this.state.dataItems, (item) => item.selected);
        this.updateState({ props: {
            query: selectedItem ? (selectedItem.displayexp || selectedItem.displayfield) : ''
          }
        } as WmSearchState);
    }
  }

  onDataItemsUpdate() {
    super.onDataItemsUpdate();
    this.isFocused && this.state.dataItems.length && this.updateFilteredData(this.state.props.query);
    this.updateDefaultQueryModel();
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.updateDefaultQueryModel();
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'dataset':
        if (!isEmpty($new) && isObject($new) && !isArray($new)) {
          $new = [$new];
          this.updateState({
            props: {
              dataset: $new
            }
          } as WmSearchState);
        }
        break;
    }
    super.onPropertyChange(name, $new, $old);
  }

  renderWidget(props: WmSearchProps) {
    const result = this.state.data;
    return (
      <View>
        {this.renderSearchBar()}
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              modalService.showModal(this.prepareModalOptions((
                <ScrollView style={{width: '100%', maxHeight: 200}} contentContainerStyle={this.styles.dropDownContent}>
                    <AssetProvider value={this.loadAsset}>
                    {result && result.map((item: any, index: any) => (
                      <View key={item.key}>
                        {
                          (!props.limit) || (props.limit && index+1 <= props.limit) ?
                            this.renderSearchItem(item, index)
                            : null
                        }
                        {
                          index === result.length - 1 ?
                          <WmAnchor caption={props.datacompletemsg} styles={this.styles.dataCompleteItem}></WmAnchor> : null
                        }
                      </View>
                    ))}
                    </AssetProvider>
                </ScrollView>
              ), this.styles, modalService));
              return null;
            }}
          </ModalConsumer>) : null}
      </View>

    );
  }
}
