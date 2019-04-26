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

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
  },
});

export default class Header extends React.Component {
    static navigationOptions = {
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor }) => (
        <Image
          source={require('./Hamburger_icon.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    };

    state = {
      modalVisible: false,
      dropdownMenuVisible: false,
    };
  
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    toggleDropdownMenuVisible = () => {
      console.log("pressed!");
      this.setState(prevState => ({dropdownMenuVisible: !prevState.dropdownMenuVisible}));
    }

    componentDidMount = () => {
    }
  
    dropDownMenu = (
      <View style={{
        position: 'absolute', 
        display: this.state.dropdownMenuVisible ? 'flex' : 'none',
        width: 200,
        height: 300,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: 'white',
        borderRadius: 4,
        zIndex: 2,
        marginLeft: 200,
        bottom: -300,
        
        padding: 16,
        }}>
        <Text style={{marginBottom: 8}}>Hey I am here</Text>
        <Text style={{marginBottom: 8}}>Me too</Text>
        <Text style={{marginBottom: 8}}>DMC</Text>
        <Text style={{borderTopWidth: 1, borderColor:'#ddd'}}>DCM</Text>
      </View>
    )
    render() {
      return (
        <View style={{
          zIndex: 1,
          justifyContent: 'space-between',
          flexDirection: 'row-reverse', 
          height: 52, 
          padding:8, 
          borderWidth: 1,
          borderRadius: 2,
          borderColor: '#ddd',
          borderBottomWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        
        <TouchableHighlight onPress={this.toggleDropdownMenuVisible}>
          <Image
              onPress={this.toggleDropdownMenuVisible}
              source={require('./dots.png')}
              style={[styles.icon, {tintColor: 'black'}]}
          />
        </TouchableHighlight>
        {
          this.props.currentNavigationState.routeName === "Journal" && <TouchableHighlight onPress={() => this.props.openDrawer()}>
            <Image
                onPress={() => this.props.openDrawer()}
                source={require('./Hamburger_icon.png')}
                style={[styles.icon, {tintColor: 'black'}]}
            />
          </TouchableHighlight>
        }
        { this.state.dropdownMenuVisible && this.dropDownMenu}
        
        </View>
      );
    }
}