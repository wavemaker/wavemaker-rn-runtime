import React, { ReactNode } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { Dimensions } from 'react-native';
const Drawer = createDrawerNavigator();

interface AppDrawerNavigatorProps {
  content: (props: any) => ReactNode;
  hide: boolean,
  type: any;
  rootComponent: React.ReactNode;
  width: number;
}

class AppDrawerNavigator extends React.Component<AppDrawerNavigatorProps, any, any> {

  constructor(props: AppDrawerNavigatorProps) {
    super(props);
  }

  render(){
    let proportion =  12 / Number(this.props.width);
    let drawerWidth = 100 / Number(proportion);
    let screenWidth = Dimensions.get('window').width;
    drawerWidth = (screenWidth * drawerWidth) / 100;
    return (<Drawer.Navigator
      initialRouteName="pages"
      drawerContent={this.props.content}
      useLegacyImplementation={false}
      screenOptions={{
          drawerType: this.props.type,
          headerShown: false,
          gestureHandlerProps: { enabled: !this.props.hide },
          drawerStyle: {
            backgroundColor: ThemeVariables.INSTANCE.pageContentBgColor,
            ...(drawerWidth && { width: drawerWidth })
          }
      }}>
      <Drawer.Screen name="pages">
        {(_props) => this.props.rootComponent}
      </Drawer.Screen>
    </Drawer.Navigator>);
  }
}

export default AppDrawerNavigator;
