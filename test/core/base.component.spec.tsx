import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import {
  BaseComponent,
  BaseComponentState,
  BaseProps,
} from '@wavemaker/app-rn-runtime/core/base.component';

interface SampleProps extends BaseProps {
  caption: string;
  onTap?: Function;
}
const DEFAULT_CLASS = 'app-sample-component';

const DEFAULT_STYLES = {
  label: {
    color: 'black',
    fontSize: 20,
  },
};

class SampleComponent extends BaseComponent<
  SampleProps,
  BaseComponentState<SampleProps>
> {
  insProperty = true;
  constructor(props: SampleProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render(): ReactNode {
    super.render();
    const props = this.state.props;
    return (
      <TouchableOpacity
        onPress={() => this.invokeEventCallback('onTap', ['test_data', this])}
      >
        <Text style={this.styles.label}>{props.caption}</Text>
      </TouchableOpacity>
    );
  }
}

describe.skip('Test BaseComponent', () => {
  test('Check validity of sample component', () => {
    const tree = renderer
      .create(<SampleComponent name="test_button" caption="test_label" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Check init callback', () => {
    const onInitFn = jest.fn((i) => {});
    renderer.create(
      <SampleComponent
        name="test_button"
        caption="test_label"
        onInit={onInitFn}
      />
    );
    expect(onInitFn.mock.calls.length).toBe(1);
    const componentInstance = onInitFn.mock.calls[0][0];
    expect(componentInstance.caption).toEqual('test_label');
    componentInstance.caption = 'test_label_modified';
    expect(componentInstance.caption).toEqual('test_label_modified');
  });

  test('Check component properties', () => {
    let componentInstance: any = null;
    renderer.create(
      <SampleComponent
        name="test_button"
        caption="test_label"
        onInit={(i: any) => {
          componentInstance = i;
        }}
      />
    );
    componentInstance.onPropertyChange = jest.fn((name, $new, $old) => {});
    expect(componentInstance.caption).toEqual('test_label');
    expect(componentInstance.onPropertyChange.mock.calls.length).toEqual(0);
    componentInstance.caption = 'test_label_modified';
    expect(componentInstance.caption).toEqual('test_label_modified');
    expect(componentInstance.onPropertyChange.mock.calls.length).toEqual(1);
    const mockCall = componentInstance.onPropertyChange.mock.calls[0];
    expect(mockCall[0]).toEqual('caption');
    expect(mockCall[1]).toEqual('test_label_modified');
    expect(mockCall[2]).toEqual('test_label');
    expect(componentInstance.insProperty).toEqual(true);
    componentInstance.insProperty = false;
    expect(componentInstance.insProperty).toEqual(false);
  });

  test('Check styles', () => {
    let componentInstance: any = null;
    const styles = {
      label: {
        color: 'white',
      },
    };
    renderer.create(
      <SampleComponent
        name="test_button"
        caption="test_label"
        onInit={(i: any) => {
          componentInstance = i;
        }}
      />
    );
    // check default styles
    expect(componentInstance.styles.label.color).toEqual('black');
    renderer.create(
      <SampleComponent
        name="test_button"
        caption="test_label"
        styles={styles}
        onInit={(i: any) => {
          componentInstance = i;
        }}
      />
    );
    expect(componentInstance.styles.label.color).toEqual('white');
  });

  test('Check component events', () => {
    const eventListener = jest.fn((e, w) => {});
    let wrapper = shallow(
      <SampleComponent
        name="test_button"
        caption="test_label"
        onTap={eventListener}
      />
    );
    const tp = wrapper.find(TouchableOpacity);
    expect(tp.length).toEqual(1);
    expect(eventListener.mock.calls.length).toBe(0);
    tp.get(0).props.onPress();
    expect(eventListener.mock.calls.length).toBe(1);
    expect(eventListener.mock.calls[0][1]).toStrictEqual(wrapper.instance());
  });

  test('Check destroy callback', () => {
    const onDestroyFn = jest.fn(() => {});
    const instance = renderer.create(
      <SampleComponent
        name="test_button"
        caption="test_label"
        onDestroy={onDestroyFn}
      />
    );
    expect(onDestroyFn.mock.calls.length).toBe(0);
    instance.unmount();
    expect(onDestroyFn.mock.calls.length).toBe(1);
  });
});
