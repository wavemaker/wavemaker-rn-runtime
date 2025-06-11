import React, { createRef } from 'react';
import { View, Text } from 'react-native';
import WmPopover from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.component';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { ScrollView } from 'react-native-gesture-handler';

const renderComponent = (props = {}) => {
  AppModalService.modalsOpened = [];
  return render(
    <ModalProvider value={AppModalService}>
      <WmPopover name="test_Popover" {...props} />
    </ModalProvider>
  );
};

const fireEventLayoutFun = (component) => {
  return fireEvent(component.root, 'layout', {
    nativeEvent: {
      layout: {
        x: 100,
        y: 100,
        px: 100,
        py: 100,
        width: 200,
        height: 200,
      },
    },
  });
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('Popover component tests', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should render the popover component', () => {
    const tree = renderComponent();
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  //accessibility props
  it('should apply accessibility props correctly', () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      name: 'testButton',
      accessibilitylabel: 'Popover',
      accessibilityrole: 'Popover',
      hint: 'test Popover',
    });
    expect(getByLabelText('Popover')).toBeTruthy();
    expect(getByRole('Popover')).toBeTruthy();
    expect(getByA11yHint('test Popover')).toBeTruthy();
  });

  //Anchor tag
  it('should render the clickable anchor with provided animation, caption, badgeValue', () => {
    const tree = renderComponent({
      animation: 'fadeIn',
      caption: 'Link',
      badgevalue: 200,
    });
    const viewEle = tree.UNSAFE_getByType(Animatedview);
    expect(tree.getByText('Link')).toBeTruthy();
    expect(tree.getByText('200')).toBeTruthy();
    expect(viewEle.props.entryanimation).toBe('fadeIn');
  });

  it('should render the clickable link with provided icon', () => {
    const tree = renderComponent({
      iconclass: 'wm-sl-l sl-home-2',
      iconmargin: 2,
    });
    expect(tree.getByText('home-2')).toBeTruthy();
  });

  it('should render popover content when the clickable link is tapped', async () => {
    const renderPopoverContentMock = jest.spyOn(
      WmPopover.prototype,
      'renderPopoverContent'
    );
    const notifyMock = jest.spyOn(WmPopover.prototype, 'notify');
    const onShowMock = jest.fn();

    const tree = renderComponent({
      title: 'popoverTitle',
      onShow: onShowMock,
      children: (
        <View>
          <Text>Children in WmContainer</Text>
        </View>
      ),
    });

    const viewText = tree.getByText('Link');
    expect(viewText).toBeTruthy();

    fireEvent.press(viewText);

    await timer(300);

    //in popover there is modalService.showModal
    //and in modalprovider value is AppModalService so in AppModalService there is showmodal
    //in showmodal the modal is pushing into modalopened array
    //because of this reason the below one is written
    const renderOptions = AppModalService.modalsOpened[0];

    //in that modal there is content
    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    //and rendering that content to produce snapshot
    const contentTree = render(<Content />);
    expect(contentTree.getByText('popoverTitle')); //popover contentBox title
    expect(contentTree.getByText('Children in WmContainer')).toBeTruthy(); //popover contentBox content

    const ScrollViewEle = contentTree.UNSAFE_getByType(ScrollView);
    expect(ScrollViewEle).not.toBeNull();
    expect(ScrollViewEle).toBeDefined();
    //fireEvent
    fireEvent(ScrollViewEle, 'scroll');

    await waitFor(() => {
      expect(onShowMock).toHaveBeenCalled();
      expect(renderPopoverContentMock).toHaveBeenCalled();
      expect(notifyMock).toHaveBeenCalled();
    });
  });

  //AutoOpen = true
  it('should render popover content by default when autoopen is true', async () => {
    const renderPopoverContentMock = jest.spyOn(
      WmPopover.prototype,
      'renderPopoverContent'
    );
    const notifyMock = jest.spyOn(WmPopover.prototype, 'notify');
    const onShowMock = jest.fn();

    const tree = renderComponent({
      onShow: onShowMock,
      autoopen: true,
      title: 'popoverTitle',
      children: (
        <View>
          <Text>Children in WmContainer</Text>
        </View>
      ),
    });

    const viewText = tree.getByText('Link');
    expect(viewText).toBeTruthy();

    const renderOptions = AppModalService.modalsOpened[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    const contentTree = render(<Content />);
    expect(contentTree.getByText('popoverTitle')); //popover contentBox title
    expect(contentTree.getByText('Children in WmContainer')).toBeTruthy(); //popover contentBox content

    const ScrollViewEle = contentTree.UNSAFE_getByType(ScrollView);
    expect(ScrollViewEle).not.toBeNull();
    expect(ScrollViewEle).toBeDefined();

    //fireEvent to scroll
    fireEvent(ScrollViewEle, 'scroll');

    await timer();

    await waitFor(() => {
      expect(onShowMock).toHaveBeenCalled();
      expect(renderPopoverContentMock).toHaveBeenCalled();
      expect(notifyMock).toHaveBeenCalled();
    });
  });

  //Auto Close = always
  it('should autoclose the popover modal when one of the item is selected if autoclose = "always"', async () => {
    const onHideMock = jest.fn();

    const props = {
      title: 'contentTitle',
      autoclose: 'always',
      onHide: onHideMock,
    };

    AppModalService.modalsOpened = [];
    const tree = render(
      <ModalProvider value={AppModalService}>
        <WmPopover name="test_Popover" {...props}>
          <Text>test_label</Text>
        </WmPopover>
      </ModalProvider>
    );

    const viewText = tree.getByText('Link');
    expect(viewText).toBeTruthy();

    //fireevent to open
    fireEvent.press(viewText);

    await timer(300);

    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    const contentTree = render(<Content />);

    const viewEle = contentTree.getByText('test_label');
    expect(viewEle).toBeTruthy();
    await timer();

    expect(contentTree.getByText('contentTitle')).toBeTruthy();

    //fireevent to close
    fireEvent(viewEle, 'press');

    await waitFor(() => {
      expect(onHideMock).toHaveBeenCalled();
    });
  });

  //Auto Close = disabled
  it('should not autoclose the popover modal when selected if autoclose=" disabled "', async () => {
    const onHideMock = jest.fn();

    //render
    const tree = renderComponent({
      title: 'contentTitle',
      autoclose: 'disabled',
      onHide: onHideMock,
      renderPartial: (props, onLoad) => {
        return <Text>test_label</Text>;
      },
    });

    const viewText = tree.getByText('Link');
    expect(viewText).toBeTruthy();

    //fireevent to open
    fireEvent.press(viewText);

    await timer(300);

    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    const contentTree = render(<Content />);
    await timer();

    const viewEle = contentTree.getByText('test_label');
    expect(viewEle).toBeTruthy();

    expect(contentTree.getByText('contentTitle')).toBeTruthy();

    //fireevent to close
    fireEvent(viewEle, 'press');
    await timer();

    expect(onHideMock).not.toHaveBeenCalled();
  });

  //onLoad Event
  it('should invoke onLoad callback when popover content is loaded if content source is from partial', async () => {
    const onLoadMock = jest.fn();

    //render
    const tree = renderComponent({
      title: 'contentTitle',
      onLoad: onLoadMock,
      renderPartial: (props, onLoad) => {
        onLoad();
      },
    });

    //fireEvent to open
    const viewEle = tree.getByText('Link');
    fireEventLayoutFun(tree);
    fireEvent.press(viewEle);

    await timer(300);
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    const contentTree = render(<Content />);

    expect(contentTree.getByText('contentTitle')).toBeTruthy();

    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });

  it('should call prepareModalOptions method and update the state, when ontap event is invoked', async () => {
    const prepareModalOptionsMock = jest.spyOn(
      WmPopover.prototype,
      'prepareModalOptions'
    );
    const ref = createRef<WmPopover>();

    //render
    const tree = renderComponent({ ref: ref, contentanimation: 'bounceIn' });

    //fireevent to open
    const viewEle = tree.getByText('Link');
    fireEventLayoutFun(tree);
    fireEvent.press(viewEle);

    await waitFor(() => {
      expect(prepareModalOptionsMock).toHaveBeenCalled();
      const viewEle = ref.current.state.modalOptions;
      expect(viewEle.animation).toBe('bounceIn');
      expect(viewEle.centered).toBe(true);
    });
  });

  //onlayout
  it('should update the (state - position) when default popoverwidth provided in props', async () => {
    const ref = createRef<WmPopover>();
    //render
    const tree = renderComponent({ type: 'dropdown', ref: ref });
    // fireEventLayoutFun(tree);
    const viewEle = tree.getByText('Link');
    fireEventLayoutFun(tree);
    fireEvent.press(viewEle);

    const x = 10,
      y = 20;
    const width = 100,
      height = 200;
    const px = 30,
      py = 40;
    ref.current.view.measure = (fun: Function) => {
      fun(x, y, width, height, px, py);
    };
    ref.current.computePosition();
    await waitFor(() => {
      expect(ref.current.state.position.left).toBe(px),
        expect(ref.current.state.position.top).toBe(py + height);
    });
  });
  it('should use stable modal options reference when hiding modal', async () => {
  AppModalService.modalsOpened = [];
  AppModalService.animatedRefs = [{ triggerExit: jest.fn() }]; // Mock with triggerExit function
  
  const hideModalSpy = jest.spyOn(AppModalService, 'hideModal').mockImplementation(() => {
    AppModalService.modalsOpened = [];
  });
  
  const ref = createRef<WmPopover>();
  const tree = renderComponent({ ref: ref as any });
  const viewEle = tree.getByText('Link');
  
  fireEvent.press(viewEle);
  await timer(300);
  
  const originalOptions = AppModalService.modalsOpened[0];
  
  (ref.current as any).setState({ modalOptions: {} });
  
  (ref.current as any).hide();
  
  expect(hideModalSpy).toHaveBeenCalled();
  
  hideModalSpy.mockRestore();
  AppModalService.modalsOpened = [];
  AppModalService.animatedRefs = [];
});

it('should not call hideModal when modal is already closed', async () => {
  AppModalService.modalsOpened = [];
  AppModalService.animatedRefs = [];
  
  const hideModalSpy = jest.spyOn(AppModalService, 'hideModal');
  const ref = createRef<WmPopover>();
  
  const tree = renderComponent({ ref: ref as any });
  
  // Set modal as closed
  (ref.current as any).setState({ isOpened: false });
  
  // Try to hide
  (ref.current as any).hide();
  
  expect(hideModalSpy).not.toHaveBeenCalled();
  
  // Cleanup
  hideModalSpy.mockRestore();
});

it('should cleanup hide function in onClose callback', async () => {
  AppModalService.modalsOpened = [];
  AppModalService.animatedRefs = [];
  
  const ref = createRef<WmPopover>();
  const tree = renderComponent({ ref: ref as any });
  
  // Open popover
  fireEvent.press(tree.getByText('Link'));
  await timer(300);
  
  const originalHide = (ref.current as any).hide;
  
  // Trigger onClose manually (not through AppModalService to avoid triggerExit)
  const modalOptions = AppModalService.modalsOpened[0];
  if (modalOptions && modalOptions.onClose) {
    modalOptions.onClose();
  }
  
  // Hide function should be replaced with no-op
  expect((ref.current as any).hide).not.toBe(originalHide);
  expect(typeof (ref.current as any).hide).toBe('function');
  
  // Cleanup
  AppModalService.modalsOpened = [];
});

it('should not call hideModal when modal is already closed', async () => {
  const hideModalSpy = jest.spyOn(AppModalService, 'hideModal');
  const ref = createRef<WmPopover>();
  
  const tree = renderComponent({ ref: ref as any });
  

  (ref.current as any).setState({ isOpened: false });
  
  (ref.current as any).hide();
  
  expect(hideModalSpy).not.toHaveBeenCalled();
  hideModalSpy.mockRestore();
});

it('should cleanup hide function in onClose callback', async () => {
  const ref = createRef<WmPopover>();
  const tree = renderComponent({ ref: ref as any });
  
  fireEvent.press(tree.getByText('Link'));
  await timer(300);
  
  const originalHide = (ref.current as any).hide;
  
  if (AppModalService.modalsOpened[0].onClose) {
    AppModalService.modalsOpened[0].onClose();
  }

  expect((ref.current as any).hide).not.toBe(originalHide);
  expect(typeof (ref.current as any).hide).toBe('function');
});
  it('should update the (state - position) when popoverwidth provided in props', async () => {
    const ref = createRef<WmPopover>();
    //render
    const popoverwidth = '800';
    const tree = renderComponent({
      type: 'dropdown',
      ref: ref,
      popoverwidth: popoverwidth,
    });

    const viewEle = tree.getByText('Link');
    fireEventLayoutFun(tree);
    fireEvent.press(viewEle);

    const x = 10,
      y = 20;
    const width = 100,
      height = 200;
    const px = 30,
      py = 40;
    ref.current.view.measure = (fun: Function) => {
      fun(x, y, width, height, px, py);
    };
    ref.current.computePosition();
    await waitFor(() => {
      expect(ref.current.state.position.left).toBe(
        px + width - parseInt(popoverwidth)
      ),
        expect(ref.current.state.position.top).toBe(py + height);
    });
  });

  //show
  it('should have width and height to be 0 when show is false', () => {
    const tree = renderComponent({ show: false });
    const viewEle = tree.root;
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });
});
