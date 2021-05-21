import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

interface AppStackNavigatorProps {
  pages: any[];
}

const AppStackNavigator = (props: AppStackNavigatorProps) => {
  return (<Stack.Navigator initialRouteName="Main">
    {props.pages.map(p => (
      <Stack.Screen key={p.name}
        name={p.name}
        initialParams={{
          pageName: p.name
        }}
        component={p.component}
        options={{
          headerShown: false,
        }}
      />
    ))}
  </Stack.Navigator>);
};

export default AppStackNavigator;