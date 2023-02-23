import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmNetworkInfoToaster from '@wavemaker/app-rn-runtime/components/advanced/network-info-toaster/network-info-toaster.component';

describe('Test NetworkInfoToaster component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmNetworkInfoToaster name="test_NetworkInfoToaster"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});