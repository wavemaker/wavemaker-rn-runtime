import React from 'react';
import { ScrollView, Text, View } from 'react-native';
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
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

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
          if (isNaN($new) && isEmpty($new)) {
            this.updateState({
              props: {
                displayValue: this.state.props.placeholder || ''
              }
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
      if (this.isDefaultValue && this.state.props.displayValue === '') {
        this.validate(this.state.props.displayValue);
        this.props.triggerValidation && this.props.triggerValidation();
      }
      this.invokeEventCallback('onBlur', [{}, this.proxy]);
      this.setState({ isOpened: false, modalOptions: {} as ModalOptions } as WmSelectState);
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
        style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid, { backgroundColor: props.disabled ? this.styles.disabledText.backgroundColor : this.styles.root.backgroundColor}]}
        ref={(ref) => {
          this.view = ref as View;
        }}
        onLayout={() => {}}>
          <Text
            style={[this.styles.text,
              this.state.props.displayValue ? {} : {color: this.styles.placeholderText.color}]}
            ref={(ref) => {
              this.widgetRef = ref;
            }}
            onPress={this.onPress.bind(this)}>
            {this.state.props.displayValue || props.placeholder || ' '}
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
    this.onChange(isPlaceholder ? '' : this.state.props.datafield === 'All Fields'  ? item.dataObject : item.datafield);
    this.hide();
  }

  renderSelectItem(item: any, isPlaceholder: boolean, isLast: boolean) {
    return (
      <Tappable onTap={this.onItemSelect.bind(this, item, isPlaceholder)}>
        <View style={[this.styles.selectItem, isLast ?  this.styles.lastSelectItem  : null ]}>
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
        props: {
        displayValue: selectedItem.displayexp || selectedItem.displayfield || ''
      }
      } as WmSelectState);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.updateDefaultQueryModel();
  }

  onDataItemsUpdate() {
    super.onDataItemsUpdate();
    this.updateDefaultQueryModel();
  }

  renderWidget(props: WmSelectProps) {
    return (
      <View>
        {this.renderSelect()}
        {this.state.isOpened ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              const items = this.state.dataItems;
              modalService.showModal(
                this.prepareModalOptions(
                  <ScrollView style={{width: '100%', maxHeight: ThemeVariables.maxModalHeight}} contentContainerStyle={this.styles.dropDownContent}>
                    {props.placeholder ?
                      <View key={props.name + '_placeholder'} style={this.styles.placeholderText}>
                        {this.renderSelectItem({}, true, false)}
                      </View>
                      : null}
                      {items && items.map((item: any, index: number) => (
                        <View key={item.key}>
                          {this.renderSelectItem(item, false, index === items.length - 1)}
                        </View>
                      ))}
                  </ScrollView>,
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
