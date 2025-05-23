import { cloneDeep, merge } from "lodash-es";

/**
 * Merges styles for the given class names from provided style rules and theme variables.
 *
 * @param classNames - Array of class names (can include multiple class strings like "btn-primary btn-outlined").
 * @param styleRules - Style rule object returned from getPrismStyleRules(themeVariables).
 */
export function getStyles(
  classNames: string[],
  styleRules: Record<string, any>
): { [key: string]: any } {
  const mergedStyles: { [key: string]: any } = {};

  // Flatten classNames: ["btn-primary btn-outlined", "app-button"] => ["btn-primary", "btn-outlined", "app-button"]
  const flattened = classNames
    .filter(Boolean)
    .flatMap(cls => cls.split(' ').map(c => c.trim()))
    .filter(Boolean);

  // Step 1: Apply individual class styles
  for (const className of flattened) {
    const classStyles = styleRules[className];
    if (classStyles) {
      for (const key in classStyles) {
        if (!mergedStyles[key]) mergedStyles[key] = {};
        mergedStyles[key] = merge({}, mergedStyles[key], classStyles[key]);
      }
    }
  }

  // Step 2: Apply combination styles (e.g., styleRules['btn-primary']['btn-outlined'])
  const combinations = getAllCombinations(flattened);
  for (const combo of combinations) {
    const nestedStyle = findNestedStyle(styleRules, combo);
    if (nestedStyle) {
      for (const key in nestedStyle) {
        if (!mergedStyles[key]) mergedStyles[key] = {};
        mergedStyles[key] = merge({}, mergedStyles[key], cloneDeep(nestedStyle[key]));
      }
    }
  }

  return mergedStyles;
}

// Utility to get all class name combinations (size 2+)
function getAllCombinations(classNames: string[]): string[][] {
  const result: string[][] = [];
  const n = classNames.length;

  for (let size = 2; size <= n; size++) {
    const combine = (start: number, path: string[]) => {
      if (path.length === size) {
        result.push([...path]);
        return;
      }
      for (let i = start; i < n; i++) {
        path.push(classNames[i]);
        combine(i + 1, path);
        path.pop();
      }
    };
    combine(0, []);
  }

  return result;
}

// Recursively finds a nested combination style (e.g., btn-primary -> btn-outlined)
function findNestedStyle(styleRules: any, classChain: string[]): any {
  let current = styleRules;
  for (const cls of classChain) {
    if (current && current[cls]) {
      current = current[cls];
    } else {
      return null;
    }
  }
  return current;
}
