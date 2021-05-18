import React from 'react';
import { View } from 'react-native';
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
class AppDrawerNavigator extends React.Component<AppDrawerNavigatorProps, any, any> {

  constructor(props: AppDrawerNavigatorProps) {
    super(props);
  }

  render(){
    return (<Drawer.Navigator 
      drawerContent={(_props) => this.props.content} 
      drawerType={this.props.type} >
      <Drawer.Screen name="leftDrawer">
        {(_props) => this.props.rootComponent}
      </Drawer.Screen>
    </Drawer.Navigator>);
  }
}

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
  return (
    <NavigationContainer>
      <AppDrawerNavigator 
        type='slide'
        content={(<AppDrawerContainer/>)}
        rootComponent={<AppStackNavigator pages={appConfig.pages || []}></AppStackNavigator>}>
      </AppDrawerNavigator>
    </NavigationContainer>
  );
};