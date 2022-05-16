import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { DatePickerModalContent, TimePickerModal } from 'react-native-paper-dates';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { ModalConsumer, ModalService, ModalOptions } from '@wavemaker/app-rn-runtime/core/modal.service';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export class DatePickerProps {
    mode?: 'date' | 'time' | 'datetime' | string = 'datetime';
    value?: Date = new Date();
    minimumDate?: Date = null as any;
    maximumDate?: Date = null as any;
    onDateChange?: Function = null as any;
    onDismiss?: Function = null as any;
    locale: string = '';
}

export class DatePickerState {
    public value?: Date = null as any;
    public modalOptions: ModalOptions = {} as any;
    public showDatePicker = false;
    public showTimePicker = false;
}

type DatePickerStyles = BaseStyles & {
    modal: AllStyle,
    content: AllStyle
};

const styles: DatePickerStyles = {
    root: {},
    text: {},
    modal: {},
    content: {
        backgroundColor: ThemeVariables.datepickerBgColor
    }
};

export default class DatePickerComponnent extends React.Component<DatePickerProps, DatePickerState, any> {
    timemodal = null as any;
    constructor(props: DatePickerProps) {
        super(props);
        this.state = {
            showDatePicker: this.props.mode !== 'time',
            showTimePicker: this.props.mode === 'time',
            value: props.value,
            modalOptions: {}
        } as DatePickerState;
    }

    prepareModalOptions(content: ReactNode) {
        const o = this.state.modalOptions;
        o.content = content;
        o.modalStyle = styles.modal;
        o.centered = true;
        return o;
    }

    public onDateChange(date: Date | undefined, modalService: ModalService) {
        const old = this.state.value;
        if (old && date) {
            date.setHours(old.getHours());
            date.setMinutes(old.getMinutes());
        }
        if (this.props.mode === 'date') {
            this.setState({
                value : date,
                showDatePicker: false,
                showTimePicker: false
            }, () => {
                this.props.onDateChange && this.props.onDateChange(this.state.value);
                this.close(modalService);
            });
        } else if (date) {
            this.setState({
                value : date,
                showDatePicker: false,
                showTimePicker: true
            }, () => {
                modalService.refresh();
            });
        }
    }

    public onTimeChange(hours: number, minutes: number, modalService: ModalService) {
        const date = this.state.value || new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        this.setState({
            value : date,
            showDatePicker: false,
            showTimePicker: false
        }, () => {
            this.props.onDateChange && this.props.onDateChange(this.state.value);
            this.timemodal = null;
            this.close(modalService);
        });
    }

    prepareTimeModal(modalService: ModalService) {
        if (!this.timemodal) {
            this.timemodal = (
            <View style={{height: 600, marginTop: 600}}>
                {
                    React.createElement(TimePickerModal, {
                        hours : this.props.value?.getHours() || 0,
                        minutes : this.props.value?.getMinutes() || 0,
                        visible : true,
                        onDismiss : () => this.close(modalService),
                        onConfirm: (params) => {
                            this.onTimeChange(params.hours, params.minutes, modalService);
                        }
                    })
                }
            </View>);
        }
        return this.timemodal;
    }

    close(modalService: ModalService) {
        modalService.hideModal(this.state.modalOptions);
        this.props.onDismiss && this.props.onDismiss();
    }

    render() {
        return (this.state.showDatePicker || this.state.showTimePicker) ? (
        <ModalConsumer>
            {(modalService: ModalService) => {
                modalService.showModal(this.prepareModalOptions(
                    (<View style={this.state.showDatePicker ? styles.content: {}}>
                        {this.state.showDatePicker && 
                            React.createElement(DatePickerModalContent, {
                                mode: "single",
                                date: this.props.value,
                                onDismiss: () => this.close(modalService),
                                onConfirm: (params) => this.onDateChange(params.date, modalService),
                                validRange: {
                                    startDate: this.props.minimumDate,
                                    endDate: this.props.maximumDate
                                },
                                locale: this.props.locale})}
                        {this.state.showTimePicker && this.prepareTimeModal(modalService)}
                    </View>)
                ));
                return null;
            }}
        </ModalConsumer>): null;
    }
}
