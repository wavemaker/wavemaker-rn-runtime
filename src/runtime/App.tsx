import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppConfig from '../core/AppConfig';
import { AppNavigator } from './App.navigator';
import injector from './injector';

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

  eval(fn: Function, failOnError = false) {
    try {
      return fn.call(this);
    } catch (e) {
      if (failOnError) {
        throw e;
      } else {
        return null;
      }
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
        { this.appConfig.loadApp && this.appStarted && <AppNavigator app={this}></AppNavigator>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
