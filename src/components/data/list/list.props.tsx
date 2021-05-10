import React from 'react';
import { BaseProps } from '@wavemaker/rn-runtime/core/base.component';
import { View } from 'react-native';

export default class WmListProps extends BaseProps {
    dataset = [] as any;
    renderItem: any = () => (<View/>);
}