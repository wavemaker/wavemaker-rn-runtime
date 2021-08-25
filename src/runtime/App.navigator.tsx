import React, { ReactNode } from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppDrawerNavigator from './navigator/drawer.navigator';
import AppStackNavigator from './navigator/stack.navigator';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface AppNavigatorProps {
  drawerContent: () => ReactNode;
  drawerAnimation: string;
  hideDrawer: boolean;
  app: any;
}

export const AppNavigator = (props: AppNavigatorProps) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const stack = (<AppStackNavigator pages={appConfig.pages || []} landingPage={appConfig.landingPage}></AppStackNavigator>);
  const leftNav = (<AppDrawerNavigator
      type={props.drawerAnimation === 'slide-over' ? 'front' : 'slide'}
      hide={props.hideDrawer}
      content={() => (<SafeAreaView style={[{flex: 1}, Platform.OS === 'ios' ? {paddingTop: -40} : {}]}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        {(props.drawerContent && props.drawerContent())  || (<View/>)}
      </SafeAreaView>)}
      rootComponent={stack}/>);
  return (<NavigationContainer>{leftNav}</NavigationContainer>);
};
