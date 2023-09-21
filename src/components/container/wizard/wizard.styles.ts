import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
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
  numberTextStepConnector: AllStyle,
  stepCounter: AllStyle
};

export const DEFAULT_CLASS = 'app-wizard';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmWizardStyles = defineStyles({
      root: {
        flexDirection: 'column',
        backgroundColor: themeVariables.wizardBackgroundColor,
        display: 'flex',
        minHeight: 240
      },
      text: {},
      activeStep:{
          backgroundColor: themeVariables.wizardStepActiveColor,
          borderColor: themeVariables.wizardStepActiveColor,
          color: themeVariables.wizardActiveStepColor
      },
      doneStep: {
        backgroundColor: themeVariables.wizardStepDoneColor,
        color: themeVariables.wizardDoneStepColor,
        borderColor: themeVariables.wizardStepDoneColor
      },
      wizardHeader: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
      },
      stepWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20
      },
      headerWrapper: {
        flex: 1
      },
      wizardBody: {
        alignSelf: 'flex-start',
        paddingTop: 10,
        flex: 1,
        width: '100%',
        borderWidth: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: themeVariables.wizardBorderColor
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
          color: themeVariables.wizardStepTitleColor
      },
      step: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 37,
        backgroundColor: themeVariables.wizardBackgroundColor,
        height: 37,
        borderWidth: 1,
        borderRadius: 18.5,
        color: themeVariables.wizardStepColor,
        borderColor: themeVariables.wizardStepColor
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
          backgroundColor: themeVariables.wizardNextBtnColor,
          borderColor: themeVariables.wizardNextBtnColor
        }
      } as WmButtonStyles,
      doneButton: {
        root: {
          marginRight: 0,
          backgroundColor: themeVariables.wizardDoneBtnColor
        },
        icon: {
          text: {
            fontSize: 12
          }
        }
      } as WmButtonStyles,
      stepIcon: {
          root: {
            alignSelf: 'center',
            justifyContent: 'center'
          },
          text: {
            color: themeVariables.wizardStepIconColor,
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
        backgroundColor: themeVariables.wizardStepConnectorColor,
        position: 'absolute',
        top: 17.5,
        zIndex: 10,
        height: 2
      },
      numberTextStepConnector: {
       display: 'none'
      },
      stepCounter: {
        fontSize: 15,
        color: themeVariables.wizardStepColor
      }
  } as WmWizardStyles);

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('number-text-inline', '', {
    stepConnector: {
      display: 'none'
    },
    numberTextStepConnector: {
      backgroundColor: themeVariables.wizardStepConnectorColor,
      height: 2,
      display: 'flex'
    },
    stepWrapper: {
      flexDirection: 'row'
    },
    wizardHeader: {
      justifyContent: 'flex-start'
    },
    headerWrapper: {
      flex: -1
    },
    stepTitle: {
      padding: 5
    },
  } as WmWizardStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', {
    wizardActions: {
      icon: {
        root:{
          transform: [{rotateY:'180deg'}]
        }
      },
    },
    nextButton:{
      root: {
        marginRight: 8,
      }
    },
    doneButton:{
      root: {
        marginRight: 8,
      },
      icon:{
        root:{
          transform: [{rotateY:'0deg'}]
        }
      }
    }
  });
});
