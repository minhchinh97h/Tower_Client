import React from 'react'

import {
    LayoutAnimation,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput
} from 'react-native';

export default class DisplayAllCompletedTodos extends React.Component{

    ActionToUncompleteAllTodoTask = (todo) => {
        this.props.ActionToUncompleteAllTodoTask(todo)
    }


    render(){
        return(
            <>
            {this.props.allCompletedTodos.map((todo, index) => (
                <View key={todo+"-"+index}>
                <Text 
                onPress={this.ActionToUncompleteAllTodoTask.bind(this, todo)}
                >{todo.title}</Text>
                </View>
            ))}
            </>
        )
    }
}

const styles = StyleSheet.create({

})