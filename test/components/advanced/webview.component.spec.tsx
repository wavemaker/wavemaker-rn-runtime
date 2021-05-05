import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmWebview from '@wavemaker/rn-runtime/components/advanced/webview/webview.component';

describe('Test Webview component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmWebview name="test_Webview"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});