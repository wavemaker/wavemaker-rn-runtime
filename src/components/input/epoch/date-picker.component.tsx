import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { DatePickerModalContent } from 'react-native-paper-dates';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { ModalConsumer, ModalService, ModalOptions } from '@wavemaker/app-rn-runtime/core/modal.service';
import { isEqual } from 'lodash-es';

export class DatePickerProps {
    value?: Date = new Date();
    minimumDate?: Date = null as any;
    maximumDate?: Date = null as any;
    onDateChange?: Function = null as any;
    onDismiss?: Function = null as any;
}

export class DatePickerState {
    public value?: Date = null as any;
    public modalOptions = null as any;
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
        backgroundColor: '#ffffff'
    }
};

export default class DatePickerComponnent extends React.Component<DatePickerProps, DatePickerState, any> {
    constructor(props: DatePickerProps) {
        super(props);
        this.state = {
            value: props.value
        } as DatePickerState;
    }

    prepareModalOptions(content: ReactNode) {
        const o = {} as ModalOptions;
        o.content = content;
        o.modalStyle = styles.modal;
        o.centered = true;
        o.contentStyle = styles.content;
        return o;
    }

    close(modalService: ModalService) {
        modalService.hideModal(this.state.modalOptions);
        this.props.onDismiss && this.props.onDismiss();
    }

    render() {
        return (
        <ModalConsumer>
            {(modalService: ModalService) => {
                modalService.showModal(this.prepareModalOptions(
                    (<View style={styles.content}>
                        <DatePickerModalContent
                            mode="single"
                            date={this.props.value}
                            onDismiss={() => this.close(modalService)}
                            onConfirm={(params) => {
                                if (this.props.onDateChange) {
                                    if (!isEqual(this.props.value, params.date)) {
                                        this.props.onDateChange(params.date);
                                    }
                                }
                                this.close(modalService);
                            }}
                            validRange= {{
                                startDate: this.props.minimumDate,
                                endDate: this.props.maximumDate
                            }}/>
                    </View>)
                ));
                return null;
            }}
        </ModalConsumer>);
    }
}