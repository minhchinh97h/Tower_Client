import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modalbox';
import { DrawerActions } from 'react-navigation-drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

        journal_header_visible: false
    };


    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    _openDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.openDrawer())
    }

    _openEditModal = () => {
        this.refs.optionModal.open()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.currentRoute !== prevProps.currentRoute) {
            if (this.props.currentRoute === "Day" || this.props.currentRoute === "Week" || this.props.currentRoute === "Month") {
                this.setState({
                    journal_header_visible: true
                })
            }

            else {
                this.setState({
                    journal_header_visible: false
                })
            }
        }
    }

    render() {
        return (
            <>
                {this.state.journal_header_visible ?
                    <JournalHeader
                        _openDrawer={this._openDrawer}
                        _openEditModal={this._openEditModal}
                        toggleReturn={this.props.toggleReturn}
                        headerText={this.props.headerText}
                    />

                    :

                    null
                }
                <Modal
                    style={{ marginTop: 300, borderRadius: 10 }}
                    backButtonClose={true}
                    coverScreen={true}
                    isOpen={this.state.modalVisible}
                    ref={"optionModal"}
                    swipeToClose={true}
                    swipeArea={500}
                >
                    <View
                        style={{ flex: 1, alignSelf: "stretch" }}
                    >
                        <View>
                            <Text style={{ textAlign: 'center' }}><FontAwesome name="minus" style={{ fontSize: 26, color: "grey" }} /></Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: "stretch" }}>
                            <Text>Edit Multiple Tasks</Text>
                            <Text>Sort</Text>
                            <Text>Share</Text>
                            <TouchableOpacity onPress={() => this.refs.optionModal.close()}>
                                <Text>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        );
    }
}

class JournalHeader extends React.PureComponent {

    _openDrawer = () => {
        this.props._openDrawer()
    }

    _openEditModal = () => {
        this.props._openEditModal()
    }
    _toggleReturn = () => {
        this.props.toggleReturn()
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
                <TouchableOpacity onPress={this._openDrawer}>
                    <Image
                        source={require('./Hamburger_icon.png')}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: 'white'
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{

                    }}

                    onPress={this._toggleReturn}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: '500',
                        }}>
                        {this.props.headerText}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={this._openEditModal}>
                    <Image
                        source={require('./dots.png')}
                        style={{
                            width: 36,
                            height: 36,
                            tintColor: 'white'
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}