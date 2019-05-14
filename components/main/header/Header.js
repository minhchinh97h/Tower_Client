import React from 'react';
import {
    View,
    Image,
    Button,
    StyleSheet,
    Modal,
    Alert,
    Text,
    TouchableHighlight
} from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
  },
});

export default class Header extends React.Component {

    state = {
      modalVisible: false,
      dropdownMenuVisible: false,
    };
  

    componentDidMount = () => {
    }
    
    render() {
      return (

        <View style={{
            paddingTop: 20,
            paddingHorizontal: 10,
            height: 80,
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'gray'
        }}>
            <TouchableHighlight onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                <Image
                    source={require('./Hamburger_icon.png')}
                    style= {{
                        width: 30,
                        height: 30,
                        tintColor: 'white'
                    }}
                />
            </TouchableHighlight>
            <Text style= {{
                color: 'white',
                fontSize: 20,
                fontWeight: '500',
            }}>Today</Text>

            <TouchableHighlight >
                <Image 
                    source={require('./dots.png')}
                    style= {{
                        width: 36,
                        height: 36,
                        tintColor: 'white'
                    }}
                />
            </TouchableHighlight>

            
        </View>
      );
    }
}