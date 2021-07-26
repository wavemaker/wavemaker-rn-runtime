import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
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
export const DEFAULT_STYLES: WmWizardStyles = {
    root: {
      flexDirection: 'column',
      backgroundColor: ThemeVariables.wizardBackgroundColor
    },
    text: {},
    activeStep:{
        color: ThemeVariables.wizardStepActiveColor
    },
    doneStep: {
      color: ThemeVariables.wizardStepDoneColor
    },
    wizardHeader: {
      height: 80,
      paddingTop: 16,
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
      paddingTop: 10
    },
    wizardFooter: {
      flexDirection: 'row',
      padding: 12
    },
    buttonWrapper: {
      flexDirection: 'row',
    },
    stepTitle: {
        textTransform: 'uppercase'
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
      color: ThemeVariables.wizardStepColor
    },
    wizardActions: {
      text : {
        textTransform: 'capitalize',
        fontSize: 14
      }
    } as WmButtonStyles,
    nextButton: {
      text: {
        color: ThemeVariables.wizardNextBtnColor
      },
      icon: {
        text: {
          color: ThemeVariables.wizardNextBtnColor
        }
      }
    } as WmButtonStyles,
    doneButton: {
      text: {
        color: ThemeVariables.wizardDoneBtnColor
      },
      icon: {
        text: {
          color: ThemeVariables.wizardDoneBtnColor
        }
      }
    } as WmButtonStyles,
    stepIcon: {
        root: {
          alignSelf: 'center',
          justifyContent: 'center'
        },
        text: {
          fontSize: 15
        }
    } as WmIconStyles,
    skipLink: {
      root: {
       padding: 8
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
      color: ThemeVariables.wizardStepCounerColor
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
