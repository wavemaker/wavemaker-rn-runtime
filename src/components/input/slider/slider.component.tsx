import React from 'react';
import { View, Text, LayoutChangeEvent, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { debounce, isNumber, isNil, isArray } from 'lodash';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSliderProps from './slider.props';
import { DEFAULT_CLASS, WmSliderStyles } from './slider.styles';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { Extrapolation, interpolate } from 'react-native-reanimated';
import WmTooltip from '../../basic/tooltip/tooltip.component';

export type SliderGestureType = 'track' | 'lowThumb' | 'highThumb';

const SCREEN_WIDTH = Dimensions.get("screen").width;

export class WmSliderState extends BaseComponentState<WmSliderProps> {
  track?: {
    top: number,
    left: number,
    width: number,
    height: number
  };
}

export default class WmSlider extends BaseComponent<WmSliderProps, WmSliderState, WmSliderStyles> {
  valueBeforeSlide: number = 0;
  private position: any = new Animated.Value(0);
  private highPosition: any = new Animated.Value(0);
  private trackGesture = Gesture.Pan();
  private knobGesture = Gesture.Pan();
  private highKnobGesture = Gesture.Pan();

  constructor(props: WmSliderProps) {
    super(props, DEFAULT_CLASS, new WmSliderProps());
    
    this.configureGesture(this.trackGesture, 'track');
    this.configureGesture(this.knobGesture, 'lowThumb');
    this.configureGesture(this.highKnobGesture, 'highThumb');
  }

  // getValueFromGesture(positionX: number) {
  //   if (this.state.track) {
  //     const factor = (positionX - this.state.track.left) / this.state.track.width;
  //     const props = this.state.props;
  //     const step = props.step || (props.maxvalue - props.minvalue) / 100;
  //     let value =  Math.round((factor * props.maxvalue + props.minvalue) / step) * step;
  //     return Math.max(Math.min(props.maxvalue, value), props.minvalue);
  //   }
  //   return 0;
  // };

  getValueFromGesture(positionX: number) {
    if (this.state.track) {
      const props = this.props;
      const state = this.state;
      const isRangeSlider = state.props.isrange && isArray(state.props.datavalue);
      const thumbSize = isRangeSlider ? 16 : 8;

      const gestureValue = this.getInterpolatedValue(
        positionX,
        [8, this.state.track.width - thumbSize],
        [props.minvalue, props.maxvalue],
        props.step,
      );

      return gestureValue;
    }
    return 0;
  }

  configureGesture(gesture: PanGesture, gestureType: SliderGestureType) {
    gesture
      .maxPointers(1)
      .minDistance(0)
      .onChange(e => {
        const width = this.state.track?.width || 0;
        const offset = SCREEN_WIDTH - width;
        const thumbPos = gestureType === "lowThumb" ? e.absoluteX - offset + 8 : e.absoluteX - offset;
        const value = this.getValueFromGesture(thumbPos);
        this.computePosition(value, gestureType);
        this.forceUpdate();
      })
      .onEnd(e => {
        if (this.state.track) {
          const width = this.state.track?.width || 0;
          const offset = SCREEN_WIDTH - width;
          const thumbPos = gestureType === "lowThumb" ? e.absoluteX - offset + 8 : e.absoluteX - offset;
          const value = this.getValueFromGesture(thumbPos);
          this.onChange(value, gestureType);
          this.forceUpdate();
        }
      })
  }

  getDataValue() {
    if (isNil(this.props.datavalue)) {
      return this.state.props.minvalue + (this.state.props.maxvalue - this.state.props.minvalue)/2;
    }
    return Math.min(Math.max(this.props.datavalue, this.state.props.minvalue), this.state.props.maxvalue);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'datavalue':
        if (isNumber($new) && isNumber($old)) {
          this.invokeEventCallback('onChange', [null, this, $new, $old]);
        }
      case 'maxvalue':
      case 'minvalue': 
        if (!this.state.props.datavalue) {
          this.setProp('datavalue', this.getDataValue() || 0)
          this.computePosition(this.state.props.datavalue, "track");
        }
        break;
    }
  }

  // onChange = debounce((value: number, gestureType: any) => {
  //   if (this.state.props.datavalue !== value) {
  //     this.updateState({
  //       props : {
  //         datavalue: value
  //       }
  //     } as WmSliderState);
  //     this.props.onFieldChange &&
  //     this.props.onFieldChange(
  //       'datavalue',
  //       value,
  //       this.state.props.datavalue
  //     );
  //   }
  // }, 200);

  onChange = debounce((value: number, gestureType: SliderGestureType) => {
    const dataValue = this.state.props.datavalue;
    const isRangeSlider = this.state.props.isrange && isArray(dataValue);

    // * thumb value for low or high
    const oldThumbValue =
      gestureType === 'lowThumb'
        ? dataValue || dataValue?.[0]
        : dataValue?.[1];

    let thumbDataValue = isRangeSlider
      ? [dataValue[0], dataValue[1]]
      : value;
    if (isRangeSlider) {
      if (gestureType === 'lowThumb') {
        const valueLowerThanHighThumb =
          value > dataValue?.[1] ? dataValue?.[1] : value;

        thumbDataValue = [valueLowerThanHighThumb, dataValue[1]];
      } else if (gestureType === 'highThumb') {
        const valueGreaterThanLowThumb =
          value < dataValue[0] ? dataValue?.[0] : value;

        thumbDataValue = [dataValue[0], valueGreaterThanLowThumb];
      } else {
        // thumbDataValue = [dataValue[0], value];
      }
    }

    // * new thumb value is different from old value
    if (oldThumbValue !== value) {
      this.updateState({
        props: {
          datavalue: thumbDataValue,
        },
      } as WmSliderState);
      this.props.onFieldChange &&
        this.props.onFieldChange('datavalue', thumbDataValue, oldThumbValue);
    }
  }, 200);

  getInterpolatedValue(
    valueToInterpolate: number,
    input: [number, number],
    output: [number, number],
    step?: number,
  ) {
    const props = this.props;
    const stepValue = step || (props.maxvalue - props.minvalue) / 100;

    const interpolatedValue = interpolate(
      valueToInterpolate,
      input,
      output,
      Extrapolation.CLAMP,
    );

    const stepwiseValue = Math.round(interpolatedValue / stepValue) * stepValue;

    return stepwiseValue;
  }

  computePosition(datavalue: number, gestureType: SliderGestureType) {
    const props = this.props;
    const state = this.state;
    const width = state.track?.width || 0;
    const isRangeSlider = state.props.isrange && isArray(state.props.datavalue);
    const thumbSize = isRangeSlider ? 16 : 8;
    // const value = ((datavalue - props.minvalue) / props.maxvalue) * (width);
    // this.position?.setValue(isNaN(value) ? 0 : value);
    // return;
    

    // * high/low datavalue to pixels
    const value = this.getInterpolatedValue(
      datavalue,
      [props.minvalue, props.maxvalue],
      [8, width - thumbSize],
      props.step,
    );

    // * single thumb slider
    if (!isRangeSlider) {
      this.position?.setValue(isNaN(value) ? 0 : value);
      return;
    }

    if (gestureType === 'highThumb') {
      const lowerValueInPx = this.getInterpolatedValue(
        this.state.props.datavalue[0],
        [props.minvalue, props.maxvalue],
        [8, width - thumbSize],
        props.step,
      );
      const valueGreaterThanLowThumb =
        datavalue < this.state.props.datavalue[0] ? lowerValueInPx : value;

      this.highPosition?.setValue(
        isNaN(valueGreaterThanLowThumb) ? 0 : valueGreaterThanLowThumb,
      );
    } else if (gestureType === 'lowThumb') {
      const highValue = isRangeSlider ? this.state.props.datavalue[1] : this.state.props.datavalue;
      const higherValueInPx = this.getInterpolatedValue(
        highValue,
        [props.minvalue, props.maxvalue],
        [8, width - thumbSize],
        props.step,
      );
      const valueLowerThanHighThumb =
      datavalue > highValue ? higherValueInPx : value;
      this.position?.setValue(
        isNaN(valueLowerThanHighThumb) ? 0 : valueLowerThanHighThumb,
      );
    } else {
      /*
       * gestureType: track
       * initial position for low and high thumb
       */
      if (isNaN(value)) {
        const lowThumbValue = isRangeSlider
          ? this.state.props.datavalue?.[0]
          : isArray(this.state.props.datavalue)
          ? this.state.props.datavalue?.[0]
          : this.state.props.datavalue;
        const lowInterpolated = this.getInterpolatedValue(
          lowThumbValue,
          [props.minvalue, props.maxvalue],
          [8, width - thumbSize],
          props.step,
        );
        this.position?.setValue(lowInterpolated);

        if (isRangeSlider) {
          const highThumbValue = this.state.props.datavalue?.[1] || width;
          const highInterpolated = this.getInterpolatedValue(
            highThumbValue,
            [props.minvalue, props.maxvalue],
            [8, width - thumbSize],
            props.step,
          );
          this.highPosition?.setValue(highInterpolated);
        }
      }
    }
  }

  getTooltipLabel(value: any, initialValue: any, type: 'lowThumb' | 'highThumb') {
    const props = this.props;
    const width = this.state.track?.width || 0;
    const isRangeSlider = this.state.props.isrange && isArray(this.state.props.datavalue);
    const thumbSize = isRangeSlider ? 16 : 8;

    let tooltipValue = initialValue;
    const updatedPositionInPx = Number(JSON.stringify(value));

    if (updatedPositionInPx) {
      const position = this.getInterpolatedValue(
        updatedPositionInPx,
        [8, width - thumbSize],
        [props.minvalue, props.maxvalue],
        1,
      );
      tooltipValue = position;
    }

    // * getting custom tooltip label
    let customTooltipLabel = tooltipValue;
    if (type === 'lowThumb' && props.lowthumbtooltiplabelexpr) {
      customTooltipLabel = props.lowthumbtooltiplabelexpr(tooltipValue);
    }
    if (type === 'highThumb' && props.highthumbtooltiplabelexpr) {
      customTooltipLabel = props.highthumbtooltiplabelexpr(tooltipValue);
    }

    return customTooltipLabel;
  }

  onLayoutChange = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    this.updateState({
      track: {
        top: isWebPreviewMode() ? (layout as any).top : layout.y,
        left: isWebPreviewMode() ? (layout as any).left : layout.x,
        width: layout.width,
        height: layout.height
      }
    } as WmSliderState, () => this.computePosition(this.state.props.datavalue, 'track'));
  }

  renderWidget(props: WmSliderProps) {
    const width = this.state.track?.width || 0;
    const isRangeSlider = props.isrange && isArray(props.datavalue);
    const thumbSize = isRangeSlider ? 16 : 8;

    return (
      <View style={this.styles.root}>
        {this._background}
        {!props.markerstep ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              {...this.getTestProps('min')}
              style={[this.styles.text, this.styles.minimumValue]}
            >
              {props.minvalue}
            </Text>
            {isRangeSlider ? (
              <></>
            ) : (
              <Text
                {...this.getTestProps('value')}
                style={[this.styles.text, this.styles.value]}
              >
                {props.datavalue}
              </Text>
            )}
            <Text
              {...this.getTestProps('max')}
              style={[this.styles.text, this.styles.maximumValue]}
            >
              {props.maxvalue}
            </Text>
          </View>
        ) : null}
        <GestureDetector gesture={this.trackGesture}>
          <TouchableOpacity
            activeOpacity={1}
            style={[this.styles.track, this.styles.trackStyle]}
            onLayout={this.onLayoutChange}
            {...this.getTestProps()}
          >
            <Animated.View
              style={[
                isRangeSlider && this.highPosition
                  ? this.styles.maximumTrack
                  : this.styles.minimumTrack,
                {
                  width: width,
                  transform: [
                    {
                      translateX: this.position.interpolate({
                        inputRange: [0, width],
                        outputRange: [-width, 0],
                      }),
                    },
                  ],
                },
                this.styles.minimumTrackStyle,
              ]}
            ></Animated.View>
            <Animated.View
              style={[
                isRangeSlider && this.highPosition
                  ? this.styles.minimumTrack
                  : this.styles.maximumTrack,
                {
                  width: width,
                  transform: [
                    {
                      translateX: this.position,
                    },
                  ],
                },
                this.styles.activeTrackStyle,
              ]}
            ></Animated.View>
            {isRangeSlider && this.highPosition ? (
              <Animated.View
                style={[
                  this.styles.maximumTrack,
                  {
                    width: width,
                    transform: [
                      {
                        translateX: this.highPosition,
                      },
                    ],
                  },
                  this.styles.maximumTrackStyle,
                ]}
              />
            ) : null}
          </TouchableOpacity>
        </GestureDetector>
        <View style={{ flexDirection: 'row' }}>
          <View>
            {width && props.markerstep
              ? Array.from(
                  {
                    length:
                      (props.maxvalue - props.minvalue) / props.markerstep + 1,
                  },
                  (_, i) => Number(props.markerstep) * i + props.minvalue
                ).map((markValue, i) => {
                  const markWidth = 10;
                  const mStep = props.markerstep || 1;
                  const stepwiseLeft = this.getInterpolatedValue(
                    markValue,
                    [props.minvalue, props.maxvalue],
                    [0, width - thumbSize],
                    mStep
                  );
                  const labelText = props?.markerlabeltext?.[i] || markValue;

                  return (
                    <View
                      key={i}
                      style={[
                        this.styles.markerWrapper,
                        {
                          left: stepwiseLeft,
                          bottom: markWidth / 2,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          this.styles.markerLabel,
                          {
                            bottom: markWidth / 2 + 10,
                          },
                          this.styles.markerLabelStyle,
                        ]}
                      >
                        {labelText}
                      </Text>
                      <View
                        style={[
                          this.styles.mark,
                          {
                            width: markWidth,
                            height: markWidth,
                            borderRadius: markWidth,
                          },
                          this.styles.markerStyle,
                        ]}
                      />
                    </View>
                  );
                })
              : null}
          </View>
          <WmTooltip
            showTooltip={props.showtooltip}
            text={this.getTooltipLabel(
              this.position?._value,
              isRangeSlider
                ? this.state.props.datavalue[0]
                : this.state.props.datavalue,
              'lowThumb'
            )}
            tooltipStyle={[
              {
                transform: [
                  {
                    translateX: this.position,
                  },
                ],
              },
              this.styles.tooltip,
            ]}
            tooltipLabelStyle={this.styles.tooltipLabel}
            tooltipTriangleStyle={this.styles.tooltipTriangle}
            direction={props.tooltipdirection}
          >
            <GestureDetector gesture={this.knobGesture}>
              <Animated.View
                style={[
                  this.styles.thumb,
                  {
                    transform: [
                      {
                        translateX: this.position,
                      },
                    ],
                  },
                ]}
              >
                <BackgroundComponent
                  size={(this.styles.thumb as any).backgroundSize}
                  position={(this.styles.thumb as any).backgroundPosition}
                  image={(this.styles.thumb as any).backgroundImage}
                ></BackgroundComponent>
              </Animated.View>
            </GestureDetector>
          </WmTooltip>
          {isRangeSlider && this.highPosition ? (
            <WmTooltip
              showTooltip={props.showtooltip}
              text={this.getTooltipLabel(
                this.highPosition._value,
                this.state.props.datavalue[1],
                'highThumb'
              )}
              tooltipStyle={[
                {
                  transform: [
                    {
                      translateX: this.highPosition,
                    },
                  ],
                },
                this.styles.tooltip,
              ]}
              tooltipLabelStyle={this.styles.tooltipLabel}
              tooltipTriangleStyle={this.styles.tooltipTriangle}
              direction={props.tooltipdirection}
            >
              <GestureDetector gesture={this.highKnobGesture}>
                <Animated.View
                  style={[
                    this.styles.thumb,
                    {
                      transform: [
                        {
                          translateX: this.highPosition,
                        },
                      ],
                    },
                    { marginLeft: -16 }
                  ]}
                  >
                  <BackgroundComponent
                    size={(this.styles.thumb as any).backgroundSize}
                    position={(this.styles.thumb as any).backgroundPosition}
                    image={(this.styles.thumb as any).backgroundImage}
                  />
                </Animated.View>
              </GestureDetector>
            </WmTooltip>
          ) : null}
        </View>
      </View>
    );
  }
}
