import React from 'react';
import { View, Text, LayoutChangeEvent, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { debounce, isNumber, isNil, isArray, isString, last, isEqual } from 'lodash';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import WmTooltip from '@wavemaker/app-rn-runtime/components/basic/tooltip/tooltip.component';

import WmSliderProps from './slider.props';
import { DEFAULT_CLASS, WmSliderStyles } from './slider.styles';
import { isDefined, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseDatasetComponent, BaseDatasetState } from '../basedataset/basedataset.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

export type SliderGestureType = 'track' | 'lowThumb' | 'highThumb';

const SCREEN_WIDTH = Dimensions.get("screen").width;

export class WmSliderState extends BaseDatasetState<WmSliderProps> {
  track?: {
    top: number,
    left: number,
    width: number,
    height: number
  };
}

interface Tick {
  displayfield: string;
  markValue: number;
  datafield: any;
  dataitem: any;
}

class Scale {

  public ticks = [] as Tick[];

  static getInstanceWithTicks(ticks: Tick[]) {
    const scale = new Scale();
    scale.ticks = [...ticks];
    return scale;
  }

  private constructor() {

  }

  public getTickIndex(value: number) {
      if (isString(value)) {
        value = parseInt(value);
      }
      let markIndex = 0;
      const i = this.ticks.findIndex((v, i) => v.markValue >= value);
      if (i === 0) {
          markIndex = 0;
      } else if (i < 0 || i === this.ticks.length - 1) {
          markIndex = this.ticks.length - 1;
      } else if ((value - this.ticks[i - 1].markValue) < (this.ticks[i].markValue - this.ticks[i - 1].markValue)/2) {
          markIndex = i - 1;
      } else {
          markIndex = i;
      }
      return markIndex;
  }

  public getMinTick() {
    return this.ticks[0];
  }

  public getMaxTick() {
    return last(this.ticks) || {} as Tick;
  }

  public getTick(value: number) {
    return this.ticks[this.getTickIndex(value)];
}

  public clamp(value: number) {
    const index = this.getTickIndex(value);
    return this.ticks[index].markValue;
  }

  public transform(min: number, max: number) {
      const thisMin = (this.ticks ? this.ticks[0]?.markValue : 0) || 0;
      const thisMax = last(this.ticks)?.markValue;
      const factor = thisMax ? (max - min)/(thisMax - thisMin) : 1;
      const ticks = [] as Tick[];
      this.ticks.forEach((v, i) => {
        const markValue = Math.round(min + (v.markValue - this.ticks[0].markValue) * factor)
        ticks[i] = {
          displayfield: '' + markValue,
          markValue: markValue,
          datafield: markValue,
          dataitem: markValue
        };
      });
      return Scale.getInstanceWithTicks(ticks);
  }
}

export default class WmSlider extends BaseDatasetComponent<WmSliderProps, WmSliderState, WmSliderStyles> {
  valueBeforeSlide: number = 0;
  private position: any = new Animated.Value(0);
  private highPosition: any = new Animated.Value(0);
  private trackGesture = Gesture.Pan();
  private knobGesture = Gesture.Pan();
  private highKnobGesture = Gesture.Pan();
  private scale: Scale = null as any;
  private uiScale: Scale = null as any;

  constructor(props: WmSliderProps) {
    super(props, DEFAULT_CLASS, new WmSliderProps());
    this.initScale();
    this.configureGesture(this.trackGesture, 'track');
    this.configureGesture(this.knobGesture, 'lowThumb');
    this.configureGesture(this.highKnobGesture, 'highThumb');
  }

  getValueFromGesture(positionX: number) {
    return this.scale?.ticks[this.uiScale.getTickIndex(positionX)].markValue || 0;
  }

  getPositionFromValue(value: number) {
    return this.uiScale?.ticks[this.scale.getTickIndex(value)]?.markValue;
  }

  configureGesture(gesture: PanGesture, gestureType: SliderGestureType) {
    gesture
      .maxPointers(1)
      .minDistance(0)
      .onChange(e => {
        const value = this.getValueFromGesture(e.absoluteX);
        this.computePosition(value, gestureType);
        this.forceUpdate();
      })
      .onEnd(e => {
        if (this.state.track) {
          const value = this.getValueFromGesture(e.absoluteX);
          this.onSliderChange(value, gestureType);
          this.forceUpdate();
        }
      })
  }

  getScaledDataValue() {
    let dataValue = this.state.props.datavalue || this.getDataValue();
    if (dataValue && this.scale) {
      dataValue = isArray(dataValue) ? dataValue: [dataValue];
      return dataValue.map((d: any) => this.scale?.ticks.find(t => t.datafield === d)?.markValue);
    }
    return dataValue;
  }

  getDataValue() {
    let dataValue = this.props.datavalue;
    if (isNil(this.props.datavalue)) {
      const mid = Math.floor(this.scale.ticks.length / 2);
      return mid > 0 ?
        [this.scale.ticks[mid - 1]?.datafield || 0,
        this.scale.ticks[mid]?.datafield || 100]
        : [];
    }
    dataValue = isArray(dataValue) ? dataValue: [dataValue];
    return dataValue.map((d: any) => this.scale.getTick(d)?.datafield);
  }

  initNumericSlider() {
    const dataset = [];
    const minValue = this.state.props.minvalue;
    const maxValue = this.state.props.maxvalue;
    const step = this.state.props.step;
    if (isDefined(minValue)
      && isDefined(maxValue)
      && isDefined(step)) {
      let nextMark = minValue;
      while (nextMark <= maxValue) {
        dataset.push(nextMark);
        nextMark += step || 1;
      }
      this.updateState({
        props: {
          dataset: dataset
        }
      } as WmSliderState);
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'maxvalue':
      case 'minvalue':
      case 'step':
        if (this.state.props.datatype === 'number' && this.initialized) {
          this.initNumericSlider();
        }
      case 'datavalue':
        if (isNumber($new) && isNumber($old)) {
          this.invokeEventCallback('onChange', [null, this, $new, $old]);
        }
        break;
    }
  }

  onDataItemsUpdate() {
    super.onDataItemsUpdate();
    this.initScale();
    this.computePosition(this.getScaledDataValue()?.[0] || 10, "track");
  }

  onSliderChange = debounce((value: number, gestureType: SliderGestureType) => {
    const dataValue = this.getScaledDataValue();
    const isRangeSlider = this.state.props.range && isArray(dataValue);

    // * thumb value for low or high
    const oldThumbValue =
      gestureType === 'lowThumb'
        ? dataValue || dataValue?.[0]
        : dataValue?.[1];

    let thumbDataValue = isRangeSlider
      ? [dataValue[0], dataValue[1]]
      : [value];
    if (isRangeSlider) {
      if (gestureType === 'lowThumb') {
        const valueLowerThanHighThumb =
          value > dataValue?.[1] ? dataValue?.[1] : value;

        thumbDataValue = [valueLowerThanHighThumb, dataValue[1]];
      } else if (gestureType === 'highThumb') {
        const valueGreaterThanLowThumb =
          value < dataValue[0] ? dataValue?.[0] : value;

        thumbDataValue = [dataValue[0], valueGreaterThanLowThumb];
      } else if (dataValue[1] && value > dataValue[1]) {
        thumbDataValue = [dataValue[0], value];
      } else {
        thumbDataValue = [value, dataValue[1]];
      }
    }

    // * new thumb value is different from old value
    const dataset = thumbDataValue.map(v => this.scale.getTick(v).datafield);
    this.updateState({
      props: {
        datavalue: dataset.length > 1 ? dataset : dataset[0]
      },
    } as WmSliderState);
    this.props.onFieldChange &&
      this.props.onFieldChange('datavalue', thumbDataValue, oldThumbValue);
  }, 200);

  initScale() {
    const props = this.state.props;
    const state = this.state;
    this.scale = Scale.getInstanceWithTicks(
      this.state.dataItems?.map((d: any, i: number) => ({
        displayfield: d.displayexp || d.displayfield,
        markValue: i + 1,
        datafield: d.datafield,
        dataitem: d
      }))
    );
    const width = state.track?.width || 0;
    this.uiScale = this.scale.transform(0, width);
  }

  computePosition(from: number, gestureType: SliderGestureType) {
    const state = this.state;
    const datavalue = this.getScaledDataValue();

    // * single thumb slider
    if (!state.props.range) {
      const value = this.getPositionFromValue(from);
      this.position?.setValue(isNaN(value) ? 0 : value);
      return;
    }

    if (gestureType === 'highThumb') {
      const value = this.getPositionFromValue(Math.max(datavalue[0], from));
      this.highPosition?.setValue(value);
    } else if (gestureType === 'lowThumb') {
      const value = this.getPositionFromValue(Math.min(from, datavalue[1]));
      this.position?.setValue(value);
    } else {
      /*
       * gestureType: track
       * initial position for low and high thumb
       */
      const lowPosition = this.getPositionFromValue(datavalue?.[0] || this.scale.getMinTick()?.datafield);
      this.position?.setValue(lowPosition || 0);
      const highPosition = this.getPositionFromValue(datavalue?.[1] || this.scale.getMaxTick()?.datafield);
      this.highPosition?.setValue(highPosition || 0);
    }
  }

  getTooltipLabel(value: any, initialValue: any, type: 'lowThumb' | 'highThumb') {
    const props = this.props;
    let tooltipValue = initialValue;
    const updatedPositionInPx = Number(JSON.stringify(value));

    if (updatedPositionInPx) {
      tooltipValue = this.scale.ticks[this.uiScale.getTickIndex(updatedPositionInPx)].markValue;
    }
    const tick = this.scale?.getTick(tooltipValue);
    // * getting custom tooltip label
    if (tick && props.getToolTipExpression && this.initialized) {
      return props.getToolTipExpression(tick.dataitem?.dataObject);
    }
    return tick?.displayfield;
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
    } as WmSliderState, () => {
      this.initScale();
      this.computePosition(this.getScaledDataValue()[0], 'track');
    });
  }

  componentDidMount(): void {
    super.componentDidMount();
    if (this.state.props.datatype === 'number') {
      this.initNumericSlider();
    }
  }

  renderToolTips(props: WmSliderProps) {
    const sDataValue = this.getScaledDataValue();
    const isRangeSlider = props.range && sDataValue.length > 1;
    return (
      <>
      <WmTooltip
        showTooltip={props.showtooltip}
        text={this.getTooltipLabel(
          this.position?._value,
          sDataValue[0],
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
            accessible={true}
            accessibilityLabel={(isRangeSlider && this.highPosition) ? 'Low thumb' : 'Thumb'}
          >
            <BackgroundComponent
              size={(this.styles.thumb as any).backgroundSize}
              position={(this.styles.thumb as any).backgroundPosition}
              image={(this.styles.thumb as any).backgroundImage}
              repeat={(this.styles.thumb as any).backgroundRepeat || 'no-repeat'}
            ></BackgroundComponent>
          </Animated.View>
        </GestureDetector>
      </WmTooltip>
      {isRangeSlider && this.highPosition ? (
        <WmTooltip
          showTooltip={props.showtooltip}
          text={this.getTooltipLabel(
            this.highPosition._value,
            sDataValue[1],
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
                }
              ]}
              accessible={true}
              accessibilityLabel={'High thumb'}
              >
              <BackgroundComponent
                size={(this.styles.thumb as any).backgroundSize}
                position={(this.styles.thumb as any).backgroundPosition}
                image={(this.styles.thumb as any).backgroundImage}
                repeat={(this.styles.thumb as any).backgroundRepeat || 'no-repeat'}
              />
            </Animated.View>
          </GestureDetector>
        </WmTooltip>
      ) : null}
      </>
    );
  }

  renderOldMarkerStyle(props: WmSliderProps) {
    const sDataValue = this.getScaledDataValue();
    const isRangeSlider = props.range && sDataValue.length > 1;
    return (
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <Text
            {...this.getTestProps('min')}
            style={[this.styles.text, this.styles.minimumValue]}
          >
            {this.scale?.ticks[0]?.displayfield}
          </Text>
          {isRangeSlider ? (
            <></>
          ) : (
            <Text
              {...this.getTestProps('value')}
              style={[this.styles.text, this.styles.value]}
            >
              {this.scale?.ticks.find(t => t.datafield === props.datavalue)?.displayfield}
            </Text>
          )}
          <Text
            {...this.getTestProps('max')}
            style={[this.styles.text, this.styles.maximumValue]}
          >
            {last(this.scale?.ticks)?.displayfield}
          </Text>
        </View>
      );
  }

  renderMarkers(props: WmSliderProps) {
    const width = this.state.track?.width || 0;
    return (<View style={{ flexDirection: 'row' }}>
      <View>
        {width ? this.scale.ticks.map((t, i) => {
          const markWidth = 10;
          const stepwiseLeft = this.getPositionFromValue(t.markValue);
          const labelText = t.displayfield;
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
                  i === 0 ? this.styles.minimumValue : null,
                  i === this.scale.ticks.length - 1 ? this.styles.maximumValue : null,
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
        }) : null}
      </View>
    </View>);
  }

  renderTracks(props: WmSliderProps) {
    const width = this.state.track?.width || 0;
    const sDataValue = this.getScaledDataValue();
    const isRangeSlider = props.range && sDataValue.length > 1;
    return (
      <GestureDetector gesture={this.trackGesture}>
        <TouchableOpacity
          activeOpacity={1}
          style={[this.styles.track, this.styles.trackStyle]}
          onLayout={this.onLayoutChange}
          {...this.getTestProps()}
          {...getAccessibilityProps(AccessibilityWidgetType.SLIDER, props)}>
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
    );
  }

  renderWidget(props: WmSliderProps) {
    const sDataValue = this.getScaledDataValue();
    return (
      <View style={this.styles.root}>
        {this._background}
        {!props.showmarkers && !props.showtooltip? this.renderOldMarkerStyle(props) : null}
        {this.renderTracks(props)}
        <View style={{ flexDirection: 'row' }}>
          {props.showmarkers ? this.renderMarkers(props) : null}
          {this.renderToolTips(props)}
        </View>
      </View>
    );
  }
}
