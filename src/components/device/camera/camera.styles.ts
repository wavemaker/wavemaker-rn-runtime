import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCameraStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-camera';
export const DEFAULT_STYLES: WmCameraStyles = defineStyles({
    root: {},
    text: {},
    button: {
      root: {
        borderWidth: 1,
        borderColor: ThemeVariables.cameraBorderColor,
        borderStyle: 'solid',
        backgroundColor: ThemeVariables.cameraBgColor
      },
      text: {
        color: ThemeVariables.cameraTextColor
      },
      icon: {
        text: {
          color: ThemeVariables.cameraTextColor
        }
      }
    } as WmButtonStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
