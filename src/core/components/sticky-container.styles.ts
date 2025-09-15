import { ViewStyle, TextStyle } from 'react-native';
import { BaseComponent, BaseComponentState, BaseProps, BaseStyles } from '../base.component';

/**
 * Utility function to calculate parent hierarchy styles for sticky positioning
 * Converts accumulated horizontal spacing from parent hierarchy to positioning offsets and content styles
 */
export function getParentStyles(component: BaseComponent<BaseProps, BaseComponentState<any>, BaseStyles>): {
   positioningStyles: ViewStyle & TextStyle; contentStyles: ViewStyle & TextStyle 
} {
  // Extract and accumulate parent-inherited styles from the entire component hierarchy
  const accumulatedParentSpacing = {
    marginLeft: 0, marginRight: 0,
    paddingLeft: 0, paddingRight: 0,
    margin: 0, padding: 0
  };

  const inheritedStyles: ViewStyle & TextStyle = {};
  
  const horizontalSpacingProperties = [
    'marginLeft', 'marginRight', 'margin',
    'paddingLeft', 'paddingRight', 'padding'
  ] as const;
  
  const inheritableProperties = [
    'alignSelf', 'alignItems', 'alignContent', 'justifyContent',
    'textAlign', 'textAlignVertical',
  ] as const;

  // Traverse up the parent hierarchy (for horizontal positioning offsets only)
  let currentComponent = component.parent;
  while (currentComponent) {
    if (currentComponent.styles && currentComponent.styles.root) {
      const parentRootStyles = currentComponent.styles.root;
      horizontalSpacingProperties.forEach(property => {
        if (parentRootStyles[property] !== undefined) {
          const value = parentRootStyles[property];
          if (typeof value === 'number') {
            (accumulatedParentSpacing as any)[property] += value;
          } else if (typeof value === 'string' && value.match(/^\d+$/)) {
            (accumulatedParentSpacing as any)[property] += parseInt(value, 10);
          }
        }
      });
      
      // Inherit other properties from the closest parent that has them
      inheritableProperties.forEach(property => {
        if (parentRootStyles[property] !== undefined && inheritedStyles[property] === undefined) {
          (inheritedStyles as any)[property] = parentRootStyles[property];
        }
      });
    }
    currentComponent = currentComponent.parent;
  }
  
  // Convert accumulated parent spacing to horizontal positioning offsets for absolute positioning
  const positioningStyles: ViewStyle & TextStyle = { ...inheritedStyles };
  const contentStyles: ViewStyle & TextStyle = {};
  
  // Apply current component's own alignment properties
  if (component.styles && component.styles.root) {
    const currentStyles = component.styles.root;
    inheritableProperties.forEach(property => {
      if (currentStyles[property] !== undefined) {
        (contentStyles as any)[property] = currentStyles[property];
      }
    });
    
    // Auto-apply alignItems: "center" when justifyContent or textAlign is "center"
    if (currentStyles.justifyContent === 'center' || currentStyles.textAlign === 'center') {
      (positioningStyles as any).alignItems = 'center';
    }
  }
 
  let leftOffset = 0;
  let rightOffset = 0;

  const { marginLeft, marginRight, margin, paddingLeft, paddingRight, padding } = accumulatedParentSpacing;
  
  // Add parent margins to horizontal positioning offsets
  if (marginLeft || margin) {
    leftOffset += (marginLeft || 0) + (margin || 0);
  }
  if (marginRight || margin) {
    rightOffset += (marginRight || 0) + (margin || 0);
  }
  
  // Add parent padding to horizontal positioning offsets
  if (paddingLeft || padding) {
    leftOffset += (paddingLeft || 0) + (padding || 0);
  }
  if (paddingRight || padding) {
    rightOffset += (paddingRight || 0) + (padding || 0);
  }
  
  if (leftOffset > 0) positioningStyles.paddingLeft = leftOffset;
  if (rightOffset > 0) positioningStyles.paddingRight = rightOffset;

  return { positioningStyles, contentStyles };
}
