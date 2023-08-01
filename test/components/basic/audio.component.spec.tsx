import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmAudio from '@wavemaker/app-rn-runtime/components/basic/audio/audio.component';

describe('Test Audio component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmAudio name="test_Audio"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});