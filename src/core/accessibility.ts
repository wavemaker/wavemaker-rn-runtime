import { AccessibilityInfo } from 'react-native';
import { isAndroid, isWebPreviewMode, removeUndefinedKeys } from './utils';
import RNRestart from 'react-native-restart';
let _isScreenReaderEnabled = false;



const restartIfNeeded = (flag: boolean) => {
  //when accessibility is enabled in the page
  if (flag && !_isScreenReaderEnabled) {
    RNRestart && RNRestart.Restart();
  }
};
AccessibilityInfo.addEventListener(
  'screenReaderChanged',
  flag => {
      restartIfNeeded(flag);
    _isScreenReaderEnabled = flag;
  },
);

export const isScreenReaderEnabled = () => _isScreenReaderEnabled;

async function getScreenReaderStatus() {
  _isScreenReaderEnabled = (!isWebPreviewMode() && await AccessibilityInfo.isScreenReaderEnabled());
}

getScreenReaderStatus();

export enum AccessibilityWidgetType {
  BUTTON = 'button',
  PICTURE = 'picture',
  TEXT = 'text',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHIPS = 'chips',
  CURRENCY = 'currency',
  RADIOSET = 'radioset',
  CHECKBOX = 'checkbox',
  CHECKBOXSET = 'checkboxset',
  TOGGLE = 'toggle',
  SWITCH = 'switch',
  DATE = 'date',
  VIDEO = 'video',
  PROGRESSBAR = 'progressbar',
  PROGRESSCIRCLE = 'progresscircle',
  LABEL = 'label',
  ANCHOR = 'anchor',
  MESSAGE = 'message',
  SEARCH = 'search',
  ICON = 'icon',
  NAV = 'nav',
  POVOVER = 'popover',
  WEBVIEW = 'webview',
  LINECHART = 'linechart',
  SLIDER = 'slider',
  BOTTOMSHEET='bottomsheet',
  TABS = 'tab'
};

  
export type AccessibilityPropsType = {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityLabelledBy?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'checkbox' | 'combobox' | 'link' | 'header' | 'search' | 'image' | 'imagebutton' | 'none' | 'summary' | 'text' | 'progressbar' | 'grid' | 'alert' | 'tab';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: Array<{
    name: string;
    label?: string;
  }>;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityLanguage?: any;
  accessibilityElementsHidden?: boolean;
  accessibilityViewIsModal?: boolean;
};
  

export const getAccessibilityProps = (widgetType: AccessibilityWidgetType, accessibilityProps: AccessibilityPropsType | any) => {
  if(accessibilityProps.accessible === false){
    return {accessible: false, importantForAccessibility: "no"}
  }
  let props: AccessibilityPropsType = {accessible: true};
  if (!_isScreenReaderEnabled || isWebPreviewMode()) {
    return {};
  }
  switch (widgetType) {
    case AccessibilityWidgetType.BUTTON:
    case AccessibilityWidgetType.TEXT:
    case AccessibilityWidgetType.NUMBER:
    case AccessibilityWidgetType.TEXTAREA:
    case AccessibilityWidgetType.CURRENCY:
    case AccessibilityWidgetType.TOGGLE:
    case AccessibilityWidgetType.DATE:
    case AccessibilityWidgetType.LABEL:
    case AccessibilityWidgetType.MESSAGE:    
    case AccessibilityWidgetType.SEARCH: 
    case AccessibilityWidgetType.ICON:
    case AccessibilityWidgetType.NAV:
    case AccessibilityWidgetType.POVOVER:
    case AccessibilityWidgetType.BOTTOMSHEET:
    case AccessibilityWidgetType.WEBVIEW:
    case AccessibilityWidgetType.LINECHART:
    case AccessibilityWidgetType.SLIDER:
    case AccessibilityWidgetType.VIDEO: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.caption?.toString();
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole;

      if (
        widgetType === AccessibilityWidgetType.BUTTON ||
        widgetType === AccessibilityWidgetType.TEXT ||
        widgetType === AccessibilityWidgetType.NUMBER ||
        widgetType === AccessibilityWidgetType.TEXTAREA ||
        widgetType === AccessibilityWidgetType.TOGGLE ||
        widgetType === AccessibilityWidgetType.DATE
      ) {
        props.accessibilityState = { disabled: accessibilityProps.disabled };
      }
      if (
        (widgetType === AccessibilityWidgetType.TEXT ||
          widgetType === AccessibilityWidgetType.NUMBER ||
          widgetType === AccessibilityWidgetType.TEXTAREA ||
          widgetType === AccessibilityWidgetType.CURRENCY ||
          widgetType === AccessibilityWidgetType.TOGGLE) &&
        isAndroid()
      ) {
        props.accessibilityLabelledBy =
          accessibilityProps.accessibilitylabelledby;
      }
      if (
        widgetType === AccessibilityWidgetType.NUMBER ||
        widgetType === AccessibilityWidgetType.CURRENCY
      ) {
        props.accessibilityValue = {
          min: accessibilityProps.minvalue,
          max: accessibilityProps.maxvalue,
        };
      }
      if (widgetType === AccessibilityWidgetType.TOGGLE) {
        props.accessibilityState = {
          ...props.accessibilityState,
          checked: accessibilityProps.selected,
        };
      }
      break;
    }

    case AccessibilityWidgetType.TABS: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.title;
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole || 'tab';
      props.accessibilityState = {
        ...props.accessibilityState,
        selected: accessibilityProps.selected,
      };
      break;
    }

    case AccessibilityWidgetType.ANCHOR: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || (accessibilityProps.badgevalue ? `${accessibilityProps.caption} ${accessibilityProps.badgevalue}` : accessibilityProps.caption);
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole
      break;
    }

    case AccessibilityWidgetType.CHECKBOX: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.caption?.toString();
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole || 'checkbox'
      props.accessibilityState = {
        disabled: accessibilityProps.readonly ||  accessibilityProps.disabled,
        checked: accessibilityProps.checked,
      };
      break;
    }

    case AccessibilityWidgetType.SELECT: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.displayValue || "Select an option"
      props.accessibilityHint = accessibilityProps.hint
      props.accessibilityRole = accessibilityProps.accessibilityrole || 'button',
      props.accessibilityState = {
        disabled: accessibilityProps.readonly ||  accessibilityProps.disabled,
        expanded: accessibilityProps.expanded,
      };
      if(isAndroid()) {
        props.accessibilityLabelledBy =
          accessibilityProps.accessibilitylabelledby;
      }
      break;
    }

    case AccessibilityWidgetType.RADIOSET: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || 'Select your preferred option';
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole || 'radiogroup'
      break;
    }

    case AccessibilityWidgetType.CHECKBOXSET: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || 'Select your preferred options';
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole || 'combobox'
      break;
    }

    case AccessibilityWidgetType.SWITCH: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || "Select an option";
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole
      props.accessibilityState = {
        disabled: accessibilityProps.disabled,
        selected: accessibilityProps.selected,
      };
      break;
    }
    case AccessibilityWidgetType.PROGRESSBAR:
    case AccessibilityWidgetType.PROGRESSCIRCLE: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.caption?.toString();
      props.accessibilityRole = accessibilityProps.accessibilityrole;
      break;
    }
    case AccessibilityWidgetType.PICTURE: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.alttext || 'Image';
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole;
      break;
    }
    default:
      break;
  }

  const finalProps = removeUndefinedKeys(props);
  // console.log('finalProps', finalProps)

  return finalProps;
}