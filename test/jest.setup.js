/*import 'react-native-gesture-handler/jestSetup';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


configure({ adapter: new Adapter() });*/

/*jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});*/ //

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
/*jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('react-native-gesture-handler', () => {});*/

//import '@testing-library/react-native/extend-expect';
//import 'react-native-gesture-handler/jestSetup';

import * as AccessibilityConfig from '../src/core/accessibility';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => {
    const originalModule = jest.requireActual(
      'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo'
    );
    return {
      _esModule: true,
      default: {
        ...originalModule,
        addEventListener: jest.fn().mockReturnValue({ remove: null }),
        isScreenReaderEnabled: jest.fn(() => Promise.resolve(true)),
      },
    };
  }
);

jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    FontAwesome: jest.fn().mockImplementation(({ name, ...props }) => {
      return (
        <View>
          <Text {...props}>{name}</Text>
        </View>
      );
    }),
  };
});

jest.mock('../src/components/basic/icon/wavicon/wavicon.component', () => {
  const { View, Text } = require('react-native');
  return jest.fn().mockImplementation(({ name, ...props }) => {
    return (
      <View>
        <Text {...props}>{name}</Text>
      </View>
    );
  });
});

jest.mock(
  '../src/components/basic/icon/streamline-regular-icon/streamline-regular-icon.component',
  () => {
    const { View, Text } = require('react-native');
    return jest.fn().mockImplementation(({ name, ...props }) => {
      return (
        <View>
          <Text {...props}>{name}</Text>
        </View>
      );
    });
  }
);

jest.mock(
  '../src/components/basic/icon/streamline-light-icon/streamline-light-icon.component',
  () => {
    const { View, Text } = require('react-native');
    return jest.fn().mockImplementation(({ name, ...props }) => {
      return (
        <View>
          <Text {...props}>{name}</Text>
        </View>
      );
    });
  }
);

jest.mock('@wavemaker/app-rn-runtime/core/injector', () => {
  const actualInjector = jest.requireActual(
    '@wavemaker/app-rn-runtime/core/injector'
  );
  return {
    ...actualInjector,
    get: jest.fn().mockImplementation(() => {
      return {
        app: {
          toastsOpened: 1,
        },
        refresh: () => {},
      };
    }),
    FOCUSED_ELEMENT: {
      get: jest.fn().mockImplementation(() => ({
        blur: jest.fn(),
      })),
      set: jest.fn(),
    },
    I18nService: {
      ...actualInjector.I18nService,
      get: jest.fn().mockImplementation(() => ({
        defaultSupportedLocale: 'en',
        selectedLocale: 'en',
        dateFormat: 'MMM d, y',
        timeFormat: 'h:mm:ss a',
        dateTimeFormat: 'MMM d, y h:mm:ss a',
        currencyCode: 'USD',
        timezone: '',
        isRTLLocale: jest.fn().mockReturnValue(false),
        getSelectedLocale: jest.fn().mockReturnValue('en'),
      })),
    },
  };
});

jest.spyOn(AccessibilityConfig, 'isScreenReaderEnabled').mockReturnValue(false);
