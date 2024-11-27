import React, { createRef, ReactNode, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import {
  render,
  fireEvent,
  cleanup,
  screen,
} from '@testing-library/react-native';
import WmTabs from '@wavemaker/app-rn-runtime/components/container/tabs/tabs.component';
import WmTabpane from '@wavemaker/app-rn-runtime/components/container/tabs/tabpane/tabpane.component';
import WmTabheader from '@wavemaker/app-rn-runtime/components/container/tabs/tabheader/tabheader.component';

const getBasicTabs = () => {
  const tabs = createRef<WmTabs>();
  const tab1 = createRef<WmTabpane>();
  const tab2 = createRef<WmTabpane>();
  const tab3 = createRef<WmTabpane>();
  return {
    tree: render(
      <WmTabs name="test_tabs" ref={tabs}>
        <WmTabpane name="tab1" title="Red" ref={tab1}></WmTabpane>
        <WmTabpane name="tab2" title="Green" ref={tab2}></WmTabpane>
        <WmTabpane name="tab3" title="Blue" ref={tab3}></WmTabpane>
      </WmTabs>
    ),
    ref: {
      tabs,
      tab1,
      tab2,
      tab3,
    },
  };
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('Test Tabs component', () => {
  test('should render the Tabs component', () => {
    const {
      tree,
      ref: { tabs },
    } = getBasicTabs();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
    expect(tree).toMatchSnapshot();
    expect(tabs.current).not.toBeNull();
  });

  test('should select the first tab pane by default', () => {
    const {
      ref: { tabs, tab1 },
    } = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
  });

  test('should select the tab pane based on header pressed', async () => {
    const {
      tree,
      ref: { tabs, tab1, tab3 },
    } = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
    const header3 = tree.getByText('Blue');
    fireEvent(header3, 'press');
    await timer(1000);
    expect(tab3.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
  });

  test('should check the goTo method', async () => {
    const {
      tree,
      ref: { tabs, tab1, tab3 },
    } = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
    tabs.current?.goToTab(2);
    await timer(1000);
    expect(tab3.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
    tabs.current?.goToTab(-1);
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
    tabs.current?.goToTab(4);
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
    tabs.current?.goToTab(0);
    await timer(1000);
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
  });

  test('should select the tab pane with select method', async () => {
    const {
      tree,
      ref: { tabs, tab1, tab3 },
    } = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
    expect(tab3.current).not.toBeNull();
    (tab3.current?.proxy as any).select();
    await timer(1000);
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
  });

  test('should render the tabs when content is from partial', async () => {
    const tab2 = createRef<WmTabpane>();
    const onLoadMock = jest.fn();

    const tree = render(
      <WmTabs name="test_tabs">
        <WmTabpane name="tab1" title="Red"></WmTabpane>
        <WmTabpane
          name="tab2"
          title="Green"
          ref={tab2}
          onLoad={onLoadMock}
          renderPartial={(props, onLoad) => {
            onLoad();
            return <Text>TEST_COMPONENT</Text>;
          }}
        ></WmTabpane>
      </WmTabs>
    );
    timer(1000);
    expect(tree.getByText('TEST_COMPONENT')).toBeTruthy();
    expect(onLoadMock).toHaveBeenCalled();
  });

  test('should render skeleton loader when showskeleton is "true"', () => {
    const tree = render(
      <WmTabs name="test_tabs" showskeleton={true}>
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
    expect(tree).toMatchSnapshot();
    expect(screen.queryByText('Red')).toBeNull();
    expect(screen.queryByText('Green')).toBeNull();
  });

  test('handles show property correctly', async () => {
    const ref = createRef();
    const tree = render(
      <WmTabs name="test_Popover" show={true} ref={ref}>
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

    expect(tree.root.props.style.width).not.toBe(0);
    expect(tree.root.props.style.height).not.toBe(0);

    ref.current.proxy.show = false;

    await timer(300);

    expect(tree.root.props.style.width).toBe(0);
    expect(tree.root.props.style.height).toBe(0);
  });

  it('should handle tablayout change event', () => {
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
    const viewEle = tree.root.children[1];
    fireEvent(viewEle, 'layout', {
      nativeEvent: nativeEvent,
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
