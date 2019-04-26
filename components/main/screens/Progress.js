import React from 'react';
import {
    View,
    Text,
    StatusBar,
    Button
} from 'react-native';

import {
  SafeAreaView
} from 'react-navigation';

import Header from './shared/Header';

export default class Progress extends React.Component {
  
    componentDidMount = () => {
      this.props.navigation.actions.openDrawer = () => {};
      console.log(this.props.navigation);
    }
    render() {
      return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="default" />
            <SafeAreaView
            style={{ flex: 1 }}
            forceInset={{ horizontal: 'always', top: 'always' }}
            >
            <Header
                openDrawer={this.props.navigation.openDrawer}
                currentNavigationState={this.props.navigation.state}
            />
            <Text>Progress</Text>
            </SafeAreaView>
        </View>
      );
    }
}
