import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import WmCard from '@wavemaker/app-rn-runtime/components/data/card/card.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WMPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';
import WMLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component'
import WmMenu from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.component'

describe('Test Card component', () => {

   let defaultProps;

  beforeEach(() => {
    defaultProps = {
      title: 'Card title',
      subheading: 'Card Subheading',
      actions: 'some-actions',
    } 
  })

   it('renders correctly with default props', () => {

    const props = {
      ...defaultProps
    }

    render(<WmCard {...props}/>)
    expect(screen.getByText('Card title')).toBeTruthy()
    expect(screen.getByText('Card Subheading')).toBeTruthy()
    expect(screen.UNSAFE_getAllByType(WmMenu)).toBeTruthy()
    expect(screen.UNSAFE_getAllByType(WmIcon).length).not.toBe(2)
   })

   it('renders icon when iconclass is provided', () => {
     
     const props = {
      ...defaultProps,
      iconclass: 'icon-class'
     }

     render(<WmCard {...props}/>)
     expect(screen.UNSAFE_queryAllByType(WmIcon).length).toBe(2)
   })

   it('renders icon when iconurl is provided', () => {

    const props = {
      ...defaultProps,
      iconurl: 'some-icon-url'
    }

    render(<WmCard {...props}/>)
    expect(screen.UNSAFE_getAllByType(WmIcon).length).toBe(2)
   })

   it('renders picture source when picturesource is provided', () => {
    const props = {
      ...defaultProps,
      picturesource: 'some-source'
    }

    render(<WmCard {...props}/>)
    expect(screen.UNSAFE_getAllByType(WMPicture).length).toBe(1)
   })

   it('renders children correctly', () => {
    const { getByText } = render(
      <WmCard>
        <WMLabel caption="Child Component"/>
      </WmCard>
    )
    expect(getByText('Child Component')).toBeTruthy()
   })

   it('should trigger onTap callback with WMCard as WMCard as one of the arguments', async () => {
    const onTapMock = jest.fn();

    const tree = render(<WmCard {...defaultProps} onTap={onTapMock}/>)

    fireEvent(tree.UNSAFE_queryAllByType(Tappable)[1], 'press')

    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled()
      const callArg = onTapMock.mock.calls[0][1]
      expect(callArg).toBeInstanceOf(WmCard)
    })
   })

   it('should trigger onDoubleTap callback with WMCard as one of the arguments', async () => {

    const onDoubleTapMock = jest.fn();

    const props = {
      ...defaultProps,
      onDoubletap: onDoubleTapMock
    }

    const tree = render(<WmCard {...props}/>)
    fireEvent(tree.UNSAFE_getAllByType(Tappable)[1], 'press')
    fireEvent(tree.UNSAFE_getAllByType(Tappable)[1], 'press')

    await waitFor(() => {
      expect(onDoubleTapMock).toHaveBeenCalled();
      const callArg = onDoubleTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmCard)
    })
   })

   it('should trigger onLongPress callback with WMCard as one of the argument', async () => {
    const onLongTapMock = jest.fn();

    const props = {
      ...defaultProps,
      onLongtap: onLongTapMock
    }

    const tree = render(<WmCard {...props}/>);
    fireEvent(tree.UNSAFE_getAllByType(Tappable)[1], 'longPress');
    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      const callArg = onLongTapMock.mock.calls[0][1]
      expect(callArg).toBeInstanceOf(WmCard)
    })
   })
   
   //TODO: Sunil Press in and out are not gettin called.
  
  //  it('should trigger onTouchStart callback', async () => {
  //   // const onTapMock = jest.fn();
  //   const onTouchStartMock = jest.fn();
  //   const tree = render(
  //     <WmCard
  //       // onTap={onTapMock}
  //       onTouchstart={onTouchStartMock}
  //     />
  //   );

  //   fireEvent(tree.UNSAFE_getAllByType(Tappable)[[0]], 'press');

  //   await waitFor(() => {
  //     expect(onTouchStartMock).toHaveBeenCalled();
  //     const callArg = onTouchStartMock.mock.calls[0][1];
  //   });
  // });

   
  // it('should trigger onTouchend callback with WMCard as one of the argument', async () => {
  //   const onTouchEndMock = jest.fn();
  //   const props = {
  //     ...defaultProps,
  //   }

  //   const tree = render(<WmCard {...props} onLongtap={onTouchEndMock}/>);
  //   fireEvent(tree.UNSAFE_getAllByType(Tappable)[1], 'longPress');
  //   await waitFor(() => {
  //     expect(onTouchEndMock).toHaveBeenCalled();
  //   })
  // })

  

});