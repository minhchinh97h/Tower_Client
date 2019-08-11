import React, { Component } from 'react'

import {
    View,
    Text,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions
} from 'react-native';

import AddTaskPanel from './add-task-panel/AddTaskPanel.Container'
import Calendar from './calendar/Calendar'
import Category from './category/Category.Container'
import Priority from './priority/Priority.Container'
import Goal from './goal/Goal.Container'

class DismissElement extends React.PureComponent {
    _onPress = () => {
        if (this.props.addTaskMenuChosen) {
            this.props.addTaskButtonActionProp()
        }

        this.props.disableAllTabs()
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={this._onPress}
            >
                <View style={{
                    flex: 1,
                    width: Dimensions.get("window").width,
                    backgroundColor: "black",
                    opacity: 0.5,
                }}>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default class OverlayModal extends Component {

    state = {
        currentAnnotation: 'day',
        calendarChosen: false,
        categoryChosen: false,
        priorityChosen: false,
        goalChosen: false,
        addTaskMenuChosen: true,

        shouldCallBackKeyboard: false
    }

    setCurrentAnnotation = (annotation) => {
        this.setState({ currentAnnotation: annotation })
    }

    disableAllTabs = () => {
        this.setState({
            calendarChosen: false,
            categoryChosen: false,
            priorityChosen: false,
            goalChosen: false,
            addTaskMenuChosen: true,
        })
    }

    chooseCalenderOption = () => {
        this.setState(prevState => ({
            calendarChosen: !prevState.calendarChosen,
            categoryChosen: false,
            priorityChosen: false,
            goalChosen: false,
            addTaskMenuChosen: false,
        }))
    }

    chooseGoalOption = () => {
        this.setState(prevState => ({
            calendarChosen: false,
            goalChosen: !prevState.goalChosen,
            categoryChosen: false,
            priorityChosen: false,
            addTaskMenuChosen: false,
        }))
    }

    chosenCategoryOption = () => {
        this.setState(prevState => ({
            calendarChosen: false,
            goalChosen: false,
            priorityChosen: false,
            categoryChosen: !prevState.categoryChosen,
            addTaskMenuChosen: false,
        }))
    }

    choosePriorityOption = () => {
        this.setState(prevState => ({
            calendarChosen: false,
            categoryChosen: false,
            priorityChosen: !prevState.priorityChosen,
            goalChosen: false,
            addTaskMenuChosen: false,
        }))
    }

    getWeek = (date) => {
        var target = new Date(date);
        var dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        var firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() != 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / 604800000);
    }

    componentDidMount() {
        let currentDayTask = this.props.currentDayTask
        if (!currentDayTask.startTime || !currentDayTask.schedule || !currentDayTask.trackingTime
            || !currentDayTask.repeat || !currentDayTask.end || !currentDayTask.category || !currentDayTask.priority || !currentDayTask.goal) {
            let data = {},
                date = new Date()

            data.startTime = date.getTime()
            data.trackingTime = data.startTime
            data.schedule = {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear()
            }
            data.repeat = {
                type: "daily",
                interval: {
                    value: 86400 * 1000 * 1
                }
            }
            data.end = {
                type: "never"
            }
            data.priority = {
                value: "pri_01",
                reward: 0,
            }
            data.goal = {
                max: 1,
                current: 0
            }

            this.props.updateAccordingTask("UPDATE_NEW_DAY_TASK", data)
        }

        let currentWeekTask = this.props.currentWeekTask

        if (!currentWeekTask.startTime || !currentWeekTask.schedule || !currentWeekTask.trackingTime
            || !currentWeekTask.repeat || !currentWeekTask.end || !currentWeekTask.category || !currentWeekTask.priority || !currentWeekTask.goal) {
            let data = {},
                date = new Date(),
                noWeek = this.getWeek(date)


            data.startTime = date.getTime()
            data.trackingTime = data.startTime
            data.schedule = {
                day: date.getDate(),
                week: noWeek,
                month: date.getMonth(),
                year: date.getFullYear()
            }

            data.repeat = {
                type: "weekly-w",
                interval: {
                    value: 86400 * 1000 * 7 * 1
                }
            }
            data.end = {
                type: "never"
            }
            data.priority = {
                value: "pri_01",
                reward: 0,
            }
            data.goal = {
                max: 1,
                current: 0
            }

            this.props.updateAccordingTask("UPDATE_NEW_WEEK_TASK", data)
        }

        let currentMonthTask = this.props.currentMonthTask

        if (!currentMonthTask.startTime || !currentMonthTask.schedule || !currentMonthTask.trackingTime
            || !currentMonthTask.repeat || !currentMonthTask.end || !currentMonthTask.category || !currentMonthTask.priority || !currentMonthTask.goal) {
            let data = {},
                date = new Date()


            data.startTime = date.getTime()
            data.trackingTime = data.startTime
            data.schedule = {
                month: date.getMonth(),
                year: date.getFullYear()
            }

            data.repeat = {
                type: "monthly-m",
                interval: {
                    value: 1
                }
            }
            data.end = {
                type: "never"
            }
            data.priority = {
                value: "pri_01",
                reward: 0,
            }
            data.goal = {
                max: 1,
                current: 0
            }

            this.props.updateAccordingTask("UPDATE_NEW_MONTH_TASK", data)
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.currentMonthTask !== prevProps.currentMonthTask){
        }
    }

    render() {
        return (
            <Modal
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        position: "relative",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >

                    <DismissElement
                        addTaskButtonActionProp={this.props.addTaskButtonActionProp}
                        disableAllTabs={this.disableAllTabs}
                        addTaskMenuChosen={this.state.addTaskMenuChosen}

                    />

                    {
                        this.state.addTaskMenuChosen ?
                            <AddTaskPanel
                                chooseCalenderOption={this.chooseCalenderOption}
                                chosenCategoryOption={this.chosenCategoryOption}
                                chooseGoalOption={this.chooseGoalOption}
                                choosePriorityOption={this.choosePriorityOption}

                                setCurrentAnnotation={this.setCurrentAnnotation}
                                currentAnnotation={this.state.currentAnnotation}

                                addTaskButtonActionProp={this.props.addTaskButtonActionProp}
                            />

                            :

                            <>
                                {/* Calendar Panel */}
                                {this.state.calendarChosen ?
                                    <Calendar
                                        currentAnnotation={this.state.currentAnnotation}
                                        calendarChosen={this.state.calendarChosen}

                                        disableAllTabs={this.disableAllTabs}
                                    />

                                    :

                                    <>
                                        {/* Category Panel */}
                                        {this.state.categoryChosen ?
                                            <Category
                                                disableAllTabs={this.disableAllTabs}
                                                currentAnnotation={this.state.currentAnnotation}
                                            />

                                            :

                                            <>
                                                {/* Repeat Panel */}
                                                {this.state.goalChosen ?
                                                    <Goal
                                                        currentAnnotation={this.state.currentAnnotation}
                                                        disableAllTabs={this.disableAllTabs}
                                                    />

                                                    :

                                                    <>
                                                        {/* Priority Panel */}
                                                        {this.state.priorityChosen ?
                                                            <Priority
                                                                disableAllTabs={this.disableAllTabs}
                                                                currentAnnotation={this.state.currentAnnotation}
                                                            />

                                                            :

                                                            <></>
                                                        }
                                                    </>
                                                }

                                            </>
                                        }
                                    </>
                                }
                            </>
                    }
                </View>

            </Modal>
        )
    }
}