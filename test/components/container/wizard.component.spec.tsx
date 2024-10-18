import React, { createRef, ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmWizard from '@wavemaker/app-rn-runtime/components/container/wizard/wizard.component';

import WmWizardProps from '@wavemaker/app-rn-runtime/components/container/wizard/wizard.props';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react-native';
import WmWizardstep from '@wavemaker/app-rn-runtime/components/container/wizard/wizardstep/wizardstep.component';
import WmWizardstepProps from '@wavemaker/app-rn-runtime/components/container/wizard/wizardstep/wizardstep.props';

// Mock
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

const timer = async (time: number = 100) => {
  await new Promise((resolve: any, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

describe('Test Wizard component', () => {
  const wizardStepPropsObject = { ...new WmWizardstepProps() };
  const wizardPropsObject = { ...new WmWizardProps() };

  const steps = [
    <WmWizardstep
      {...wizardStepPropsObject}
      key={0}
      index={0}
      title="Step 1"
      name="step1"
    >
      <Text>Content of Step 1</Text>
    </WmWizardstep>,
    <WmWizardstep
      {...wizardStepPropsObject}
      key={1}
      index={1}
      title="Step 2"
      name="step2"
    >
      <Text>Content of Step 2</Text>
    </WmWizardstep>,
    <WmWizardstep
      {...wizardStepPropsObject}
      key={2}
      index={2}
      title="Step 3"
      name="step3"
    >
      <Text>Content of Step 3</Text>
    </WmWizardstep>,
  ];

  const defaultProps = {
    actionsalignment: 'right',
    children: steps,
    cancelable: true,
    cancelbtnlabel: 'Cancel',
    donebtnlabel: 'Done',
    nextbtnlabel: 'Next',
    previousbtnlabel: 'Previous',
    defaultstep: 'step1',
    progresstype: 'default',
    headernavigation: true,
  } as unknown as WmWizardProps;

  const renderComponent = (props = {}) => {
    AppModalService.modalsOpened = [];
    return render(
      <ModalProvider value={AppModalService}>
        <WmWizard {...defaultProps} {...props} name="test_wizard" />
      </ModalProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Check validity of sample component', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
  });

  it('renders without crashing', async () => {
    const ref = createRef();
    const tree = renderComponent({ ref });

    await timer(300);

    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeTruthy();
      expect(screen.getByText('Content of Step 1')).toBeTruthy();
    });
  });

  it('should render when defaultstep is none', async () => {
    const tree = renderComponent({ defaultstep: 'none' });
    await timer(500);

    expect(tree).toMatchSnapshot();

    expect(tree.queryByText('Step 1')).toBeNull();
    expect(tree.queryByText('Content of Step 1')).toBeNull();
  });

  it('should navigate to the next step when the next button is clicked', async () => {
    renderComponent();
    await timer(300);

    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeTruthy();
    });
  });

  it('should navigate to the previous step when the previous button is clicked', async () => {
    renderComponent({ defaultstep: 'step2' });
    await timer(300);

    fireEvent.press(screen.getByText(defaultProps.previousbtnlabel));
    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeTruthy();
    });
  });

  it('renders wizard steps', async () => {
    const ref = createRef();
    renderComponent({ ref });
    await timer(300);

    expect(screen.getByText('Step 1')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Content of Step 1')).toBeTruthy();
    });

    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      fireEvent.press(screen.getByText('Step 2'));
      expect(screen.getByText('Content of Step 2')).toBeTruthy();
    });

    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      fireEvent.press(screen.getByText('Step 3'));
      expect(screen.getByText('Content of Step 3')).toBeTruthy();
      expect(screen.getByText(defaultProps.donebtnlabel)).toBeTruthy();
    });
  });

  it('should call onDone callback when the done button is clicked on the last step', async () => {
    const mockDoneCallback = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmWizard.prototype,
      'invokeEventCallback'
    );
    const props = {
      ...defaultProps,
      defaultstep: 'step3',
      onDone: mockDoneCallback,
    };

    renderComponent(props);
    await timer(300);

    fireEvent.press(screen.getByText('Done'));
    await waitFor(() => {
      expect(mockDoneCallback).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onDone',
        expect.anything()
      );
    });
  });

  it('should call onCancel callback when the cancel button is clicked', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmWizard.prototype,
      'invokeEventCallback'
    );
    const mockCancelCallback = jest.fn();
    const props = { ...defaultProps, onCancel: mockCancelCallback };

    const { getByText } = renderComponent(props);
    await timer(300);

    fireEvent.press(getByText('Cancel'));
    await waitFor(() => {
      expect(mockCancelCallback).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onCancel',
        expect.anything()
      );
    });
  });

  it('should call onSkip callback when the skip button is clicked', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmWizard.prototype,
      'invokeEventCallback'
    );
    const steps = [
      <WmWizardstep
        {...wizardStepPropsObject}
        key={0}
        index={0}
        title="Step 1"
        name="step1"
        enableskip={true}
      >
        <Text>Content of Step 1</Text>
      </WmWizardstep>,
      <WmWizardstep
        {...wizardStepPropsObject}
        key={1}
        index={1}
        title="Step 2"
        name="step2"
        enableskip={true}
      >
        <Text>Content of Step 2</Text>
      </WmWizardstep>,
      <WmWizardstep
        {...wizardStepPropsObject}
        key={2}
        index={2}
        title="Step 3"
        name="step3"
        enableskip={true}
      >
        <Text>Content of Step 3</Text>
      </WmWizardstep>,
    ];

    const props = {
      ...defaultProps,
      children: steps,
      onSkip: jest.fn(),
    };

    const { getByText } = renderComponent(props);
    await timer(300);

    fireEvent.press(getByText('Skip'));

    await waitFor(() => {
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onChange',
        expect.anything()
      );
    });
  });

  it('should call change function when the next button is clicked', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmWizard.prototype,
      'invokeEventCallback'
    );
    const mockChangeCallback = jest.fn();
    const props = { ...defaultProps, onChange: mockChangeCallback };

    const { getByText } = renderComponent(props);
    await timer(300);

    fireEvent.press(getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      expect(mockChangeCallback).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onChange',
        expect.anything()
      );
    });
  });

  it('should call change function when the previous button is clicked', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmWizard.prototype,
      'invokeEventCallback'
    );
    const mockChangeCallback = jest.fn();
    const props = {
      ...defaultProps,
      defaultstep: 'step2',
      onChange: mockChangeCallback,
    };

    const { getByText } = renderComponent(props);
    await timer(300);

    fireEvent.press(getByText(defaultProps.previousbtnlabel));
    await waitFor(() => {
      expect(mockChangeCallback).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onChange',
        expect.anything()
      );
    });
  });

  it('should align the actions to left', async () => {
    const ref = createRef();
    renderComponent({ actionsalignment: 'left', ref });
    expect(screen).toMatchSnapshot();
    await timer(300);
    expect(screen.root.children[3].props.style[1].flexDirection).toBe('row');
  });

  it('should align the actions to right', async () => {
    const ref = createRef();
    renderComponent({ actionsalignment: 'right', ref });
    await timer(300);
    expect(screen.root.children[3].props.style[1].flexDirection).toBe(
      'row-reverse'
    );
  });

  it('updates default step', async () => {
    renderComponent({ defaultstep: 'step2' });
    await timer(300);

    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeTruthy();
      expect(screen.getByText('Content of Step 2')).toBeTruthy();
    });
  });

  it('should render cancel button', async () => {
    renderComponent();
    await timer(300);
    expect(screen.getByText(defaultProps.cancelbtnlabel)).toBeTruthy();
  });

  it("shouldn't render cancel button", async () => {
    renderComponent({ cancelable: false });
    await timer(300);
    expect(screen.queryByText(defaultProps.cancelbtnlabel)).toBeFalsy();
  });

  it('should handle show property', async () => {
    renderComponent({ show: false });
    await timer(300);
    expect(screen.root.props.style).toMatchObject({
      height: 0,
      width: 0,
    });
  });

  it('should render Progress Circle Header', async () => {
    const renderProgressCircleHeaderSpy = jest.spyOn(
      WmWizard.prototype,
      'renderProgressCircleHeader'
    );
    const tree = renderComponent({ classname: 'progress-circle-header' });
    await timer(300);
    expect(tree).toMatchSnapshot();
    expect(renderProgressCircleHeaderSpy).toHaveBeenCalled();
    renderProgressCircleHeaderSpy.mockRestore();
    expect(
      tree.getByTestId('test_wizard_progress_progresscircle')
    ).toBeTruthy();
  });

  it('renders wizard steps for progress circle header', async () => {
    const ref = createRef();
    renderComponent({ ref, classname: 'progress-circle-header' });
    await timer(300);

    expect(screen.getByText('Step 1')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Content of Step 1')).toBeTruthy();
    });

    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      fireEvent.press(screen.getByText('Step 2'));
      expect(screen.getByText('Content of Step 2')).toBeTruthy();
    });

    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      fireEvent.press(screen.getByText('Step 3'));
      expect(screen.getByText('Content of Step 3')).toBeTruthy();
      expect(screen.getByText(defaultProps.donebtnlabel)).toBeTruthy();
    });
  });

  it('should skip the step when the skip link is clicked', async () => {
    const steps = [
      <WmWizardstep
        {...wizardStepPropsObject}
        key={0}
        index={0}
        title="Step 1"
        name="step1"
        enableskip={true}
      >
        <Text>Content of Step 1</Text>
      </WmWizardstep>,
      <WmWizardstep
        {...wizardStepPropsObject}
        key={1}
        index={1}
        title="Step 2"
        name="step2"
        enableskip={true}
      >
        <Text>Content of Step 2</Text>
      </WmWizardstep>,
      <WmWizardstep
        {...wizardStepPropsObject}
        key={2}
        index={2}
        title="Step 3"
        name="step3"
        enableskip={true}
      >
        <Text>Content of Step 3</Text>
      </WmWizardstep>,
    ];
    renderComponent({ children: steps });
    await timer(300);
    fireEvent.press(screen.getByText('Skip'));
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Skip'));
    await waitFor(() => {
      expect(screen.getByText('Step 3')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Skip'));
  });

  it("should render the default 'Step Title' when title is not defined to wizard step", async () => {
    const steps = [
      <WmWizardstep {...wizardStepPropsObject} key={0} index={0} name="step1">
        <Text>Content of Step 1</Text>
      </WmWizardstep>,
      <WmWizardstep {...wizardStepPropsObject} key={1} index={1} name="step2">
        <Text>Content of Step 2</Text>
      </WmWizardstep>,
      <WmWizardstep {...wizardStepPropsObject} key={2} index={2} name="step3">
        <Text>Content of Step 3</Text>
      </WmWizardstep>,
    ];
    renderComponent({ children: steps });
    await waitFor(() => {
      expect(screen.getByText('Step Title')).toBeTruthy();
    });
  });

  it('should not render prev button when currentStep is less than 0', async () => {
    const ref = createRef();
    renderComponent({ ref, defaultstep: 'step3' });
    await timer(300);

    fireEvent.press(screen.getByText(defaultProps.previousbtnlabel));
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeTruthy();
    });
    fireEvent.press(screen.getByText(defaultProps.previousbtnlabel));
    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeTruthy();
    });
    expect(screen.queryByText(defaultProps.previousbtnlabel)).toBeFalsy();
  });

  it('should not render next button when current step exceeds the the steps length', async () => {
    const ref = createRef();
    renderComponent({ ref, defaultstep: 'step1' });
    await timer(300);

    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeTruthy();
    });
    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      expect(screen.getByText('Step 3')).toBeTruthy();
    });
    expect(screen.queryByText(defaultProps.nextbtnlabel)).toBeFalsy();
  });

  it('should not update current step if invokeEventCallback returns false when next button is pressed', async () => {
    const invokeNextCBSpy = jest.spyOn(WmWizardstep.prototype, 'invokeNextCB');
    invokeNextCBSpy.mockReturnValue(false);
    renderComponent({ defaultstep: 'step1' });
    await timer(300);
    const setActiveSpy = jest.spyOn(WmWizardstep.prototype, 'setActive');
    fireEvent.press(screen.getByText(defaultProps.nextbtnlabel));
    await waitFor(() => {
      expect(invokeNextCBSpy).toHaveBeenCalled();
      expect(setActiveSpy).not.toHaveBeenCalled();
    });
  });

  it('should not update current step if invokeEventCallback returns false when previous button is pressed', async () => {
    const invokePrevCBSpy = jest.spyOn(WmWizardstep.prototype, 'invokePrevCB');
    invokePrevCBSpy.mockReturnValue(false);
    renderComponent({ defaultstep: 'step2' });
    await timer(300);
    fireEvent.press(screen.getByText(defaultProps.previousbtnlabel));
    await waitFor(() => {
      expect(invokePrevCBSpy).toHaveBeenCalled();
    });
  });

  it('should not invoke onSkip callback if current step blocks it', async () => {
    const steps = [
      <WmWizardstep
        {...wizardStepPropsObject}
        key={0}
        index={0}
        title="Step 1"
        name="step1"
        enableskip={true}
      >
        <Text>Content of Step 1</Text>
      </WmWizardstep>,
      <WmWizardstep
        {...wizardStepPropsObject}
        key={1}
        index={1}
        title="Step 2"
        name="step2"
        enableskip={true}
      >
        <Text>Content of Step 2</Text>
      </WmWizardstep>,
      <WmWizardstep
        {...wizardStepPropsObject}
        key={2}
        index={2}
        title="Step 3"
        name="step3"
        enableskip={true}
      >
        <Text>Content of Step 3</Text>
      </WmWizardstep>,
    ];

    const invokeNextCBSpy = jest.spyOn(WmWizardstep.prototype, 'invokeNextCB');
    invokeNextCBSpy.mockReturnValue(false);
    renderComponent({ children: steps });
    await timer(300);
    fireEvent.press(screen.getByText('Next'));
    const invokeSkipCBSpy = jest.spyOn(WmWizardstep.prototype, 'invokeSkipCB');
    await waitFor(() => {
      expect(invokeNextCBSpy).toHaveBeenCalled();
    });
  });

  test('render skeleton if showskeleton is true and showskeletonchildren is false', async () => {
    const renderSkeletonSpy = jest.spyOn(WmWizard.prototype, 'renderSkeleton');

    const tree = renderComponent({
      showskeleton: true,
      showskeletonchildren: false,
    });
    expect(screen).toMatchSnapshot();

    expect(renderSkeletonSpy).toHaveBeenCalled();
    const viewElement = tree.root;
    expect(viewElement.props.style.backgroundColor).toBe('#eeeeee');
    expect(viewElement.props.children[0].props.style).toContainEqual({
      opacity: 0,
    });
    renderSkeletonSpy.mockRestore();
  });

  test('render skeleton if showskeleton is true and showskeletonchildren is true', async () => {
    const renderSkeletonSpy = jest.spyOn(WmWizard.prototype, 'renderSkeleton');

    const tree = renderComponent({
      showskeleton: true,
      showskeletonchildren: true,
    });
    expect(screen).toMatchSnapshot();

    expect(renderSkeletonSpy).toHaveBeenCalled();
    const viewElement = tree.root;
    expect(viewElement.props.style.backgroundColor).toBe('#eeeeee');
    expect(viewElement.props.children[0].props.style).toContainEqual({
      opacity: 0,
    });
    renderSkeletonSpy.mockRestore();
  });
});
