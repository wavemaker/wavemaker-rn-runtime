import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCardStyles = BaseStyles & {
    heading: AllStyle,
    cardIcon: WmIconStyles,
    title: WmLabelStyles,
    subheading: WmLabelStyles,
    picture: WmPictureStyles
};

export const DEFAULT_CLASS = 'app-card';
export const DEFAULT_STYLES: WmCardStyles = {
    root: {
        width: '100%',
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 5
    },
    text: {},
    cardIcon: {
        root: {
            marginTop: 4,
            marginRight: 8
        }
    } as WmIconStyles,
    heading : {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: ThemeVariables.cardHeaderBgColor,
        flexDirection: 'row'
    },
    title: {
        root: {
            fontSize: 16,
            lineHeight: 24,
            color: ThemeVariables.cardTitleColor
        }
    } as WmLabelStyles,
    subheading: {
        root: {
            fontSize: 12,
            lineHeight: 18,
            color: ThemeVariables.cardSubTitleColor
        }
    } as WmLabelStyles,
    picture: {
        root : {
            width: '100%'
        }
    } as WmPictureStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);