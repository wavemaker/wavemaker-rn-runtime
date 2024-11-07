import React from 'react';
import { TouchableOpacity, Animated, Easing, LayoutChangeEvent, View, DimensionValue } from 'react-native';

import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { unStringify, validateField} from '@wavemaker/app-rn-runtime/core/utils';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 

import WmToggleProps from './toggle.props';
import { DEFAULT_CLASS, WmToggleStyles } from './toggle.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmToggleState extends BaseComponentState<WmToggleProps> {
  isSwitchOn: boolean = false;
  isValid: boolean = true;
  errorType = '';
  viewWidth: number = 0;
}

export default class WmToggle extends BaseComponent<WmToggleProps, WmToggleState, WmToggleStyles> {

  private animationValue = new Animated.Value(0);
  private scaleValue = new Animated.Value(1);

  constructor(props: WmToggleProps) {
    super(props, DEFAULT_CLASS, new WmToggleProps(), new WmToggleState());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        let value =
          unStringify($new) ===
          unStringify(this.state.props.checkedvalue, true);
        this.updateState({ isSwitchOn: value } as WmToggleState);
        break;
    }
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmToggleState);
  }

  validate(value: any) {
    const validationObj = validateField(this.state.props, value);
    this.updateState({
      isValid: validationObj.isValid,
      errorType: validationObj.errorType
    } as WmToggleState);
  }

  onToggleSwitch(value: any) {
    const oldValue = this.state.props.datavalue;
    this.validate(value);
    this.updateState({ isSwitchOn: value } as WmToggleState);
    const dataValue = value === true ? this.state.props.checkedvalue : this.state.props.uncheckedvalue;
    Animated.sequence([
      Animated.timing(this.scaleValue, {
        toValue: 1.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animationValue, {
        toValue: value ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(this.scaleValue, {
        toValue: value ? 1.5 : 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });
    // @ts-ignore
    this.updateState({ props: { datavalue: dataValue } },
      ()=> {
        if (!this.props.onFieldChange) {
          this.invokeEventCallback('onChange', [null, this.proxy, dataValue, oldValue]);
        } else {
          this.props.onFieldChange && this.props.onFieldChange('datavalue', dataValue, oldValue);
        }
        this.invokeEventCallback('onBlur', [ null, this.proxy ]);
      });
  }

  onLayoutChange(event: LayoutChangeEvent){
    let width = event.nativeEvent.layout.width;
    this.setState({
      viewWidth: width,
    } as WmToggleState);
  }

  public renderSkeleton(props: WmToggleProps): React.ReactNode {
      let skeletonWidth, skeletonHeight;
      if(this.props.skeletonwidth == "0") {
        skeletonWidth = 0
      } else {
        skeletonWidth = this.props.skeletonwidth || this.styles.root?.width
      }
  
      if(this.props.skeletonheight == "0") {
        skeletonHeight = 0
      } else {
        skeletonHeight = this.props.skeletonheight || this.styles.root?.height;
      }
      
      return createSkeleton(this.theme, this.styles.skeleton, {
        ...this.styles.root,
        width: skeletonWidth as DimensionValue,
        height: skeletonHeight as DimensionValue
      });
  }

  renderWidget(props: WmToggleProps) {
    const styles = this.theme.mergeStyle(this.styles, 
      this.theme.getStyle(this.state.isSwitchOn ? 'app-toggle-on' : 'app-toggle-off'));
    return (
      <TouchableOpacity 
      onLayout={(e) => {
        this.onLayoutChange(e);
      }}
      {...getAccessibilityProps(AccessibilityWidgetType.TOGGLE, {...this.props, selected: this.state.isSwitchOn})}
      onPress={() => {
        if (this.props.disabled || this.props.readonly) {
          return;
        }
        // Added setTimeout to smooth animation
        setTimeout(() => {
          this.invokeEventCallback('onFocus', [null, this]);
          this.invokeEventCallback('onTap', [null, this]);
        }, 500);
        this.onToggleSwitch(!this.state.isSwitchOn);
      }}{...this.getTestPropsForAction()}
      style={styles.root}>
       {styles.root.animation && styles.root.animation === 'none' ? (
          <View style={styles.handle}>
            <BackgroundComponent
              size={styles.handle.backgroundSize || 'contain'}
              position={styles.handle.backgroundPosition}
              image={styles.handle.backgroundImage}
              repeat={styles.handle.backgroundRepeat || 'no-repeat'}
            />
          </View>
          ): ( <Animated.View
            style={[
              styles.handle,
              {
                transform: [
                  {
                    translateX: this.animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, this.state.viewWidth - (this.styles.handle.width as number + 18)],
                    }),
                  },
                  { scale: this.scaleValue }
                ],
              },
            ]}>
            <BackgroundComponent
              size={styles.handle.backgroundSize || 'contain'}
              position={styles.handle.backgroundPosition}
              image={styles.handle.backgroundImage}
              repeat={styles.handle.backgroundRepeat || 'no-repeat'}
            />
          </Animated.View>)}
      </TouchableOpacity>
    );
  }
}
