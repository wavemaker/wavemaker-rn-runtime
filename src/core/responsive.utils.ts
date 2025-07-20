import _viewPort from './viewport';
import { DEVICE_BREAK_POINTS } from '../styles/theme';
import { Alert } from 'react-native';

export type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg';

export type ResponsiveConfig<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
};

/**
 * Determines the current responsive breakpoint based on viewport width
 * @returns The current breakpoint ('xs' | 'sm' | 'md' | 'lg')
 * 
 */
export const getCurrentBreakpoint = (): ResponsiveBreakpoint => {
  const width = _viewPort.width;
  
  if (width >= parseInt(DEVICE_BREAK_POINTS.MIN_LARGE_DEVICE)) {
    return 'lg';
  } else if (width >= parseInt(DEVICE_BREAK_POINTS.MIN_MEDIUM_DEVICE)) {
    return 'md';
  } else if (width >= parseInt(DEVICE_BREAK_POINTS.MIN_SMALL_DEVICE)) {
    return 'sm';
  } else {
    return 'xs';
  }
};

/**
 * Gets responsive value for current breakpoint with safe mobile-first fallback
 * The fallback order is: current breakpoint -> smaller breakpoints -> xs (ultimate fallback)
 * 
 * @param responsiveConfig Object containing values for each breakpoint (xs, sm, md, lg)
 * @param currentBreakpoint Current breakpoint (optional, will be auto-detected if not provided)
 * @returns The value for current breakpoint or fallback value
 * 
 */
export const getNumberOfColumnsFromResponsiveConfig = (
  responsiveConfig: ResponsiveConfig<number>,
  currentBreakpoint?: ResponsiveBreakpoint,
  fallback: boolean = false
): number => {
  const breakpoint = currentBreakpoint || getCurrentBreakpoint();
  
  let value = responsiveConfig[breakpoint];
  
  if (!value && fallback) {
    const fallbackOrder = ['xs', 'sm', 'md', 'lg'];
    const currentIndex = fallbackOrder.indexOf(breakpoint);
    
    // Check smaller breakpoints only
    for (let i = currentIndex - 1; i >= 0; i--) {
      const fallbackBreakpoint = fallbackOrder[i] as keyof typeof responsiveConfig;
      if (responsiveConfig[fallbackBreakpoint]) {
        value = responsiveConfig[fallbackBreakpoint];
        break;
      }
    }
  }
  
  return value ?? responsiveConfig.xs ?? 1;
};
