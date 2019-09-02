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

import AddCategoryPanel from './add-category/AddCategoryPanel.Container'

export default class Category extends React.Component {

    constructor(props) {
        super(props)

        this.addNewCateRef = React.createRef()
    }

    state = {
        //mock data for category, the unmock one will be saved in Redux store
        category_arr: [],

        //Current and previous chosen index of category in category_arr
        currentIndex: -1,
        lastIndex: -1,

        //translateY style value properties to make the panel move down and up when keyboard is called
        translateYValue: new Animated.Value(0),

        should_flat_list_rerender: 0,

        add_category_bool: false

    }

    chooseAddCategory = () => {
        this.setState(prevState => ({
            add_category_bool: !prevState.add_category_bool
        }))
    }

    _keyExtractor = (item, index) => `flatlist-category-${index}`

    _renderItem = ({ item, index }) => {
        if (index !== this.state.category_arr.length - 1)
            return (
                <CategoryRow
                    data={item}
                    index={index}
                    currentIndex={this.state.currentIndex}
                    lastIndex={this.state.lastIndex}
                    selectCategory={this.selectCategory}

                    task_data={this.props.task_data}
                />
            )

        else {
            return (
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        height: 30,
                        marginTop: 20,
                    }}

                    onPress={this.chooseAddCategory}
                >
                    <Text>
                        Add new category
                    </Text>
                </TouchableOpacity>
            )
        }
    }

    // handle selections of categories from user
    // to minimize the number of updates
    selectCategory = (index) => {
        this.setState((state, props) => ({
            lastIndex: state.currentIndex,
            currentIndex: index,
            should_flat_list_rerender: state.should_flat_list_rerender + 1,
        }))
    }

    initializeCategoryArr = () => {
        let categories = this.props.categories,
            category_arr = []
        for (var key in categories) {
            if (categories.hasOwnProperty(key)) {
                category_arr.push({
                    id: key,
                    ...categories[key]
                })
            }
        }

        category_arr.push({
            name: "Add new category"
        })

        this.setState({
            category_arr: [...category_arr]
        })
    }

    save = () => {
        let category_key = Object.keys(this.props.categories)[this.state.currentIndex]
        this.props.updateTask({ category: category_key })

        this.props.hideAction()
    }

    clear = () => {
        this.selectCategory(0)
    }

    cancel = () => {
        this.props.hideAction()
    }

    componentDidMount() {
        this.initializeCategoryArr()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.categories !== prevProps.categories) {
            this.initializeCategoryArr()
        }

    }

    render() {
        return (
            <>
                <Animated.View
                    style={{
                        position: 'absolute',
                        width: 338,
                        height: 390,
                        transform: [{ translateY: this.state.translateYValue }],
                        backgroundColor: 'white',
                        borderRadius: 10,
                        paddingHorizontal: 30,
                        paddingVertical: 30,
                    }}
                >
                    {this.state.add_category_bool ?
                        <AddCategoryPanel
                            hideAction={this.chooseAddCategory}
                            edit={false}
                        />
                        :
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <View
                                style={{
                                    height: 20,
                                    justifyContent: "center",
                                }}
                            >
                                <Text>Category</Text>
                            </View>

                            <View
                                style={{
                                    height: 200,
                                    marginTop: 20,
                                }}
                            >
                                <FlatList
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItem}
                                    data={this.state.category_arr}
                                    extraData={this.state.should_flat_list_rerender}
                                    removeClippedSubviews={true}
                                />
                            </View>

                            <View
                                style={{
                                    height: 60,
                                    marginBottom: 10,
                                    backgroundColor: 'white',
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableHighlight
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        backgroundColor: 'gray',
                                        marginRight: 20
                                    }}

                                    onPress={this.clear}
                                >
                                    <Text
                                        style={{
                                            color: "white"
                                        }}
                                    >
                                        Clear
                            </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        backgroundColor: 'gray',
                                        marginRight: 20
                                    }}

                                    onPress={this.cancel}
                                >
                                    <Text
                                        style={{
                                            color: "white"
                                        }}
                                    >
                                        X
                            </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        backgroundColor: 'gray',
                                        marginRight: 10
                                    }}

                                    onPress={this.save}
                                >
                                    <Text
                                        style={{
                                            color: "white"
                                        }}
                                    >
                                        OK
                            </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    }

                </Animated.View>
            </>
        )
    }
}

// row for rendering purpose in Flatlist
class CategoryRow extends React.PureComponent {
    static styles = StyleSheet.create({
        unChosenRadio: {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: "gainsboro",
            borderRadius: 20,
        },
        chosenRadio: {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: "gainsboro",
            borderRadius: 20,
            backgroundColor: "black"
        }
    })

    state = {
        radioStyle: CategoryRow.styles.unChosenRadio
    }


    _onPress = () => {
        this.props.selectCategory(this.props.index)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.index === nextProps.currentIndex) {
            return ({
                radioStyle: CategoryRow.styles.chosenRadio
            })
        }

        else if (nextProps.index === nextProps.lastIndex) {
            return ({
                radioStyle: CategoryRow.styles.unChosenRadio
            })
        }

        return null
    }

    componentDidMount() {
        let { category } = this.props.task_data

        if (category && category.length > 0) {
            if (this.props.data.id === category) {
                this._onPress()
            }
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 20,
                    height: 30,
                }}

                onPress={this._onPress}
            >
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <View
                            style={{
                                width: 15,
                                height: 15,
                                borderRadius: 15,
                                backgroundColor: this.props.data.color,
                                borderWidth: 1,
                                borderColor: "gainsboro"
                            }}
                        >

                        </View>

                        <Text
                            style={{
                                color: "gainsboro",
                                marginLeft: 22,
                            }}
                        >
                            {this.props.data.name}
                        </Text>
                    </View>

                    <View
                        style={this.state.radioStyle}
                    >

                    </View>
                </>
            </TouchableHighlight>
        )
    }
}