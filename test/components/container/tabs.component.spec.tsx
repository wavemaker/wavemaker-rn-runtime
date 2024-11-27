import React, { createRef, ReactNode, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import {
  render,
  fireEvent,
  cleanup,
  screen,
} from '@testing-library/react-native';
import WmTabs from '@wavemaker/app-rn-runtime/components/container/tabs/tabs.component';

describe('Test Tabs component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmTabs name="test_Tabs"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });

    expect(ref.current.proxy.tabLayout.toString()).toBe(nativeEvent.toString());
  });

  it('should set tab pane heights when layout change event is triggered', () => {
    const ref = createRef();
    const tree = render(
      <WmTabs name="test_Popover" ref={ref}>
        <WmTabpane name="tab1" title="Red"></WmTabpane>
        <WmTabpane
          name="tab2"
          title="Green"
          renderPartial={() => {
            return <Text>TEST_COMPONENT</Text>;
          }}
        ></WmTabpane>
      </WmTabs>
    );
    const nativeEvent = {
      layout: {
        width: 100,
        height: 100,
      },
    };
    const viewEle = tree.UNSAFE_getAllByType(WmTabpane)[0].parent;
    fireEvent(viewEle, 'layout', {
      nativeEvent: nativeEvent,
    });

    expect(ref.current.proxy.tabPaneHeights.toString()).toBe(
      nativeEvent.layout.height.toString()
    );
  });

  it('should handle tabheader layout change events', () => {
    const ref = createRef();
    const tree = render(<WmTabheader name="test_Popover" ref={ref} data={[
      {title: 'tab1', icon: 'fa fa-edit', key: 'tab1'},
      {title: 'tab2', icon: 'fa fa-edit', key: 'tab2'},
      {title: 'tab3', icon: 'fa fa-edit', key: 'tab3'},
    ]}/>);
    const nativeEvent = {
      layout: {
        width: 100,
        height: 100,
      },
    };

    ref.current.proxy.setHeaderPanelPositon({ nativeEvent: nativeEvent });
    ref.current.proxy.setHeaderPositon(1, { nativeEvent: nativeEvent });

    expect(ref.current.proxy.headerPanelLayout).toMatchObject(
      nativeEvent.layout
    );

    expect(ref.current.proxy.headersLayout[1]).toMatchObject(
      nativeEvent.layout
    );
  });

  it('should disable scroll when shouldScroll prop is false', () => {
    const ref = createRef();
    const tree = render(<WmTabheader name="test_Popover" shouldScroll={false} ref={ref} data={[
      {title: 'tab1', icon: 'fa fa-edit', key: 'tab1'},
      {title: 'tab2', icon: 'fa fa-edit', key: 'tab2'},
      {title: 'tab3', icon: 'fa fa-edit', key: 'tab3'},
    ]}/>);
    const nativeEvent = {
      layout: {
        width: 100,
        height: 100,
      },
    };

    ref.current.proxy.setHeaderPanelPositon({ nativeEvent: nativeEvent });
    ref.current.proxy.setHeaderPositon(1, { nativeEvent: nativeEvent });

    const scrollComponent = tree.UNSAFE_getByType(ScrollView);

    expect(ref.current.proxy.headerPanelLayout).toMatchObject(
      nativeEvent.layout
    );

    expect(ref.current.proxy.headersLayout[1]).toMatchObject(
      nativeEvent.layout
    );

    expect(scrollComponent.props.scrollEnabled).toBe(false)
  });

  // test('should navigate to next and previous', async () => {
  //   const {tree, ref: {tabs, tab1, tab2, tab3}} = getBasicTabs();
  //   expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
  //   tabs.current?.next();
  //   await timer(1000);
  //   expect(tabs.current?.selectedTabPane === tab2.current?.proxy).toBeTruthy();
  //   tabs.current?.next();
  //   await timer(1000);
  //   expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
  //   tabs.current?.prev();
  //   await timer(1000);
  //   expect(tabs.current?.selectedTabPane === tab2.current?.proxy).toBeTruthy();
  // });
});
