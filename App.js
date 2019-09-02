import React from 'react';
import MainNavigator from './components/main/Main' //Main screen
import { Dimensions } from 'react-native'
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import Drawer from './components/drawer/Drawer.Container'
import Header from './components/main/header/Header.Container'

import * as FileSystem from 'expo-file-system';

let categories = {},
  currentTask = {},
  cate_filePath = FileSystem.documentDirectory + "categories.json",
  currentTask_filePath = FileSystem.documentDirectory + "currentTask.json"

export default class App extends React.Component {

  initialState = {}

  currentDate = new Date()

  state = {
    store: undefined,
  }

  loadCategoriesFromFile = async (filePath) => {

    let info = await FileSystem.getInfoAsync(filePath)

    if (info.exists) {
      let readData = await FileSystem.readAsStringAsync(filePath)

      categories = JSON.parse(readData)

      this.initialState = { ... this.initialState, ... { categories } }

    }

    else {
      let writtenData = await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify({
          cate_0: {
            name: "Inbox",
            color: "red"
          }
        })
      )

      let readData = await FileSystem.readAsStringAsync(filePath)

      categories = JSON.parse(readData)

      this.initialState = { ... this.initialState, ... { categories } }

    }
  }

  loadCurrentTaskFromFile = async (filePath) => {
    let info = await FileSystem.getInfoAsync(filePath)

    if (info.exists) {
      let readData = await FileSystem.readAsStringAsync(filePath)

      currentTask = JSON.parse(readData)

      this.initialState = { ... this.initialState, ... { currentTask } }
    }

    else {
      let writtenData = await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify({
          title: "",
          description: "",
          type: "day",
          category: "cate_0",
          schedule: {
            year: this.currentDate.getFullYear(),
            month: this.currentDate.getMonth(),
            day: this.currentDate.getDate()
          },
          repeat: {
            type: "daily",
            interval: {
              value: 86400 * 1000
            }
          },
          end: {
            type: "never"
          },
          priority: {
            value: "pri_01",
            reward: 0
          },
          goal: {
            max: 1,
            current: 0
          }
        })
      )

      let readData = await FileSystem.readAsStringAsync(filePath)

      currentTask = JSON.parse(readData)

      this.initialState = { ... this.initialState, ... { currentTask } }
    }
  }

  InitializeLoading = async () => {
    let results = await Promise.all([
      this.loadCategoriesFromFile(cate_filePath),
      this.loadCurrentTaskFromFile(currentTask_filePath)
    ])

    this.setState({
      store: createStore(rootReducer, this.initialState)
    })
  }

  componentDidMount() {
    // this.InitializeLoading().catch(err => console.log(err))
    this.setState({
      store: createStore(rootReducer)
    })
  }

  render() {
    return (
      <>
        {
          this.state.store ?
            <Provider store={this.state.store}>
              <AppContainer />
            </Provider>

            :

            null
        }
      </>

    )
  }
}

const ContentNavigator = createStackNavigator(
  { //Stack navigator works as a history object in a web browser, which helps popping out in pushing in screen to proceed navigations
    Main: MainNavigator
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: ({ navigation }) => ({
      header: <Header navigation={navigation} />
    })
  }
)

const drawerNavigator = createDrawerNavigator({
  ContentNavigator: ContentNavigator,
}, {
    drawerLockMode: 'locked-closed',
    contentComponent: Drawer,
    drawerType: 'slide',
    drawerWidth: Dimensions.get("window").width * 0.80,
    overlayColor: "gray"
  })

const AppContainer = createAppContainer(drawerNavigator) //return a React component, which is to wrap the stack navigator 





