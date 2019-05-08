import React from 'react';
import AddAllTodo from './containers/AddAllTodo.Container'
import DisplayAllTodos from './containers/DisplayAllTodos.Container'
import DisplayAllCompletedTodos from './containers/DisplayAllCompletedTodos.Container'

import {createMaterialTopTabNavigator} from 'react-navigation'

import Daily from './layouts/Daily/Daily'
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

import {
    LayoutAnimation,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput
} from 'react-native';


// class Journal extends React.Component {
//     static navigationOptions = {
//         header: null,
//         title: 'Journal'
//     }

//     render(){
//         return(
//             <View style={styles.container}>
//                 <AddAllTodo />

//                 <View>
//                     <Text style={styles.filteringTodoTasks}>Show all uncompleted todo tasks:</Text>
//                     <DisplayAllTodos />
//                 </View>

//                 <View>
//                     <Text style={styles.filteringTodoTasks}>Show all completed todo tasks:</Text>
//                     <DisplayAllCompletedTodos />
//                 </View>
//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },

//     filteringTodoTasks: {
//         margin: 20,
//     }
// })

export default JournalTopNavigator;