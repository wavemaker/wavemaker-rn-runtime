import React from 'react';
import WmAnchor from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.component';
import { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import mockNavigationService from '../../../__mocks__/navigation.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import * as WmUtils from '@wavemaker/app-rn-runtime/core/utils';
// import WmSkeleton from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import * as accessibilityUtils from '@wavemaker/app-rn-runtime/core/accessibility';

const renderComponent = (props = {}) => {
  const loadAsset = (path) => path;

  return render(
    <NavigationServiceProvider value={mockNavigationService}>
      <AssetProvider value={loadAsset}>
        <WmAnchor {...props} />
      </AssetProvider>
    </NavigationServiceProvider>
  );
};

const getStyleObject = (styleArr, styleObj) => {
  if(!styleArr) return;

  if(!Array.isArray(styleArr)){
    Object.keys(styleArr).forEach(key => {
      styleObj[key] = styleArr[key];
    });

    return;
  }

  styleArr.forEach(item => {
    getStyleObject(item, styleObj);
  });

  return styleObj;
}

describe('Test Anchor component', () => {
  beforeEach(()=>{
    jest
      .spyOn(accessibilityUtils, 'isScreenReaderEnabled')
      .mockReturnValue(false);
  })
  afterEach(() => cleanup());

  test('should render anchor component', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      hyperlink: 'http://example.com',
      encodeurl: false,
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
    });

    expect(tree).toMatchSnapshot();
  });

  test('show render icon along with caption in anchor when iconclass and iconposition is provided in props', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Test caption',
    });

    expect(tree).toMatchSnapshot();
    expect(tree.queryByText('link')).not.toBeNull();
    expect(tree.queryByText('Test caption')).not.toBeNull();
  });

  test('should not trigger navigation when there is no hyperlink', () => {
    const onTapMock = jest.fn();
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      hyperlink: null,
      onTap: onTapMock,
    });
    fireEvent.press(tree.getByText('Click here'));

    waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      expect(mockNavigationService.openUrl).not.toHaveBeenCalled();
    });
  });

  test('should triggers onTap event prop', () => {
    const onTapMock = jest.fn();
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      onTap: onTapMock,
    });
    fireEvent.press(tree.getByText('Click here'));

    waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
    });
  });

  test('should triggers onDoubleTap event prop', () => {
    const onTapMock = jest.fn();
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      onDoubleTap: onTapMock
    });
    fireEvent.press(tree.getByText('Click here'));
    fireEvent.press(tree.getByText('Click here'));

    waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
    });
  });

  test('should triggers onLongTap event prop', () => {
    const onTapMock = jest.fn();
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      onLongTap: onTapMock
    });
    fireEvent(tree.getByText('Click here'), 'longPress');

    waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
    });
  });

  test('should trigger navigation on hyperlink tap', async () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      hyperlink: 'http://example.com',
      encodeurl: false,
      target: '_top',
      onTap: jest.fn(),
    });
    fireEvent.press(tree.getByText('Click here'));

    await waitFor(() => {
      expect(mockNavigationService.openUrl).toHaveBeenCalledWith(
        'http://example.com',
        { target: '_top' }
      );
    });
  });

  test('should trigger navigation on hyperlink tap with the provided hyper link and target to be "_blank" when target is not passed in props', async () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      hyperlink: 'http://example.com',
      onTap: jest.fn(),
    });
    fireEvent.press(tree.getByText('Click here'));

    await waitFor(() => {
      expect(mockNavigationService.openUrl).toHaveBeenCalledWith(
        'http://example.com',
        { target: '_blank' }
      );
    });
  });

  test('should render skeleton when showskeleton is true', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '100',
      skeletonwidth: '50',
      name: 'wm-anchor',
    });

    expect(tree.queryByTestId('test-anchor_caption')).toBeNull();
    expect(tree).toMatchSnapshot();
  });


  //TODO: find a way to set animate state as true in WmSkeleton component.
  test('should render skeleton when showskeleton is true and should take roots height and width', async () => {    
    const tree = renderComponent({
      showskeleton: true,
      name: 'wm-anchor',
      styles: {
        root: {
          width: 80,
          height: 80,
        },
      },
    });

    await waitFor(()=>{
      expect(tree).toMatchSnapshot();
      expect(tree.toJSON().props.style.height).toBe(80);
      expect(tree.toJSON().props.style.width).toBe(80);
    })
  });

  test('should render skeleton when showskeleton is true with skeletonheight and skeletonwidth', async () => {    
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: 88,
      skeletonwidth: 89,
      name: 'wm-anchor',
    });

    await waitFor(()=>{
      expect(tree).toMatchSnapshot();
      expect(tree.toJSON().props.style.height).toBe(88);
      expect(tree.toJSON().props.style.width).toBe(89);
    })
  });

  test('should not render when show props is "false', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      show: false,
    });

    expect(tree.toJSON().props.style).toMatchObject({width: 0, height: 0});
  });

  test('should render the badge correctly for badge value', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      hyperlink: 'http://example.com',
      encodeurl: false,
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 10,
    });
    const badgeElement = tree.getByText('10');

    expect(badgeElement).toHaveProperty('children', ['10']);
    expect(tree).toMatchSnapshot();
  });

  test('renders icon as per given iconClass and iconPosition', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      caption: 'Click here',
      hyperlink: 'http://example.com',
      encodeurl: false,
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      iconclass: 'fa fa-home',
      iconposition: 'top',
      accessibilitylabel: 'wm-icon',
    });

    expect(tree.queryByText('home')).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  test('should render accessibility properties correctly', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      caption: 'Click here',
      hyperlink: 'http://example.com',
      encodeurl: false,
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      iconclass: 'fa fa-home',
      iconposition: 'top',
      accessibilitylabel: 'Anchor',
      hint: 'Go to example.com',
    });
    const anchorComponent = tree.queryByA11yHint('Go to example.com');

    expect(anchorComponent).not.toBeNull();
    expect(tree.queryByLabelText('Anchor')).not.toBeNull();
    expect(tree.queryByAccessibilityHint('Go to example.com')).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  test('handles icon related styles and properties correctly', () => {
    const iconUrl = 'https://docs.wavemaker.com/learn/img/WM_blue_logo.png';

    const tree = renderComponent({
      iconwidth: 20,
      iconheight: 20,
      name: 'test-anchor',
      iconposition: 'left',
      accessibilitylabel: 'anchor',
      iconurl: iconUrl,
      iconmargin: 10,
      badge: 10,
    });
    const iconComponent = tree.getByTestId('test-anchor_icon_icon');

    expect(iconComponent.props.style.height).toBe(20);
    expect(iconComponent.props.style.width).toBe(20);
    expect(iconComponent.props.style.margin).toBe(10);
    expect(tree).toMatchSnapshot();
  });

  test('should encode URL when encodeurl is true', async () => {
    const encodeUrl = jest.spyOn(WmUtils, 'encodeUrl');

    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
      hyperlink: 'http://example.com',
      encodeurl: true,
    });
    fireEvent.press(tree.getByText('Click here'));

    await waitFor(() => {
      expect(mockNavigationService.openUrl).toHaveBeenCalledWith(
        'http://example.com',
        {
          target: '_blank',
        }
      );

      expect(encodeUrl).toHaveBeenCalled();
    });
  });

  test('should render caption with default value as "Link"', async () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
    });

    expect(tree).toMatchSnapshot();
    expect(tree.queryByText('Link')).not.toBeNull(); // default value of caption is "Link".
  });

  test('should not render caption when falsy value is passed in caption', async () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: '',
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
    });

    expect(tree).toMatchSnapshot();
    expect(tree.queryByText('Link')).toBeNull(); // default value of caption is "Link".
  });

  test('should render icon to the right of caption when iconposition is "right"', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'right',
      caption: 'Click here',
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
    });

    const startingIndex = 1; // as first component is background component;
    const anchorChildren = tree.getByTestId('test-anchor_a').children;
    const anchorStyleArr = tree.getByTestId('test-anchor_a').props.style;
    const anchorStyle = getStyleObject(anchorStyleArr, {});

    expect(anchorStyle).toMatchObject({flexDirection: 'row'})
    expect(anchorChildren[startingIndex].props.accessibilityLabel).toBe('Click here');
    expect(anchorChildren[startingIndex + 1].props.iconclass).toBe('fa fa-link');
    expect(tree).toMatchSnapshot();
  });

  test('should render icon to the left of caption when iconposition is "left"', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'left',
      caption: 'Click here',
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
    });

    const startingIndex = 1; // as first component is background component;
    const anchorChildren = tree.getByTestId('test-anchor_a').children;
    const anchorStyleArr = tree.getByTestId('test-anchor_a').props.style;
    const anchorStyle = getStyleObject(anchorStyleArr, {});

    expect(anchorStyle).toMatchObject({flexDirection: 'row'})
    expect(anchorChildren[startingIndex].props.iconclass).toBe('fa fa-link');
    expect(anchorChildren[startingIndex + 1].props.accessibilityLabel).toBe('Click here');
    expect(tree).toMatchSnapshot();
  });

  test('should render icon to the top of caption when iconposition is "top"', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'top',
      caption: 'Click here',
      animation: 'bounce',
      skeletonwidth: '100%',
      skeletonheight: '100%',
      badgevalue: 5,
      onTap: jest.fn(),
    });

    const startingIndex = 1; // as first component is background component;
    const anchorChildren = tree.getByTestId('test-anchor_a').children;
    const anchorStyleArr = tree.getByTestId('test-anchor_a').props.style;
    const anchorStyle = getStyleObject(anchorStyleArr, {});

    expect(anchorStyle).toMatchObject({flexDirection: 'column'})
    expect(anchorChildren[startingIndex].props.iconclass).toBe('fa fa-link');
    expect(anchorChildren[startingIndex + 1].props.accessibilityLabel).toBe('Click here');
    expect(tree).toMatchSnapshot();
  });

  test('tappable component in anchor should take 100% of width and height when root height and with is provided ', () => {
    const tree = renderComponent({
      id: 'test-anchor',
      iconclass: 'fa fa-link',
      iconposition: 'right',
      caption: 'Click here',
      animation: 'bounce',
      badgevalue: 5,
      onTap: jest.fn(),
      styles: {
        root: {
          height: 81,
          width: 83,
        },
      },
    });

    expect(tree.toJSON().props.style).toMatchObject({
      height: 81,
      width: 83
    });
    expect(tree).toMatchSnapshot();
  });
});
