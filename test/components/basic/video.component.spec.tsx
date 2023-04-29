import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmVideo from '@wavemaker/app-rn-runtime/components/basic/video/video.component';

describe('Test Video component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmVideo name="test_Video"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});