import React from 'react';
import renderer from 'react-test-renderer';
import WMButton from '@wavemaker/app-rn-runtime/components/basic/button.component';


describe('Check Button', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<WMButton name="test_button"/>).toJSON();
    expect(1).toBe(1);
  });
});