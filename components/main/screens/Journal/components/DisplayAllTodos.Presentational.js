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

export default class DisplayAllTodos extends React.Component{
    
    state = {
        todoNodes: null
    }

    ActionToCompleteAllTodoTask = (todo) => {
        this.props.ActionToCompleteAllTodoTask(todo)
    }

    componentDidMount(){
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    render(){

        return(
            <>
            {this.props.allTodos.map((todo, index) => (
                <View key={todo+"-"+index}>
                    <Text 
                    onPress={this.ActionToCompleteAllTodoTask.bind(this, todo)}
                    >{todo.title}</Text>
                </View>
            ))}
            </>
        )
    }
}

const styles = StyleSheet.create({

})