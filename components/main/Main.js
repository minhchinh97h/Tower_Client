
import React from 'react'

import JournalTopNavigator from './screens/Journal/Journal'
import Progress from './screens/Progress/Progress.Container'
import Reward from './screens/Reward/Reward'
import Settings from './screens/Settings/Settings'

import BottomTabNavigator from './bottomTabNavigator/BottomTabNavigator.Container'

import {createBottomTabNavigator} from 'react-navigation'


const MainNavigator = createBottomTabNavigator({
    Journal: JournalTopNavigator,
    Progress: { screen: Progress },
    Reward: { screen: Reward },
    Settings: { screen: Settings },
},
{
    initialRouteName: "Journal",
    tabBarComponent: props => (
        <BottomTabNavigator {...props} />
    )
})




export default MainNavigator
