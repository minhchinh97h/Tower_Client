import React from 'react';
import AddAllTodo from './containers/AddAllTodo.Container'
import DisplayAllTodos from './containers/DisplayAllTodos.Container'
import DisplayAllCompletedTodos from './containers/DisplayAllCompletedTodos.Container'

import {createMaterialTopTabNavigator} from 'react-navigation'

import Daily from './layouts/Daily/Daily.Container'
import Weekly from './layouts/Weekly/Weekly'
import Monthly from './layouts/Monthly/Monthly'


const JournalTopNavigator = createMaterialTopTabNavigator({
    Daily: {screen: Daily},
    Weekly: {screen: Weekly},
    Monthly: {screen: Monthly}
},
{
    initialRouteName: "Daily",
    tabBarOptions: {
        upperCaseLabel: false,
        labelStyle: {
            color: 'black',
            fontSize: 18
        },
        style: {
            backgroundColor: 'white',
            shadowColor: 'transparent'
        },
        tabStyle: {
        },
        indicatorStyle: {
            top: 0,
            backgroundColor: 'black',
        }
    },
})

export default JournalTopNavigator;