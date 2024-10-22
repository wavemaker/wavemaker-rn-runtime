import {
  Watcher,
  useWatcher,
} from '@wavemaker/app-rn-runtime/runtime/watcher';
import { WIDGET_LOGGER } from '@wavemaker/app-rn-runtime/core/base.component';
import { useState } from 'react';
import { Text,View } from 'react-native';

// import { renderHook } from '@testing-library/react-hooks';


const WATCH_LOGGER = WIDGET_LOGGER.extend('watch');

describe('Watcher System', () => {
  let watcher: Watcher;
  let mockLogger: any;

  beforeEach(() => {
    watcher = Watcher.ROOT.create(); // Create a fresh child watcher for each test
    // mockLogger = WATCH_LOGGER;
  });

  afterEach(() => {
    watcher.destroy(); // Cleanup watcher after each test
  });

  it('should add a watch expression and detect changes in primitive values', () => {
    let value = 1;
    const onChange = jest.fn();

    watcher.watch(() => value, onChange);

    watcher.check();
    expect(onChange).not.toHaveBeenCalled();

    // Trigger a change
    value = 2;
    watcher.check();

    expect(onChange).toHaveBeenCalledWith(1, 2);
  });

  it('should not trigger onChange if the value has not changed', () => {
    let value = 1;
    const onChange = jest.fn();

    watcher.watch(() => value, onChange);

    watcher.check(); 
    expect(onChange).not.toHaveBeenCalled();

    value = 1; // No change in value
    watcher.check();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle array changes correctly', () => {
    let arr = [1, 2, 3];
    const onChange = jest.fn();

    watcher.watch(() => arr, onChange);

    expect(onChange).not.toHaveBeenCalled();

    // Modify the array
    arr = [1, 2, 3, 4];
    watcher.check();

    expect(onChange).toHaveBeenCalledWith([1, 2, 3], [1, 2, 3, 4]);
  });

  it('should detect changes in array', () => {
    let arr = [1, 2, 3];
    const onChange = jest.fn();

    const expression = watcher.watch(() => arr, onChange);

    arr = [1, 2, 3, 4];
    watcher.check();

    // Check if `last` was cloned properly (after the change)
    expect(expression.value).toEqual([1, 2, 3, 4]);

    // Modify the new array and check if it's a separate instance
    arr.push(5);
    watcher.check();
    expect(expression.value).toEqual([1, 2, 3, 4, 5]); // The last value should remain unchanged
  });

  it('should handle multiple watch expressions', () => {
    let value1 = 1;
    let value2 = 10;
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    watcher.watch(() => value1, onChange1);
    watcher.watch(() => value2, onChange2);

    // Trigger a change in the first expression
    value1 = 2;
    watcher.check();

    expect(onChange1).toHaveBeenCalledWith(1, 2);
    expect(onChange2).not.toHaveBeenCalled();

    // Now change the second value
    value2 = 20;
    watcher.check();

    expect(onChange2).toHaveBeenCalledWith(10, 20);
  });

  it('should remove child watcher and clean up', () => {
    const childWatcher = watcher.create();

    expect(watcher.children.length).toBe(1);

    childWatcher.destroy();

    expect(watcher.children.length).toBe(0);
  });

  it('should count the total number of watchers and expressions', () => {
    let value1 = 1;
    let value2 = 10;

    watcher.watch(() => value1, jest.fn());
    watcher.watch(() => value2, jest.fn());

    const childWatcher = watcher.create();
    childWatcher.watch(() => value2, jest.fn());

    expect(watcher.count()).toBe(3); // 2 in root watcher, 1 in child watcher
  });

  it('should handle null and undefined values', () => {
    let value: any = null;
    const onChange = jest.fn();

    watcher.watch(() => value, onChange);
    expect(onChange).not.toHaveBeenCalled();

    // Change from null to undefined
    value = undefined;
    watcher.check();
    expect(onChange).toHaveBeenCalledWith(null, undefined);
  });

  it('should detect changes when function throws an error', () => {
    let value = 1;
    const onChange = jest.fn();

    watcher.watch(() => {
      if (value === 2) throw new Error('Error');
      return value;
    }, onChange);

    // Trigger change to 2 which throws an error
    value = 2;
    watcher.check();

    // Error in execution should return null and cause change detection
    expect(onChange).toHaveBeenCalledWith(1, null);
  });

  it('should handle changes in empty arrays correctly', () => {
    let arr: number[] = [];
    const onChange = jest.fn();

    watcher.watch(() => arr, onChange);

    expect(onChange).not.toHaveBeenCalled();

    // Change from empty array to array with elements
    arr = [1, 2, 3];
    watcher.check();

    expect(onChange).toHaveBeenCalledWith([], [1, 2, 3]);
  });

  it('should not trigger onChange if array contents remain the same after mutation', () => {
    let arr = [1, 2, 3];
    const onChange = jest.fn();

    watcher.watch(() => arr, onChange);

    // Mutate array but keep the contents the same
    arr = [1, 2, 3];
    watcher.check();

    expect(onChange).not.toHaveBeenCalled(); // No change in array content
  });

  it('should handle object equality check', () => {
    let obj1 = { a: 1, b: { c: 2 } };
    let obj2 = { d: 3, e: 4 };
    const onChange = jest.fn();

    watcher.watch(() => obj1, onChange);
    obj1 = { ...obj1, ...obj2 };

    watcher.check();

    expect(onChange).toHaveBeenCalledWith(
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2 }, d: 3, e: 4 }
    );
  });

  //we are not handling deep manipulation of objects , i.e onchange is not called when reference of both objects remain same
  // it('should handle deep object equality check', () => {
  //     let obj = { a: 1, b: { c: 2 } };
  //     const onChange = jest.fn();

  //     watcher.watch(() => obj, onChange);

  //     // Mutate inner object
  //     obj.b.c = 3;
  //     watcher.check();

  //     expect(onChange).toHaveBeenCalledWith({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } });
  // });

  it('should trigger onChange even if objects remain deeply equal', () => {
    let obj = { a: 1, b: { c: 2 } };
    const onChange = jest.fn();

    watcher.watch(() => obj, onChange);

    // Reassign object but contents remain the same
    obj = { a: 1, b: { c: 2 } };
    watcher.check();

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2 } }
    );
  });

  it('should not log a debug message if no change is detected', () => {
    let prop = 10;
    const onChange = jest.fn();
    const debugSpy = jest.spyOn(WATCH_LOGGER, 'debug');
    watcher.watch(() => prop, onChange);
    watcher.check();

    expect(debugSpy).not.toHaveBeenCalled();
  });

  it('should log a debug message when a change is detected', () => {
    let prop = 10;
    let debugMsg = "";
    const onChange = jest.fn();
    const debugSpy = jest.spyOn(WATCH_LOGGER, 'debug').mockImplementation((fn:any ) => {
      debugMsg = fn();
    });
    watcher.watch(() => prop, onChange);

    prop = 20;
    watcher.check();

    expect(debugSpy).toHaveBeenCalled();
    expect(debugSpy).toHaveBeenCalledWith(expect.any(Function));

    expect(debugMsg).toBe('Watcher: <prop> Changed from 10 to 20 ');
  });

});

describe('Parent and Child Watcher tests ', () => {
  let parentWatcher: Watcher;
  let childWatcher: Watcher;

  beforeEach(() => {
    // Create a parent watcher
    parentWatcher = Watcher.ROOT.create();

    // Create a child watcher from the parent
    childWatcher = parentWatcher.create();
  });

  afterEach(() => {
    // Cleanup watchers after each test
    parentWatcher.destroy();
  });

  // it('should trigger both parent and child watchers when child prop changes', () => {
  it('should trigger both parent and child watchers independently on respective changes', () => {
    // Track variables to monitor changes
    let parentProp = 5;
    let childProp = 10;
    let parentWatcherTriggered = false;
    let childWatcherTriggered = false;

    // Watch a property using the parent watcher
    parentWatcher.watch(
      () => parentProp,
      (prev, now) => {
        parentWatcherTriggered = true;
      }
    );

    // Watch a property using the child watcher
    childWatcher.watch(
      () => childProp,
      (prev, now) => {
        childWatcherTriggered = true;
      }
    );

    // Initially, no changes should have triggered the watchers
    expect(parentWatcherTriggered).toBe(false);
    expect(childWatcherTriggered).toBe(false);

    // Change the child prop and force the parent watcher to check for changes
    childProp = 20;
    parentWatcher.check();

    // Verify that both the parent and child watchers were triggered
    expect(parentWatcherTriggered).toBe(false); // Parent should not trigger, as its watched prop didn't change
    expect(childWatcherTriggered).toBe(true); // Child should trigger because its prop changed

    // Reset the flags and change the parent prop
    parentWatcherTriggered = false;
    childWatcherTriggered = false;
    parentProp = 15;
    parentWatcher.check();

    // Verify that the parent watcher is triggered
    expect(parentWatcherTriggered).toBe(true); // Parent should now trigger
    expect(childWatcherTriggered).toBe(false); // Child should not be triggered for parent prop change
  });

  it('should clean up child watcher when removed from parent', () => {
    // Ensure the parent has the child watcher
    expect(parentWatcher.children.length).toBe(1);

    // Remove the child watcher from the parent
    parentWatcher.remove(childWatcher);

    // Check that the child watcher has been removed
    expect(parentWatcher.children.length).toBe(0);
  });

  it('should handle multiple props and correctly trigger on specific changes', () => {
    let parentProp1 = 1;
    let parentProp2 = 2;
    let childProp1 = 10;
    let childProp2 = 20;

    let parentTriggeredCount = 0;
    let childTriggeredCount = 0;

    // Parent watcher watching multiple props
    parentWatcher.watch(
      () => parentProp1,
      () => parentTriggeredCount++
    );
    parentWatcher.watch(
      () => parentProp2,
      () => parentTriggeredCount++
    );

    // Child watcher watching multiple props
    childWatcher.watch(
      () => childProp1,
      () => childTriggeredCount++
    );
    childWatcher.watch(
      () => childProp2,
      () => childTriggeredCount++
    );

    // No changes should have been detected yet
    expect(parentTriggeredCount).toBe(0);
    expect(childTriggeredCount).toBe(0);

    // Change a child prop
    childProp1 = 30;
    parentWatcher.check();

    // Verify that only the child watcher was triggered
    expect(parentTriggeredCount).toBe(0); // Parent watcher should not be triggered
    expect(childTriggeredCount).toBe(1); // Child watcher should be triggered once

    // Change a parent prop
    parentProp1 = 5;
    parentWatcher.check();

    // Verify that only the parent watcher was triggered
    expect(parentTriggeredCount).toBe(1); // Parent watcher should be triggered once
    expect(childTriggeredCount).toBe(1); // Child watcher should remain unchanged
  });
});

// import React from 'react';
// import { TouchableOpacity } from 'react-native';
// import { render, fireEvent, act } from '@testing-library/react-native';

// // Helper Component to test the useWatcher hook
// const TestWatcherComponent = ({ initialValue }) => {
//     const parentWatcher = Watcher.ROOT;
//     const { watch } = useWatcher(parentWatcher);

//     const [value, setValue] = React.useState(initialValue);

//     const watchedValue = watch(() => value);

//     return (
//         <View>
//             <Text testID="watched-value">{watchedValue}</Text>
//             <TouchableOpacity testID="change-value" onPress={() => setValue(value + 1)}>
//                 <Text>Change Value</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// describe('useWatcher hook', () => {
//     let parentWatcher: Watcher;

//     beforeEach(() => {
//         parentWatcher = Watcher.ROOT.create();  // Create fresh parent watcher
//     });

//     afterEach(() => {
//         parentWatcher.destroy();  // Cleanup parent watcher after each test
//     });

//     it('should create a watcher and track changes in a React Native component', () => {
//         const initialValue = 1;
//         const { getByTestId } = render(<TestWatcherComponent initialValue={initialValue} />);

//         // Ensure that the watcher is created
//         expect(parentWatcher.children.length).toBe(1);

//         // Initial value rendered in the component
//         const watchedValueText = getByTestId('watched-value');
//         expect(watchedValueText.props.children).toBe(1);  // Value should be 1 initially

//         // Simulate value change by pressing the button
//         const changeValueButton = getByTestId('change-value');
//         act(() => {
//             fireEvent.press(changeValueButton);  // Press the button to increment value
//         });

//         // Check if the parentWatcher detects the change
//         act(() => {
//             parentWatcher.check();
//         });

//         // The new watched value should be updated
//         expect(watchedValueText.props.children).toBe(2);
//     });

//     it('should clean up watcher on component unmount', () => {
//         const { unmount } = render(<TestWatcherComponent initialValue={1} />);

//         // Ensure that the watcher is created
//         expect(parentWatcher.children.length).toBe(1);

//         // Unmount the component
//         unmount();

//         // The watcher should be removed after the component unmounts
//         expect(parentWatcher.children.length).toBe(0);
//     });
// });

// describe('useWatcher hook', () => {
//     let parentWatcher: Watcher;

//     beforeEach(() => {
//         parentWatcher = Watcher.ROOT.create();  // Create fresh parent watcher
//     });

//     afterEach(() => {
//         parentWatcher.destroy();  // Cleanup parent watcher after each test
//     });

//     it('should create a watcher and track changes in a React component', () => {
//         let value = 1;

//         const { result } = renderHook(() => useWatcher(parentWatcher));

//         expect(parentWatcher.children.length).toBe(1);  // New watcher created

//         // Watch a value
//         const watchedValue = result.current.watch(() => value);
//         expect(watchedValue).toBe(1);  // Initial value is 1

//         // Change value and check if watcher updates
//         value = 2;
//         parentWatcher.check();  // Force the parent watcher to check for changes

//         const updatedValue = result.current.watch(() => value);
//         expect(updatedValue).toBe(2);  // Updated value after the check
//     });

//     it('should clean up watcher on component unmount', () => {
//         const { unmount } = renderHook(() => useWatcher(parentWatcher));

//         expect(parentWatcher.children.length).toBe(1);  // New watcher created

//         unmount();  // Simulate component unmount

//         expect(parentWatcher.children.length).toBe(0);  // Watcher should be cleaned up
//     });
// });

// // Helper Component to test the useWatcher hook
// const TestWatcherComponent = ({ initialValue }: { initialValue: number }) => {
//     const parentWatcher = Watcher.ROOT;
//     const { watch } = useWatcher(parentWatcher);

//     const [value, setValue] = useState(initialValue);

//     const watchedValue = watch(() => value);

//     return (
//         <View>
//             <Text testID="watched-value">{watchedValue}</Text>
//             <Text testID="change-value" onPress={() => setValue(value + 1)}>Change Value</Text>
//         </View>
//     );
// };

// describe('useWatcher hook without @testing-library/react-hooks', () => {
//     let parentWatcher: Watcher;

//     beforeEach(() => {
//         parentWatcher = Watcher.ROOT.create();  // Create fresh parent watcher
//     });

//     afterEach(() => {
//         parentWatcher.destroy();  // Cleanup parent watcher after each test
//     });

//     it('should create a watcher and track changes in a React component', () => {
//         const initialValue = 1;
//         const { getByTestId } = render(<TestWatcherComponent initialValue={initialValue} />);

//         // Ensure that the watcher is created
//         expect(parentWatcher.children.length).toBe(1);

//         // Initial value rendered in the component
//         const watchedValueText = getByTestId('watched-value');
//         expect(watchedValueText.props.children).toBe(1);  // Value should be 1 initially

//         // Simulate value change by pressing the button
//         const changeValueButton = getByTestId('change-value');
//         fireEvent.press(changeValueButton);  // Press the button to increment value

//         // Check if the parentWatcher detects the change
//         parentWatcher.check();

//         // The new watched value should be updated
//         expect(watchedValueText.props.children).toBe(2);
//     });

//     it('should clean up watcher on component unmount', () => {
//         const { unmount } = render(<TestWatcherComponent initialValue={1} />);

//         // Ensure that the watcher is created
//         expect(parentWatcher.children.length).toBe(1);

//         // Unmount the component
//         unmount();

//         // The watcher should be removed after the component unmounts
//         expect(parentWatcher.children.length).toBe(0);
//     });
// });
