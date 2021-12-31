import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';

export type WmWizardStyles = BaseStyles & {
  wizardHeader: AllStyle,
  wizardBody: AllStyle,
  wizardFooter: AllStyle,
  wizardActions: WmButtonStyles,
  stepTitle: AllStyle,
  buttonWrapper: AllStyle,
  step: AllStyle,
  nextButton: WmButtonStyles,
  doneButton: WmButtonStyles,
  stepIcon: WmIconStyles,
  skipLink: WmAnchorStyles,
  activeStep: AllStyle,
  doneStep: AllStyle,
  headerWrapper: AllStyle,
  stepWrapper: AllStyle,
  stepConnector: AllStyle,
  stepCounter: AllStyle
};

export const DEFAULT_CLASS = 'app-wizard';
export const DEFAULT_STYLES: WmWizardStyles = defineStyles({
    root: {
      flexDirection: 'column',
      backgroundColor: ThemeVariables.wizardBackgroundColor,
      display: 'flex',
      maxHeight: '100%'
    },
    text: {},
    activeStep:{
        backgroundColor: ThemeVariables.wizardStepActiveColor,
        color: ThemeVariables.defaultColorF
    },
    doneStep: {
      backgroundColor: ThemeVariables.wizardStepDoneColor,
      color: ThemeVariables.defaultColorF
    },
    wizardHeader: {
      height: 80,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    stepWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20
    },
    headerWrapper: {
      flex: 1,
      paddingRight: 12,
      paddingLeft: 12
    },
    wizardBody: {
      alignSelf: 'flex-start',
      paddingTop: 10,
      flex: 1,
      width: '100%',
      borderWidth: 0,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: ThemeVariables.wizardBorderColor
    },
    wizardFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 12
    },
    buttonWrapper: {
      flexDirection: 'row',
    },
    stepTitle: {
        textTransform: 'capitalize',
        fontSize: 12,
        color: ThemeVariables.defaultColorA
    },
    step: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 37,
      backgroundColor: ThemeVariables.wizardBackgroundColor,
      height: 37,
      borderWidth: 1,
      borderRadius: 18.5,
      marginBottom: 10,
      color: ThemeVariables.wizardStepColor,
      borderColor: ThemeVariables.wizardStepColor
    },
    wizardActions: {
      root: {
        marginRight: 8
      },
      text : {
        textTransform: 'capitalize',
        fontSize: 14
      }
    } as WmButtonStyles,
    nextButton: {
      root: {
        marginRight: 0,
        backgroundColor: ThemeVariables.wizardNextBtnColor,
        borderColor: ThemeVariables.wizardNextBtnColor
      }
    } as WmButtonStyles,
    doneButton: {
      root: {
        marginRight: 0,
        backgroundColor: ThemeVariables.wizardDoneBtnColor
      }
    } as WmButtonStyles,
    stepIcon: {
        root: {
          alignSelf: 'center',
          justifyContent: 'center'
        },
        text: {
          color: ThemeVariables.defaultColorF,
          fontSize: 15
        }
    } as WmIconStyles,
    skipLink: {
      root: {
       padding: 8,
       alignSelf: 'flex-end'
      },
    } as WmAnchorStyles,
    stepConnector: {
      backgroundColor: ThemeVariables.wizardStepConnectorColor,
      position: 'absolute',
      top: 17.5,
      zIndex: 10,
      height: 2
    },
    stepCounter: {
      fontSize: 15,
      color: ThemeVariables.primaryColor
    }
} as WmWizardStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
