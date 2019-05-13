import React, { Component } from 'react';
import {NavigationActions} from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, Image, TextInput, ScrollView } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class drawerContentComponents extends Component {

    navigateToScreen = ( route ) =>(
        () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    })

  render() {
      let bottom = (
        <View style={{
            alignSelf:"flex-end",
            flexDirection: "row",
            paddingLeft: 16
        }}>
            
            <FontAwesome5 name={'search'} style={styles.icon}></FontAwesome5>
            <TextInput style={{height: 32,  width: 260}} placeholder="Search"/>
        </View>
      )
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ImageBackground source={require('./drawer-background.png')} style={{flex: 1, width: 280, justifyContent: 'center'}} >
                    <Image
                        source={require('./icon.png')}
                        style={{
                            width: 80,
                            height: 80,
                            alignSelf: "center"
                        }}
                    />
                    <Text style={styles.headerText}>User Name</Text>
                </ImageBackground>
            </View>
            <ScrollView style={styles.screenContainer}>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'envelope'} style={styles.icon}/>
                    <Text>Inbox</Text>
                </View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'calendar'} style={styles.icon}/>
                    <Text>Today</Text>
                </View>
                <View style={styles.blackBar}></View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 1</Text>
                </View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 2</Text>
                </View>
                <View style={styles.blackBar}></View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 1</Text>
                </View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 2</Text>
                </View>
                <View style={styles.blackBar}></View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 1</Text>
                </View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 2</Text>
                </View>
                <View style={styles.blackBar}></View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 1</Text>
                </View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'folder'} style={styles.icon}/>
                    <Text>Folder 2</Text>
                </View>
                <View style={styles.blackBar}></View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'plus'} style={styles.icon}/>
                    <Text>Add list</Text>
                </View>
                <View style={styles.screenStyle} onPress={this.navigateToScreen('TabNavigator')}>
                    <FontAwesome5 name={'wrench'} style={styles.icon}/>
                    <Text>Manage list</Text>
                </View>
                
            </ScrollView>
            {
                bottom
            }
        </View>
    
    )
  }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    headerContainer: {
        height: 160,
        alignItems: 'center'
    },
    headerText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 16
    },
    screenContainer: {
        height: 400,
        width: 280
    },
    screenStyle: {
        height: 30,
        paddingLeft: 16,
        marginTop: 4,
        marginBottom: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    screenTextStyle:{
        fontSize: 20,
        marginLeft: 20
    },
    blackBar: {
        height:2,
        backgroundColor: 'black',
        width: 240,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 12
    },
    icon:{
        fontSize: 24,
        marginRight: 8,
        marginLeft: 2
    }
});