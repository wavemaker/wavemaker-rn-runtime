import { getCurrentBreakpoint, getNumberOfColumnsFromResponsiveConfig } from '@wavemaker/app-rn-runtime/core/responsive.utils';
import _viewPort from '@wavemaker/app-rn-runtime/core/viewport';

describe('Responsive Utils', () => {
  const mockViewport = (width: number) => {
    Object.defineProperty(_viewPort, 'width', {
      value: width,
      writable: true,
      configurable: true,
    });
  };

  afterEach(() => {
    mockViewport(375);
  });

  describe('getCurrentBreakpoint', () => {
    test('should return xs for extra small screens (<768px)', () => {
      mockViewport(500);
      expect(getCurrentBreakpoint()).toBe('xs');
    });

    test('should return sm for small screens (768px-991px)', () => {
      mockViewport(800);
      expect(getCurrentBreakpoint()).toBe('sm');
    });

    test('should return md for medium screens (992px-1199px)', () => {
      mockViewport(1000);
      expect(getCurrentBreakpoint()).toBe('md');
    });

    test('should return lg for large screens (>=1200px)', () => {
      mockViewport(1300);
      expect(getCurrentBreakpoint()).toBe('lg');
    });

    test('should handle edge cases correctly', () => {
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

  describe('getResponsiveValue', () => {
    test('should return value for current breakpoint when defined', () => {
      mockViewport(800); 
      const config = { xs: 1, sm: 2, md: 3, lg: 4 };
      
      expect(getNumberOfColumnsFromResponsiveConfig(config)).toBe(2);
    });

    test('should fallback to smaller breakpoints only (safer approach)', () => {
      mockViewport(1000);
      const config = { xs: 1, sm: 2, md: undefined, lg: 4 };
      
      expect(getNumberOfColumnsFromResponsiveConfig(config, undefined, true)).toBe(2);
      
      const configOnlyLarge = { xs: 1, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configOnlyLarge, undefined, true)).toBe(1);
    });

    test('should fallback to xs when all other breakpoints are undefined', () => {
      mockViewport(1000);
      const config = { xs: 1, sm: undefined, md: undefined, lg: undefined };
      
      expect(getNumberOfColumnsFromResponsiveConfig(config)).toBe(1);
    });

    test('should work with number values', () => {
      mockViewport(800);
      
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
      mockViewport(800);
      
      expect(getNumberOfColumnsFromResponsiveConfig({})).toBe(1);
      
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 })).toBe(1);
      
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 }, undefined, true)).toBe(1); 
      
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1 })).toBe(1);
    });

    test('should handle falsy values correctly', () => {
      mockViewport(1000);
      
      const configWithUndefined = { xs: 1, sm: 2, md: undefined, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configWithUndefined, undefined, true)).toBe(2);
      
      const configWithZero = { xs: 1, sm: 2, md: 0, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(configWithZero)).toBe(0);
      
      expect(getNumberOfColumnsFromResponsiveConfig(configWithUndefined)).toBe(1);
    });

    test('should support list component itemsperrow use case', () => {
      mockViewport(500);
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(1);
      
      mockViewport(800);
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(2);
      
      mockViewport(1300);
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, md: 3, lg: 4 })).toBe(4);
    });

    test('should handle realistic responsive scenarios', () => {
      mockViewport(1000);
      
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, sm: 2, lg: 4 }, undefined, true)).toBe(2);
      
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1, lg: 4 }, undefined, true)).toBe(1);
      
      expect(getNumberOfColumnsFromResponsiveConfig({ xs: 1 })).toBe(1);
      
      expect(getNumberOfColumnsFromResponsiveConfig({ lg: 4 })).toBe(1);
    });
  });

  describe('Integration with List Component', () => {
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

    test('should handle sparse itemsperrow configuration', () => {
      mockViewport(1000);
      
      const sparseConfig = { xs: 1, lg: 4 };
      expect(getNumberOfColumnsFromResponsiveConfig(sparseConfig, undefined, true)).toBe(1);
      
      const minimalConfig = { xs: 1 };
      expect(getNumberOfColumnsFromResponsiveConfig(minimalConfig)).toBe(1);
      
      expect(getNumberOfColumnsFromResponsiveConfig(sparseConfig)).toBe(1);
    });
  });
}); 