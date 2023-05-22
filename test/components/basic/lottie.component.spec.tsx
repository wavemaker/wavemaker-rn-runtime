import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';

describe('Test Lottie component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmLottie name="test_Lottie"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});