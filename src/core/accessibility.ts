import { AccessibilityInfo } from 'react-native';
import { isAndroid, removeUndefinedKeys } from './utils';

let _isScreenReaderEnabled = false;

AccessibilityInfo.addEventListener(
  'screenReaderChanged',
  flag => {
    _isScreenReaderEnabled = flag;
  },
);

export const isScreenReaderEnabled = () => _isScreenReaderEnabled;

async function getScreenReaderStatus() {
  _isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
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
};

  
export type AccessibilityPropsType = {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityLabelledBy?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'header' | 'search' | 'image' | 'imagebutton' | 'none' | 'summary' | 'text' | 'progressbar' | 'grid' | 'alert';
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
  let props: AccessibilityPropsType = {accessible: true};
  if (!_isScreenReaderEnabled) {
    return {};
  }
  switch (widgetType) {
    case AccessibilityWidgetType.BUTTON:
    case AccessibilityWidgetType.TEXT:
    case AccessibilityWidgetType.NUMBER:
    case AccessibilityWidgetType.TEXTAREA:
    case AccessibilityWidgetType.SELECT:
    case AccessibilityWidgetType.CURRENCY:
    case AccessibilityWidgetType.TOGGLE:
    case AccessibilityWidgetType.DATE:
    case AccessibilityWidgetType.LABEL:
    case AccessibilityWidgetType.ANCHOR:
    case AccessibilityWidgetType.MESSAGE:    
    case AccessibilityWidgetType.SEARCH: 
    case AccessibilityWidgetType.PICTURE: 
    case AccessibilityWidgetType.ICON:
    case AccessibilityWidgetType.NAV:
    case AccessibilityWidgetType.POVOVER:
    case AccessibilityWidgetType.WEBVIEW:
    case AccessibilityWidgetType.LINECHART:  
    case AccessibilityWidgetType.VIDEO: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.caption;
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityRole = accessibilityProps.accessibilityrole;

      if (
        widgetType === AccessibilityWidgetType.BUTTON ||
        widgetType === AccessibilityWidgetType.TEXT ||
        widgetType === AccessibilityWidgetType.NUMBER ||
        widgetType === AccessibilityWidgetType.TEXTAREA ||
        widgetType === AccessibilityWidgetType.SELECT ||
        widgetType === AccessibilityWidgetType.TOGGLE ||
        widgetType === AccessibilityWidgetType.DATE
      ) {
        props.accessibilityState = { disabled: accessibilityProps.disabled };
      }
      if (
        (widgetType === AccessibilityWidgetType.TEXT ||
          widgetType === AccessibilityWidgetType.NUMBER ||
          widgetType === AccessibilityWidgetType.TEXTAREA ||
          widgetType === AccessibilityWidgetType.SELECT ||
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
      if (widgetType === AccessibilityWidgetType.SELECT) {
        props.accessibilityState = {
          ...props.accessibilityState,
          expanded: accessibilityProps.expanded,
        };
      }
      if (widgetType === AccessibilityWidgetType.TOGGLE) {
        props.accessibilityState = {
          ...props.accessibilityState,
          selected: accessibilityProps.selected,
        };
      }
      break;
    }

    case AccessibilityWidgetType.CHIPS: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.caption;
      props.accessibilityHint = accessibilityProps.hint;
      props.accessibilityState = {
        disabled: accessibilityProps.disabled,
        selected: accessibilityProps.selected,
      };
      break;
    }

    case AccessibilityWidgetType.RADIOSET: {
      props.accessibilityState = {
        disabled: accessibilityProps.readonly || accessibilityProps.disabled,
        selected: accessibilityProps.selected,
      };
      break;
    }

    case AccessibilityWidgetType.CHECKBOX: {
      props.accessibilityState = {
        disabled: accessibilityProps.readonly ||  accessibilityProps.disabled,
        checked: accessibilityProps.checked,
      };
      break;
    }

    case AccessibilityWidgetType.SWITCH: {
      props.accessibilityState = {
        disabled: accessibilityProps.disabled,
        selected: accessibilityProps.selected,
      };
      break;
    }
    case AccessibilityWidgetType.PROGRESSBAR:
    case AccessibilityWidgetType.PROGRESSCIRCLE: {
      props.accessibilityLabel = accessibilityProps.accessibilitylabel || accessibilityProps.caption;
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
  