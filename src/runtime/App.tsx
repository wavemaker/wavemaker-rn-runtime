import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { merge } from 'lodash';
import WmModal from '@wavemaker/app-rn-runtime/components/basic/modal/modal.component';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

import AppModalService from './app-modal.service';
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

  componentDidMount() {
    Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()))
      .then(() => {
      this.onAppVariablesReady();
      this.appStarted = true;
      this.forceUpdate();
    });
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

  refresh() {
    this.appConfig.refresh();
  }
  
  render() {
    return (
      <ModalProvider value={AppModalService}>
        <View  style={styles.container}>
          { this.appConfig.loadApp && this.appStarted && (
          <View style={styles.container}>
            <AppNavigator app={this}></AppNavigator>
            {AppModalService.modalOptions.content && 
              (<WmModal 
                styles={{
                  root : merge(styles.appModal, AppModalService.modalOptions.modalStyle),
                  content: AppModalService.modalOptions.contentStyle,
                }}>
                  {AppModalService.modalOptions.content}
              </WmModal>)}
          </View>)}
        </View>
      </ModalProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  appModal: {
    position: 'absolute',
    top: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
