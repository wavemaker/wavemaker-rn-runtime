import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmProgressCircleProps from './progress-circle.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmProgressCircleStyles } from './progress-circle.styles';

export class WmProgressCircleState extends BaseComponentState<WmProgressCircleProps> {}

export default class WmProgressCircle extends BaseComponent<WmProgressCircleProps, WmProgressCircleState, WmProgressCircleStyles> {

  constructor(props: WmProgressCircleProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmProgressCircleProps());
  }

  renderWidget(props: WmProgressCircleProps) {
    const value = (props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue) * 100;
    const styles = deepCopy(this.styles, this.theme.getStyle(`app-${props.type}-progress-circle`));
    const showText = props.captionplacement !== 'hidden';
    return (
    <View style={styles.root}>
      <Tappable target={this} styles={{root:{width: '100%', height: '100%'}}}>
        <AnimatedCircularProgress
          fill={value}
          width={styles.progressValue.height}
          backgroundWidth={styles.progressValue.height}
          rotation={0}
          tintColor={styles.progressValue.backgroundColor}
          backgroundColor={styles.progressCircle.backgroundColor}
          size={styles.root.height}>
            {(fill) => (<Text style={styles.text}>{ showText ? value : '' }</Text>)}  
        </AnimatedCircularProgress>
      </Tappable>
    </View>); 
  }
}
