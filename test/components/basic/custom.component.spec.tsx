import React from 'react';
import { Text, View } from 'react-native';
import { cleanup, render, waitFor } from '@testing-library/react-native';
import WmCustom from '@wavemaker/app-rn-runtime/components/basic/custom/custom.component';

const renderComponent = (props = {}) => {
  const defaultProps = {
    id: 'test-custom',
    renderview: (props) => <Text {...props}>{props.text}</Text>,
    text: 'Custom Content',
    skeletonheight: '100px',
    skeletonwidth: '200px',
    name: 'wm-custom',
    accessibilitylabel: 'wm-custom-label',
  };
  return render(<WmCustom {...defaultProps} {...props} />);
};

describe('Custom component', () => {
  afterEach(() => {
    cleanup();
  });

  test('children should be null or empty when renderview return null', () => {
    const tree = renderComponent({
      renderview: () => null,
    });

    expect(tree.queryByText('Custom Content')).toBeNull();
    expect(tree).toMatchSnapshot();
  });

  test('renders the WmCustom component with given props', () => {
    const tree = renderComponent();
    expect(tree.getByText('Custom Content')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('renders custom view returned by renderview prop', () => {
    const customView = (props) => (
      <View>
        <Text>{props.extraText}</Text>
      </View>
    );
    const { getByText } = renderComponent({
      renderview: customView,
      extraText: 'Extra Text',
    });
    expect(getByText('Extra Text')).toBeTruthy();
  });

  test('should render the WmCustom component with children component', () => {
    const children = <Text>Children component</Text>;
    const renderView = ({ text, children }) => (
      <View>
        <Text>{text}</Text>
        <Text>{children}</Text>
      </View>
    );

    const tree = renderComponent({ children, renderview: renderView });
    expect(tree.getByText('Custom Content')).toBeTruthy();
    expect(tree.getByText('Children component')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('applies styles from props', () => {
    const tree = renderComponent({
      styles: { root: { backgroundColor: 'red' } },
    });

    console.log(tree.toJSON());

    expect(tree.toJSON().props.style).toEqual(
      expect.objectContaining({ backgroundColor: 'red' })
    );
  });

  test('should render skeleton when showskeleton is true', async () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '10px',
      skeletonwidth: '10px',
    });

    expect(tree.toJSON()?.props.style.height).toEqual('10px');
    expect(tree.toJSON()?.props.style.width).toEqual('10px');
    expect(tree.toJSON()?.props.style.backgroundColor).toEqual('#eeeeee');
    expect(tree).toMatchSnapshot();
  });

  test('should render skeleton with root style when showskeleton is true and, skeletonheight and skeletonwidth is not provided or falsy value', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: null,
      skeletonwidth: null,
      styles: {
        root: {
          height: '125px',
          width: '122px',
        },
      },
    });

    expect(tree.toJSON()?.props.style.height).toEqual('125px');
    expect(tree.toJSON()?.props.style.width).toEqual('122px');
    expect(tree.toJSON()?.props.style.backgroundColor).toEqual('#eeeeee');
    expect(tree).toMatchSnapshot();
  });

  test('applies theme styles', () => {
    const themeStyles = {
      root: { backgroundColor: 'green' },
    };
    const tree = render(
      <WmCustom
        id="test-custom"
        renderview={(props) => <Text>{props.text}</Text>}
        text="Custom Content"
        styles={themeStyles}
      />
    );
    const rootElement = tree.toJSON();
    expect(rootElement.props.style).toEqual(
      expect.objectContaining({ backgroundColor: 'green' })
    );
    expect(tree).toMatchSnapshot();
  });
});
