import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements'
import { Map } from 'immutable'

export default class TaskCard extends React.PureComponent {
    state = {
        checked: false,
        uncomplete_checked: false
    }

    _onPress = () => {
        this.props.onPress(this.props.task_data)
    }

    getWeek = (date) => {
        let target = new Date(date);
        let dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        let firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() != 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / 604800000);
    }

    getMonday = (date) => {
        let dayInWeek = new Date(date).getDay()
        let diff = dayInWeek === 0 ? 6 : dayInWeek - 1
        return new Date(new Date(date).getTime() - (diff * 86400 * 1000))
    }

    getNoWeekInMonth = (date) => {
        let nearest_monday = this.getMonday(date)
        let first_moday_of_month = this.getMonday(new Date(date.getFullYear(), date.getMonth(), 7))

        return Math.floor((nearest_monday - first_moday_of_month) / 7) + 1
    }

    checkComplete = () => {
        if (this.props.is_chosen_date_today) {
            this.setState(prevState => ({
                checked: !prevState.checked
            }))

            let task = { ... this.props.task_data },
                current_date = new Date(),
                data = {},
                overwrite_obj = {},
                currentGoal = 0,
                completed_tasks = Map(this.props.completed_tasks)

            if (this.props.flag === "uncompleted") {
                if (this.props.type === "day") {
                    let day_timestamp = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(day_timestamp)) {
                            currentGoal = data[day_timestamp].current
                        }

                        overwrite_obj[day_timestamp] = {
                            current: currentGoal + 1
                        }

                        data = { ...data, ...overwrite_obj }
                    }

                    else {
                        data.id = task.id
                        data[day_timestamp] = {
                            current: currentGoal + 1,
                            category: task.category
                        }
                    }
                }

                else if (this.props.type === "week") {
                    let week_timestamp = new Date(this.getMonday(current_date).getFullYear(), this.getMonday(current_date).getMonth(), this.getMonday(current_date).getDate()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(week_timestamp)) {
                            currentGoal = data[week_timestamp].current
                        }

                        overwrite_obj[week_timestamp] = {
                            current: currentGoal + 1
                        }

                        data = { ...data, ...overwrite_obj }
                    }

                    else {
                        data.id = task.id
                        data[week_timestamp] = {
                            category: task.category,
                            current: currentGoal + 1
                        }
                    }
                }

                else {
                    let month_timestamp = new Date(current_date.getFullYear(), current_date.getMonth()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(month_timestamp)) {
                            currentGoal = data[month_timestamp].current
                        }

                        overwrite_obj[month_timestamp] = {
                            current: currentGoal + 1
                        }

                        data = { ...data, ...overwrite_obj }
                    }

                    else {
                        data.id = task.id
                        data[month_timestamp] = {
                            category: task.category,
                            current: currentGoal + 1
                        }
                    }
                }

            }

            else {
                if (this.props.type === "day") {
                    let day_timestamp = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(day_timestamp)) {
                            currentGoal = data[day_timestamp].current
                        }

                        overwrite_obj[day_timestamp] = {
                            current: currentGoal - 1
                        }

                        data = { ...data, ...overwrite_obj }
                    }
                }

                else if (this.props.type === "week") {
                    let week_timestamp = new Date(this.getMonday(current_date).getFullYear(), this.getMonday(current_date).getMonth(), this.getMonday(current_date).getDate()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(week_timestamp)) {
                            currentGoal = data[week_timestamp].current
                        }

                        overwrite_obj[week_timestamp] = {
                            current: currentGoal - 1
                        }

                        data = { ...data, ...overwrite_obj }
                    }
                }

                else {
                    let month_timestamp = new Date(current_date.getFullYear(), current_date.getMonth()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(month_timestamp)) {
                            currentGoal = data[month_timestamp].current
                        }

                        overwrite_obj[month_timestamp] = {
                            current: currentGoal - 1
                        }

                        data = { ...data, ...overwrite_obj }
                    }
                }
            }

            this.props.updateCompletedTask(data)
        }
    }

    unCheckComplete = () => {
        if (this.props.is_chosen_date_today) {
            this.setState(prevState => ({
                uncomplete_checked: !prevState.uncomplete_checked
            }))

            let task = { ... this.props.task_data },
                current_date = new Date(),
                data = {},
                overwrite_obj = {},
                currentGoal = 0,
                completed_tasks = Map(this.props.completed_tasks)

            if (this.props.flag === "uncompleted") {
                if (this.props.type === "day") {
                    let day_timestamp = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(day_timestamp)) {
                            currentGoal = data[day_timestamp].current
                        }

                        if (currentGoal <= 0) {
                            overwrite_obj[day_timestamp] = {
                                current: currentGoal
                            }
                        }

                        else {
                            overwrite_obj[day_timestamp] = {
                                current: currentGoal - 1
                            }
                        }
                        
                        data = { ...data, ...overwrite_obj }
                    }
                }

                else if (this.props.type === "week") {
                    let week_timestamp = new Date(this.getMonday(current_date).getFullYear(), this.getMonday(current_date).getMonth(), this.getMonday(current_date).getDate()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(week_timestamp)) {
                            currentGoal = data[week_timestamp].current
                        }

                        if (currentGoal <= 0) {
                            overwrite_obj[week_timestamp] = {
                                current: currentGoal
                            }
                        }

                        else {
                            overwrite_obj[week_timestamp] = {
                                current: currentGoal - 1
                            }
                        }

                        data = { ...data, ...overwrite_obj }
                    }
                }

                else {
                    let month_timestamp = new Date(current_date.getFullYear(), current_date.getMonth()).getTime()

                    if (completed_tasks.has(task.id)) {
                        data = completed_tasks.get(task.id)

                        if (data.hasOwnProperty(month_timestamp)) {
                            currentGoal = data[month_timestamp].current
                        }

                        if (currentGoal <= 0) {
                            overwrite_obj[month_timestamp] = {
                                current: currentGoal
                            }
                        }

                        else {
                            overwrite_obj[month_timestamp] = {
                                current: currentGoal - 1
                            }
                        }

                        data = { ...data, ...overwrite_obj }
                    }
                }
            }

            this.props.updateCompletedTask(data)
        }
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this._onPress}>

                <View style={styles.checkBox}>
                    <CheckBox
                        center
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.state.checked}
                        onPress={this.checkComplete}
                    />
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptionText}>{this.props.title ? this.props.title : 'Example task'}</Text>
                    <Text style={styles.descriptionAmount}>{this.props.goal ? `${this.props.current_goal_value}/${this.props.goal.max}` : "0/3"}</Text>
                </View>
                {this.props.flag === "uncompleted" ?
                    <View
                        style={styles.checkBox}
                    >
                        <CheckBox
                            center
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.uncomplete_checked}
                            onPress={this.unCheckComplete}
                        />
                    </View>
                    :
                    null
                }
                <View style={styles.share}>
                    <FontAwesome name={'link'} style={styles.icon} />
                </View>
                <View style={styles.colorBox}>
                    <FontAwesome name={'circle'} style={styles.icon} />
                </View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        borderWidth: 1,
        borderColor: 'grey',
        borderLeftWidth: 3,
        marginBottom: 4,
        marginTop: 4,
        backgroundColor: 'white',
        zIndex: 30
    },
    checkBox: {
        width: 50,
        height: 60
    },
    description: {
        flex: 1
    },
    descriptionText: {
        lineHeight: 25,
        fontSize: 16
    },
    descriptionAmount: {
        lineHeight: 25,
        opacity: 0.5
    },
    share: {
        width: 50,
        height: 60,
    },
    colorBox: {
        width: 50,
        height: 60
    },
    icon: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24,
        lineHeight: 60
    }
});