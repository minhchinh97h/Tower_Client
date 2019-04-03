import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/login/Login' //Login screen
import SignUp from './components/signup/SignUp' //Sign Up screen
import Main from './components/main/Main' //Main screen
import {createStackNavigator, createAppContainer} from 'react-navigation'

import { DrawerNavigator } from './components/main/Main';


export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    )
  }
}


const styles = StyleSheet.create({
  topSpaced: {
    marginTop: 20
  }
})


const AppNavigator = createStackNavigator({ //Stack navigator works as a history object in a web browser, which helps popping out in pushing in screen to proceed navigations
  Login: {
    screen: Login
  },
  SignUp: {
    screen: SignUp
  },
  Main: {
    screen: DrawerNavigator,
    navigationOptions: {
      title: 'Home',
      header: null //this will hide the header
    },
  }
}, {
  initialRouteName: "Login"
},
{
  initialRouteName: "Main",
})

const AppContainer =  createAppContainer(AppNavigator) //return a React component, which is to wrap the stack navigator