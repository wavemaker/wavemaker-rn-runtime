import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { find } from 'lodash';

import WmSearchProps from './search.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSearchStyles } from './search.styles';
import { ModalConsumer, ModalOptions, ModalService} from "@wavemaker/app-rn-runtime/core/modal.service";
import { LocalDataProvider } from '@wavemaker/app-rn-runtime/components/basic/search/local-data-provider';

import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';

export class WmSearchState extends BaseDatasetState<WmSearchProps> {
  searchQuery: any = '';
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
  private dataProvider: LocalDataProvider;
  public widgetRef: TextInput | null = null;
  private cursor: any = 0;

  constructor(props: WmSearchProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSearchProps(), new WmSearchState());
    this.dataProvider = new LocalDataProvider();
    if (this.props.datavalue) {
      this.updateState({
        searchQuery: this.props.datavalue
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
      searchQuery: '',
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

  updateFilteredData(queryText: any) {
    const props = this.state.props;
    const filterOptions = {
      query: queryText,
      props: props,
      entries: this.state.dataItems
    };
    let filteredData;
    if (props.minchars && queryText.length < props.minchars) {
      filteredData = [];
    } else {
      filteredData = props.type === 'search' && !queryText ? [] : this.dataProvider.filter(filterOptions);
    }
    this.updateState({
      props: { result: filteredData.map( item => item.dataObject) },
      data: filteredData,
      searchQuery: queryText,
    } as WmSearchState);
    if (!this.state.isOpened) {
      this.showPopover();
    }
  }

  focus() {
    this?.widgetRef?.focus();
  }

  onChange(value: any) {
    this.isDefaultQuery = false;
     this.updateDatavalue(undefined);
     if (this.state.props.searchon === 'onsearchiconclick') {
       this.updateState({
         props: { result: [] },
         data: [],
         searchQuery: value,
       } as WmSearchState);
     } else {
       this.updateFilteredData(value);
     }

     this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.prevDatavalue ]);
  }

  invokeChange(e: any) {
    this.cursor = e.target.selectionStart;
    this.setState({ searchQuery: e.target.value });
  }

  onFocus() {
    if (this.state.props.type === 'autocomplete') {
      this.updateFilteredData(this.state.searchQuery || '');
    }
    this.invokeEventCallback('onFocus', [null, this]);
  }

  onBlur() {
    this.isDefaultQuery = true;
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
      this.setState({ isOpened: false, modalOptions: {} as ModalOptions });
    };
    this.hide = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  searchIconPress() {
    if (this.state.props.searchon === 'onsearchiconclick') {
      this.updateFilteredData(this.state.searchQuery);
    } else {
      this.onItemSelect(this.state.data[0]);
    }
  }

  onItemSelect(item: any) {
    this.updateState({
      searchQuery: item.displayexp || item.displayfield
    } as WmSearchState);
    this.updateDatavalue(item.datafield);
    this.prevDatavalue = item.datafield;
    this.queryModel = item;
    this.invokeEventCallback('onSelect', [null, this, item.datafield]);
    this.invokeEventCallback('onSubmit', [null, this]);
    this.hide();
  }

  renderSearchBar() {
    const props = this.state.props;
    return(
      /*
       * onLayout function is required.
       * https://github.com/naoufal/react-native-accordion/pull/19/files
       */
      <View style={this.styles.root} ref={ref => {this.view = ref as View}} onLayout={() => {}}>
        <View style={this.styles.searchInputWrapper}>
          <TextInput style={[this.styles.text, this.state.isOpened && this.state.dataItems?.lenth > 0? this.styles.focusedText : null]}
           ref={ref => {this.widgetRef = ref;
             if (ref) {
               // @ts-ignore
               ref.selectionStart = ref.selectionEnd = this.cursor;
             }}}
            placeholder={props.placeholder}
            autoFocus={props.autofocus}
            editable={props.disabled || props.readonly ? false : true}
            onChangeText={this.onChange.bind(this)}
            onChange={this.invokeChange.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onLayout={e => {this.searchInputWidth = e.nativeEvent.layout.width}}
            onBlur={this.onBlur.bind(this)}
            value={this.state.searchQuery}>
         </TextInput>
         {props.showclear && this.state.searchQuery ? <WmButton onTap={this.clearSearch.bind(this)}
                   styles={this.styles.clearButton} iconclass={'wi wi-clear'}></WmButton> : null}
       </View>
        {props.showSearchIcon && props.type === 'search' ? <WmButton styles={this.styles.searchButton}
                  iconclass={'wi wi-search'} onTap={this.searchIconPress.bind(this)}></WmButton> : null}
      </View>
    );
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
        selectedItem && this.updateState({
          searchQuery: selectedItem.displayexp || selectedItem.displayfield
        } as WmSearchState);
    }
  }

  componentDidMount(): void {
    super.componentDidMount();
  }

  renderWidget(props: WmSearchProps) {
    const result = this.state.data;
    this.updateDefaultQueryModel();
    return (
      <View>
        {this.renderSearchBar()}
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              modalService.showModal(this.prepareModalOptions((
                <View style={this.styles.dropDownContent}>
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
                </View>
              ), this.styles, modalService));
              return null;
            }}
          </ModalConsumer>) : null}
      </View>

    );
  }
}
