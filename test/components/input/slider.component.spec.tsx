import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmSlider from '@wavemaker/app-rn-runtime/components/input/slider/slider.component';

describe('Test Slider component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmSlider name="test_Slider"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});