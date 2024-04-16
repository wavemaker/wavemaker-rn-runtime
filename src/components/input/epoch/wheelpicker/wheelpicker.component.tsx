import React, {createRef} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import WmWheelPickerProps from './wheelpicker.props';
import { DEFAULT_CLASS, WmWheelPickerStyles } from './wheelpicker.styles';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

export class WmWheelPickerState extends BaseComponentState<WmWheelPickerProps> {
  selectedIndex: number = 0;
}

export class WmWheelScrollPicker extends BaseComponent<WmWheelPickerProps, WmWheelPickerState,
 WmWheelPickerStyles> {
  wheelPickerRef: any = null;

  constructor(props: WmWheelPickerProps) {
    super(props, DEFAULT_CLASS);

    this.wheelPickerRef = createRef();
  }

  initialScrollTo() {
    const props = this.props;
    const y = props.itemHeight * props.selectedIndex;
    this.wheelPickerRef?.current?.scrollTo?.({y: y, animated: false});
    this.setState({
      selectedIndex: props.selectedIndex || 0,
    });
  }

  handleWheelScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // console.log('scroll =>', event.nativeEvent.contentOffset);
    const selectedIdx = Math.round(
      event.nativeEvent.contentOffset.y / this.props.itemHeight,
    );

    this.setState({
      selectedIndex: selectedIdx,
    });
  };

  handleWheelMomentumEnd = () => {
    const props = this.props;
    const state = this.state;

    const selectedData = props.data[state.selectedIndex];
    this.props.onValueChange?.(selectedData, state.selectedIndex);
  };

  renderWidget(props: WmWheelPickerProps) {
    const state = this.state;
    const styles = this.styles;
    const {data, wrapperHeight, itemHeight} = props;
    const scrollOffset = (wrapperHeight - itemHeight) / 2;

    return (
      <View style={[styles.root, {height: wrapperHeight}]}>
        <ScrollView
          ref={this.wheelPickerRef}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingVertical: scrollOffset}}
          showsVerticalScrollIndicator={false}
          onLayout={() => this.initialScrollTo()}
          onScroll={this.handleWheelScroll}
          onMomentumScrollEnd={this.handleWheelMomentumEnd}
          decelerationRate="fast"
          snapToInterval={itemHeight} // your snap points
        >
          {data.map((item, index) => {
            const isSelected = index === state.selectedIndex;

            return (
              <View
                key={`data_item_${index}`}
                style={[styles.center, styles.itemBg, {height: itemHeight}]}>
                <Text
                  style={
                    isSelected ? [styles.selectedItemText] : [styles.itemText]
                  }>
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={[
            styles.selectedItemBg,
            {
              height: itemHeight,
              top: scrollOffset,
            },
          ]}
        />
      </View>
    );
  }
}

export default WmWheelScrollPicker;
