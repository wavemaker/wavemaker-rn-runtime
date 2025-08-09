import React from 'react';
import { View, Text, LayoutChangeEvent, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { debounce, isNumber, isNil, isArray, isString, last, isEqual, isObject } from 'lodash';
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

  public transform(min: number, max: number, markerRadius: number) {
      const MARKER_RADIUS = markerRadius;
      const adjustedMin = min + MARKER_RADIUS;
      const adjustedMax = max - MARKER_RADIUS;
      const thisMin = (this.ticks ? this.ticks[0]?.markValue : 0) || 0;
      const thisMax = last(this.ticks)?.markValue;
      const factor = thisMax ? (adjustedMax - adjustedMin)/(thisMax - thisMin) : 1;
      const ticks = [] as Tick[];
      this.ticks.forEach((v, i) => {
        const markValue = Math.round(adjustedMin + (v.markValue - this.ticks[0].markValue) * factor)
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
  private positionRefMaksudai: any = React.createRef();
  private tempPosition: any = React.createRef();
  private readonly MARKER_WIDTH = 10; 

  constructor(props: WmSliderProps) {
    super(props, DEFAULT_CLASS, new WmSliderProps());
    this.initScale();
    this.configureGesture(this.trackGesture, 'track');
    this.configureGesture(this.knobGesture, 'lowThumb');
    this.configureGesture(this.highKnobGesture, 'highThumb');
    this.positionRefMaksudai.current = 0;
  }

  private constrainValueToRange(value: any): any {
    const minValue = this.state.props.minvalue;
    const maxValue = this.state.props.maxvalue;
    if (!isDefined(minValue) || !isDefined(maxValue)) {
      return value;
    }
        
    if (isArray(value)) {
      return value.map((val: any) => {
        if (val < minValue) return minValue;
        if (val > maxValue) return maxValue;
        return val;
      });
    } else if (!isNil(value)) {
      if (value < minValue) return minValue;
      if (value > maxValue) return maxValue;
    }
    
    return value;
  }
  private getMarkerWidthFromStyles(): number {
    const cssWidth = this.styles?.markerStyle?.width;
    return (typeof cssWidth === 'number' && cssWidth > 0) ? cssWidth : this.MARKER_WIDTH;
  }
  private getMarkerRadius(): number {
    const markerWidth = this.getMarkerWidthFromStyles();
    const markerHeight = this.styles?.markerStyle?.height as number || markerWidth;
    const trackHeight = this.state.track?.height || 2;
    
    const baseRadius = markerWidth / 2;
    const extraPadding = Math.max(0, (trackHeight - markerHeight) / 2);
    
    return baseRadius + extraPadding;
}
  getValueFromGesture(positionX: number) {
    return this.scale?.ticks[this.uiScale.getTickIndex(positionX)].markValue || 0;
  }

  getPositionFromValue(value: number | string) {
    // Use precise positioning for numeric sliders to support decimal values
    const usePrecisePositioning = this.state?.props?.datatype === 'number';
    const track = this.state?.track;
    let numericValue: any = value;
    if (isString(numericValue)) {
      const convertedNumber = Number(numericValue);
      if (!isNaN(convertedNumber)) {
        numericValue = convertedNumber;
      }
    }
    const min = this.state.props.minvalue;
    const max = this.state.props.maxvalue;
    const width = track?.width ?? 0;

    if (usePrecisePositioning && width > 0 && isNumber(numericValue) && isNumber(min) && isNumber(max) && max !== min) {
      const markerRadius = this.getMarkerRadius();
      const adjustedMinPx = markerRadius;
      const adjustedMaxPx = width - markerRadius;
      const clamped = Math.max(min, Math.min(max, numericValue));
      const ratio = (clamped - min) / (max - min);
      return adjustedMinPx + ratio * (adjustedMaxPx - adjustedMinPx);
    }
    return this.uiScale?.ticks[this.scale.getTickIndex(numericValue)]?.markValue;
  }

  configureGesture(gesture: PanGesture, gestureType: SliderGestureType) {
    gesture
      .maxPointers(1)
      .minDistance(0)
      .onChange(e => {
        const tickLastIndex = this.scale.ticks.length-1
        const max = this.uiScale?.ticks[tickLastIndex]?.markValue;
        const min = this.uiScale?.ticks[0]?.markValue;

        let newValue = this.positionRefMaksudai.current + e.translationX;
        newValue = newValue > max ? max : newValue;
        newValue = newValue < min ? min : newValue;

        this.position.setValue(newValue);
        this.tempPosition.current = newValue;
      })
      .onEnd(e => {
        if (this.state.track) {
          const value = this.getValueFromGesture(this.tempPosition.current);
          this.positionRefMaksudai.current = this.tempPosition.current;
          this.computePosition(value, gestureType);
          this.onSliderChange(value, gestureType);
        }
      })
  }

  getScaledDataValue() {
    let dataValue = this.state.props.datavalue || this.getDataValue();
     dataValue = this.constrainValueToRange(dataValue);
    if (dataValue && this.scale) {
      dataValue = isArray(dataValue) ? dataValue: [dataValue];
      return dataValue.map((d: any) => {
      if (this.state?.props?.datatype === 'number') {
        const convertedNumber = isString(d) ? Number(d) : d;
        const parsedValue = isNaN(convertedNumber as any) ? this.state.props.maxvalue : convertedNumber;
        const tickMatchNum = this.scale?.ticks.find(t => t.datafield === parsedValue);
        return tickMatchNum ? tickMatchNum.markValue : parsedValue;
      }
      const convertedNumber = isString(d) ? Number(d) : d;
      const parsedValue = isNaN(convertedNumber as any) ? d : convertedNumber;
      const tickMatch = this.scale?.ticks.find(t => t.datafield === parsedValue);
      return tickMatch ? tickMatch.markValue : parsedValue;
    });
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
    dataValue = this.constrainValueToRange(dataValue);
    dataValue = isArray(dataValue) ? dataValue: [dataValue];
    if (!this.scale || !this.scale.getTick) {
      return dataValue; 
    }
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
      if (!isEqual($new, $old)) {
        const clampedValue = this.constrainValueToRange($new);
        if (!isEqual(clampedValue, $new)) {
          this.updateState({
            props: {
              datavalue: clampedValue
            }
          } as WmSliderState); 
        }
        const valueForPosition = isArray(clampedValue) ? clampedValue[0] : clampedValue;
        if (isDefined(valueForPosition)) {
          this.computePosition(valueForPosition as number, 'track');
        }
        this.invokeEventCallback('onChange', [null, this, clampedValue, $old]);
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
    const markerRadius = this.getMarkerRadius();
    this.uiScale = this.scale.transform(0, width, markerRadius);
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
    const maxValue = this.state.props.maxvalue;
    const minValue = this.state.props.minvalue;
    const minTick = this.scale.getMinTick();
    const maxTick = this.scale.getMaxTick();
    const props = this.props;
    let tooltipValue = initialValue;
    const updatedPositionInPx = Number(JSON.stringify(value));
    const tick = this.scale?.getTick(tooltipValue);
    // * getting custom tooltip label
    if (tick && props.getToolTipExpression && this.initialized) {
      if (tick.datafield <= minValue && minTick?.dataitem?.dataObject) {
        return props.getToolTipExpression(minTick.dataitem.dataObject);
      }
      if (tick.datafield >= maxValue && maxTick?.dataitem?.dataObject) {
        return props.getToolTipExpression(maxTick.dataitem.dataObject);
      }
      if (tick.dataitem?.dataObject) {
        return props.getToolTipExpression(tick.dataitem.dataObject);
      }
    }
    // If no exact tick match (e.g., decimal value on numeric slider), show the raw value
    if (this.state?.props?.datatype === 'number') {
      const exactTick = this.scale?.ticks.find(t => t.datafield === tooltipValue);
      return exactTick ? exactTick.displayfield : String(tooltipValue);
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

  getLabel = (data: Array<any> | string | undefined, displayFiled: number | string, indexOfMarker: number): string => {
    let title = "";
    if(isString(data)) {
      let formattedData = data.replace(/ ,/g, ',').replace(/, /g, ',');
      title = this.getLabel(formattedData.split(','), displayFiled, indexOfMarker);
    } else if(data && isArray(data) && data[indexOfMarker]) {
      if(isObject(data[indexOfMarker]) && (data[indexOfMarker] as any).title) {
        title = `${(data[indexOfMarker] as {title: string | number, position?: string}).title}`;
      } else if(!isObject(data[indexOfMarker])){
        title = `${data[indexOfMarker]}`
      }
    } else {
      title = `${displayFiled}`; 
    }

    return title;
  }

  getLabelPosition = (data: Array<any> | string | undefined, indexOfMarker: number): string => {
    let position = "up";
    if(data && isArray(data) && data[indexOfMarker]) {
      if(isObject(data[indexOfMarker]) && (data[indexOfMarker] as any).position) {
        position = (data[indexOfMarker] as {title: string | number, position: string}).position;
      }
    }

    return position;
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
    const markerlabeltext = props.markerlabeltext;
    const width = this.state.track?.width || 0;
    return (<View style={{ flexDirection: 'row' }}>
      <View>
        {width ? this.scale.ticks.map((t, i) => {
          const markWidth = this.getMarkerWidthFromStyles();
          const stepwiseLeft = this.getPositionFromValue(t.markValue);
          const labelText = this.getLabel(markerlabeltext, t.displayfield, i);
          const marketLabelPosition = this.getLabelPosition(markerlabeltext, i);
          return (
            <View
              key={i}
              style={[
                this.styles.markerWrapper,
                {
                  left: stepwiseLeft,
                  bottom: markWidth / 2,
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={[
                  this.styles.markerLabel,
                  marketLabelPosition === 'down'?
                  {
                    bottom: (markWidth / 2 + 10 + markWidth) * -1,
                  }: {
                    bottom: (markWidth / 2 + 10),
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
                  this.styles.markerStyle
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
          {...getAccessibilityProps(AccessibilityWidgetType.SLIDER, props)}
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
              this.styles.activeTrackStyle
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
      <View style={this.styles.root} onLayout={(event) => this.handleLayout(event)}>
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