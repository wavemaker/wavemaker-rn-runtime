import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCarouselContent from '@wavemaker/app-rn-runtime/components/advanced/carousel/carousel-content/carousel-content.component';

describe('Test CarouselContent component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCarouselContent name="test_CarouselContent"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});