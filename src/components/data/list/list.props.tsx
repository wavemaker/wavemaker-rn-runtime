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
    disableitem = ($item: any, $index: any) => false;
    direction: 'row' | 'column' = 'column';
    groupby: string = null as any;
    match: string = null as any;
    orderby: string = null as any;
    dateformat: string = null as any;
    itemclass: ($item: any, $index: any) => string = null as any;
}
