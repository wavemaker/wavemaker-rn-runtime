import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import WmWheelDatePicker from '../../wheel-date-picker.component';
import WmButton from '../../../../basic/button/button.component';
import {
  DEFAULT_CLASS,
  WmDateTimePickerModalStyles,
} from '../styles/datetime-picker-modal.styles';
import {
  BaseComponent,
  BaseComponentState,
} from '@wavemaker/app-rn-runtime/core/base.component';
import WmDatePickerModalProps from './date-picker-modal.props';

export class WmDatePickerModalState extends BaseComponentState<WmDatePickerModalProps> {
  selectedDate: Date = new Date();
}

export class WmDatePickerModal extends BaseComponent<
  WmDatePickerModalProps,
  WmDatePickerModalState,
  WmDateTimePickerModalStyles
> {
  constructor(props: WmDatePickerModalProps) {
    super(props, DEFAULT_CLASS, new WmDatePickerModalProps());
  }

  renderWidget() {
    const { isVisible, minDate, maxDate, onClose, onCancel, onSelect } = this.props;
    const { selectedDate } = this.state;
    const { styles } = this;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        onDismiss={onClose}
      >
        <View style={styles.root}>
          <TouchableWithoutFeedback style={styles.flex1} onPress={onClose}>
            <View style={styles.flex1} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.header}>Select Date</Text>
            <WmWheelDatePicker
              minDate={minDate}
              maxDate={maxDate}
              selectedDate={this.props.selectedDate || selectedDate}
              onDateChange={(date) => {
                this.setState({ selectedDate: date });
              }}
            />
            <View style={styles.buttonWrapper}>
              <WmButton
                styles={styles.cancelBtn}
                caption="Cancel"
                onTap={onCancel}
              />
              <WmButton
                styles={styles.selectBtn}
                caption="Select"
                onTap={() => onSelect?.(selectedDate || this.props.selectedDate || new Date())}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default WmDatePickerModal;
