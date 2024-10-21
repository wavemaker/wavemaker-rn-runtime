import React from 'react';
import { Platform, Image } from 'react-native';
import Lottie from 'react-lottie-player';
import { act, render, waitFor } from '@testing-library/react-native';
import WmSpinner from '@wavemaker/app-rn-runtime/components/basic/spinner/spinner.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

const renderComponent = (props = {}) => {
  const defaultProps = {
    id: 'test-spinner',
    caption: 'Loading...',
    iconclass: 'fa fa-circle-o-notch fa-spin',
    iconsize: 30,
  };
  const loadAsset = (path) => path;

  return render(
    <AssetProvider value={loadAsset}>
      <WmSpinner {...defaultProps} {...props} />
    </AssetProvider>
  );
};

jest.mock('react-lottie-player');

//WmPicture mock
jest.mock(
  '@wavemaker/app-rn-runtime/components/basic/picture/picture.component',
  () => {
    const { View, Text, Image } = require('react-native');
    const CustomComponent = (props) => (
      <View>
        <Text>{props.id}</Text>
        <Image
          source={{ uri: props.picturesource }}
          width={props.imagewidth}
          height={props.imageheight}
        />
      </View>
    );

    return CustomComponent;
  }
);

describe('Spinner component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render component with default props', () => {
    const { toJSON, getByText } = renderComponent();
    expect(getByText('circle-o-notch')).toBeTruthy();
    expect(getByText('Loading...')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  test('should render component with icon when iconclass is provided', () => {
    const props = {
      iconclass: 'fa fa-edit fa-spin',
    };
    const { toJSON, getByText } = renderComponent(props);

    expect(getByText('edit')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  test('renders with image when image is provided', () => {
    const props = {
      image:
        'https://www.wavemaker.com/wp-content/uploads/2024/02/WaveMaker-Logo-1.svg',
      imageheight: '20',
      imagewidth: 20,
    };
    const { toJSON, UNSAFE_queryByType } = renderComponent(props);

    expect(UNSAFE_queryByType(Image)).toBeTruthy();
    expect(UNSAFE_queryByType(Image)?.props.source).toMatchObject({
      uri: props.image,
    });
    expect(toJSON()).toMatchSnapshot();
  });

  xit('renders with lottie when lottie is provided', async () => {
    (Platform as any).OS = 'ios';
    const lottieFileName = 'lottieAnimationData.json';
    const props = {
      iconclass: null,
      image: null,
      lottie: {
        json: lottieFileName,
        loader: 'circleSpinner',
      },
    };
    const { toJSON, getByTestId, getByText } = renderComponent(props);

    await waitFor(() => {
      expect(getByTestId('test-spinner_lottie')).toBeTruthy();
      expect(getByTestId('test-spinner_lottie').props.sourceName).toBe(
        lottieFileName
      );
      expect(getByText('Loading...')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  test('renders caption when caption is provided', () => {
    const { getByText } = renderComponent({ caption: 'Please wait...' });
    const caption = getByText('Please wait...');

    act(() => {
      expect(caption).toBeTruthy();
    });
  });

  test('does not render caption when caption is not provided', () => {
    const props = { caption: null };
    const { queryByText } = renderComponent(props);

    const caption = queryByText('Loading...');
    expect(caption).toBeNull();
  });

  test('adds lottie colors correctly based on theme', () => {
    const props = { lottie: 'spinIcon' };
    const instance = new WmSpinner(props);

    const lottiePath = {
      json: require('./mockData/lottie-animation.json'),
    };
    const coloredLottie = instance.addClasstoLottie(lottiePath);

    expect(coloredLottie).toBeTruthy();
  });

  test('renders lottie player correctly on web', () => {
    (Platform as any).OS = 'web'; // Set platform to web
    const { toJSON, UNSAFE_getByType } = renderComponent({
      lottie: {
        json: require('./mockData/lottie-animation.json'),
        loader: 'circleSpinner',
      },
    });

    expect(UNSAFE_getByType(Lottie)).toBeTruthy(); // react-lottie-player won't show in snapshot as its a web component.
    expect(toJSON()).toMatchSnapshot();
  });
});
