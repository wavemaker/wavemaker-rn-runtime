import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WmPageContent from '@wavemaker/app-rn-runtime/components/page/page-content/page-content.component';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';

import WmContent from '@wavemaker/app-rn-runtime/components/page/content/content.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

class PC_SkeletonTester_Without_Content_Skeleton extends React.Component {
  render() {
     return (<WmContent
      name="content1"
      >
         <WmPageContent showskeleton={true} name="pagecontent1">
            <WmLabel name="test_skeleton"/>
         </WmPageContent>
      </WmContent>
     )
  }
}

class PC_SkeletonTester_With_Content_Skeleton extends React.Component {
  render() {
     return (<WmContent
      name="content1"
      showskeleton={false}
      >
         <WmPageContent showskeleton={true}  name="pagecontent1">
            <WmLabel name="test_skeleton"/>
         </WmPageContent>
      </WmContent>
     )
  }
}


describe('base component test skeleton when page content inside content', () => {
  test('should not show the skeleton', () => {
    render(<PC_SkeletonTester_Without_Content_Skeleton/>)
    expect(() => screen.getByTestId('test_skeleton_caption')).toThrow();
  })

  test('should not show the skeleton', () => {
    render(<PC_SkeletonTester_With_Content_Skeleton/>)
   expect(screen.getByTestId('test_skeleton_caption')).toBeTruthy()
})
})



const renderComponent = (props = {}) => {
  return render(<WmPageContent name="test_Navbar" {...props} />);
};

describe('Test PageContent component', () => {
  it('should render pageContent component', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render root element with backgroundcolor when scrollable prop is true', () => {
    renderComponent();
    const rootEle = screen.root;
    expect(rootEle.props.style.backgroundColor).toBe('#eeeeee');
  });

  it('should render scrollView when scrollable prop is true', () => {
    renderComponent();
    const viewEle = screen.UNSAFE_queryByType(ScrollView);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  it('should not render scrollView when scrollable prop is false', () => {
    renderComponent({ scrollable: false });
    const viewEle = screen.UNSAFE_queryByType(ScrollView);
    expect(viewEle).toBeNull();
  });

  it('should render background Component', () => {
    const tree = renderComponent();
    const viewEle = tree.UNSAFE_queryByType(BackgroundComponent);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  it('when ever user tries to scroll, then onscroll event should render and calls the notify method', () => {
    const notifyMock = jest.spyOn(WmPageContent.prototype, 'notify');
    renderComponent({
      children: (
        <View>
          <Text>children</Text>
        </View>
      ),
    });
    const scrollViewEle = screen.root.children[1];
    fireEvent(scrollViewEle, 'scroll');
    expect(screen.getByText('children')).toBeTruthy();
    expect(notifyMock).toHaveBeenCalled();
  });

  //styles
  xit('should render root element with styles when scrollable prop is false', () => {
    const tree = renderComponent({ scrollable: false });
    const rootEle = screen.root;
    expect(rootEle.props.style.backgroundColor).toBe('#eeeeee');
    expect(rootEle.props.style.minHeight).toBe('100%');
    expect(rootEle.props.style.paddingLeft).toBe(8);
    expect(rootEle.props.style.paddingRight).toBe(8);
    expect(rootEle.props.style.paddingTop).toBe(8);
    expect(rootEle.props.style.paddingBottom).toBe(8);

    const styles = {
      root: {
        paddingLeft: 10,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: 'red',
        minHeight: '100%',
      },
    };
    //rerender
    tree.rerender(<WmPageContent name="test_Navbar" styles={styles} />);
    expect(rootEle.props.style.backgroundColor).toBe('red');
    expect(rootEle.props.style.minHeight).toBe('100%');
    expect(rootEle.props.style.paddingLeft).toBe(10);
    expect(rootEle.props.style.paddingRight).toBe(20);
    expect(rootEle.props.style.paddingTop).toBe(10);
    expect(rootEle.props.style.paddingBottom).toBe(20);
  });

  it('should render children when scrollable prop is false', () => {
    const tree = renderComponent({
      scrollable: false,
      children: (
        <View>
          <Text>children</Text>
        </View>
      ),
    });
    expect(tree.getByText('children')).toBeTruthy();
  });
});
