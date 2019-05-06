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

import DrawerNavComponent from './drawers/DrawerNavComponent';


const TabNavigator = createBottomTabNavigator({
    Journal: { screen: Journal },
    Progress: { screen: Progress },
    Reward: { screen: Reward },
    Settings: { screen: Settings },
},
{
    initialRouteName: "Journal",
    tabBarOptions: {
        style: {
            zIndex: 35
        },
    }
}
);

const DrawerNavigator = createDrawerNavigator({
    TabNavigator : {screen: TabNavigator }
}, {
    drawerLockMode: 'locked-closed',
    contentComponent: DrawerNavComponent
});

module.exports = {
    DrawerNavigator
}