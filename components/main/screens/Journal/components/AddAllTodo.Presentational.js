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


class AddAllTodo extends React.Component{

    state= {
        currentAllTodo: ''
    }

    AddTodoToAll = () => {
        if(this.state.currentAllTodo.length > 0)
            this.props.addTodoToAll(this.state.currentAllTodo)
    }

    render(){
        return(
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    onChangeText = {(currentAllTodo) => {
                        this.setState({currentAllTodo})
                    }}
                />
                
                <Button title="Add" onPress={this.AddTodoToAll}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    input: {
        borderWidth: 2,
        width: 100,
        height: 30
    }
})

export default AddAllTodo