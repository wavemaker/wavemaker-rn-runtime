import React, { ReactNode } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

interface AppDrawerNavigatorProps {
  content: (props: any) => ReactNode;
  hide: boolean,
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
      screenOptions={{
          drawerType: this.props.type,
          headerShown: false,
          gestureHandlerProps: { enabled: !this.props.hide },
      }}>
      <Drawer.Screen name="pagesnew">
        {(_props) => this.props.rootComponent}
      </Drawer.Screen>
    </Drawer.Navigator>);
  }
}

export default AppDrawerNavigator;
