import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Animated,
    Switch
} from 'react-native'

import { Haptics } from "expo";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    faRedoAlt
} from '@fortawesome/free-solid-svg-icons'
import { Map, List, fromJS } from 'immutable'

import { Audio } from "expo-av";

import { styles } from './styles/styles'

// const completing_sound = new Audio.Sound()
// completing_sound.loadAsync(require("../../../../../../../../assets/sounds/Completing01.mp3"))

export default class TaskCard extends React.PureComponent {
    priority_order = {
        pri_01: 0,
        pri_02: 1,
        pri_03: 2,
        pri_04: 3
    }

    task_type_order = {
        day: 0,
        week: 1,
        month: 2
    }

    state = {
        checked_complete: false
    }

    _openModal = () => {
        this.props.openModal(this.props.task_data)
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

    _doUpdateOnCompletedTask = (flag, type, operation) => {
        let task_map = Map(this.props.task_data),
            task_id = task_map.get("id"),
            task_category = task_map.get("category"),
            task_priority = task_map.getIn(["priority", "value"]),
            task_reward = parseFloat(task_map.getIn(["reward", "value"])),
            current_date = new Date(),
            monday = this.getMonday(current_date),
            data = Map(),
            completed_tasks_map = Map(this.props.completed_tasks),
            timestamp_toString = 0

        if (type === "day") {
            timestamp_toString = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate()).getTime().toString()
        }

        else if (type === "week") {
            timestamp_toString = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).getTime().toString()
        }

        else {
            timestamp_toString = new Date(current_date.getFullYear(), current_date.getMonth()).getTime().toString()
        }

        if (operation === "inc") {
            if (flag === "uncompleted") {

                if (completed_tasks_map.hasIn([task_id, timestamp_toString])) {
                    if (type === "day") {
                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value + task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value + 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array", this.priority_order[task_priority]], (value) => value + 1)
                    }

                    else if (type === "week") {
                        let day_in_week = current_date.getDay()

                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value + task_reward)
                        data.updateIn([timestamp_toString, "total_points_array", day_in_week], (value) => value + task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value + 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array", day_in_week, this.priority_order[task_priority]], (value) => value + 1)
                    }

                    else {
                        let day_in_month = current_date.getDate()

                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value + task_reward)
                        data.updateIn([timestamp_toString, "total_points_array", day_in_month - 1], (value) => value + task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value + 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array", day_in_month - 1, this.priority_order[task_priority]], (value) => value + 1)
                    }
                }

                else {
                    let pre_convert_obj = {
                        id: task_id,
                        category: task_category
                    }
                    let pre_convert_completed_data = {
                        current: 1,
                        totalPoints: task_reward
                    }

                    if (type === "day") {
                        pre_convert_completed_data.current_priority_value = task_priority
                        pre_convert_completed_data.completed_priority_array = [0, 0, 0, 0]
                        pre_convert_completed_data.completed_priority_array[this.priority_order[task_priority]] += 1
                    }

                    else if (type === "week") {
                        let day_in_week = current_date.getDay()

                        let completed_priority_array = [],
                            total_points_array = []

                        for (let i = 0; i < 7; i++) {
                            completed_priority_array.push([0, 0, 0, 0])
                            total_points_array.push(0)
                        }

                        completed_priority_array[day_in_week][this.priority_order[task_priority]] += 1
                        total_points_array[day_in_week] += task_reward

                        pre_convert_completed_data.total_points_array = total_points_array
                        pre_convert_completed_data.current_priority_value = task_priority
                        pre_convert_completed_data.completed_priority_array = completed_priority_array
                    }

                    else {
                        let day_in_month = current_date.getDate(),
                            last_day_in_month = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate(),
                            completed_priority_array = [],
                            total_points_array = []

                        for (let i = 0; i < last_day_in_month; i++) {
                            completed_priority_array.push([0, 0, 0, 0])
                            total_points_array.push(0)
                        }

                        completed_priority_array[day_in_month - 1][this.priority_order[task_priority]] += 1
                        total_points_array[day_in_month - 1] += task_reward

                        pre_convert_completed_data.total_points_array = total_points_array
                        pre_convert_completed_data.current_priority_value = task_priority
                        pre_convert_completed_data.completed_priority_array = completed_priority_array
                    }

                    pre_convert_obj[timestamp_toString] = pre_convert_completed_data

                    data = fromJS(pre_convert_obj)
                }
            }

            //operation increase - flag completed
            else {
                if (completed_tasks_map.hasIn([task_id, timestamp_toString])) {
                    if (type === "day") {
                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value - 1 < 0 ? 0 : value - 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array"], (completed_priority_array) => {
                            return List(completed_priority_array).update(this.priority_order[task_priority], (value) => value - 1 < 0 ? 0 : value - 1)
                        })
                    }

                    else if (type === "week") {
                        let day_in_week = current_date.getDay()

                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "total_points_array", day_in_week], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value - 1 < 0 ? 0 : value - 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array"], (completed_priority_array) => {
                            return List(completed_priority_array).updateIn([day_in_week, this.priority_order[task_priority]], (value) => value - 1 < 0 ? 0 : value - 1)
                        })
                    }

                    else {
                        let day_in_month = current_date.getDate()

                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "total_points_array", day_in_month - 1], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value - 1 < 0 ? 0 : value - 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array"], (completed_priority_array) => {
                            return List(completed_priority_array).updateIn([day_in_month - 1, this.priority_order[task_priority]], (value) => value - 1 < 0 ? 0 : value - 1)
                        })
                    }
                }
            }
        }

        else {
            if (flag === "uncompleted") {
                if (completed_tasks_map.hasIn([task_id, timestamp_toString])) {
                    if (type === "day") {
                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value - 1 < 0 ? 0 : value - 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array"], (completed_priority_array) => {
                            return List(completed_priority_array).update(this.priority_order[task_priority], (value) => value - 1 < 0 ? 0 : value - 1)
                        })
                    }

                    else if (type === "week") {
                        let day_in_week = current_date.getDay()

                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "total_points_array", day_in_week], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value - 1 < 0 ? 0 : value - 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array"], (completed_priority_array) => {
                            return List(completed_priority_array).updateIn([day_in_week, this.priority_order[task_priority]], (value) => value - 1 < 0 ? 0 : value - 1)
                        })
                    }

                    else {
                        let day_in_month = current_date.getDate()

                        data = Map(completed_tasks_map.get(task_id)).asMutable()
                        data.updateIn(["category"], (value) => task_category)
                        data.updateIn([timestamp_toString, "totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "total_points_array", day_in_month - 1], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                        data.updateIn([timestamp_toString, "current"], (value) => value - 1 < 0 ? 0 : value - 1)
                        data.updateIn([timestamp_toString, "current_priority_value"], (value) => task_priority)
                        data.updateIn([timestamp_toString, "completed_priority_array"], (completed_priority_array) => {
                            return List(completed_priority_array).updateIn([day_in_month - 1, this.priority_order[task_priority]], (value) => value - 1 < 0 ? 0 : value - 1)
                        })
                    }
                }
            }
        }

        return ({
            type: this.props.action_type,
            keyPath: [task_id],
            notSetValue: {},
            updater: (value) => data.toMap()
        })
    }

    _doUpdateOnChartStats = (flag, operation) => {
        let current_date = new Date(),
            day_in_week = current_date.getDay(),
            day_in_month = current_date.getDate(),
            month_in_year = current_date.getMonth(),
            year = current_date.getFullYear(),
            last_day_in_month = new Date(year, month_in_year + 1, 0).getDate(),
            monday = this.getMonday(current_date),
            day_timestamp_toString = new Date(year, month_in_year, day_in_month).getTime().toString(),
            week_timestamp_toString = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).getTime().toString(),
            month_timestamp_toString = new Date(current_date.getFullYear(), current_date.getMonth()).getTime().toString(),
            year_timestamp_toString = current_date.getFullYear().toString(),
            task_priority = Map(this.props.task_data).getIn(["priority", "value"]),
            task_reward = parseFloat(Map(this.props.task_data).getIn(["reward", "value"])),
            task_type = Map(this.props.task_data).get("type")


        let day_chart_stats_update = this._updateDayChartStats(task_type, task_reward, task_priority, day_timestamp_toString, flag, operation)

        let week_chart_stats_update = this._updateWeekChartStats(task_type, task_reward, task_priority, day_in_week, week_timestamp_toString, flag, operation)

        let month_chart_stats_update = this._updateMonthChartStats(task_type, task_reward, task_priority, day_in_month, last_day_in_month, month_timestamp_toString, flag, operation)

        let year_chart_stats_update = this._updateYearChartStats(task_type, task_reward, task_priority, month_in_year, year_timestamp_toString, flag, operation)

        return ({
            day_action_type: "UPDATE_DAY_CHART_STATS",
            day_chart_keyPath: [day_timestamp_toString],
            day_chart_notSetValue: {},
            day_chart_updater: (value) => day_chart_stats_update,

            week_action_type: "UPDATE_WEEK_CHART_STATS",
            week_chart_keyPath: [week_timestamp_toString],
            week_chart_notSetValue: {},
            week_chart_updater: (value) => week_chart_stats_update,

            month_action_type: "UPDATE_MONTH_CHART_STATS",
            month_chart_keyPath: [month_timestamp_toString],
            month_chart_notSetValue: {},
            month_chart_updater: (value) => month_chart_stats_update,

            year_action_type: "UPDATE_YEAR_CHART_STATS",
            year_chart_keyPath: [year_timestamp_toString],
            year_chart_notSetValue: {},
            year_chart_updater: (value) => year_chart_stats_update,
        })
    }

    _updateDayChartStats = (task_type, task_reward, task_priority, timestamp_toString, flag, operation) => {
        let day_chart_stats_map = Map(this.props.day_chart_stats),
            returning_data = Map()


        if (operation === "inc") {
            if (flag === "uncompleted") {
                if (day_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && day_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && day_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(day_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["totalPoints"], (value) => value + task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value + task_reward)
                }

                else {
                    let prev_converted_timestamp_data = {}
                    let current = [0, 0, 0, 0]
                    current[this.priority_order[task_priority]] += 1

                    let task_type_completions = [0, 0, 0]
                    task_type_completions[this.task_type_order[task_type]] += 1

                    prev_converted_timestamp_data = {
                        current,
                        totalPoints: task_reward,
                        task_type_completions
                    }

                    returning_data = fromJS(prev_converted_timestamp_data)
                }
            }

            //flag completed - operation increase => will decrease the goal current value when the complete button is pressed
            else {
                if (day_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && day_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && day_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(day_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
                }
            }
        }

        // operation decrease - flag uncompleted (only uncompleted task has operation increase and decrease, completed only has decrease)
        else {
            if (day_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                && day_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                && day_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                returning_data = Map(day_chart_stats_map.get(timestamp_toString)).asMutable()
                returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
            }
        }

        return returning_data.toMap()
    }

    _updateWeekChartStats = (task_type, task_reward, task_priority, day_in_week, timestamp_toString, flag, operation) => {
        let week_chart_stats_map = Map(this.props.week_chart_stats),
            returning_data = Map()

        if (operation === "inc") {
            if (flag === "uncompleted") {

                if (week_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && week_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", day_in_week, this.priority_order[task_priority]])
                    && week_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && week_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(week_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["completed_priority_array", day_in_week, this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["totalPoints"], (value) => value + task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value + 1)
                }

                else {
                    let prev_converted_timestamp_data = {}
                    let current = [0, 0, 0, 0]
                    current[this.priority_order[task_priority]] += 1

                    let completed_priority_array = []
                    for (let i = 0; i < 7; i++) {
                        completed_priority_array.push([0, 0, 0, 0])
                    }
                    completed_priority_array[day_in_week][this.priority_order[task_priority]] += 1

                    let task_type_completions = [0, 0, 0]
                    task_type_completions[this.task_type_order[task_type]] += 1

                    prev_converted_timestamp_data = {
                        current,
                        completed_priority_array,
                        totalPoints: task_reward,
                        task_type_completions
                    }

                    returning_data = fromJS(prev_converted_timestamp_data)
                }
            }

            //flag completed - operation increase => will decrease the goal current value when the complete button is pressed
            else {
                if (week_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && week_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", day_in_week, this.priority_order[task_priority]])
                    && week_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && week_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(week_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["completed_priority_array", day_in_week, this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
                }
            }
        }

        // operation decrease - flag uncompleted (only uncompleted task has operation increase and decrease, completed only has decrease)
        else {
            if (week_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                && week_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", day_in_week, this.priority_order[task_priority]])
                && week_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                && week_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                returning_data = Map(week_chart_stats_map.get(timestamp_toString)).asMutable()
                returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["completed_priority_array", day_in_week, this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
            }
        }

        return returning_data.toMap()
    }

    _updateMonthChartStats = (task_type, task_reward, task_priority, day_in_month, last_day_in_month, timestamp_toString, flag, operation) => {
        let month_chart_stats_map = Map(this.props.month_chart_stats),
            returning_data = Map()

        if (operation === "inc") {
            if (flag === "uncompleted") {
                if (month_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && month_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", (day_in_month - 1), this.priority_order[task_priority]])
                    && month_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && month_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(month_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["completed_priority_array", (day_in_month - 1), this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["totalPoints"], (value) => value + task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value + 1)
                }

                else {
                    let prev_converted_timestamp_data = {}
                    let current = [0, 0, 0, 0]
                    current[this.priority_order[task_priority]] += 1

                    let completed_priority_array = []

                    for (let i = 0; i < last_day_in_month; i++) {
                        completed_priority_array.push([0, 0, 0, 0])
                    }

                    completed_priority_array[(day_in_month - 1)][this.priority_order[task_priority]] += 1

                    let task_type_completions = [0, 0, 0]
                    task_type_completions[this.task_type_order[task_type]] += 1

                    prev_converted_timestamp_data = {
                        current,
                        completed_priority_array,
                        totalPoints: task_reward,
                        task_type_completions
                    }

                    returning_data = fromJS(prev_converted_timestamp_data)
                }
            }

            //flag completed - operation increase => will decrease the goal current value when the complete button is pressed
            else {
                if (month_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && month_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", (day_in_month - 1), this.priority_order[task_priority]])
                    && month_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && month_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(month_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["completed_priority_array", (day_in_month - 1), this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
                }
            }
        }

        // operation decrease - flag uncompleted (only uncompleted task has operation increase and decrease, completed only has decrease)
        else {
            if (month_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                && month_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", (day_in_month - 1), this.priority_order[task_priority]])
                && month_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                && month_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                returning_data = Map(month_chart_stats_map.get(timestamp_toString)).asMutable()
                returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["completed_priority_array", (day_in_month - 1), this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
            }
        }

        return returning_data.toMap()
    }

    _updateYearChartStats = (task_type, task_reward, task_priority, month_in_year, timestamp_toString, flag, operation) => {
        let year_chart_stats_map = Map(this.props.year_chart_stats),
            returning_data = Map()

        if (operation === "inc") {
            if (flag === "uncompleted") {
                if (year_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && year_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", month_in_year, this.priority_order[task_priority]])
                    && year_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && year_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(year_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["completed_priority_array", month_in_year, this.priority_order[task_priority]], (v) => v + 1)
                    returning_data.updateIn(["totalPoints"], (value) => value + task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value + 1)
                }

                else {
                    let prev_converted_timestamp_data = {}
                    let current = [0, 0, 0, 0]
                    current[this.priority_order[task_priority]] += 1

                    let completed_priority_array = []

                    for (let i = 0; i < 12; i++) {
                        completed_priority_array.push([0, 0, 0, 0])
                    }

                    completed_priority_array[month_in_year][this.priority_order[task_priority]] += 1

                    let task_type_completions = [0, 0, 0]
                    task_type_completions[this.task_type_order[task_type]] += 1

                    prev_converted_timestamp_data = {
                        current,
                        completed_priority_array,
                        totalPoints: task_reward,
                        task_type_completions
                    }

                    returning_data = fromJS(prev_converted_timestamp_data)
                }
            }

            //flag completed - operation increase => will decrease the goal current value when the complete button is pressed
            else {
                if (year_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                    && year_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", month_in_year, this.priority_order[task_priority]])
                    && year_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                    && year_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                    returning_data = Map(year_chart_stats_map.get(timestamp_toString)).asMutable()
                    returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["completed_priority_array", month_in_year, this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                    returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                    returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
                }
            }
        }

        // operation decrease - flag uncompleted (only uncompleted task has operation increase and decrease, completed only has decrease)
        else {
            if (year_chart_stats_map.hasIn([timestamp_toString, "current", this.priority_order[task_priority]])
                && year_chart_stats_map.hasIn([timestamp_toString, "completed_priority_array", month_in_year, this.priority_order[task_priority]])
                && year_chart_stats_map.hasIn([timestamp_toString, "totalPoints"])
                && year_chart_stats_map.hasIn([timestamp_toString, "task_type_completions", this.task_type_order[task_type]])) {
                returning_data = Map(year_chart_stats_map.get(timestamp_toString)).asMutable()
                returning_data.updateIn(["current", this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["completed_priority_array", month_in_year, this.priority_order[task_priority]], (v) => v - 1 < 0 ? 0 : v - 1)
                returning_data.updateIn(["totalPoints"], (value) => value - task_reward < 0 ? 0 : value - task_reward)
                returning_data.updateIn(["task_type_completions", this.task_type_order[task_type]], (value) => value - 1 < 0 ? 0 : value - 1)
            }
        }

        return returning_data.toMap()
    }

    _updateBalanceData = (amount, flag, operation) => {
        let returning_data = {
            type: "",
            amount: amount
        }

        if (operation === "inc") {
            // Deposit
            if (flag === "uncompleted") {
                returning_data.type = "DEPOSIT_BALANCE_AMOUNT"
            }

            // Withdraw
            else {
                returning_data.type = "WITHDRAW_BALANCE_AMOUNT"
            }
        }

        // Withdraw
        else {
            returning_data.type = "WITHDRAW_BALANCE_AMOUNT"
        }

        return returning_data
    }

    _checkComplete = () => {
        if (this.props.is_chosen_date_today) {
            let sending_obj = {}

            sending_obj.completed_task_data = this._doUpdateOnCompletedTask(this.props.flag, this.props.type, "inc")

            sending_obj.chart_data = this._doUpdateOnChartStats(this.props.flag, "inc")

            let reward_value = parseFloat(Map(this.props.task_data).getIn(["reward", "value"]))

            sending_obj.balance_data = this._updateBalanceData(reward_value, this.props.flag, "inc")

            this.props.updateBulkThunk(sending_obj)

            if (this.props.flag === "uncompleted") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

                this._playingSound()
            }

            else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)


            }

            this.setState(prevState => ({
                checked_complete: !prevState.checked_complete
            }))
        }
    }

    _unCheckComplete = () => {
        if (this.props.is_chosen_date_today) {

            let sending_obj = {}

            sending_obj.completed_task_data = this._doUpdateOnCompletedTask(this.props.flag, this.props.type, "dec")

            sending_obj.chart_data = this._doUpdateOnChartStats(this.props.flag, "dec")

            let reward_value = parseFloat(Map(this.props.task_data).getIn(["reward", "value"]))

            sending_obj.balance_data = this._updateBalanceData(reward_value, this.props.flag, "dec")

            this.props.updateBulkThunk(sending_obj)

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
    }

    _playingSound = async () => {
        try {
            const completing_sound = new Audio.Sound()
            await completing_sound.loadAsync(require("../../../../../../../../assets/sounds/Completing01.wav"))
            await completing_sound.playAsync()
        }

        catch (error) {
            console.log(error)
        }
    }

    render() {
        let priorities_map = Map(this.props.priorities),
            categories_map = Map(this.props.categories),
            task_data_map = Map(this.props.task_data),
            task_priority_value = task_data_map.getIn(["priority", "value"]),
            task_priority_color = priorities_map.getIn([task_priority_value, "color"]),
            task_category = task_data_map.get("category"),
            task_category_color = categories_map.getIn([task_category, "color"])

        return (
            <View
                style={styles.container}
            >
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <PriorityColorBar
                            priority_color={task_priority_color}
                        />

                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: 62,
                                paddingHorizontal: 15,
                            }}

                            onPress={this._checkComplete}
                        >
                            <CompleteBox
                                checked_complete={this.state.checked_complete}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginLeft: 15,
                            flex: 1,
                            justifyContent: "center",
                        }}
                        onPress={this._openModal}
                    >
                        <Text
                            style={styles.task_title}
                        >
                            {this.props.title}
                        </Text>

                        <Text
                            style={styles.goal_tracking}
                        >
                            {this.props.current_goal_value} / {this.props.goal_value}
                        </Text>
                    </TouchableOpacity>
                </View>



                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    {this.props.flag === "uncompleted" ?

                        <TouchableOpacity
                            style={{
                                width: 58,
                                height: 62,
                                justifyContent: "center",
                                alignItems: "center",
                            }}

                            onPress={this._unCheckComplete}
                        >
                            <FontAwesomeIcon
                                icon={faRedoAlt}
                                size={18}
                                color="#BDBDBD"
                            />
                        </TouchableOpacity>

                        :
                        null
                    }
                    <CategoryColorCircle
                        category_color={task_category_color}
                    />
                </View>
            </View>
        )
    }
}

class PriorityColorBar extends React.PureComponent {

    render() {
        return (
            <View
                style={{
                    width: 9,
                    backgroundColor: this.props.priority_color,
                    borderRadius: 30,
                    height: 62,
                    marginLeft: 1,
                }}
            >

            </View>
        )
    }
}

class CompleteBox extends React.PureComponent {

    render() {
        return (
            <View
                style={styles.complete_box_container}
            >
                {this.props.checked_complete ?
                    <View>

                    </View>

                    :

                    null
                }

                <View>

                </View>
            </View>
        )
    }
}

class CategoryColorCircle extends React.PureComponent {
    render() {
        return (
            <>
                {this.props.category_color === "white" || this.props.category_color === "no color" ?
                    <View
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "#2C2C2C",
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal: 15,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                width: 1,
                                backgroundColor: "#2C2C2C",
                                transform: [{ rotate: "45deg" }]
                            }}
                        >
                        </View>
                    </View>
                    :

                    <View
                        style={{
                            backgroundColor: this.props.category_color,
                            marginHorizontal: 15,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                        }}
                    >

                    </View>
                }
            </>
        )
    }
}