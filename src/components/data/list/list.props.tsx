import React from 'react';
import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { View } from 'react-native';

export default class WmListProps extends BaseProps {
    formRef: any;
    iconclass: string = null as any;
    deferload = false;
    ondemandmessage = 'Load More';
    title: string = null as any;
    subheading: string = null as any;
    dataset = [] as any;
    maxnumberofitems = 50;
    children? = null as any;
    renderItem: any = () => (<View />);
    loadingicon: string = null as any;
    loadingdatamsg = 'Loading...';
    multiselect = false;
    nodatamessage = 'No data found';
    loadingdata = false;
    selectfirstitem = false;
    selectionlimit = -1;
    disableitem: Function | boolean = ($item: any, $index: any) => false;
    itemkey?: ($item: any, $index: any) => any = null as any;
    direction: 'horizontal' | 'vertical' = 'vertical';
    groupby: string = null as any;
    match: string = null as any;
    orderby: string = null as any;
    dateformat: string = null as any;
    selecteditem = null as any;
    navigation: 'Scroll' | 'On-Demand' | 'None' = 'None';
    itemclass: ($item: any, $index: any) => string = null as any;
    getNextPageData: ($event: any, $list: any, page: number) => Promise<any> = null as any;
    pagesize = 20;
    itemsperrow = {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
    };
    numberofskeletonitems?: number | string;
    hidehorizontalscrollbar?: boolean = false;
    triggeronrenderwhenhidden?: boolean = true;
}
