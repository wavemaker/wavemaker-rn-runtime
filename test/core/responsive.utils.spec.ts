import { getCurrentBreakpoint, getNumberOfColumnsFromResponsiveConfig } from '@wavemaker/app-rn-runtime/core/responsive.utils';
import _viewPort from '@wavemaker/app-rn-runtime/core/viewport';
import { Platform } from 'react-native';

describe('Responsive Utils', () => {
  const mockViewport = (width: number) => {
    // Mock the viewport width property
    (_viewPort as any).width = width;
  };

  const mockPlatform = (platform: 'web' | 'ios' | 'android') => {
    Object.defineProperty(Platform, 'OS', {
      value: platform,
      writable: true,
    });
  };

  afterEach(() => {
    mockViewport(375);
    jest.restoreAllMocks();
  });

  describe('getCurrentBreakpoint', () => {
    describe('Web breakpoints', () => {
      beforeEach(() => {
        mockPlatform('web');
      });

      test('should return xs for extra small screens (<768px) on web', () => {
        mockViewport(500);
        expect(getCurrentBreakpoint()).toBe('xs');
      });

      test('should return sm for small screens (768px-991px) on web', () => {
        mockViewport(800);
        expect(getCurrentBreakpoint()).toBe('sm');
      });

      test('should return md for medium screens (992px-1199px) on web', () => {
        mockViewport(1000);
        expect(getCurrentBreakpoint()).toBe('md');
      });

      test('should return lg for large screens (≥1200px) on web', () => {
        mockViewport(1300);
        expect(getCurrentBreakpoint()).toBe('lg');
      });

      test('should handle web breakpoint edge cases correctly', () => {
        mockViewport(767);
        expect(getCurrentBreakpoint()).toBe('xs');

        mockViewport(768);
        expect(getCurrentBreakpoint()).toBe('sm');

        mockViewport(991);
        expect(getCurrentBreakpoint()).toBe('sm');

        mockViewport(992);
        expect(getCurrentBreakpoint()).toBe('md');

        mockViewport(1199);
        expect(getCurrentBreakpoint()).toBe('md');

        mockViewport(1200);
        expect(getCurrentBreakpoint()).toBe('lg');
      });
    });

    describe('Native mobile breakpoints', () => {
      beforeEach(() => {
        mockPlatform('ios');
      });

      test('should return xs for phones portrait (<480px) on native', () => {
        mockViewport(375); // iPhone portrait
        expect(getCurrentBreakpoint()).toBe('xs');
      });

      test('should return sm for phones landscape/small tablets (480px-767px) on native', () => {
        mockViewport(667); // iPhone landscape
        expect(getCurrentBreakpoint()).toBe('sm');
      });

      test('should return md for tablets portrait (768px-1023px) on native', () => {
        mockViewport(834); // iPad portrait
        expect(getCurrentBreakpoint()).toBe('md');
      });

      test('should return lg for tablets landscape/desktops (≥1024px) on native', () => {
        mockViewport(1194); // iPad landscape
        expect(getCurrentBreakpoint()).toBe('lg');
      });

      test('should handle native breakpoint edge cases correctly', () => {
        mockViewport(479);
        expect(getCurrentBreakpoint()).toBe('xs');

        mockViewport(480);
        expect(getCurrentBreakpoint()).toBe('sm');

        mockViewport(767);
        expect(getCurrentBreakpoint()).toBe('sm');

        mockViewport(768);
        expect(getCurrentBreakpoint()).toBe('md');

        mockViewport(1023);
        expect(getCurrentBreakpoint()).toBe('md');

        mockViewport(1024);
        expect(getCurrentBreakpoint()).toBe('lg');
      });
    });
  });

  describe('getNumberOfColumnsFromResponsiveConfig', () => {
    beforeEach(() => {
      mockPlatform('web'); // Default to web for most tests
    });

    test('should return value for current breakpoint when defined', () => {
      mockViewport(800); // sm on web
      const config = { xs: 1, sm: 2, md: 3, lg: 4 };
      
      expect(getNumberOfColumnsFromResponsiveConfig(config)).toBe(2);
    });

    test('should fallback to larger breakpoints when enabled (scale up approach)', () => {
      mockViewport(500); // xs breakpoint on web
      
      // xs missing, should scale up to sm
      const configMissingXs = { sm: 2, md: 3, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configMissingXs, undefined, true)).toBe(2);
      
      // xs and sm missing, should scale up to md
      const configMissingXsAndSm = { md: 3, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configMissingXsAndSm, undefined, true)).toBe(3);
      
      // Only lg available, should scale up to lg
      const configOnlyLarge = { lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configOnlyLarge, undefined, true)).toBe(4);
    });

    test('should fallback to larger breakpoints from sm breakpoint', () => {
      mockViewport(800); // sm breakpoint on web
      
      // sm missing, should scale up to md
      const configMissingSm = { xs: 1, md: 3, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configMissingSm, undefined, true)).toBe(3);
      
      // sm and md missing, should scale up to lg
      const configMissingSmAndMd = { xs: 1, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configMissingSmAndMd, undefined, true)).toBe(4);
    });

    test('should fallback to larger breakpoints from md breakpoint', () => {
      mockViewport(1000); // md breakpoint on web
      
      // md missing, should scale up to lg
      const configMissingMd = { xs: 1, sm: 2, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configMissingMd, undefined, true)).toBe(4);
    });

    test('should fallback to xs when no fallback enabled or no larger breakpoints available', () => {
      mockViewport(1000); // md breakpoint on web
      
      // No fallback enabled - should use xs as ultimate fallback
      const config = { xs: 1, sm: 2, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(config, undefined, false)).toBe(1);
      
      // lg breakpoint with no lg value and fallback enabled - should use xs as ultimate fallback
      mockViewport(1300); // lg breakpoint
      const configMissingLg = { xs: 1, sm: 2, md: 3 };
      expect(getNumberOfColumnsFromResponsiveConfig(configMissingLg, undefined, true)).toBe(1);
    });

    test('should work with number values', () => {
      mockViewport(800); // sm breakpoint
      
      const numberConfig = { xs: 1, sm: 2, md: 3, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(numberConfig)).toBe(2);
      
      const largeNumberConfig = { xs: 2, sm: 4, md: 6, lg: 8 };
      expect(getNumberOfColumnsFromResponsiveConfig(largeNumberConfig)).toBe(4);
    });

    test('should allow manual breakpoint specification', () => {
      mockViewport(500);
      const config = { xs: 1, sm: 2, md: 3, lg: 4 };
      
      expect(getNumberOfColumnsFromResponsiveConfig(config, 'lg')).toBe(4);
      expect(getNumberOfColumnsFromResponsiveConfig(config, 'md')).toBe(3);
    });

    test('should handle empty or partial configurations', () => {
      mockViewport(800); // sm breakpoint
      
      // Empty config - should use safe default of 1
      expect(getNumberOfColumnsFromResponsiveConfig({})).toBe(1);
      
      // Only lg defined, no fallback - should use safe default of 1
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 })).toBe(1);
      
      // Only lg defined, with fallback - should scale up to lg
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 }, undefined, true)).toBe(4);
      
      // xs defined - should use xs as ultimate fallback
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1 })).toBe(1);
    });

    test('should handle falsy values correctly', () => {
      mockViewport(1000); // md breakpoint
      
      // md is undefined, with fallback should scale up to lg
      const configWithUndefined = { xs: 1, sm: 2, md: undefined, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configWithUndefined, undefined, true)).toBe(4);
      
      // md is 0 (falsy but defined), should return 0
      const configWithZero = { xs: 1, sm: 2, md: 0, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configWithZero)).toBe(0);
      
      // No fallback enabled, should use xs
      expect(getNumberOfColumnsFromResponsiveConfig(configWithUndefined)).toBe(1);
    });

    test('should support list component itemsperrow use case', () => {
      mockViewport(500); // xs
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(1);
      
      mockViewport(800); // sm
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(2);
      
      mockViewport(1300); // lg
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(4);
    });

    test('should handle realistic responsive scenarios', () => {
      mockViewport(1000); // md breakpoint
      
      // md missing, with fallback should scale up to lg
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, lg: 4 }, undefined, true)).toBe(4);
      
      // md missing, no lg available, should use xs as ultimate fallback
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2 }, undefined, true)).toBe(1);
      
      // Only xs defined
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1 })).toBe(1);
      
      // Only lg defined, no fallback
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 })).toBe(1);
      
      // Only lg defined, with fallback
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 }, undefined, true)).toBe(4);
    });

    test('should maintain backwards compatibility with fallback default false', () => {
      mockViewport(1000); // md breakpoint
      
      // Default behavior (fallback=false) - should not scale up
      const config = { xs: 1, sm: 2, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(config)).toBe(1); // Uses xs as ultimate fallback
      
      // Explicit fallback=false
      expect(getNumberOfColumnsFromResponsiveConfig(config, undefined, false)).toBe(1);
      
      // With fallback=true should scale up to lg
      expect(getNumberOfColumnsFromResponsiveConfig(config, undefined, true)).toBe(4);
    });

    test('should work correctly with native mobile breakpoints', () => {
      mockPlatform('ios');
      
      mockViewport(375); // xs on native (phone portrait)
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(1);
      
      mockViewport(667); // sm on native (phone landscape)
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(2);
      
      mockViewport(834); // md on native (tablet portrait)
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(3);
      
      mockViewport(1194); // lg on native (tablet landscape)
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(4);
    });
  });

  describe('Integration with List Component', () => {
    beforeEach(() => {
      mockPlatform('web');
    });

    test('should provide correct column count for different screen sizes', () => {
      const itemsPerRowConfig = { xs: 1, sm: 2, md: 3, lg: 4 };
      
      mockViewport(500);
      expect(getCurrentBreakpoint()).toBe('xs');
      expect(getNumberOfColumnsFromResponsiveConfig(itemsPerRowConfig)).toBe(1);
      
      mockViewport(800);
      expect(getCurrentBreakpoint()).toBe('sm');
      expect(getNumberOfColumnsFromResponsiveConfig(itemsPerRowConfig)).toBe(2);
      
      mockViewport(1000);
      expect(getCurrentBreakpoint()).toBe('md');
      expect(getNumberOfColumnsFromResponsiveConfig(itemsPerRowConfig)).toBe(3);
      
      mockViewport(1300);
      expect(getCurrentBreakpoint()).toBe('lg');
      expect(getNumberOfColumnsFromResponsiveConfig(itemsPerRowConfig)).toBe(4);
    });

    test('should handle sparse itemsperrow configuration with scale up fallback', () => {
      mockViewport(1000); // md breakpoint
      
      // md missing, with fallback should scale up to lg
      const sparseConfig = { xs: 1, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(sparseConfig, undefined, true)).toBe(4);
      
      // Only xs available
      const minimalConfig = { xs: 1 };
      expect(getNumberOfColumnsFromResponsiveConfig(minimalConfig)).toBe(1);
      
      // No fallback enabled - should use xs as ultimate fallback
      expect(getNumberOfColumnsFromResponsiveConfig(sparseConfig)).toBe(1);
    });

    test('should work correctly across platforms', () => {
      const itemsPerRowConfig = { xs: 1, sm: 2, md: 3, lg: 4 };

      // Test web breakpoints
      mockPlatform('web');
      mockViewport(800); // sm on web (768-991)
      expect(getCurrentBreakpoint()).toBe('sm');
      expect(getNumberOfColumnsFromResponsiveConfig(itemsPerRowConfig)).toBe(2);

      // Test native breakpoints  
      mockPlatform('ios');
      mockViewport(800); // md on native (768-1023)
      expect(getCurrentBreakpoint()).toBe('md');
      expect(getNumberOfColumnsFromResponsiveConfig(itemsPerRowConfig)).toBe(3);
    });
  });
}); 