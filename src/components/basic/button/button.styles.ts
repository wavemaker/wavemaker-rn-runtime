import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../icon/icon.styles';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmButtonStyles = BaseStyles & {
  content: AllStyle,
  badge: AllStyle,
  icon: WmIconStyles,
  skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-button';
const getPrismStyleRules = (themeVariables: any) : { [key: string]: any }=> {
   return {
        "app-button": {
          "container": {
              "height": "auto",
              "width": "100%",
              "flexGrow": 1,
              "justifyContent": "center"
          },
          "root": {
              "position": "relative",
              "backgroundColor": themeVariables.btnBackground,
              "borderWidth": themeVariables.btnBorderWidth,
              "borderStyle": themeVariables.btnBorderStyle,
              "borderColor": themeVariables.btnBorderColor,
              "borderRadius": themeVariables.btnRadius,
              "rippleColor": themeVariables.btnRippleColor,
              "boxShadow": themeVariables.btnShadow,
              "alignSelf": "flex-start",
              "flexDirection": "column",
              "overflow": "hidden",
              "minWidth": themeVariables.btnMinWidth,
              "minHeight": themeVariables.btnHeight,
              
          },
          "content": {
              "display": "flex",
              "flexGrow": 1,
              "flexDirection": "row",
              "alignItems": "center",
              "justifyContent": "center",
              "cursor": "pointer",
              "gap": themeVariables.btnGap,
              "paddingLeft": themeVariables.btnPaddingLeft,
              "paddingRight": themeVariables.btnPaddingRight,
              "paddingBottom": themeVariables.btnPaddingBottom,
              "paddingTop": themeVariables.btnPaddingTop,
          },
          "text": {
              "fontSize": themeVariables.btnFontSize,
              "fontFamily": themeVariables.btnFontFamily,
              "fontWeight": themeVariables.btnFontWeight,
              "lineHeight": themeVariables.btnLineHeight,
              "letterSpacing": themeVariables.btnLetterSpacing,
              "textTransform": themeVariables.btnTextTransform,
              "whiteSpace": "nowrap",
              "color": themeVariables.btnColor
          },
          "text-hidden": {
              "display": "none"
          },
          "content-icon-top": {
              "flexDirection": "column",
              "paddingBottom": themeVariables.btnGap,
              "paddingTop": themeVariables.btnGap,
          },
          "icon": {
              "root": {
                  "padding": 0,
                  "color": themeVariables.btnColor
              },
              "text": {
                  "paddingTop": 0,
                  "paddingRight": 0,
                  "paddingBottom": 0,
                  "paddingLeft": 0,
                  "fontSize": themeVariables.btnIconSize,
                  "minWidth": themeVariables.btnIconSize,
                  "width": themeVariables.btnIconSize,
                  "height": themeVariables.btnIconSize
              },
              "icon": {
                  "padding": 0,
              }
          },
          "skeleton": {
              "root": {
                  "height": themeVariables.btnHeight,
              }
          }
      },
      "btn-text": {
        root: {
            backgroundColor: "transparent",
            borderColor: "transparent",
        },
        content: {
            paddingLeft: themeVariables.space3,
            paddingRight: themeVariables.space3,
            paddingBottom: themeVariables.space2,
            paddingTop: themeVariables.space2,
        }
      },
      "btn-default": {
        "root": {
            "backgroundColor": themeVariables.btnDefaultBackground,
            "borderColor": themeVariables.btnDefaultBorderColor,
        },
        "text": {
            "color": themeVariables.btnDefaultColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnDefaultColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnDefaultOutlinedBackground,
                "borderColor": themeVariables.btnDefaultOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnDefaultOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnDefaultOutlinedColor
                }
            },
        },
        "btn-text": {
            "root": {
                "backgroundColor": "transparent",
                "borderColor": "transparent",
            },
            "text": {
                "color": themeVariables.btnDefaultColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnDefaultColor
                }
            }
        }
      },
      "btn-primary": {
        "root": {
            "backgroundColor": themeVariables.btnPrimaryBackground,
            "borderColor": themeVariables.btnPrimaryBorderColor,
        },
        "text": {
            "color": themeVariables.btnPrimaryColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnPrimaryColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnPrimaryOutlinedBackground,
                "borderColor": themeVariables.btnPrimaryOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnPrimaryOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnPrimaryOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnPrimaryBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnPrimaryBackground
                }
            }
        }
      },
      "btn-secondary": { 
        "root": {
            "backgroundColor": themeVariables.btnSecondaryBackground,
            "borderColor": themeVariables.btnSecondaryBorderColor,
        }, 
        "text": {
            "color": themeVariables.btnSecondaryColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnSecondaryColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnSecondaryOutlinedBackground,
                "borderColor": themeVariables.btnSecondaryOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnSecondaryOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnSecondaryOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnSecondaryBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnSecondaryBackground
                }
            }
        }
      },
      "btn-tertiary": {
        "root": {
            "backgroundColor": themeVariables.btnTertiaryBackground,
            "borderColor": themeVariables.btnTertiaryBorderColor,
        },
        "text": {
            "color": themeVariables.btnTertiaryColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnTertiaryColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnTertiaryOutlinedBackground,
                "borderColor": themeVariables.btnTertiaryOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnTertiaryOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnTertiaryOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnTertiaryBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnTertiaryBackground
                }
            }
        }
      },
      "btn-success": {
        "root": {
            "backgroundColor": themeVariables.btnSuccessBackground,
            "borderColor": themeVariables.btnSuccessBorderColor,
        },
        "text": {
            "color": themeVariables.btnSuccessColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnSuccessColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnSuccessOutlinedBackground,
                "borderColor": themeVariables.btnSuccessOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnSuccessOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnSuccessOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnSuccessBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnSuccessBackground
                }
            }
        }
      },
      "btn-danger": {
        "root": {
            "backgroundColor": themeVariables.btnDangerBackground,
            "borderColor": themeVariables.btnDangerBorderColor,
        },
        "text": {
            "color": themeVariables.btnDangerColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnDangerColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnDangerOutlinedBackground,
                "borderColor": themeVariables.btnDangerOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnDangerOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnDangerOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnDangerBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnDangerBackground
                }
            }
        }
      },
      "btn-error": {
        "root": {
            "backgroundColor": themeVariables.btnDangerBackground,
            "borderColor": themeVariables.btnDangerBorderColor,
        },
        "text": {
            "color": themeVariables.btnDangerColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnDangerColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnDangerOutlinedBackground,
                "borderColor": themeVariables.btnDangerOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnDangerOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnDangerOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnDangerBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnDangerBackground
                }
            }
        }
      },
      "btn-info": {
        "root": {
            "backgroundColor": themeVariables.btnInfoBackground,
            "borderColor": themeVariables.btnInfoBorderColor,
        },
        "text": {
            "color": themeVariables.btnInfoColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnInfoColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnInfoOutlinedBackground,
                "borderColor": themeVariables.btnInfoOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnInfoOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnInfoOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnInfoBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnInfoBackground
                }
            }
        }
      },
      "btn-warning": {
        "root": {
            "backgroundColor": themeVariables.btnWarningBackground,
            "borderColor": themeVariables.btnWarningBorderColor,
        },
        "text": {
            "color": themeVariables.btnWarningColor
        },
        "icon": {
            "root": {
                "color": themeVariables.btnWarningColor
            }
        },
        "btn-outlined": {
            "root": {
                "backgroundColor": themeVariables.btnWarningOutlinedBackground,
                "borderColor": themeVariables.btnWarningOutlinedBorderColor,
            },
            "text": {
                "color": themeVariables.btnWarningOutlinedColor
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnWarningOutlinedColor
                }
            },
        },
        "btn-text": {
            "text": {
                "color": themeVariables.btnWarningBackground
            },
            "icon": {
                "root": {
                    "color": themeVariables.btnWarningBackground
                }
            },
        }
      },
      "btn-xs": {
        "content-icon-top": {
            "paddingBottom": themeVariables.btnXsGap,
            "paddingTop": themeVariables.btnXsGap,
        },
        "root": {
            "borderRadius": themeVariables.btnXsRadius,
            "minHeight": themeVariables.btnXsHeight,
            "minWidth": themeVariables.btnXsMinWidth,
            "skeleton": {
                "root": {
                    "height": themeVariables.btnXsHeight,
                }
            }
        },
        "text": {
            "fontSize": themeVariables.btnXsFontSize,
            "fontFamily": themeVariables.btnXsFontFamily,
            "fontWeight": themeVariables.btnXsFontWeight,
            "lineHeight": themeVariables.btnXsLineHeight,
            "letterSpacing": themeVariables.btnXsLetterSpacing,
        },
        "content": {
            "gap": themeVariables.btnXsGap,
            "paddingLeft": themeVariables.btnXsPaddingLeft,
            "paddingRight": themeVariables.btnXsPaddingRight,
            "paddingBottom": themeVariables.btnXsPaddingBottom,
            "paddingTop": themeVariables.btnXsPaddingTop,
        },
        "icon": {
            "text": {
                "fontSize": themeVariables.btnXsIconSize,
                "minWidth": themeVariables.btnXsIconSize,
                "width": themeVariables.btnXsIconSize,
                "height": themeVariables.btnXsIconSize
            },
        }
      },
      "btn-sm": {
        "content-icon-top": {
            "paddingBottom": themeVariables.btnSmGap,
            "paddingTop": themeVariables.btnSmGap,
        },
        "root": {
            "borderRadius": themeVariables.btnSmRadius,
            "minHeight": themeVariables.btnSmHeight,
            "minWidth": themeVariables.btnSmMinWidth
        },
        "skeleton": {
            "root": {
                "height": themeVariables.btnSmHeight,
            }
        },
        "text": {
            "fontSize": themeVariables.btnSmFontSize,
            "fontFamily": themeVariables.btnSmFontFamily,
            "fontWeight": themeVariables.btnSmFontWeight,
            "lineHeight": themeVariables.btnSmLineHeight,
            "letterSpacing": themeVariables.btnSmLetterSpacing,
        },
        "content": {
            "gap": themeVariables.btnSmGap,
            "paddingLeft": themeVariables.btnSmPaddingLeft,
            "paddingRight": themeVariables.btnSmPaddingRight,
            "paddingBottom": themeVariables.btnSmPaddingBottom,
            "paddingTop": themeVariables.btnSmPaddingTop,
        },
        "icon": {
            "text": {
                "fontSize": themeVariables.btnSmIconSize,
                "minWidth": themeVariables.btnSmIconSize,
                "width": themeVariables.btnSmIconSize,
                "height": themeVariables.btnSmIconSize
            },
        }
      },
      "btn-lg": {
        "content-icon-top": {
            "paddingBottom": themeVariables.btnLgGap,
            "paddingTop": themeVariables.btnLgGap,
        },
        "skeleton": {
            "root": {
                "height": themeVariables.btnLgHeight,
            }
        },
        "root": {
            "borderRadius": themeVariables.btnLgRadius,
            "minHeight": themeVariables.btnLgHeight,
            "minWidth": themeVariables.btnLgMinWidth,
        },
        "text": {
            "fontSize": themeVariables.btnLgFontSize,
            "fontFamily": themeVariables.btnLgFontFamily,
            "fontWeight": themeVariables.btnLgFontWeight,
            "lineHeight": themeVariables.btnLgLineHeight,
            "letterSpacing": themeVariables.btnLgLetterSpacing,
        },
        "content": {
            "gap": themeVariables.btnLgGap,
            "paddingLeft": themeVariables.btnLgPaddingLeft,
            "paddingRight": themeVariables.btnLgPaddingRight,
            "paddingBottom": themeVariables.btnLgPaddingBottom,
            "paddingTop": themeVariables.btnLgPaddingTop,
        },
        "icon": {
            "text": {
                "fontSize": themeVariables.btnLgIconSize,
                "minWidth": themeVariables.btnLgIconSize,
                "width": themeVariables.btnLgIconSize,
                "height": themeVariables.btnLgIconSize,
            },
        }
      },
      "btn-elevated": {
        "root": {
            "box-shadow": themeVariables.btnElevatedShadow,
        },
      },
      "app-button-disabled": {
        "root": {
            "backgroundColor": themeVariables.btnDisabledBackground,
            "borderColor": themeVariables.btnDisabledBorderColor,
            "opacity": themeVariables.btnDisabledOpacity,
            "boxShadow": "none",
            "cursor": "not-allowed",
        },
        "text": {
            "color": themeVariables.btnDisabledColor,
        },
      },
      "btn-disabled": {
        "root": {
            "backgroundColor": themeVariables.btnDisabledBackground,
            "borderColor": themeVariables.btnDisabledBorderColor,
            "opacity": themeVariables.btnDisabledOpacity,
            "boxShadow": "none",
            "cursor": "not-allowed",
        },
        "text": {
            "color": themeVariables.btnDisabledColor,
        },
      },
      "btn-block": {
        "root": {
            "width": "100%",
        }
      },
      "fab-btn": {
        "root": {
            "position": "fixed",
            "bottom": 160,
            "right": 48,
            "width": themeVariables.btnFabWidth,
            "height": themeVariables.btnFabHeight,
            "borderRadius": themeVariables.btnFabBorderRadius,
            "justifyContent": "center",
            "alignItems": "center"
        },
        "text": {
            "marginLeft": 0,
            "marginRight": 0
        },
        "icon": {
            "icon": {
                "fontSize": themeVariables.btnFabFontSize,
            }
        }
      },
      'btn-icon': {
        "content-icon-top": {
            "paddingBottom": 0,
            "paddingTop": 0,
        },
        'root': {
            'borderRadius': themeVariables.btnIconMdRadius,
            'margin': themeVariables.btnIconMdMargin,
            'min-width': themeVariables.btnIconMdWidth,
            'width': themeVariables.btnIconMdWidth,
            'height': themeVariables.btnIconMdHeight,
            'min-height': themeVariables.btnIconMdHeight,
        },
        'text': {
            'display': 'none',
        },
        'content': {
            "paddingLeft": 0,
            "paddingRight": 0,
            "paddingBottom": 0,
            "paddingTop": 0,
        },
        "icon": {
            "text": {
                "fontSize": themeVariables.btnIconMdSize,
                "minWidth": themeVariables.btnIconMdSize,
                "width": themeVariables.btnIconMdSize,
                "height": themeVariables.btnIconMdSize
            },
        },
        'btn-xs': {
            "content-icon-top": {
                "paddingBottom": 0,
                "paddingTop": 0,
            },
            'root':{
                'min-width': themeVariables.btnIconXsWidth,
                'width': themeVariables.btnIconXsWidth,
                'height': themeVariables.btnIconXsHeight,
                'min-height': themeVariables.btnIconXsHeight,
            },
            'content': {
                "paddingLeft": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingTop": 0,
            }
        },
        'btn-sm': {
            "content-icon-top": {
                "paddingBottom": 0,
                "paddingTop": 0,
            },
            'root':{
                'min-width': themeVariables.btnIconSmWidth,
                'width': themeVariables.btnIconSmWidth,
                'height': themeVariables.btnIconSmHeight,
                'min-height': themeVariables.btnIconSmHeight,
            },
            'content': {
                "paddingLeft": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingTop": 0,
            }
        },
        'btn-lg': {
            "content-icon-top": {
                "paddingBottom": 0,
                "paddingTop": 0,
            },
            'root':{
                'min-width': themeVariables.btnIconLgWidth,
                'width': themeVariables.btnIconLgWidth,
                'height': themeVariables.btnIconLgHeight,
                'min-height': themeVariables.btnIconLgHeight,
            },
            'content': {
                "paddingLeft": 0,
                "paddingRight": 0,
                "paddingBottom": 0,
                "paddingTop": 0,
            }
        }
      }
      
    }
};

const getNonPrismStyleRules = (themeVariables: any) : { [key: string]: any }=> ({
    "app-button": {
         root: {
                minHeight: 40,
                borderRadius: 32,
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 24,
                paddingRight: 24,
                rippleColor: themeVariables.rippleColor
              },
              content: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              },
              text: {
                fontSize: 14,
                fontFamily: themeVariables.baseFont,
                fontWeight: '500',
                textAlign: 'center',
                textTransform: 'capitalize',
              },
              badge: {
                backgroundColor: themeVariables.buttonBadgeBackgroundColor,
                color: themeVariables.buttonBadgeTextColor,
                alignSelf: 'flex-end',
                position: 'relative',
                bottom: 60 ,
                marginRight: 18,
                borderWidth: 1,
                borderStyle: 'solid',
              },
              icon: {
                root : {
                  alignSelf: 'auto',
                  paddingLeft: -8,
                  paddingRight: -8
                },
                icon: {},
                text: {
                  paddingRight: themeVariables.buttonTextPadding,
                  fontSize: 16
                }
              } as WmIconStyles,
              skeleton: {
                root: {
                  width: 96,
                  height: 48,
                  borderRadius: 4
                }
              } as WmSkeletonStyles
    },
    "app-button-disabled": {
        root : {
            opacity: 0.5
          }
      },
      "btn-default": {
            root: {
              borderWidth: 1,
              borderColor: themeVariables.buttonBorderColor,
              borderStyle: 'solid',
              backgroundColor: themeVariables.buttonDefaultColor
            },
            text: {
              color: themeVariables.buttonDefaultTextColor
            },
            badge: {
              backgroundColor: themeVariables.buttonDefaultTextColor,
              color: themeVariables.buttonDefaultColor,
              borderColor: themeVariables.buttonDefaultColor
            },
            icon: {
              text: {
                color: themeVariables.buttonDefaultTextColor
              }
            }
      },
      "btn-info": {
        root: {
          borderWidth: 1,
          borderColor: themeVariables.buttonBorderColor,
          borderStyle: 'solid',
          backgroundColor: themeVariables.buttonInfoColor
        },
        text: {
          color: themeVariables.buttonInfoTextColor
        },
        badge: {
          backgroundColor: themeVariables.buttonInfoTextColor,
          color: themeVariables.buttonInfoColor,
          borderColor: themeVariables.buttonInfoColor
        },
        icon: {
          text: {
            color: themeVariables.buttonInfoTextColor
          }
        }
  },
  "btn-primary": {
    root: {
      borderWidth: 1,
      borderColor: themeVariables.buttonBorderColor,
      borderStyle: 'solid',
      backgroundColor: themeVariables.buttonPrimaryColor
    },
    text: {
      color: themeVariables.buttonPrimaryTextColor
    },
    badge: {
      backgroundColor: themeVariables.buttonPrimaryTextColor,
      color: themeVariables.buttonPrimaryColor,
      borderColor: themeVariables.buttonPrimaryColor
    },
    icon: {
      text: {
        color: themeVariables.buttonPrimaryTextColor
      }
    }
},
"btn-secondary": {
    root: {
      borderWidth: 1,
      borderColor: themeVariables.buttonBorderColor,
      borderStyle: 'solid',
      backgroundColor: themeVariables.buttonSecondaryColor
    },
    text: {
      color: themeVariables.buttonSecondaryTextColor
    },
    badge: {
      backgroundColor: themeVariables.buttonSecondaryTextColor,
      color: themeVariables.buttonSecondaryColor,
      borderColor: themeVariables.buttonSecondaryColor
    },
    icon: {
      text: {
        color: themeVariables.buttonSecondaryTextColor
      }
    }
},
"btn-danger": {
    root: {
      borderWidth: 1,
      borderColor: themeVariables.buttonBorderColor,
      borderStyle: 'solid',
      backgroundColor: themeVariables.buttonDangerColor
    },
    text: {
      color: themeVariables.buttonDangerTextColor
    },
    badge: {
      backgroundColor: themeVariables.buttonDangerTextColor,
      color: themeVariables.buttonDangerColor,
      borderColor: themeVariables.buttonDangerColor
    },
    icon: {
      text: {
        color: themeVariables.buttonDangerTextColor
      }
    }
},
"btn-success": {
    root: {
      borderWidth: 1,
      borderColor: themeVariables.buttonBorderColor,
      borderStyle: 'solid',
      backgroundColor: themeVariables.buttonSuccessColor
    },
    text: {
      color: themeVariables.buttonSuccessTextColor
    },
    badge: {
      backgroundColor: themeVariables.buttonSuccessTextColor,
      color: themeVariables.buttonSuccessColor,
      borderColor: themeVariables.buttonSuccessColor
    },
    icon: {
      text: {
        color: themeVariables.buttonSuccessTextColor
      }
    }
},

}
)


export const defaultStyles = (themeVariables: any,isPrism = false) => {
 return isPrism ? getPrismStyleRules(themeVariables) : getNonPrismStyleRules(themeVariables);
}
