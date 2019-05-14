import React from 'react';
import {
    View,
    Text,
    StatusBar,
    SafeAreaView,
    Button
} from 'react-native';

export default class Progress extends React.Component {
    componentDidMount(){
      const didFocusScreen = this.props.navigation.addListener(
        'didFocus',
        payload => {
            this.props.changeRouteAction(payload.state.routeName)
        }
    )
    }

    render() {
      return (
        <>
        </>
      //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //     <StatusBar barStyle="default" />
      //       <SafeAreaView
      //       style={{ flex: 1 }}
      //       forceInset={{ horizontal: 'always', top: 'always' }}
      //       >
      //       <Header
      //           openDrawer={this.props.navigation.openDrawer}
      //       />
      //       <Button 
      //               onPress={() => { this.props.navigation.openDrawer();}}
      //               title="Go to OverView"></Button>
      //       </SafeAreaView>
      //   </View>
      );
    }
}
