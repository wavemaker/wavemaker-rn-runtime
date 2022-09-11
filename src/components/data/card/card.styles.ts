import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';

export type WmCardStyles = BaseStyles & {
    heading: AllStyle,
    cardIcon: WmIconStyles,
    title: WmLabelStyles,
    subheading: WmLabelStyles,
    picture: WmPictureStyles
};

export const DEFAULT_CLASS = 'app-card';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCardStyles = defineStyles({
        root: {
            width: '100%',
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
            backgroundColor: themeVariables.cardHeaderBgColor,
            flexDirection: 'row',
            alignContent: 'center',
            width: '100%'
        },
        title: {
            text: {
                fontSize: 16,
                lineHeight: 24,
                color: themeVariables.cardTitleColor
            }
        } as WmLabelStyles,
        subheading: {
            text: {
                fontSize: 12,
                lineHeight: 18,
                color: themeVariables.cardSubTitleColor
            }
        } as WmLabelStyles,
        picture: {
            root : {
                width: '100%'
            }
        } as WmPictureStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});