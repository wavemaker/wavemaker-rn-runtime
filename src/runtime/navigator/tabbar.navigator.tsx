import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '../injector';

const Tabbar = createBottomTabNavigator();

interface AppTabbarProps {
  content: any;
  rootComponent: React.ReactNode;
}

class AppTabbarNavigator extends React.Component<AppTabbarProps, any, any> {

  constructor(props: AppTabbarProps) {
    super(props);
  }

  render(){
    return (<Tabbar.Navigator 
      tabBar={(_props) => this.props.content}>
      <Tabbar.Screen name="tab">
        {(_props) => this.props.rootComponent}
      </Tabbar.Screen>
    </Tabbar.Navigator>);
  }
}

export default AppTabbarNavigator;
