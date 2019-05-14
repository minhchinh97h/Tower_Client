import React from 'react'
import {
    View,
    Text,
    StatusBar,
    SafeAreaView,
    Button
} from 'react-native';


export default class Monthly extends React.Component{
    static navigationOptions = {
        swipeEnabled: false,
    }

    
    render(){
        return(
            <View>
                <Text>Monthly</Text>
            </View>
        )
    }
}