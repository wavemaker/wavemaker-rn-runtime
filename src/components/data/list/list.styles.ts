import { TextStyle, ViewStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmListStyles = BaseStyles & {
    heading: AllStyle,
    groupHeading: TextStyle,
    listIcon: WmIconStyles,
    loadingIcon: WmIconStyles,
    title: WmLabelStyles,
    subheading: WmLabelStyles,
    emptyMessage: WmLabelStyles,
    item: AllStyle,
    selectedItem: AllStyle
};

export const DEFAULT_CLASS = 'app-list';
export const DEFAULT_STYLES: WmListStyles = defineStyles({
    root: {},
    text: {},
    listIcon: {
        root: {
            marginTop: 4,
            marginRight: 8
        }
    } as WmIconStyles,
    groupHeading: {
        backgroundColor: ThemeVariables.groupHeadingBgColor,
        fontSize: 16,
        paddingLeft: 8,
        paddingRight: 8,
        lineHeight: 40,
        fontFamily: ThemeVariables.baseFont
    },
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
        padding: 8,
        backgroundColor: ThemeVariables.listHeaderBgColor
    },
    title: {
        text: {
            color: ThemeVariables.listTitleColor,
            fontSize: 16,
            lineHeight: 24,
        }
    } as WmLabelStyles,
    subheading: {
        text: {
            fontSize: 12,
            lineHeight: 16,
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
    item: {
        ...BASE_THEME.getStyle('elevate1').root,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: ThemeVariables.itemBgColor,
        borderRadius: 6,
        marginBottom: 6,
        borderBottomWidth: 0,
        borderBottomColor: ThemeVariables.listDividerColor,
        borderStyle: 'solid',
    },
    selectedItem : {} as AllStyle
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

BASE_THEME.addStyle('app-list-dense', '', {
    item: {
        marginBottom: 0,
        borderRadius: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    } as ViewStyle
} as WmListStyles);
