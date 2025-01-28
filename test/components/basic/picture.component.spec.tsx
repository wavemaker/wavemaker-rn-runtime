import React, { createRef } from 'react';
import { Image } from 'react-native';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
// import * as lodash from 'lodash-es';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import { defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

const renderComponent = (props = {}) => {
  const defaultProps = {
    animation: null,
    animationdelay: null,
    picturesource: null,
    pictureplaceholder:
      'https://www.wavemaker.com/wp-content/uploads/2024/02/WaveMaker-Logo-1.svg',
    shape: null,
    isSvg: null,
    resizemode: 'stretch',
    name: 'wm',
  };

  const loadAsset = (path) => path;

  return render(
    <AssetProvider value={loadAsset}>
      <WmPicture {...defaultProps} {...props} />
    </AssetProvider>
  );
};

const getStyleObject = (styleArr, styleObj) => {
  if (!styleArr) return;

  if (!Array.isArray(styleArr)) {
    Object.keys(styleArr).forEach((key) => {
      styleObj[key] = styleArr[key];
    });

    return;
  }

  styleArr.forEach((item) => {
    getStyleObject(item, styleObj);
  });

  return styleObj;
};

describe('Picture component', () => {
  afterEach(() => {
    const DEFAULT_CLASS = 'app-picture';
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
      const defaultStyles = defineStyles({
        root: {
          overflow: 'hidden',
          width: 270,
          rippleColor: themeVariables.transparent,
        },
        text: {},
        picture: {
          width: '100%',
          height: '100%',
        },
        skeleton: {
          root: {
            width: '100%',
            height: 128,
          },
        },
      });

      addStyle(DEFAULT_CLASS, '', defaultStyles);
      addStyle('rounded-image', '', {
        picture: {
          borderRadius: 6,
        },
      });
      addStyle('thumbnail-image', '', {
        root: {
          backgroundColor: themeVariables.pictureThumbBgColor,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: themeVariables.pictureThumbBorderColor,
          borderRadius: 6,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 8,
          paddingRight: 8,
        },
      });
    });

    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render component when image source is falsy', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      pictureplaceholder: null,
      picturesource: null,
    });

    await waitFor(() => {
      expect(Array.isArray(tree.toJSON())).toBe(false);
      expect(tree.toJSON().children).toBeNull();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render image when full path is not present', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      pictureplaceholder: 'WaveMaker-Logo-1.svg',
    });
    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByTestId('wm_picture')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render image with source from picturesource when both picturesource and pictureplaceholder is present', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      pictureplaceholder: 'placeholder-image.png',
      picturesource: 'WaveMaker-Logo-1.svg',
    });
    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByTestId('wm_picture')).toBeTruthy();
      expect(tree.getByTestId('wm_picture').props.source).toBe(
        'WaveMaker-Logo-1.svg'
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render component', async () => {
    const customRef = createRef();
    const tree = renderComponent({ ref: customRef });
    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByTestId('wm_picture')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  // TODO: Check why updateStateMock is called only once but it should call twice.
  // test('should render component with width and height extracted from Image component of react-native', async () => {
  //   const height = 122;
  //   const width = 123;
  //   // const lodashMock = jest.spyOn(lodash, 'isNumber').mockReturnValue(true);
  //   jest.spyOn(Image, 'resolveAssetSource').mockReturnValue({
  //     height,
  //     width,
  //     scale: 1,
  //     uri: ''
  //   })

  //   const customRef = createRef();
  //   const tree = renderComponent({
  //     ref: customRef,
  //     // isSvg: true,
  //     picturesource: 1,
  //     pictureplaceholder: null,
  //     styles: {
  //       root: {
  //         height: 130
  //       }
  //     }
  //    });
  //   const updateStateMock = jest.spyOn(customRef.current, 'updateState');
  //   act(() => {
  //     customRef.current.setState({
  //       naturalImageWidth: 10,
  //       naturalImageHeight: 10,
  //     });
  //   });
  //   const childElementWithLayout = tree.toJSON().children[0];

  //   fireEvent(childElementWithLayout, 'layout', {
  //     nativeEvent: {
  //       layout: {
  //         width: 100,
  //         height: 100,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     expect(updateStateMock).toHaveBeenCalledWith({
  //       naturalImageWidth: width,
  //       naturalImageHeight: height,
  //     })
  //     expect(tree.getByTestId('wm_picture')).toBeTruthy();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });

  test('should render component style according to root style', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      styles: {
        root: {
          height: '104',
          backgroundColor: '#000',
        },
      },
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    const componentStyleArr = tree.toJSON()[1].props.style;
    const componentStyle = getStyleObject(componentStyleArr, {});

    await waitFor(() => {
      expect(tree.getByTestId('wm_picture')).toBeTruthy();
      expect(componentStyle).toMatchObject({
        height: '104',
        backgroundColor: '#000',
      });
      expect(tree).toMatchSnapshot();
    });
  });

  test('should apply correct accessiblitylabel', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByLabelText('wm-picture')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should not render the component when show props is false', () => {
    const tree = renderComponent({
      isSvg: 'no',
      show: false,
    });

    const componentStyleArr = tree.toJSON()[1].props.style;
    const componentStyle = {};
    componentStyleArr.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        componentStyle[key] = item[key];
      });
    });

    expect(componentStyle).toMatchSnapshot({ height: 0, width: 0 });
    expect(tree).toMatchSnapshot();
  });

  test('should apply accessibilityrole correctly', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByRole('wm-picture-role')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render component width according to naturalImageWidth and naturalImageHeight state of the component when native width of the device is falsy', async () => {
    const naturalImageWidth = 10;
    const naturalImageHeight = 10;
    const nativeHeight = 100;

    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      styles: {
        root: {
          height: '100%',
        },
      },
    });
    const updateStateMock = jest.spyOn(customRef.current, 'updateState');

    act(() => {
      customRef.current.setState({
        naturalImageWidth: naturalImageWidth,
        naturalImageHeight: naturalImageHeight,
        imageWidth: 100,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          height: nativeHeight,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByTestId('wm_picture')).toBeTruthy();
      expect(updateStateMock).toHaveBeenCalledWith({
        imageHeight: nativeHeight,
        imageWidth: (nativeHeight * naturalImageWidth) / naturalImageHeight,
      });
      expect(tree).toMatchSnapshot();
    });
  });

  test('should not update state when native layout height and width are falsy', async () => {
    const naturalImageWidth = 10;
    const naturalImageHeight = 10;

    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      styles: {
        root: {
          height: '100%',
        },
      },
    });
    const updateStateMock = jest.spyOn(customRef.current, 'updateState');

    act(() => {
      customRef.current.setState({
        naturalImageWidth: naturalImageWidth,
        naturalImageHeight: naturalImageHeight,
        imageWidth: 100,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {},
      },
    });

    await waitFor(() => {
      expect(tree.getByTestId('wm_picture')).toBeTruthy();
      expect(updateStateMock).not.toHaveBeenCalled();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should apply the resize mode in Image component from resizemode prop', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      resizemode: 'contain',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.getByLabelText('wm-picture')).toBeTruthy();
      expect(tree.getByLabelText('wm-picture').props.resizeMode).toBe(
        'contain'
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should not render Image component when native layout height is not present', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      resizemode: 'contain',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.queryByLabelText('wm-picture')).toBeNull();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should not render Image component when native layout width is not present', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      resizemode: 'contain',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          height: 100,
        },
      },
    });

    await waitFor(() => {
      expect(tree.queryByLabelText('wm-picture')).toBeNull();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render Image component style according to shape prop as circle', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      shape: 'circle',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          height: 100,
          width: 100,
        },
      },
    });

    await waitFor(() => {
      const imageComponent = tree.queryByLabelText('wm-picture');
      const imageComponentStyleArr = imageComponent.props.style;
      const imageComponentStyle = {};
      imageComponentStyleArr.forEach((item) => {
        Object.keys(item).forEach((key) => {
          imageComponentStyle[key] = item[key];
        });
      });

      expect(imageComponentStyle).toMatchObject({ borderRadius: 50 });
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render Image component style according to shape prop as rounded', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      shape: 'rounded',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          height: 100,
          width: 100,
        },
      },
    });

    await waitFor(() => {
      const theme = customRef.current.theme.getStyle('rounded-image');
      const imageComponent = tree.getByLabelText('wm-picture');
      const imageComponentStyleArr = imageComponent.props.style;
      const imageComponentStyle = {};
      imageComponentStyleArr.forEach((item) => {
        Object.keys(item).forEach((key) => {
          imageComponentStyle[key] = item[key];
        });
      });

      expect(imageComponentStyle).toMatchObject(theme.picture);
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render Image component style according to shape prop as thumbnail', async () => {
    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      shape: 'thumbnail',
    });

    act(() => {
      customRef.current.setState({
        naturalImageWidth: 10,
        naturalImageHeight: 10,
      });
    });

    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          height: 100,
          width: 100,
        },
      },
    });

    await waitFor(() => {
      const theme = customRef.current?.theme.getStyle('thumbnail-image');
      const componentStyleArr = tree.toJSON()[1].props.style;
      const componentStyle = {};
      componentStyleArr.forEach((item) => {
        if (!item) return;
        Object.keys(item).forEach((key) => {
          componentStyle[key] = item[key];
        });
      });

      expect(componentStyle).toMatchObject(theme.root);
      expect(tree.getByLabelText('wm-picture')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should be null when isSvg prop is falsy and naturalImageWidth state is falsy', () => {
    const tree = renderComponent({
      isSvg: null,
    });

    expect(Array.isArray(tree.toJSON())).toBe(false);
    expect(tree.toJSON().children).toBeNull();
  });

  test('should render skeleton when showskeleton prop is true', () => {
    const tree = renderComponent({
      showskeleton: true,
      styles: {
        root: {
          height: 125,
          width: 125,
        },
      },
    });

    expect(tree.toJSON()[1].props.style).toMatchObject({
      height: 125,
      width: 125,
    });
    expect(tree).toMatchSnapshot();
  });

  test('should render skeleton when showskeleton prop is true with skeletonheight and skeletonwidth provided in props', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: 200,
      skeletonwidth: 125,
    });

    expect(tree.toJSON()[1].props.style).toMatchObject({
      height: 200,
      width: 125,
    });
    expect(tree).toMatchSnapshot();
  });

    it('should return null when required properties are missing', () => {
      const customRef = createRef();
      const instance = renderComponent({
        ref: customRef,
        pictureplaceholder: 'WaveMaker-Logo-1.svg',
      }).UNSAFE_getByType(WmPicture).instance;
  
    
      const state1 = {};
      const state2 = { naturalImageHeight: 100 };
      const state3 = { naturalImageHeight: 100, naturalImageWidth: 50 };
  
      expect(instance.calculateHeightIfNeeded(state1)).toBeNull();
      expect(instance.calculateHeightIfNeeded(state2)).toBeNull();
      expect(instance.calculateHeightIfNeeded(state3)).toBeNull();
    });
  
    it('should calculate and return height correctly', () => {
      const customRef = createRef();
      const state = {
        naturalImageHeight: 300,
        naturalImageWidth: 200,
        originalContainerWidth: 150,
      };
      const instance = renderComponent({
        ref: customRef,
        pictureplaceholder: 'WaveMaker-Logo-1.svg',
      }).UNSAFE_getByType(WmPicture).instance;
      instance.state = state;
      expect(instance.calculateHeightIfNeeded(state)).toBe(225);
    });

  xit('should render skeleton with styles with respect to shape as rounded', async () => {
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
      addStyle('rounded-image', '', {
        picture: {
          height: 125,
          width: 125,
        },
      });
    });

    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      shape: 'rounded',
      showskeleton: true,
      styles: {
        root: {
          height: null,
          width: null,
        },
      },
    });

    act(() => {
      customRef.current.setState({
        imageWidth: 100,
        imageHeight: 100,
      });
    });

    const theme = customRef.current.theme.getStyle('rounded-image');
    const imageComponentStyle = tree.toJSON()[1].props.style;
    await waitFor(() => {
      expect(imageComponentStyle.height).toBe(theme.picture.height);
      expect(imageComponentStyle.width).toBe(theme.picture.width);
      expect(tree).toMatchSnapshot();
    });
  });

  xit('should render skeleton with styles with respect to shape as thumbnail', async () => {
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
      addStyle('thumbnail-image', '', {
        root: {
          height: 125,
          width: 125,
        },
      });
    });

    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      shape: 'thumbnail',
      showskeleton: true,
      styles: {
        root: {
          height: null,
          width: null,
        },
      },
    });

    act(() => {
      customRef.current.setState({
        imageWidth: 100,
        imageHeight: 100,
      });
    });

    const theme = customRef.current.theme.getStyle('thumbnail-image');
    const imageComponentStyle = tree.toJSON()[1].props.style;
    await waitFor(() => {
      expect(imageComponentStyle.height).toBe(theme.root.height);
      expect(imageComponentStyle.width).toBe(theme.root.width);
      expect(tree).toMatchSnapshot();
    });
  });

  xit('should render skeleton with styles with respect to shape as circle', async () => {
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
      addStyle('thumbnail-image', '', {
        root: {
          height: 125,
          width: 125,
        },
      });
    });

    const customRef = createRef();
    const tree = renderComponent({
      ref: customRef,
      accessibilitylabel: 'wm-picture',
      accessibilityrole: 'wm-picture-role',
      shape: 'thumbnail',
      showskeleton: true,
      styles: {
        root: {
          height: null,
          width: null,
        },
      },
    });

    act(() => {
      customRef.current.setState({
        imageWidth: 100,
        imageHeight: 100,
      });
    });

    const theme = customRef.current.theme.getStyle('thumbnail-image');
    const imageComponentStyle = tree.toJSON()[1].props.style;
    await waitFor(() => {
      expect(imageComponentStyle.height).toBe(theme.root.height);
      expect(imageComponentStyle.width).toBe(theme.root.width);
      expect(tree).toMatchSnapshot();
    });
  });
});
