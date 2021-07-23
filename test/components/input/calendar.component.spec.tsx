import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WmCalendar from '@wavemaker/app-rn-runtime/components/input/calendar/calendar.component';

describe('Test Calendar component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmCalendar name="test_Calendar"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });
});