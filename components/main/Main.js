import React from 'react';
import {
    LayoutAnimation,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    createMaterialBottomTabNavigator,
    createBottomTabNavigator,
    NavigationScreenProp,
    NavigationState,
    SafeAreaView,
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator,
} from 'react-navigation';


import Journal from './screens/Journal';
import Progress from './screens/Progress';
import Reward from './screens/Reward';
import Settings from './screens/Settings';

import OverView from './drawers/OverView';

const TabNavigator = createBottomTabNavigator({
    Journal: { screen: Journal },
    Progress: { screen: Progress },
    Reward: { screen: Reward },
    Settings: { screen: Settings },
});


const DrawerNavigator = createDrawerNavigator({
    TabNavigator : { screen: TabNavigator}
});

module.exports = {
    DrawerNavigator
}