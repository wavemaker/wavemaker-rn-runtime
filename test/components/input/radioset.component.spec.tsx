import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmRadioset from '@wavemaker/app-rn-runtime/components/input/radioset/radioset.component';

describe('Test Radioset component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmRadioset name="test_Radioset"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});