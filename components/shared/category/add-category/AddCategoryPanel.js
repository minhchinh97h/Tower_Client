import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    TextInput,
    Keyboard,
    Modal,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Animated
} from 'react-native';

export default class AddCategoryPanel extends React.PureComponent {

    state = {
        choose_color_panel_bool: false,

        new_cate_name: "",

        chosen_color: "red"
    }

    setTextInputRef = (r) => {
        this.text_input_ref = r
    }

    changeChosenColor = (color) => {
        this.setState({
            chosen_color: color
        })
    }

    onChangeTextInput = ({ nativeEvent }) => {
        this.setState({
            new_cate_name: nativeEvent.text
        })
    }

    toggleChooseColorPanel = () => {
        this.setState(prevState => ({
            choose_color_panel_bool: !prevState.choose_color_panel_bool
        }))
    }

    clear = () => {
        this.setState({
            new_cate_name: "",
            chosen_color: "red"
        })
    }

    cancel = () => {
        this.props.hideAction()
    }

    save = () => {
        if (!this.props.edit) {
            if (this.state.new_cate_name.length > 0) {
                let categories_length = 0

                for (let key in this.props.categories) {
                    if (this.props.categories.hasOwnProperty(key)) {
                        categories_length += 1
                    }
                }

                let new_key = `cate_${categories_length}`,
                    data = {}

                data[new_key] = {
                    name: this.state.new_cate_name,
                    color: this.state.chosen_color,
                    quantity: 0,
                }

                this.props.createCategory(data)
                this.props.hideAction()

            }

            else {
                this.text_input_ref.blur()
            }
        }

        else {
            if (this.state.new_cate_name.length > 0) {
                let data = {
                    name: this.state.new_cate_name,
                    color: this.state.chosen_color,
                    quantity: this.props.category.data.quantity
                }

                this.props.updateCategory(this.props.category.key, data)
                this.props.hideAction()
            }

            else {
                this.text_input_ref.blur()
            }
        }
    }

    componentDidMount() {
        if (this.props.edit) {
            this.setState({
                new_cate_name: this.props.category.data.name,
                chosen_color: this.props.category.data.color
            })
        }
    }


    render() {
        return (
            <>
                {this.state.choose_color_panel_bool ?
                    <ColorPanel
                        changeChosenColor={this.changeChosenColor}
                        toggleChooseColorPanel={this.toggleChooseColorPanel}
                    />

                    :

                    <View
                        style={{
                            position: "absolute",
                            width: 338,
                            height: 390,
                            paddingHorizontal: 30,
                            paddingVertical: 30,
                        }}
                    >
                        <View>
                            {this.props.edit ?
                                <Text>Edit Category</Text>

                                :

                                <Text>Add Category</Text>

                            }
                        </View>

                        <View
                            style={{
                                marginTop: 20,
                                height: 40,
                            }}
                        >
                            <TextInput
                                style={{
                                    backgroundColor: "gainsboro",
                                    borderRadius: 10,
                                    flex: 1,
                                    paddingHorizontal: 10,
                                }}

                                onChange={this.onChangeTextInput}
                                value={this.state.new_cate_name}
                                placeholder={""}
                                ref={this.setTextInputRef}
                            />
                        </View>

                        <TouchableOpacity
                            style={{
                                marginTop: 20,
                                height: 40,
                                flex: 1,
                            }}

                            onPress={this.toggleChooseColorPanel}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Text>
                                    Choose Color
                        </Text>

                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: this.state.chosen_color,
                                    }}
                                >
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginTop: 20,
                                height: 40,
                                flex: 1,
                            }}
                        >
                            <Text>
                                Share with friends
                    </Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                bottom: 0,
                                left: 0,
                                right: 0,
                            }}
                        >
                            <View
                                style={{
                                    height: 100,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "pink",
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginLeft: 20,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}

                                        onPress={this.clear}
                                    >
                                        <Text>
                                            Clear
                                </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "pink",
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginLeft: 20,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}

                                        onPress={this.cancel}
                                    >
                                        <Text>
                                            X
                                </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "pink",
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginLeft: 20,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}

                                        onPress={this.save}
                                    >
                                        <Text>
                                            OK
                                </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                }
            </>
        )
    }
}

class ColorPanel extends React.PureComponent {

    color_data = ["gainsboro", "red", "black", "purple", "green", "yellow", "blue", "pink", "brown", "purple", "gray", "#FFBF00"]

    state = {
        color_array: []
    }

    componentDidMount() {

        this.setState({
            color_array: this.color_data.map((color, index) => (
                <ColorHolder
                    key={`color-holder-${index}`}
                    {... this.props}
                    color={color}
                />
            ))
        })

    }

    cancel = () => {
        this.props.toggleChooseColorPanel()
    }


    render() {
        return (
            <View
                style={{
                    position: "absolute",
                    width: 338,
                    height: 390,
                    paddingHorizontal: 30,
                    paddingVertical: 30,
                }}
            >
                <Text>
                    Choose a color
                </Text>

                <View
                    style={{
                        marginTop: 20,
                        flex: 1,
                        flexWrap: "wrap",
                        flexDirection: "row",
                    }}
                >
                    {this.state.color_array}
                </View>

                <View
                    style={{
                        bottom: 20,
                        left: 0,
                        right: 0,
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            paddingHorizontal: 30,
                        }}
                    >
                        <TouchableOpacity
                            style={{

                            }}

                            onPress={this.cancel}
                        >
                            <Text>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class ColorHolder extends React.PureComponent {

    _onPress = () => {
        this.props.toggleChooseColorPanel()
        this.props.changeChosenColor(this.props.color)
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 278 / 4,
                    marginVertical: 10,
                }}

                onPress={this._onPress}
            >
                <View
                    style={{
                        backgroundColor: this.props.color,
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                    }}
                >
                </View>
            </TouchableOpacity>
        )
    }
}