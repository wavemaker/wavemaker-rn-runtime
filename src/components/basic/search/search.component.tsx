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
  position = {} as DropdownPosition;
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
  private rootElement: any;
  private isDefaultQuery: boolean = true;
  private dataProvider: LocalDataProvider;

  constructor(props: WmSearchProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSearchProps(), new WmSearchState());
    this.dataProvider = new LocalDataProvider();
  }

  private computePosition = (e: any) => {
    const position = {} as DropdownPosition;
    this.rootElement = e.nativeEvent.target;
    this.view.measure((x, y, width, height, px, py) => {
      position.top = py + height;
      position.left = px;
      this.updateState({ position: position } as WmSearchState);
    });
  };

  clearSearch() {
    this.invokeEventCallback('onClear', [null, this]);
    this.hide();
    this.updateState({
      searchQuery: '',
    } as WmSearchState);
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
      data: filteredData,
      searchQuery: queryText,
    } as WmSearchState);
  }

  onChange(value: any) {
     this.updateDatavalue(undefined);
     if (this.state.props.searchon === 'onsearchiconclick') {
       this.updateState({
         data: [],
         searchQuery: value,
       } as WmSearchState);
     } else {
       this.updateFilteredData(value);
       if (!this.state.isOpened) {
         this.showPopover();
       }
     }

     this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.prevDatavalue ]);
  }

  onFocus() {
    if (this.state.props.type === 'autocomplete') {
      this.updateFilteredData(this.state.searchQuery || '');
      if (!this.state.isOpened) {
        this.showPopover();
      }
    }
    this.invokeEventCallback('onFocus', [null, this]);
  }

  public showPopover = () => {
    this.setState({ isOpened: true });
  };

  public hide = () => {};

  prepareModalOptions(content: React.ReactNode, styles: WmSearchStyles, modalService: ModalService) {
    const o = this.state.modalOptions;
    const modalContentSTyles = { width: this.searchInputWidth, left: this.rootElement.offsetLeft };
    o.modalStyle = {...styles.modal, ...this.state.position,};
    o.contentStyle = {...styles.modalContent, ...modalContentSTyles};
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
      if (!this.state.isOpened) {
        this.showPopover();
      }
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
      <View style={this.styles.searchWrapper}>
        <View style={this.styles.searchInputWrapper}>
          <TextInput style={this.styles.searchInput}
            placeholder={props.placeholder}
            autoFocus={props.autofocus}
            editable={props.disabled || props.readonly ? false : true}
            onChangeText={this.onChange.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onLayout={e => {this.searchInputWidth = e.nativeEvent.layout.width}}
            onBlur={() => this.invokeEventCallback('onBlur', [null, this])}
            value={this.state.searchQuery}>
         </TextInput>
         {props.showclear && this.state.searchQuery ? <WmButton onTap={this.clearSearch.bind(this)}
                   styles={this.styles.clearButton} iconclass={'wi wi-clear'}></WmButton> : null}
       </View>
        {props.showSearchIcon ? <WmButton styles={this.styles.searchButton}
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
        this.isDefaultQuery = false;
    }
  }

  renderWidget(props: WmSearchProps) {
    const result = this.state.data;
    this.updateDefaultQueryModel();
    return (
      <View style={this.styles.root} onLayout={this.computePosition} ref={ref => {this.view = ref as View}}>
        {this.renderSearchBar()}
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              modalService.showModal(this.prepareModalOptions((
                <View style={this.styles.dropDownContent}>
                  <TouchableOpacity onPress={() => {
                     this.hide()
                  }}>
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
                  </TouchableOpacity>
                </View>
              ), this.styles, modalService));
              return null;
            }}
          </ModalConsumer>) : null}
      </View>

    );
  }
}
