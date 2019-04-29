import React, { Component } from 'react';
import {NavigationActions} from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, Image } from 'react-native'

export default class drawerContentComponents extends Component {

    navigateToScreen = ( route ) =>(
        () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    })

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ImageBackground source={require('./drawer-background.png')} style={{flex: 1, width: 280, justifyContent: 'center'}} >
                    <Image
                        source={require('./icon.png')}
                        style={{
                            width: 100,
                            height: 100,
                            alignSelf: "center"
                        }}
                    />
                    <Text style={styles.headerText}>User Name</Text>
                </ImageBackground>
            </View>
            <View style={styles.screenContainer}>
                <View style={styles.screenStyle}>
                    <Text onPress={this.navigateToScreen('TabNavigator')}>Home</Text>
                </View>
                <View style={styles.screenStyle}>
                    <Text onPress={this.navigateToScreen('ScreenA')}>Screen A</Text>
                </View>
                <View style={styles.screenStyle}>
                    <Text onPress={this.navigateToScreen('ScreenB')}>Screen B</Text>
                </View>
                <View style={styles.screenStyle}>
                    <Text onPress={this.navigateToScreen('ScreenC')}>Screen C</Text>
                </View>
            </View>
        </View>
    
    )
  }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        height: 200,
        alignItems: 'center'
    },
    headerText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 24,
        marginTop: 16
    },
    screenContainer: {
        paddingTop: 20
    },
    screenStyle: {
        height: 30,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    screenTextStyle:{
        fontSize: 20,
        marginLeft: 20
    },

});