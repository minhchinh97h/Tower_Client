import React from 'react';
import {
    View,
    Text,
    StatusBar,
    Button,
} from 'react-native';

import {
  SafeAreaView
} from 'react-navigation';

import Header from './shared/Header'

export default class Reward extends React.Component {
    render() {
      return (
        <View style={{ flex: 1}}>
          <StatusBar barStyle="default" />
            <SafeAreaView
            style={{ flex: 1 }}
            forceInset={{ horizontal: 'always', top: 'always' }}
            >
            <Header
                openDrawer={this.props.navigation.openDrawer}
                currentNavigationState={this.props.navigation.state}
            />
            <Text>Reward</Text>
            </SafeAreaView>
        </View>
      );
    }
}