import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faBars,
    faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import {
    styles
} from './styles/styles'

export default class RewardHeader extends React.PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <TouchableOpacity
                        style={styles.end_icon_container}
                        onPress={this._openDrawer}
                    >
                        <FontAwesomeIcon
                            icon={faBars}
                            size={20}
                            color={"#BDBDBD"}
                        />
                    </TouchableOpacity>

                    <View>
                        <Text
                            style={styles.middle_text_style}
                        >
                            Progress
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.end_icon_container}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisV}
                            size={20}
                            color={"#BDBDBD"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}