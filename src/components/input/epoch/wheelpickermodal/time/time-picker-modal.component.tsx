import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import WmWheelTimePicker from '../../wheel-time-picker.component';
import WmButton from '../../../../basic/button/button.component';
import {
  DEFAULT_CLASS,
  WmDateTimePickerModalStyles,
} from '../styles/datetime-picker-modal.styles';
import {
  BaseComponent,
  BaseComponentState,
} from '@wavemaker/app-rn-runtime/core/base.component';
import WmTimePickerModalProps from './time-picker-modal.props';

export class WmTimePickerModalState extends BaseComponentState<WmTimePickerModalProps> {
  selectedTime: Date = new Date();
}

export class WmTimePickerModal extends BaseComponent<
  WmTimePickerModalProps,
  WmTimePickerModalState,
  WmDateTimePickerModalStyles
> {
  constructor(props: WmTimePickerModalProps) {
    super(props, DEFAULT_CLASS, new WmTimePickerModalProps());
  }

  renderWidget(props: WmTimePickerModalProps) {
    const { is24Hour, isVisible, onClose, onCancel, onSelect, timeheadertitle, timeconfirmationtitle, timecanceltitle } = this.props;
    const { selectedTime } = this.state;
    const { styles } = this;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        onDismiss={onClose}
      >
        <View style={styles.root} onLayout={(event) => this.handleLayout(event)}>
          <TouchableWithoutFeedback style={styles.flex1} onPress={onClose}>
            <View style={styles.flex1} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.header}>{timeheadertitle}</Text>
            <WmWheelTimePicker
              selectedTime={this.props.selectedDateTime || selectedTime}
              is24Hour={is24Hour}
              onTimeChange={(time) => {
                this.setState({ selectedTime: time });
              }}
            />
            <View style={styles.buttonWrapper}>
              <WmButton
                styles={styles.cancelBtn}
                caption={timecanceltitle}
                onTap={onCancel}
              />
              <WmButton
                styles={styles.selectBtn}
                caption={timeconfirmationtitle}
                onTap={() => onSelect?.(selectedTime || this.props.selectedDateTime || new Date().setSeconds(0))}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default WmTimePickerModal;
