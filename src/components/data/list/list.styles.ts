import { TextStyle, ViewStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmListStyles = BaseStyles & {
    heading: AllStyle,
    groupHeading: TextStyle,
    listIcon: WmIconStyles,
    loadingIcon: WmIconStyles,
    title: WmLabelStyles,
    subheading: WmLabelStyles,
    emptyMessage: WmLabelStyles,
    onDemandMessage: WmLabelStyles,
    item: AllStyle,
    itemContainer: ViewStyle | ViewStyle[],
    selectedItem: AllStyle,
    selectedIcon: WmIconStyles,
    group: AllStyle,
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-list';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmListStyles = defineStyles({
        root: {},
        listContainer:{},
        text: {},
        listIcon: {
            root: {
                marginTop: 10,
                marginRight: 8
            }
        } as WmIconStyles,
        groupHeading: {
            backgroundColor: themeVariables.groupHeadingBgColor,
            fontSize: 16,
            paddingLeft: 8,
            paddingRight: 8,
            lineHeight: 40,
            fontFamily: themeVariables.baseFont
        },
        loadingIcon: {
            root: {
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                fontSize: 16
            },
            text: {
                color: themeVariables.listSubTitleColor
            }
        } as WmIconStyles,
        heading : {
            padding: 8,
            marginBottom: 6,
            backgroundColor: themeVariables.listHeaderBgColor
        },
        title: {
            text: {
                color: themeVariables.listTitleColor,
                fontSize: 16,
                fontFamily: themeVariables.baseFont,
                lineHeight: 24,
                fontWeight: '400'   
            }
        } as WmLabelStyles,
        subheading: {
            text: {
                fontSize: 14,
                lineHeight: 20,
                fontFamily: themeVariables.baseFont,
                fontWeight: '400',
                color: themeVariables.listSubTitleColor
            }
        } as WmLabelStyles,
        emptyMessage: {
            root: {
                flex: 1,
                alignSelf: 'center',
                fontSize: 16,
                lineHeight: 18,
                color: themeVariables.listSubTitleColor
            }
        } as WmLabelStyles,
        onDemandMessage: {
            root: {
                paddingVertical: 8,
                width: '100%'
            } as ViewStyle,
            text: {
                textAlign: 'center',
                color: themeVariables.listSubTitleColor
            }
        } as WmLabelStyles,
        group: {
            marginBottom: 16,
        },
        item: {
            boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.08)',
            paddingLeft: 4,
            paddingRight: 4,
            flex: 1,
            flexDirection: 'row',
            paddingTop: 4,
            paddingBottom: 4,
            minHeight: 56,
            backgroundColor: themeVariables.itemBgColor,
            borderColor: themeVariables.selectedItemBorderColor,
            borderRadius: 6,
            borderStyle: 'solid',
        },
        itemContainer: {
        },
        selectedItem : {} as AllStyle,
        selectedIcon : {
            root: {
                position: 'absolute',
                right: 0,
                top: 0
            },
            text: {
                color: themeVariables.primaryColor,
                fontSize: 16
            }
        } as WmIconStyles,
        skeleton: {
            root: {
                shadowColor: 'transparent',
                paddingTop: 0,
                paddingBottom: 0,    
                paddingLeft: 0,
                paddingRight: 0,    
            }
        } as any as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);

    addStyle('app-horizontal-list', '', {
        groupHeading: {
            minWidth: 120,
            backgroundColor: themeVariables.groupHeadingBgColor,
        },
        item: {
            marginRight: 6,
            borderColor: themeVariables.selectedItemBorderColor,
        }
    } as WmListStyles);

    addStyle('app-vertical-list', '', {
        item: {
            marginBottom: 6,
            width: '100%',
            borderBottomWidth: 0,
            borderBottomColor: themeVariables.listDividerColor,
        }
    } as any as WmListStyles);

    addStyle('app-horizontal-list-dense', '', {
        item: {
            marginRight: 0,
            borderRadius: 0,
            borderRightWidth: 1,
            borderRightColor: 'rgba(0,0,0,0.05)'
        } as ViewStyle
    } as WmListStyles);

    addStyle('app-list-dense', '', {
        item: {
            marginBottom: 0,
            borderRadius: 0,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.05)'
        } as ViewStyle
    } as WmListStyles);
});
