import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmSkeleton from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

describe('Test Skeleton component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmSkeleton name="test_Skeleton"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});