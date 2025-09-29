import React from 'react';
import { Dimensions, Platform, StatusBar, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { find, isEmpty, isString } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WmSelectProps from './select.props';
import { DEFAULT_CLASS, WmSelectStyles } from './select.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { ModalConsumer, ModalOptions, ModalService } from '@wavemaker/app-rn-runtime/core/modal.service';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';
import { PopoverPosition } from '../../navigation/popover/popover.component';

export class WmSelectState extends BaseDatasetState<WmSelectProps> {
  modalOptions = {} as ModalOptions;
  isOpened: boolean = false;
  selectedValue: any = '';
  position={} as PopoverPosition;
  selectWidth:number = 0;
  positionReady:boolean = false;
}

export default class WmSelect extends BaseDatasetComponent<WmSelectProps, WmSelectState, WmSelectStyles> {
  constructor(props: WmSelectProps) {
    super(props, DEFAULT_CLASS, new WmSelectProps(), new WmSelectState());
  }
  view: View = null as any;
  public widgetRef: Text | null = null;
  private isDefaultValue: boolean = true;
  private safeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  private isMounted: boolean = true;
  private isComputing: boolean = false;

  componentWillUnmount() {
    this.isMounted = false;
    super.componentWillUnmount?.();
  }
  private setSafeAreaInsets(insets: any) {
    this.safeAreaInsets = insets;
  }

  async onPress(event: any) {
    if (this.state.props.disabled) {
      return;
    }
    if (!this.state.isOpened && !this.isComputing) {
      this.isComputing = true;
      try {
        await this.showPopover();
      } finally {
        this.isComputing = false;
      }
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

  private computePosition = (): Promise<void> => {
    return new Promise((resolve) => {
      const checkMounted = () => !this.view || !this.isMounted ? (resolve(), false) : true;
  
      if (!checkMounted()) return;
  
      requestAnimationFrame(() => {
        if (!checkMounted()) return;
        
        this.view.measureInWindow((px, py, width, height) => {
          if (!checkMounted()) return;
          
          const isDropdown = this.state.props.classname?.includes('select-dropdown');
          const windowDimensions = Dimensions.get('window');
          const position = {} as PopoverPosition;
          
          if (this.isRTL) {
            position.right = windowDimensions.width - px - width;
          } else {
            position.left = px;
          }
          // Adjust if overflows
          if (px + width > windowDimensions.width) {
            if (this.isRTL) {
              position.right = windowDimensions.width - px - width;
            } else {
              position.left = px + width - width;
            }
          }
          position.top = py + height - (Platform.OS === 'ios' && isDropdown ? this.safeAreaInsets.top : 0);
          
          this.updateState({
            position,
            positionReady: true,
            selectWidth: width
          } as WmSelectState, resolve);
        });
      });
    });
  };

  prepareModalOptions(content: React.ReactNode, styles: WmSelectStyles, modalService: ModalService) {
    const o = this.state.modalOptions;
    o.modalStyle = styles.modal;
    o.contentStyle = {...styles.modalContent,...this.state.position};
    o.content = content;
    o.isModal = true;
    o.centered = true;
    o.onClose = () => {
      this.hide = () => {};
      if (this.isDefaultValue && this.state.props.displayValue === '') {
        this.validate(this.state.props.displayValue);
        setTimeout(() => {
          this.props.triggerValidation && this.props.triggerValidation();
        }, 0);
      }
      this.invokeEventCallback('onBlur', [{}, this.proxy]);
      this.setState({ 
        isOpened: false, 
        positionReady: false,
        modalOptions: {} as ModalOptions 
      } as WmSelectState);
    };
    this.hide = () => modalService.hideModal(this.state.modalOptions);
    return o;
  }

  public showPopover = async () => {
      await this.computePosition();
      this.updateState({ isOpened: true } as WmSelectState);
  };

  public hide = () => {};

  focus() {
    this?.widgetRef?.focus();
  }

  private renderSkeletonForText(){
    return createSkeleton(this.theme, {} as WmSkeletonStyles, {
      ...this.styles.textSkeleton.root
    });
  }

  renderSelect() {
    const props = this.state.props;
    const select = this.styles.root as any;
    return (
      /*
       * onLayout function is required.
       * https://github.com/naoufal/react-native-accordion/pull/19/files
       */
      <View
        style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid, { backgroundColor: props.disabled ? this.styles.disabledText.backgroundColor : this.styles.root.backgroundColor}, 
          this._showSkeleton ? { justifyContent: 'space-between' } : {}]}
        ref={(ref) => {
          this.view = ref as View;
        }}
        onLayout={(event) => {this.updateState({selectWidth : event.nativeEvent.layout.width} as any)}}
        {...getAccessibilityProps(AccessibilityWidgetType.SELECT, props)}>
          {select.backgroundImage ? (<BackgroundComponent
            image={select.backgroundImage}
            position={select.backgroundPosition || 'center'}
            size={select.backgroundSize || 'contain'}
            repeat={select.backgroundRepeat || 'no-repeat'}
            resizeMode={select.backgroundResizeMode}
            style={{borderRadius: this.styles.root.borderRadius}}
          ></BackgroundComponent>) : null }
          {this._showSkeleton && (this.state.props.displayValue || props.placeholder)? this.renderSkeletonForText() : <Text
            style={[this.styles.text,
              this.state.props.displayValue ? {} : {color: this.styles.placeholderText.color}]}
            ref={(ref) => {
              this.widgetRef = ref;
            }}
            {...this.getTestPropsForInput()}
            onPress={this.onPress.bind(this)}
            importantForAccessibility='no'>
            {this.state.props.displayValue || props.placeholder || ' '}
          </Text>}
          <WmButton
            styles={this._showSkeleton ? this.styles.arrowButtonSkeleton.root : this.styles.arrowButton}
            iconclass={'wi wi-keyboard-arrow-down'}
            onTap={this.onPress.bind(this)}
            hint={props?.hint}
            accessible={false}
          />
      </View>
    );
  }

  isSelected(item: any) {
    const val = this.state.props.datafield === 'All Fields'  ? item.dataObject : item.datafield;
    return this.state.props.datavalue === val;
  }

  onItemSelect(item: any, isPlaceholder?: boolean) {
    this.isDefaultValue = false;
    this.onChange(isPlaceholder ? '' : this.state.props.datafield === 'All Fields'  ? item.dataObject : item.datafield);
    this.hide();
  }

  renderSelectItem(item: any, index: number, isPlaceholder: boolean, isLast: boolean) {
    let selected = this.isSelected(item);
    return (
      <Tappable {...this.getTestPropsForAction('selectitem'+index)} onTap={this.onItemSelect.bind(this, item, isPlaceholder)} 
      accessibilityProps={{...getAccessibilityProps(
        AccessibilityWidgetType.SELECT,
        {...this.props, expanded: this.state.isOpened}
      )}}
      disableTouchEffect={this.state.props.disabletoucheffect}>
        <View style={[this.styles.selectItem, isLast ?  this.styles.lastSelectItem  : null, selected ? this.styles.selectedItem : null ]}>
          <Text  {...this.getTestPropsForLabel('label'+index)} style={[this.styles.selectItemText,  {color: isPlaceholder ? this.styles.placeholderText.color : selected ? this.styles.selectedItemText.color : this.styles.selectItemText.color}]}>
            {isPlaceholder ? this.state.props.placeholder : (item.displayexp || item.displayfield)}
          </Text>
          <WmIcon id={this.getTestId('checkicon' + index)} iconclass='wi wi-check' styles={this.theme.mergeStyle(this.styles.checkIcon, {
            root: {
              opacity: !isPlaceholder && selected ?  1 : 0
            }
          })}></WmIcon>
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
    let isDropdown = this.state.props.classname?.includes('select-dropdown');
    const styles = this.theme.mergeStyle( this.styles,this.theme.getStyle('select-dropdown'));
    if (isDropdown && this.state.selectWidth) {
        styles.modalContent.width = this.styles.dropdown.width || this.state.selectWidth;
    }

    const SafeAreaWrapper = () => {
      const insets = useSafeAreaInsets();
      this.setSafeAreaInsets(insets);
      return null;
    };

    return (
      <>
        <SafeAreaWrapper />
        <View 
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            this.updateState({ selectWidth: width } as WmSelectState);
            this.handleLayout(event);
          }}
          style={[this.styles.rootWrapper]}>
          {this._background}
          {this.renderSelect()}
          {this.state.isOpened && this.state.positionReady ? (
          <ModalConsumer>
            {(modalService: ModalService) => {
              const items = this.state.dataItems;
              modalService.showModal(
                this.prepareModalOptions(
                  <ScrollView style={ isDropdown ?[{width : this.state.selectWidth},this.styles.dropdown]:{width: '100%', maxHeight: Dimensions.get('window').height - 64 - (StatusBar.currentHeight || 0)}} 
                  contentContainerStyle={this.styles.dropDownContent}>
                    {props.placeholder ?
                      <View key={props.name + '_placeholder'} style={this.styles.placeholderText}>
                        {this.renderSelectItem({}, 0, true, false)}
                      </View>
                      : null}
                      {items && items.map((item: any, index: number) => (
                        <View key={item.key}>
                          {this.renderSelectItem(item, index, false, index === items.length - 1)}
                        </View>
                      ))}
                  </ScrollView>,
                  isDropdown?styles:this.styles,
                  modalService
                )
              );
              return null;
            }}
          </ModalConsumer>
        ) : null}
      </View>
      </>
    );
  }
}
