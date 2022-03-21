import React from 'react';
import { Text, View } from 'react-native';
import { find, isEmpty } from 'lodash';

import WmSelectProps from './select.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSelectStyles } from './select.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

export class WmSelectState extends BaseDatasetState<WmSelectProps> {
  modalOptions = {} as ModalOptions;
  isOpened: boolean = false;
  selectedValue: any = '';
}

export default class WmSelect extends BaseDatasetComponent<WmSelectProps, WmSelectState, WmSelectStyles> {
  constructor(props: WmSelectProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSelectProps(), new WmSelectState());
  }
  view: View = null as any;
  public widgetRef: Text | null = null;
  private isDefaultValue: boolean = true;

  onPress(event: any) {
    if (this.state.props.disabled) {
      return;
    }
    if (!this.state.isOpened) {
      this.showPopover();
    }
    this.invokeEventCallback('onFocus', [event, this.proxy]);
  }

  onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
      switch(name) {
        case 'datavalue':
          if (isEmpty($new)) {
            this.updateState({
              selectedValue: this.state.props.placeholder
            } as WmSelectState);
          } 
      }
  }

  prepareModalOptions(content: React.ReactNode, styles: WmSelectStyles, modalService: ModalService) {
    const o = this.state.modalOptions;
    o.modalStyle = styles.modal;
    o.contentStyle = {...styles.modalContent};
    o.content = content;
    o.isModal = true;
    o.centered = true;
    o.onClose = () => {
      this.hide = () => {};
      this.invokeEventCallback('onBlur', [{}, this.proxy]);
      this.setState({ isOpened: false, modalOptions: {} as ModalOptions });
    };
    this.hide = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  public showPopover = () => {
      this.updateState({ isOpened: true } as WmSelectState);
  };

  public hide = () => {};

  focus() {
    this?.widgetRef?.focus();
  }

  renderSelect() {
    const props = this.state.props;
    return (
      /*
       * onLayout function is required.
       * https://github.com/naoufal/react-native-accordion/pull/19/files
       */
      <View
        style={[this.styles.root, { backgroundColor: props.disabled ? this.styles.disabledText.backgroundColor : this.styles.root.backgroundColor}]}
        ref={(ref) => {
          this.view = ref as View;
        }}
        onLayout={() => {}}>
          <Text
            style={this.styles.text}
            ref={(ref) => {
              this.widgetRef = ref;
            }}
            onPress={this.onPress.bind(this)}>
            {this.state.selectedValue || props.placeholder || ' '}
          </Text>
          <WmButton
            styles={this.styles.arrowButton}
            iconclass={'wi wi-keyboard-arrow-down'}
            onTap={this.onPress.bind(this)}
          />
      </View>
    );
  }

  onItemSelect(item: any, isPlaceholder?: boolean) {
    this.isDefaultValue = false;
    this.updateState({
      selectedValue: isPlaceholder ? this.state.props.placeholder : (item.displayexp || item.displayfield)
    } as WmSelectState);
    this.onChange(isPlaceholder ? '' : this.state.props.datafield === 'All Fields'  ? item.dataObject : item.datafield);
    this.hide();
  }

  renderSelectItem(item: any, isPlaceholder?: boolean) {
    return (
      <Tappable onTap={this.onItemSelect.bind(this, item, isPlaceholder)}>
        <View style={this.styles.selectItem}>
          <Text style={[this.styles.selectItemText,  {color: isPlaceholder ? this.styles.placeholderText.color : this.styles.selectItemText.color}]}>
            {isPlaceholder ? this.state.props.placeholder : (item.displayexp || item.displayfield)}
          </Text>
        </View>
      </Tappable>
    );
  }

  updateDefaultQueryModel() {
    if (this.state.dataItems && this.state.dataItems.length && this.isDefaultValue) {
      const selectedItem = find(this.state.dataItems, (item) => item.selected);
      selectedItem && this.updateState({
        selectedValue: selectedItem.displayexp || selectedItem.displayfield
      } as WmSelectState);
    }
  }

  renderWidget(props: WmSelectProps) {
    const items = this.state.dataItems;
    this.updateDefaultQueryModel();
    return (
      <View>
        {this.renderSelect()}
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              modalService.showModal(
                this.prepareModalOptions(
                  <View style={this.styles.dropDownContent}>
                    {props.placeholder ?
                      <View key={props.name + '_placeholder'} style={this.styles.placeholderText}>
                        {this.renderSelectItem({}, true)}
                      </View>
                      : null}
                    {items &&
                      items.map((item: any) => (
                        <View key={item.key}>
                          {this.renderSelectItem(item)}
                        </View>
                      ))}
                  </View>,
                  this.styles,
                  modalService
                )
              );
              return null;
            }}
          </ModalConsumer>
        ) : null}
      </View>
    );
  }
}
