import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmProgressCircleStyles } from '@wavemaker/app-rn-runtime/components/basic/progress-circle/progress-circle.styles';
import { WmPopoverStyles } from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.styles';
import { WmLabelStyles } from '@wavemaker/app-rn-runtime/components/basic/label/label.styles';
import { TextStyle } from 'react-native';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmWizardStyles = BaseStyles & {
  wizardHeader: AllStyle,
  wizardBody: AllStyle,
  wizardFooter: AllStyle,
  wizardActions: WmButtonStyles,
  stepTitleWrapper: AllStyle,
  stepTitle: AllStyle,
  stepSubTitle: AllStyle,
  buttonWrapper: AllStyle,
  step: AllStyle,
  nextButton: WmButtonStyles,
  doneButton: WmButtonStyles,
  prevButton: WmButtonStyles,
  cancelButton: WmButtonStyles,
  stepIcon: WmIconStyles,
  skipLink: WmAnchorStyles,
  activeStep: AllStyle,
  doneStep: AllStyle,
  headerWrapper: AllStyle,
  stepWrapper: AllStyle,
  stepConnector: AllStyle,
  numberTextStepConnector: AllStyle,
  activeStepCounter: TextStyle,
  stepCounter: AllStyle,
  progressCircle: WmProgressCircleStyles,
  popover: WmPopoverStyles,
  stepMenu: AllStyle,
  activeStepMenu: AllStyle,
  stepMenuLabel: WmLabelStyles,
  stepMenuActiveLabel: WmLabelStyles
  stepMenuIcon: WmIconStyles,
  stepMenuActiveIcon: WmIconStyles,
  stepDot: AllStyle,
  activeStepDot: AllStyle,
  skeleton: WmSkeletonStyles
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
        width: '100%',
        borderWidth: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: themeVariables.wizardBorderColor
      },
      wizardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 12,
        width: '100%',
      },
      buttonWrapper: {
        flexDirection: 'row',
      },
      stepTitleWrapper: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column'
      },
      stepTitle: {
          textTransform: 'capitalize',
          fontSize: 12,
          color: themeVariables.wizardStepTitleColor
      },
      stepSubTitle:{
        fontSize: 10,
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
          paddingRight: 8,
          backgroundColor: themeVariables.wizardNextBtnColor,
          borderColor: themeVariables.wizardActiveStepColor
        },
        text:{
          color: themeVariables.wizardActiveStepColor
        }
      } as WmButtonStyles,
      prevButton: {
        root: {
          paddingLeft: 16
        },
        icon: {
          icon:{
          paddingRight: 0,
          paddingLeft: 0
          }
        } as WmIconStyles
      } as WmButtonStyles,
      cancelButton: {
        root:{
          minHeight: 46
        }
      } as WmButtonStyles,
      doneButton: {
        root: {
          marginRight: 0,
          backgroundColor: themeVariables.wizardDoneBtnColor,
          borderColor: themeVariables.wizardActiveStepColor
        },
        text:{
          color: themeVariables.wizardActiveStepColor
        },
        icon: {
          text: {
            fontSize: 12,
            color: themeVariables.wizardActiveStepColor
          }
        }
      } as WmButtonStyles,
      stepIcon: {
          root: {
            alignSelf: 'center',
            justifyContent: 'center',
            paddingLeft: 8
          },
          text: {
            color: themeVariables.wizardStepIconColor,
            fontSize: 15
          },
          icon: {
            color: themeVariables.wizardStepIconColor
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
      activeStepCounter: {
        color: themeVariables.wizardActiveStepColor
      },
      skeleton: {  
        root: {
        }
      } as WmSkeletonStyles,
      stepCounter: {
        fontSize: 15,
        color: themeVariables.wizardStepColor
      },
      progressCircle:{} as WmProgressCircleStyles,
      popover:{} as WmPopoverStyles,
      stepMenu:{},
      activeStepMenu:{},
      stepMenuLabel: {} as WmLabelStyles,
      stepMenuActiveLabel: {} as WmLabelStyles,
      stepMenuIcon: {} as WmIconStyles,
      stepMenuActiveIcon: {} as WmIconStyles,
      stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: themeVariables.wizardStepColor
      },
      activeStepDot: {
        backgroundColor: themeVariables.wizardActiveStepColor
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
    stepTitleWrapper: {
      flex: 0
    },
    stepTitle: {
      padding: 5
    },
  } as WmWizardStyles);
  addStyle('stepper-basic', '', {
    step: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        backgroundColor: themeVariables.wizardBackgroundColor,
        height: 2,
        borderWidth: 1,
        borderRadius: 5,
        color: themeVariables.wizardStepColor,
        borderColor: themeVariables.wizardStepColor
      },
    activeStep:{
      backgroundColor: themeVariables.wizardStepActiveColor,
      borderColor: themeVariables.wizardStepActiveColor,
      color: themeVariables.wizardActiveStepColor,
      height: 2
    },
     doneStep: {
        backgroundColor: themeVariables.wizardStepDoneColor,
        color: themeVariables.wizardDoneStepColor,
        borderColor: themeVariables.wizardStepDoneColor,
        height: 2
      },
  } as WmWizardStyles);
  addStyle('segment-steppe', '', {
    step: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        backgroundColor: themeVariables.wizardBackgroundColor,
        height: 2,
        borderWidth: 1,
        borderRadius: 5,
        color: themeVariables.wizardStepColor,
        borderColor: themeVariables.wizardStepColor
      },
  } as WmWizardStyles);
  addStyle('progress-circle-header', '', {
    stepWrapper: {
      paddingBottom: 4,
      flexDirection: 'row',
      alignItems: 'center'
    },
    wizardHeader: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: themeVariables.wizardBackgroundColor,
      height: 120,
      borderRadius: 30
    },
    stepSubTitle:{
      fontSize: 12,
      paddingHorizontal: 5
    },
    headerWrapper: {
      flex: 1
    },
    stepTitleWrapper: {
      flex: 2
    },
    stepTitle: {
      fontSize: 16,
      paddingHorizontal: 5
    },
    progressCircle:{
      root: { 
        height: 60, 
        width: 60 
      }, 
      text: {},
      progressValue:{
        height: 8
      }
    },
    popover:{
      popover:{
        width: 160,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: themeVariables.menuBackgroundColor,
        minHeight:160,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28  
      },
      popoverContent: {
        root:{
          //@ts-ignore
          flex: undefined
        }
      },
      modalContent:{
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28
      }
    } as WmPopoverStyles,
    stepMenu:{
      flexDirection: 'row', 
      padding: 14, 
      alignItems: 'center', 
      justifyContent:'flex-start'
    },
    activeStepMenu:{},
    stepMenuLabel:{
      text:{
        color:themeVariables.menuItemTextColor
      }
    },
    stepMenuActiveLabel:{
      text:{
        color: themeVariables.primaryColor
      }
    },
    stepMenuIcon: {
      root:{
        paddingRight: 4
      },
      text:{
        color:themeVariables.menuItemTextColor
      }
    },
    stepMenuActiveIcon:{
      root:{
        paddingRight: 4
      },
      text:{
        color: themeVariables.primaryColor
      }
    }
  } as WmWizardStyles);
  addStyle('dottedstepper', '', {
    step: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 37,
      height: 37,
      borderWidth: 2,
      borderRadius: 18.5,
      backgroundColor: themeVariables.wizardBackgroundColor,
      borderColor: themeVariables.wizardStepColor
    }
  } as WmWizardStyles);
  addStyle('dottedstepper-vertical', '', {
    wizardHeader: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    stepWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: 56
    },
    stepTitleWrapper: {
      marginLeft: 12,
      flex: 0,
      justifyContent: 'flex-start',
      flexDirection: 'column',
      minWidth: 120,
      flexShrink: 0
    },
    stepConnector: {
      width: 2,
      borderStyle: 'dotted',
      borderWidth: 1,
      backgroundColor: 'transparent',
      borderColor: themeVariables.wizardStepConnectorColor
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
