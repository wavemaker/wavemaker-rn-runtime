import React from 'react';
import { Image } from 'react-native';
import { cleanup, render, waitFor } from '@testing-library/react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';

const timer = (time = 200) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const hexToArgbValue = (hex: string) => {
  let hexCode = hex.substring(1);
  if (hexCode.length === 3) {
    hexCode = '' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  hexCode = '0xff' + hexCode;

  return parseInt(hexCode, 16);
};

const formateDecimalValue = (valueInStr: string) => {
  return parseFloat(valueInStr) / 100;
}

const renderComponent = (props = {}) => {
  const defaultProps = {
    size: '100% 100%',
  };

  return render(
    <AssetProvider value={(path) => path}>
      <BackgroundComponent {...defaultProps} {...props} />
    </AssetProvider>
  );
};

// jest.mock('@wavemaker/app-rn-runtime/core/utils', () => {
//   return {
//     isFullPathUrl: jest.fn(),
//   };
// });

jest.mock('@wavemaker/app-rn-runtime/core/imageSizeEstimator', () => ({
  getSize: jest.fn((uri, callback) => {
    callback(100, 200); // mock image dimensions
  }),
}));

describe('Background Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('should render gradient when image prop contains linear-gradient', () => {
    const tree = renderComponent({
      image: 'linear-gradient(45deg, #4c669f, #3b5998)',
    });

    expect(tree.getByTestId('wm-expo-linear-gradient').props.colors).toEqual([
      hexToArgbValue('#4c669f'),
      hexToArgbValue('#3b5998'),
    ]);
    expect(tree).toMatchSnapshot();
  });

  test('should render gradient when image prop contains linear-gradient with decimal values in gradient color', () => {
    const tree = renderComponent({
      image: 'linear-gradient(68.44deg, #EEEEEE 10%, #A61527 41.98%, #C32033 73.75%, #B41227 100%)',
    });

    expect(tree.getByTestId('wm-expo-linear-gradient').props.colors).toEqual([
      hexToArgbValue('#EEEEEE'),
      hexToArgbValue('#A61527'),
      hexToArgbValue('#C32033'),
      hexToArgbValue('#B41227'),
    ]);
    expect(tree.getByTestId('wm-expo-linear-gradient').props.locations).toEqual([
      formateDecimalValue('10%'),
      formateDecimalValue('41.98%'),
      formateDecimalValue('73.75%'),
      formateDecimalValue('100%')
    ])
    expect(tree).toMatchSnapshot();
  });

  test('source should not have "url" prefix of the image string', async () => {
    const props = {
      image: 'url(http://example.com/image.jpg)',
    };

    const tree = renderComponent(props);
    await timer();

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree).toMatchSnapshot();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'repeat',
        source: { uri: 'http://example.com/image.jpg' },
      });
    });
  });

  test('should apply image natural width and height when size is falsy', async () => {
    const props = {
      image: 'url(http://example.com/image.jpg)',
      size: null,
    };

    const tree = renderComponent(props);
    await timer();

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree).toMatchSnapshot();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'repeat',
        source: { uri: 'http://example.com/image.jpg' },
      });

      // value is mocked at the top
      expect(tree.UNSAFE_getByType(Image).props.style).toEqual(
        expect.arrayContaining([
          {
            minHeight: 200,
            minWidth: 100,
          },
        ])
      );
    });
  });

  test('should apply resizeMode correctly', async () => {
    const props = {
      image: 'url(http://example.com/image.jpg)',
      resizeMode: 'center',
    };

    const tree = renderComponent(props);
    await timer();

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree).toMatchSnapshot();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'center',
        source: { uri: 'http://example.com/image.jpg' },
      });
    });
  });

  xit('should apply position center correctly', async () => {
    const props = {
      image: 'url(http://example.com/image.jpg)',
      position: 'center',
    };

    const tree = renderComponent(props);

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'center',
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should apply resizeMode as repeat', async () => {
    const props = {
      image: 'url(http://example.com/image.jpg)',
    };

    const tree = renderComponent(props);

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'repeat',
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render with image file present in project directory', async () => {
    const props = {
      image: 'resources/images/american-impressionism.png',
    };

    const tree = renderComponent(props);
    await timer();

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree).toMatchSnapshot();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'repeat',
        source: 'resources/images/american-impressionism.png',
      });
    });
  });

  test('should update image source if props change', async () => {
    const tree = renderComponent({
      image: 'example.com/image.jpg',
      size: '80% 50%',
    });

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'repeat',
        source: 'example.com/image.jpg',
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            height: '50%',
            width: '80%',
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });

    tree.rerender(
      <AssetProvider value={(path) => path}>
        <BackgroundComponent
          image="example.com/new-image.jpg"
          size="20% 100%"
        />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        resizeMode: 'repeat',
        source: 'example.com/new-image.jpg',
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            height: '100%',
            width: '20%',
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render image when valid image full path is provided', async () => {
    const tree = renderComponent({
      image: 'http://example.com/image.jpg',
    });

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props.source).toMatchObject({
        uri: 'http://example.com/image.jpg',
      });
      expect(tree).toMatchSnapshot();
    });
  });

  test('should set resizeMode based on size prop as "contain"', async () => {
    const tree = renderComponent({
      image: 'http://example.com/image.jpg',
      size: 'contain',
    });

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
        resizeMode: 'contain',
      });
      expect(tree).toMatchSnapshot();
    });
  });

  xit('should render when position has two values', async () => {
    const tree = renderComponent({
      image: 'http://example.com/image.jpg',
      position: '(top, left)',
    });

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            left: 0,
            top: 0,
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });

    tree.rerender(
      <AssetProvider value={(path) => path}>
        <BackgroundComponent
          image="http://example.com/image.jpg"
          position="(top, right)"
        />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            right: 0,
            top: 0,
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });

    tree.rerender(
      <AssetProvider value={(path) => path}>
        <BackgroundComponent
          image="http://example.com/image.jpg"
          position={'(bottom, right)'}
        />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            right: 0,
            bottom: 0,
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });

    tree.rerender(
      <AssetProvider value={(path) => path}>
        <BackgroundComponent
          image="http://example.com/image.jpg"
          position={'(bottom, left)'}
        />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            left: 0,
            bottom: 0,
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render with different repeat props', async () => {
    const tree = renderComponent({
      image: 'http://example.com/image.jpg',
      repeat: 'no-repeat',
      size: null,
    });

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            height: 200,
            width: 100,
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });

    tree.rerender(
      <AssetProvider value={(path) => path}>
        <BackgroundComponent
          image="http://example.com/image.jpg"
          repeat="repeat-x"
          size={null}
        />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
        resizeMode: 'repeat',
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            height: 200,
            width: '100%',
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });

    tree.rerender(
      <AssetProvider value={(path) => path}>
        <BackgroundComponent
          image="http://example.com/image.jpg"
          repeat="repeat-y"
          size={null}
        />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(tree.toJSON()).not.toBeNull();
      expect(tree.UNSAFE_getByType(Image).props).toMatchObject({
        source: { uri: 'http://example.com/image.jpg' },
      });
      expect(tree.UNSAFE_getByType(Image).parent?.props.style).toEqual(
        expect.arrayContaining([
          {
            width: 100,
            height: '100%',
          },
        ])
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
