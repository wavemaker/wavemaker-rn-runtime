import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmSelectStyles = BaseStyles & {
  arrowButton: WmButtonStyles;
  modal: AllStyle;
  modalContent: AllStyle;
  selectItem: AllStyle;
  lastSelectItem: AllStyle,
  selectItemText: AllStyle;
  dropDownContent: AllStyle;
  disabledText: AllStyle;
  placeholderText: AllStyle;
  invalid: AllStyle;
};

export const DEFAULT_CLASS = 'app-select';
export const DEFAULT_STYLES: WmSelectStyles = defineStyles({
  root: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.inputBorderColor,
    backgroundColor: ThemeVariables.inputBackgroundColor,
    borderRadius: 6,
    minWidth: 160
  },
  invalid: {
    borderBottomColor: ThemeVariables.inputInvalidBorderColor
  },
  text: {
    fontSize: 16,
    fontFamily: ThemeVariables.baseFont,
    flex: 1,
    color: ThemeVariables.inputTextColor
  },
  disabledText: {
    backgroundColor : ThemeVariables.inputDisabledBgColor
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '100%'
  },
  modalContent: {
    backgroundColor: ThemeVariables.selectDropdownBackgroundColor,
    borderRadius: 6,
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.selectBorderColor,
    width: '90%'
  },
  selectItem: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: ThemeVariables.selecttemBorderColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  lastSelectItem: {
    borderBottomWidth: 0
  },
  selectItemText: {
    fontSize: 16,
    fontFamily: ThemeVariables.baseFont,
    color: ThemeVariables.selectItemTextColor
  },
  placeholderText: {
    color: ThemeVariables.inputPlaceholderColor
  },
  dropDownContent: {},
  arrowButton: {
    root: {
      padding: 0,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    }
  } as WmButtonStyles,
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      backgroundColor: ThemeVariables.inputDisabledBgColor
    }
});

