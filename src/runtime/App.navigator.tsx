import React, { ReactNode } from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppDrawerNavigator from './navigator/drawer.navigator';
import AppStackNavigator from './navigator/stack.navigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isEmpty, keys, last } from 'lodash';

declare const window: any;

export interface AppNavigatorProps {
  drawerContent: () => ReactNode;
  drawerAnimation: string;
  hideDrawer: boolean;
  landingPage?: string;
  app: any;
}

const getStateFromPath = (path: string, options?: any) => {
  let hash: string = window.location.hash;
  hash = hash.substring(1);
  if (hash && hash.startsWith('/')) {
    hash = hash.substring(1);
  }
  if (!hash) {
    return;
  }
  let [pageName, paramstr] = hash.split('?');
  let params = {} as any;
  if (paramstr) {
    paramstr.split('&').forEach((p) => {
      const [k, v] = p.split('=');
      params[k] = v;
    });
  }
  return {
    routes: [{
      name: 'pages',
      state: {
        index: 0,
        routes: [{
          name: pageName,
          params: params
        }]
      }
    }]
  }
};

const getPathFromState = (state: any, options: any) => {
  const pagesRoute = state?.routes[0];
  const pageRoute: any = last(pagesRoute?.state.routes);
  let path = '';
  if (pageRoute) {
    path = window.location.href.split('#')[0] + '#/'+ pageRoute.name;
    if (!isEmpty(pageRoute.params)) {
      path += '?' + keys(pageRoute.params).map((k) => {
        return `${k}=${pageRoute.params[k]}`
      }).join('&');
    }
  }
  return path;
};

export const AppNavigator = (props: AppNavigatorProps) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const pages = {};
  const linking = {
    prefixes: [`${appConfig.appId}://`],
    config: {
      screens: {
        "pages": {
          path: "pages",
          screens: pages
        }
      }
    },
    getStateFromPath: isWebPreviewMode() ? getStateFromPath : undefined,
    getPathFromState: isWebPreviewMode()? getPathFromState: undefined
  } as any;
  appConfig.pages?.forEach((p) => {
    //@ts-ignore
    pages[p.name] = p.name;
  });
  const stack = (<AppStackNavigator
    pages={appConfig.pages || []}
    landingPage={props.landingPage || appConfig.landingPage}></AppStackNavigator>);
  const leftNav = (<AppDrawerNavigator
      type={props.drawerAnimation === 'slide-over' ? 'front' : 'slide'}
      hide={props.hideDrawer}
      content={() => (<SafeAreaView style={[{flex: 1}, Platform.OS === 'ios' ? {paddingTop: -40} : {}]}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        {(props.drawerContent && props.drawerContent())  || (<View/>)}
      </SafeAreaView>)}
      rootComponent={stack}/>);
  return (<NavigationContainer linking={linking}>{leftNav}</NavigationContainer>);
};
