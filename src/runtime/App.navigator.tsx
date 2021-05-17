import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppConfig from '../core/AppConfig';
import injector from './injector';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

interface AppDrawerNavigatorProps {
  content: any;
  type: any;
  rootComponent: React.ReactNode;
}

const AppDrawerNavigator = (props: AppDrawerNavigatorProps) => {
  return (<Drawer.Navigator drawerContent={(_props) => props.content} drawerType={props.type}>
    <Drawer.Screen name="Stack">
      {(_props) => props.rootComponent}
    </Drawer.Screen>
  </Drawer.Navigator>);
};

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

export const AppNavigator = (props: any) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const drawerContent = appConfig.currentPage && appConfig.currentPage.drawerContent;
  const drawerType = appConfig.currentPage && appConfig.currentPage.drawerType;
  const stackNavigator = (<AppStackNavigator pages={appConfig.pages || []}></AppStackNavigator>);
  return (
    <NavigationContainer>
      {drawerContent ? (<AppDrawerNavigator 
        type={drawerType}
        content={drawerContent}
        rootComponent={stackNavigator}></AppDrawerNavigator>): stackNavigator}
    </NavigationContainer>
  );
};