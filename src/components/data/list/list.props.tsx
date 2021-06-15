import React from 'react';
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { View } from 'react-native';

export default class WmListProps extends BaseProps {
    iconclass: string = null as any;
    title: string = null as any;
    subheading: string = null as any;
    dataset = [] as any;
    renderItem: any = () => (<View/>);
    loadingicon='fa fa-circle-o-notch fa-pulse';
    loadingdatamsg = 'Loading...';
    nodatamessage = 'No data found';
    loadingdata = false;
    selectfirstitem = false;
    disableitem = false;
}