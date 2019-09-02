import React, { Component } from 'react';
import { DrawerActions } from 'react-navigation-drawer'
import {
    TouchableOpacity,
    Text,
    View,
    Modal,
    TextInput,
    FlatList,
    Dimensions
} from 'react-native'
import AddCategoryPanel from '../shared/category/add-category/AddCategoryPanel.Container'

export default class Drawer extends React.PureComponent {

    chosen_delete_category_key = {}

    state = {
        open_modal_bool: false,

        edit_task_bool: false,

        edit_category_data: {},

        delete_category_bool: false,
    }

    chooseEditCategory = (category_data) => {
        this.setState(prevState => ({
            edit_category_data: { ...category_data },
            edit_task_bool: !prevState.edit_task_bool
        }))

        this.toggleModalBool()
    }

    toggleModalBool = () => {
        this.setState({
            open_modal_bool: true
        })
    }

    dismissModal = () => {
        this.toggleModalBool()
        this.setState({
            edit_task_bool: false,
            edit_category_data: {},
            open_modal_bool: false
        })
    }

    toggleDeleteCategoryBool = (category_key) => {
        this.setState({
            delete_category_bool: true
        })

        this.chosen_delete_category_key = category_key
    }

    dissmissDeleteCategoryBool = () => {
        this.setState({
            delete_category_bool: false
        })
    }

    deleteCategory = () => {
        this.props.deleteAllTasksInCategory("DELETE_ALL_DAY_TASKS_WITH_CATEGORY", this.chosen_delete_category_key)
        this.props.deleteAllTasksInCategory("DELETE_ALL_WEEK_TASKS_WITH_CATEGORY", this.chosen_delete_category_key)
        this.props.deleteAllTasksInCategory("DELETE_ALL_MONTH_TASKS_WITH_CATEGORY", this.chosen_delete_category_key)
        this.props.deleteAllTasksInCategory("DELETE_ALL_COMPLETED_DAY_TASKS_WITH_CATEGORY", this.chosen_delete_category_key)
        this.props.deleteAllTasksInCategory("DELETE_ALL_COMPLETED_WEEK_TASKS_WITH_CATEGORY", this.chosen_delete_category_key)
        this.props.deleteAllTasksInCategory("DELETE_ALL_COMPLETED_MONTH_TASKS_WITH_CATEGORY", this.chosen_delete_category_key)
        this.props.deleteCategory(this.chosen_delete_category_key)

        this.dissmissDeleteCategoryBool()
    }

    render() {
        return (
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                    paddingTop: 34,
                    flex: 1
                }}
            >
                <View
                    style={{
                        height: 28,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text>
                        Sign in or Sign up
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: 18,
                        height: 30,
                    }}
                >
                    <TextInput
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(196, 196, 196, 0.7)",
                            borderRadius: 5,
                        }}
                    />
                </View>

                <CategoryList
                    {... this.props}
                    toggleModalBool={this.toggleModalBool}
                    chooseEditCategory={this.chooseEditCategory}

                    toggleDeleteCategoryBool={this.toggleDeleteCategoryBool}
                />

                {this.state.open_modal_bool ?
                    <Modal
                        transparent={true}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    width: Dimensions.get("window").width,
                                    backgroundColor: "black",
                                    opacity: 0.5
                                }}

                                onPress={this.dismissModal}
                            >

                            </TouchableOpacity>

                            <View
                                style={{
                                    position: 'absolute',
                                    width: 338,
                                    height: 390,
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                }}
                            >

                                <AddCategoryPanel
                                    hideAction={this.dismissModal}
                                    edit={this.state.edit_task_bool}
                                    category={this.state.edit_category_data}
                                />
                            </View>
                        </View>

                    </Modal>

                    :

                    <>
                        {this.state.delete_category_bool ?
                            <Modal
                                transparent={true}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "relative",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            width: Dimensions.get("window").width,
                                            backgroundColor: "black",
                                            opacity: 0.5
                                        }}

                                        onPress={this.dissmissDeleteCategoryBool}
                                    >

                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            position: 'absolute',
                                            width: 300,
                                            height: 200,
                                            backgroundColor: 'white',
                                            borderRadius: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingHorizontal: 30,
                                            paddingVertical: 20,
                                        }}
                                    >
                                        <Text>
                                            Are you sure deleting all tasks in this category?
                                        </Text>

                                        <View
                                            style={{
                                                marginTop: 20,
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "pink"
                                                }}

                                                onPress={this.dissmissDeleteCategoryBool}
                                            >
                                                <Text>
                                                    No
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "pink",
                                                    marginLeft: 20,
                                                }}

                                                onPress={this.deleteCategory}
                                            >
                                                <Text>
                                                    Yes
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            :

                            null
                        }
                    </>
                }

            </View>
        )
    }
}

class CategoryList extends React.PureComponent {

    state = {
        category_arr: [],
        should_flatlist_update: 0
    }

    _keyExtractor = (item, index) => `category-${index}`

    _renderItem = ({ item, index }) => {
        if (index === 0) {
            return (
                <GeneralCategoryRow
                    chooseCategory={this.props.chooseCategory}
                    navigation={this.props.navigation}
                />
            )
        }
        else if (index < this.state.category_arr.length - 1 && index > 0) {
            return (
                <CategoryRow
                    data={item}
                    category_key={Object.keys(this.props.categories)[index - 1]}
                    category_index={index}
                    chooseEditCategory={this.props.chooseEditCategory}
                    chooseCategory={this.props.chooseCategory}
                    navigation={this.props.navigation}

                    toggleDeleteCategoryBool={this.props.toggleDeleteCategoryBool}
                />
            )
        }

        return (
            <AddCategoryRow
                toggleModalBool={this.props.toggleModalBool}
            />
        )
    }

    loadCategories = (categories) => {
        let category_arr = []

        category_arr.push({
            name: "General"
        })

        for (var key in categories) {
            if (categories.hasOwnProperty(key)) {
                category_arr.push({
                    id: key,
                    ...categories[key]
                })
            }
        }

        category_arr.push({
            name: "Add category"
        })

        this.setState(prevState => ({
            category_arr: [...category_arr],
            should_flatlist_update: prevState.should_flatlist_update + 1
        }))
    }

    componentDidMount() {
        this.loadCategories(this.props.categories)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.categories !== prevProps.categories) {
            this.loadCategories(this.props.categories)
        }
    }

    render() {
        return (
            <FlatList
                data={this.state.category_arr}
                extraData={this.state.should_flatlist_update}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
        )
    }
}

class GeneralCategoryRow extends React.PureComponent {
    _onPress = () => {
        this.props.chooseCategory("general")
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    }
    render() {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: 50,
                    marginTop: 10,
                    justifyContent: "center"
                }}

                onPress={this._onPress}
            >
                <Text>
                    General
                </Text>
            </TouchableOpacity>
        )
    }
}

class CategoryRow extends React.PureComponent {

    editCategory = () => {
        this.props.chooseEditCategory({ data: this.props.data, key: this.props.category_key })
    }

    _chooseCategory = () => {
        this.props.chooseCategory(this.props.category_key)
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    chooseDeleteCategory = () => {
        this.props.toggleDeleteCategoryBool(this.props.category_key)
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    height: 50,
                    marginTop: 10,
                }}

                onPress={this._chooseCategory}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <View>
                        <Text>
                            {this.props.data.name}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text>
                            {this.props.data.quantity}
                        </Text>

                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                            }}

                            onPress={this.editCategory}
                        >
                            <Text>
                                edit
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                            }}

                            onPress={this.chooseDeleteCategory}
                        >
                            <Text>
                                delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

class AddCategoryRow extends React.PureComponent {

    _onPress = () => {
        this.props.toggleModalBool()
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: 50,
                    marginTop: 10,
                    justifyContent: "center"
                }}

                onPress={this._onPress}
            >
                <Text>
                    Add Category
                </Text>
            </TouchableOpacity>
        )
    }
}