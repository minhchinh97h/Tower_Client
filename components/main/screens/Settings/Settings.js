import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

export default class Settings extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('./../shared/icon.png')}
            style={{
              width: 100,
              height: 100,
              alignSelf: "center"
            }}
          />
          <Text style={{
            color: 'black',
            textAlign: 'center',
            fontSize: 24,
            marginTop: 16
          }}>User Name</Text>
        </View>
      );
    }
}