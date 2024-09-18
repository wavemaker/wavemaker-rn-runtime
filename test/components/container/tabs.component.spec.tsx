import React, { createRef, ReactNode, useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import WmTabs from '@wavemaker/app-rn-runtime/components/container/tabs/tabs.component';
import WmTabpane from '@wavemaker/app-rn-runtime/components/container/tabs/tabpane/tabpane.component';

const getBasicTabs = () => {
  const tabs = createRef<WmTabs>();
  const tab1 = createRef<WmTabpane>();
  const tab2 = createRef<WmTabpane>();
  const tab3 = createRef<WmTabpane>();
  return {
    tree: render(
        <WmTabs name="test_tabs" ref={tabs}>
          <WmTabpane name="tab1" title='Red' ref={tab1}></WmTabpane>
          <WmTabpane name="tab2" title='Green' ref={tab2}></WmTabpane>
          <WmTabpane name="tab3" title='Blue' ref={tab3}></WmTabpane>
        </WmTabs>
    ),
    ref: {
      tabs,
      tab1,
      tab2,
      tab3
    }
  };
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('Test Tabs component', () => {
  test('should render the Tabs component', () => {
    const {tree, ref: {tabs}} = getBasicTabs();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
    expect(tree).toMatchSnapshot();
    expect(tabs.current).not.toBeNull();
  });

  test('should select the first tab pane by default', () => {
    const {ref: {tabs, tab1}} = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
  });

  test('should select the tab pane based on header pressed', async () => {
    const {tree, ref: {tabs, tab1, tab3}} = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
    const header3 = tree.getByText('Blue');
    fireEvent(header3, 'press');
    await timer(1000);
    expect(tab3.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
  });

  test('should check the goTo method', async () => {
    const {tree, ref: {tabs, tab1, tab3}} = getBasicTabs();
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
    const {tree, ref: {tabs, tab1, tab3}} = getBasicTabs();
    expect(tab1.current).not.toBeNull();
    expect(tabs.current?.selectedTabPane === tab1.current?.proxy).toBeTruthy();
    expect(tab3.current).not.toBeNull();
    (tab3.current?.proxy as any).select();
    await timer(1000);
    expect(tabs.current?.selectedTabPane === tab3.current?.proxy).toBeTruthy();
  });

  test('should select the tab pane with select method', async () => {
    const tab2 = createRef<WmTabpane>();
    const tree = render(
      <WmTabs name="test_tabs">
        <WmTabpane name="tab1" title='Red'></WmTabpane>
        <WmTabpane name="tab2" title='Green' ref={tab2}  renderPartial={() => {
          return (<Text>TEST_COMPONENT</Text>);
        }}></WmTabpane>
      </WmTabs>
    );
    timer(1000);
    expect(tree.getByText('TEST_COMPONENT')).not.toBeNull();
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
