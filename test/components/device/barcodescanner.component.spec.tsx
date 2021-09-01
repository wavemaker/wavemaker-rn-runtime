import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmBarcodescanner from '@wavemaker/app-rn-runtime/components/device/barcodescanner/barcodescanner.component';

describe('Test Barcodescanner component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmBarcodescanner name="test_Barcodescanner"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
