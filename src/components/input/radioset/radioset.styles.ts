import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmRadiosetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  radioHead: AllStyle;
  radioLabel: AllStyle;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-radioset';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmRadiosetStyles = defineStyles({
      root: {
        color: themeVariables.checkedColor
      },
      text: {},
      groupHeaderTitle: {
        backgroundColor: themeVariables.groupHeadingBgColor,
        fontSize: 16,
        paddingLeft: 8,
        paddingRight: 8,
        lineHeight: 40,
        fontFamily: themeVariables.baseFont
      } as AllStyle,
      radioHead: {
        flexDirection: 'row',
        alignContent: 'center',
      } as AllStyle,
      radioLabel: {
          alignSelf: 'center',
          fontFamily: themeVariables.baseFont,
          fontSize: 16,
          color: themeVariables.labelDefaultColor
      } as AllStyle,
      skeleton: {
        root: {
          width: '100%',
          height: 16,
          borderRadius: 4
        }
      } as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      color: themeVariables.checkedDisabledColor,
      opacity: 0.8
    }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
