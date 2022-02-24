import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmFileupload from '@wavemaker/app-rn-runtime/components/input/fileupload/fileupload.component';

describe('Test Fileupload component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmFileupload name="test_Fileupload"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
