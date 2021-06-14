import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmListStyles = BaseStyles & {
    heading: AllStyle,
    listIcon: WmIconStyles,
    loadingIcon: WmIconStyles,
    title: WmLabelStyles,
    subheading: WmLabelStyles,
    emptyMessage: WmLabelStyles,
    selectedItem: AllStyle
};

export const DEFAULT_CLASS = 'app-list';
export const DEFAULT_STYLES: WmListStyles = {
    root: {},
    text: {},
    listIcon: {
        root: {
            marginTop: 4,
            marginRight: 8
        }
    } as WmIconStyles,
    loadingIcon: {
        root: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            fontSize: 16
        },
        text: {
            color: ThemeVariables.listSubTitleColor
        }
    } as WmIconStyles,
    heading : {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12
    },
    title: {
        root: {
            fontSize: 16,
            lineHeight: 24,
            color: ThemeVariables.listTitleColor
        }
    } as WmLabelStyles,
    subheading: {
        root: {
            fontSize: 12,
            lineHeight: 18,
            color: ThemeVariables.listSubTitleColor
        }
    } as WmLabelStyles,
    emptyMessage: {
        root: {
            flex: 1,
            alignSelf: 'center',
            fontSize: 16,
            lineHeight: 18,
            color: ThemeVariables.listSubTitleColor
        }
    } as WmLabelStyles,
    selectedItem : {
        borderColor: ThemeVariables.selectedItemBorderColor,
        borderWidth: 1,
        borderStyle: 'solid'
    } as AllStyle
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);