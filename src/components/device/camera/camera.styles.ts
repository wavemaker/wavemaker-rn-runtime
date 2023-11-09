import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmCameraStyles = BaseStyles & {
  button: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-camera';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmCameraStyles = defineStyles({
      root: {},
      text: {},
      button: {
        root: {
          borderWidth: 1,
          borderColor: themeVariables.cameraBorderColor,
          borderStyle: 'solid',
          backgroundColor: themeVariables.cameraBgColor,
          borderRadius: 4
        },
        text: {
          color: themeVariables.cameraTextColor
        },
        icon: {
          text: {
            color: themeVariables.cameraTextColor
          },
          icon: {
            fontSize: 24
          }
        }
      } as WmButtonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});