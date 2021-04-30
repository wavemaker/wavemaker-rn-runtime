import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppConfig from '../core/AppConfig';
import injector from './injector';

const Stack = createStackNavigator();
const MyStack = (props: any) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        { appConfig.pages?.map(p => (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default abstract class BaseApp extends React.Component {

  Actions: any = {};
  Variables: any = {};
  onAppVariablesReady = () => {};
  appStarted = false;
  appConfig = injector.get<AppConfig>('APP_CONFIG');
  private startUpVariables: string[] = [];
  private autoUpdateVariables: string[] = [];

  constructor(props: any) {
    super(props);
    this.appConfig.app = this;
    this.appConfig.refresh = () => {
      this.forceUpdate();
      this.appConfig.currentPage && this.appConfig.currentPage.forceUpdate();
    }
  }

  componentDidMount() {
    Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()))
      .then(() => {
      this.onAppVariablesReady();
      this.appStarted = true;
      this.forceUpdate();
    });
  }

  refresh() {
    this.appConfig.refresh();
  }
  
  render() {
    return (
      <View  style={styles.container}>
        { this.appConfig.loadApp && this.appStarted && <MyStack app={this}></MyStack>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
