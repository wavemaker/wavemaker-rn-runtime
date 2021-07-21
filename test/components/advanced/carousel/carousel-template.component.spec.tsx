import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCarouselTemplate from '@wavemaker/app-rn-runtime/components/advanced/carousel/carousel-template/carousel-template.component';

describe('Test CarouselTemplate component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCarouselTemplate name="test_CarouselTemplate"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});