import React, { ReactNode } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
const Drawer = createDrawerNavigator();

interface AppDrawerNavigatorProps {
  content: (props: any) => ReactNode;
  hide: boolean,
  drawerStyle: any;
  type: any;
  rootComponent: React.ReactNode;
}

class AppDrawerNavigator extends React.Component<AppDrawerNavigatorProps, any, any> {

  constructor(props: AppDrawerNavigatorProps) {
    super(props);
  }

  render(){
    return (<Drawer.Navigator
      initialRouteName="pages"
      drawerContent={this.props.content}
      useLegacyImplementation={false}
      screenOptions={{
          drawerType: this.props.type,
          headerShown: false,
          gestureHandlerProps: { enabled: !this.props.hide },
          drawerStyle: { backgroundColor:  ThemeVariables.INSTANCE.pageContentBgColor, ...this.props.drawerStyle}
      }}>
      <Drawer.Screen name="pages">
        {(_props) => this.props.rootComponent}
      </Drawer.Screen>
    </Drawer.Navigator>);
  }
}

export default AppDrawerNavigator;
