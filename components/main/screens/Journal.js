import React from 'react';
import {
    LayoutAnimation,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    createMaterialTopTabNavigator,
    NavigationScreenProp,
    NavigationState,
    SafeAreaView,
} from 'react-navigation';

import DailyScreen from './tabs/Daily';
import WeeklyScreen from './tabs/Weekly';
import MonthlyScreen from './tabs/Monthly';

import Header from './shared/Header'
const SimpleTabs = createMaterialTopTabNavigator({
    Daily: DailyScreen,
    Weekly: WeeklyScreen,
    Monthly: MonthlyScreen,
}, {
    tabBarOptions:{
        activeTintColor: '#fefefe',
        labelStyle: {
            fontSize: 16,
            color: '#000000',
            fontWeight: 'bold',
        },    
        style: {
            backgroundColor: '#ffffff' // TabBar background
        }
    }
});

class Journal extends React.Component {
    static router = SimpleTabs.router;

    componentDidMount() {
        const willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
              console.log('Journal focused');
            }
        );
            console.log(this.props.navigation);
    }     

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }
    render() {
        const { navigation } = this.props;
        const { routes, index } = navigation.state;
        const activeRoute = routes[index];
        let bottom = (
            <TouchableHighlight style={{
                zIndex: 1011,
                marginBottom: 8,
                //position: 'absolute',
                bottom: 0
            }}>
                <View style={{
                    width: 64,
                    height: 64,
                    backgroundColor: 'grey',
                    borderRadius: 32,
                    shadowOffset:{  width: 50,  height: 50,  },
                    shadowColor: 'black',
                    shadowOpacity: 0.75,
                    alignSelf: "center",
                    elevation: 5
                }}>
                    <Text style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 24,
                        color: 'white',
                        height:64
                    }}>
                        +
                    </Text>
                </View>
            </TouchableHighlight>
        );
        if (activeRoute.routeName !== 'Home') {
            /*
        bottom = (
            <View style={{ height: 50, borderTopWidth: StyleSheet.hairlineWidth, alignSelf: "flex-end" }}>
            <Button
                title="Check out"
                onPress={() => {
                //
                }}
            />
            </View>
        );
        */
        }
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
            <SimpleTabs navigation={navigation} />
            </SafeAreaView>
            {bottom}
        </View>
        );
    }
    }

    export default Journal;