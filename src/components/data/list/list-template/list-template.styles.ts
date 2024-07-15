import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmListTemplateStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-list-template';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmListTemplateStyles = defineStyles<WmListTemplateStyles>({
        root: {
            backgroundColor: themeVariables.listHeaderBgColor,
        },
        text: {},
        skeleton: {
            root: {
                backgroundColor: themeVariables.lightGrayColor,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 16,
                paddingBottom: 16,
                flex: 1
            }
        } as any as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('list-card-template', '', {
        root : {
            borderBottomWidth: 0,
            // marginLeft: 35,
        }
    } as WmListTemplateStyles);
    addStyle('horizontal-list-template', '', {
        root : {}
    } as WmListTemplateStyles);
    addStyle('vertical-list-template', '', {
        root : {
        }
    } as WmListTemplateStyles);
});