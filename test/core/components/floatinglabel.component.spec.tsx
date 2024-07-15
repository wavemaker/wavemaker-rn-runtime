import React from 'react';
import { act, render, cleanup, waitFor } from '@testing-library/react-native';
import { FloatingLabel } from '@wavemaker/app-rn-runtime/core/components/floatinglabel.component';
import MockDate from 'mockdate';

const frameTime = 100;
const timeTravel = (time = frameTime) => {
  const tickTravel = () => {
    const now = Date.now();
    MockDate.set(new Date(now + frameTime));
    // Run the timers forward
    act(() => {
      jest.advanceTimersByTime(frameTime);
    });
  };
  // Step through each of the frames
  const frames = time / frameTime;
  for (let i = 0; i < frames; i++) {
    tickTravel();
  }
};

describe('FloatingLabel Component', () => {
  beforeEach(()=> {
    MockDate.set(0);
  })

  afterEach(() => {
    cleanup();
    MockDate.reset();
  });

  test('should apply ellipsizeMode correctly', async () => {
    const { getByText } = render(
      <FloatingLabel label="Ellipsize Label" moveUp={false} />
    );
    timeTravel(200);
    const text = getByText('Ellipsize Label');

    await waitFor(()=>{
      expect(text.props.ellipsizeMode).toBe('tail');
    })
  });

  test('should render the label with default props', () => {
    const { getByText } = render(
      <FloatingLabel label="Test Label" moveUp={true} />
    );

    expect(getByText('Test Label')).toBeTruthy();
  });

  test('should apply additional styles from prop', () => {
    const { getByText } = render(
      <FloatingLabel
        label="Styled Label"
        moveUp={false}
        style={{ color: 'red', fontSize: 20 }}
      />
    );
    const text = getByText('Styled Label');
    expect(text.props.style).toMatchObject({ color: 'red' });
    expect(text.props.style).toMatchObject({ fontSize: 20 });
  });

  test('should animate position and scale when moveUp is true', () => {
    jest.useFakeTimers();
    const { getByText, rerender } = render(
      <FloatingLabel label="Animate Label" moveUp={false} />
    );
    timeTravel(200);

    const initialAnimatedView = getByText('Animate Label').parent?.parent;
    const style = {};
    initialAnimatedView?.props.style.transform.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        style[key] = item[key];
      });
    });

    expect(style).toMatchObject({
      translateY: 0,
      translateX: 0,
      scale: 1,
    });

    rerender(<FloatingLabel label="Animate Label" moveUp={true} />);
    timeTravel(200);

    const animatedView = getByText('Animate Label').parent?.parent;
    const transformStyle = {};
    animatedView.props.style.transform.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        transformStyle[key] = item[key];
      });
    });

    expect(transformStyle).toMatchObject({
      translateY: -16,
      translateX: -16,
      scale: 0.8,
    });

    jest.useRealTimers();
  });

  test('should animate position and scale when moveUp becomes true to false', () => {
    jest.useFakeTimers();

    const { getByText, rerender } = render(
      <FloatingLabel label="Animate Label" moveUp={true} />
    );
    timeTravel(200);

    const initialAnimatedView = getByText('Animate Label').parent?.parent;
    const style = {};
    initialAnimatedView?.props.style.transform.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        style[key] = item[key];
      });
    });

    expect(style).toMatchObject({
      translateY: -16,
      translateX: -16,
      scale: 0.8,
    });

    rerender(<FloatingLabel label="Animate Label" moveUp={false} />);
    timeTravel(200);

    const animatedView = getByText('Animate Label').parent?.parent;
    const transformStyle = {};
    animatedView.props.style.transform.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        transformStyle[key] = item[key];
      });
    });

    expect(transformStyle).toMatchObject({
      translateY: 0,
      translateX: 0,
      scale: 1,
    });
    jest.useRealTimers();

  });

  test('should set correct transformation values based on style', () => {
    jest.useFakeTimers();
    const width = 85;
    const fontSize = 20;

    const { getByText } = render(
      <FloatingLabel
        label="Animate Label"
        moveUp={true}
        style={{
          fontSize: fontSize,
          width: width,
        }}
      />
    );
    timeTravel(200);

    const initialAnimatedView = getByText('Animate Label').parent?.parent;
    const style = {};
    initialAnimatedView?.props.style.transform.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        style[key] = item[key];
      });
    });

    expect(style).toMatchObject({
      translateX: -1 * width * 0.1,
      translateY: -1 * fontSize,
      scale: 0.8,
    });
  });

  jest.useRealTimers();
});
