import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import AppTabbarNavigator from './navigator/tabbar.navigator';
import AppDrawerNavigator from './navigator/drawer.navigator';
import AppStackNavigator from './navigator/stack.navigator';
import injector from './injector';

class AppDrawerContainer extends React.Component<any, any, any> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const appConfig = injector.get<AppConfig>('APP_CONFIG');
    appConfig.setDrawerContent = (content: React.ReactNode) => {
      this.setState({content: content});
    };
  }

  componentDidUnMount() {
    const appConfig = injector.get<AppConfig>('APP_CONFIG');
    this.setState({
      content: null
    });
    appConfig.setDrawerContent = () => {};
  }

  render(){
    return (this.state && this.state.content) || <View/>;
  }

}


class AppTabbarContainer extends React.Component<any, any, any> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const appConfig = injector.get<AppConfig>('APP_CONFIG');
    appConfig.setTabbarContent = (content: React.ReactNode) => {
      this.setState({content: content});
    };
  }

  componentDidUnMount() {
    const appConfig = injector.get<AppConfig>('APP_CONFIG');
    this.setState({
      content: null
    });
    appConfig.setTabbarContent = () => {};
  }

  render(){
    return (this.state && this.state.content) || <View/>;
  }

}

export const AppNavigator = (props: any) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const stack = (<AppStackNavigator pages={appConfig.pages || []}></AppStackNavigator>);
  const tabbar = (
    <AppTabbarNavigator
      content={(<AppTabbarContainer/>)}
      rootComponent={stack}/>);
  const leftNav = (
    <AppDrawerNavigator 
      type='slide'
      content={(<AppDrawerContainer/>)}
      rootComponent={tabbar}/>);
  return (<NavigationContainer> {leftNav}</NavigationContainer>);
};