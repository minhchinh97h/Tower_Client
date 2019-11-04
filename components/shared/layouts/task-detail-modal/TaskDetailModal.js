import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    Image,
    TextInput,
    Modal,
    ScrollView
} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { Map, List } from 'immutable'
import { styles } from './styles/styles';

import EditDeleteRow from './edit-delete-row/EditDeleteRow'
import TitleDescriptionRow from './title-description-row/TitleDescriptionRow'
import ScheduleRow from './schedule-row/ScheduleRow'
import CategoryRow from './category-row/CategoryRow'
import PriorityRow from './priority-row/PriorityRow'
import RepeatRow from './repeat-row/RepeatRow'
import EndRow from './end-row/EndRow'
import RewardRow from './reward-row/RewardRow'
import GoalRow from './goal-row/GoalRow'

const window_width = Dimensions.get("window").width

export default class TaskDetailModal extends Component {

    daysInWeekText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    monthNames = ["January", "Febuary", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    month_names_in_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    short_daysInWeekText = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


    edit_task = this.props.task_data

    yes_delete_clicked = false

    priority_order = {
        pri_01: 0,
        pri_02: 1,
        pri_03: 2,
        pri_04: 3
    }

    state = {
        isOpened: false,
        isEditing: false,
        day_in_week_text: "",
        date_number: "",
        month_text: "",
        category: "",
        priority: "",
        repeat: "",
        goal: "",
        calendar_text: "",
        should_update: 0,
        toggle_delete: false,
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

    toggleEdit = (visible) => {
        this.setState(() => ({ isEditing: visible }));
    }

    _handleTaskUpdate = () => {
        let edit_task = this.edit_task,
            date = new Date(edit_task.startTime),
            category = edit_task.category ? Map(this.props.categories).get(edit_task.category).name : "",
            priority = edit_task.priority ? this.props.priorities[edit_task.priority.value].name : "",
            goal = edit_task.goal ? `${edit_task.goal.max} times` : "",
            calendar_text, repeat


        if (this.props.type === "day") {

            if (date) {
                calendar_text = `${this.daysInWeekText[date.getDay()]} ${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
            }


            if (edit_task.repeat) {
                if (edit_task.repeat.type === "daily") {
                    repeat = `Every ${edit_task.repeat.interval.value} day(s)`
                }

                else if (edit_task.repeat.type === "weekly") {
                    repeat = `Every ${edit_task.repeat.interval.value} week(s)`
                }

                else {
                    repeat = `Every ${edit_task.repeat.interval.value} month(s)`
                }
            }

        }

        else if (this.props.type === "week") {

            if (date && edit_task.schedule) {
                calendar_text = `Week ${edit_task.schedule.week} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
            }

            if (edit_task.repeat) {
                if (edit_task.repeat.type === "weekly-w") {
                    repeat = `Every ${edit_task.repeat.interval.value} week(s)`
                }

                else {
                    repeat = `Every ${edit_task.repeat.interval.value} month(s)`
                }
            }

        }

        else {
            if (edit_task.schedule) {
                calendar_text = `${this.monthNames[edit_task.schedule.month]} ${edit_task.schedule.year}`
            }

            if (edit_task.repeat) {
                repeat = `Every ${edit_task.repeat.interval.value} month(s)`
            }
        }

        this.setState({
            category,
            priority,
            repeat,
            goal,
            calendar_text
        })
    }



    _dismissModal = () => {
        this.props.closeModal()
    }

    toggleDelete = () => {
        this.setState(prevState => ({
            toggle_delete: !prevState.toggle_delete
        }))
    }

    updateTaskDeletionOnStatsAllTime = (task_id, type) => {
        let stats = Map(this.props.stats).asMutable(),
            completed_tasks = Map(this.props.completed_tasks)

        if (completed_tasks.has(task_id)) {
            let completed_data = Map(completed_tasks.get(task_id))

            completed_data.keySeq().forEach((key) => {
                if (key !== "id" && key !== "category" && key !== "priority_value") {
                    let completed_timestamp = parseInt(key)

                    if (stats.has(completed_timestamp)) {
                        if (type === "day") {
                            let priority_value = completed_data.getIn([key, "priority_value"]),
                                current_value = completed_data.getIn([key, "current"])

                            stats.updateIn([completed_timestamp, "current"], (value) => {
                                return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }

                        else if (type === "week") {
                            let day_completed_array = List(completed_data.getIn([key, "day_completed_array"])),
                                priority_value_array = List(completed_data.getIn([key, "priority_value_array"]))

                            day_completed_array.forEach((completed_value, index) => {
                                if (completed_value > 0) {
                                    stats.updateIn([completed_timestamp, "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value_array.get(index)], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }
                            })
                        }

                        else {
                            let day_completed_array = List(completed_data.getIn([key, "day_completed_array"])),
                                priority_value_array = List(completed_data.getIn([key, "priority_value_array"]))

                            day_completed_array.forEach((completed_value, index) => {
                                if (completed_value > 0) {
                                    stats.updateIn([completed_timestamp, "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value_array.get(index)], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }
                            })
                        }
                    }
                }
            })
        }

        return stats
    }

    updateTaskDeletionOnChartStatsAllTime = (task_id, type) => {
        let week_chart_stats = Map(this.props.week_chart_stats).asMutable(),
            month_chart_stats = Map(this.props.month_chart_stats).asMutable(),
            year_chart_stats = Map(this.props.year_chart_stats).asMutable(),
            completed_tasks = Map(this.props.completed_tasks)

        if (completed_tasks.has(task_id)) {
            let completed_data = Map(completed_tasks.get(task_id))

            completed_data.keySeq().forEach((key) => {
                if (key !== "id" && key !== "category" && key !== "priority_value") {
                    let completed_timestamp = parseInt(key)

                    if (type === "day") {
                        let priority_value = completed_data.getIn([key, "priority_value"]),
                            current_value = completed_data.getIn([key, "current"]),
                            near_monday = this.getMonday(completed_timestamp),
                            week_completed_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime(),
                            day_in_week = new Date(completed_timestamp).getDay(),
                            day_in_month = new Date(completed_timestamp).getDate(),
                            completed_month = new Date(completed_timestamp).getMonth(),
                            completed_year = new Date(completed_timestamp).getFullYear(),
                            month_completed_timestamp = new Date(completed_year, completed_month).getTime()

                        if (week_chart_stats.hasIn([week_completed_timestamp, day_in_week.toString(), "current"])) {
                            week_chart_stats.updateIn([week_completed_timestamp, day_in_week.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }

                        if (month_chart_stats.hasIn([month_completed_timestamp, day_in_month.toString(), "current"])) {
                            month_chart_stats.updateIn([month_completed_timestamp, day_in_month.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }

                        if (year_chart_stats.hasIn([completed_year, completed_month.toString(), "current"])) {
                            year_chart_stats.updateIn([completed_year, completed_month.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }
                    }

                    else if (type === "week") {
                        let priority_value_array = List(completed_data.getIn([key, "priority_value_array"])),
                            day_completed_array = List(completed_data.getIn([key, "day_completed_array"]))

                        day_completed_array.forEach((completed_value, index) => {
                            if (completed_value > 0) {
                                let i = index
                                if (i === 0) i = 7

                                let date = new Date(completed_timestamp + (i - 1) * 86400 * 1000),
                                    day_in_month = date.getDate(),
                                    month = date.getMonth(),
                                    year = date.getFullYear(),
                                    month_timestamp = new Date(year, month).getTime(),
                                    priority_value = priority_value_array.get(index)


                                if (week_chart_stats.hasIn([completed_timestamp, index.toString(), "current"])) {
                                    week_chart_stats.updateIn([completed_timestamp, index.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (month_chart_stats.hasIn([month_timestamp, day_in_month.toString(), "current"])) {
                                    month_chart_stats.updateIn([month_timestamp, day_in_month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                                    })
                                }

                                if (year_chart_stats.hasIn([year, month.toString(), "current"])) {
                                    year_chart_stats.updateIn([year, month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                                    })
                                }
                            }
                        })

                    }

                    else {
                        let priority_value_array = List(completed_data.getIn([key, "priority_value_array"])),
                            day_completed_array = List(completed_data.getIn([key, "day_completed_array"])),
                            completed_month = new Date(completed_timestamp).getMonth(),
                            completed_year = new Date(completed_timestamp).getFullYear()

                        day_completed_array.forEach((completed_value, index) => {
                            if (completed_value > 0) {
                                let day = index + 1,
                                    date = new Date(completed_year, completed_month, day),
                                    near_monday = this.getMonday(date),
                                    completed_week_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime(),
                                    day_in_week = date.getDay(),
                                    priority_value = priority_value_array.get(index)


                                if (week_chart_stats.hasIn([completed_week_timestamp, day_in_week.toString(), "current"])) {
                                    week_chart_stats.updateIn([completed_week_timestamp, day_in_week.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (month_chart_stats.hasIn([completed_timestamp, day.toString(), "current"])) {
                                    month_chart_stats.updateIn([completed_timestamp, day.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                                    })
                                }

                                if (year_chart_stats.hasIn([completed_year, completed_month.toString(), "current"])) {
                                    year_chart_stats.updateIn([completed_year, completed_month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }

        return ({
            week_chart_stats,
            month_chart_stats,
            year_chart_stats
        })
    }

    updateTaskDeletionOnCategory = (category) => {
        let categories = Map(this.props.categories),
            data = {}

        if (categories.has(category)) {
            data = { ...categories.get(category) }
            if (data.hasOwnProperty("quantity")) {
                data.quantity -= 1

                if (data.quantity < 0) {
                    data.quantity = 0
                }
            }
        }

        return data
    }

    delete = () => {
        let sending_obj = {
            category_obj: {
                id: this.edit_task.category,
                data: this.updateTaskDeletionOnCategory(this.edit_task.category)
            },
            task_id: this.edit_task.id,
            stats: {}
        }

        if (this.props.type === "day") {
            sending_obj.completed_task_action_type = "DELETE_COMPLETED_DAY_TASK"
            sending_obj.task_action_type = "DELETE_DAY_TASK"
            sending_obj.stats.action_type = "RETURN_NEW_DAY_STATS"
        }

        else if (this.props.type === "week") {
            sending_obj.completed_task_action_type = "DELETE_COMPLETED_WEEK_TASK"
            sending_obj.task_action_type = "DELETE_WEEK_TASK"
            sending_obj.stats.action_type = "RETURN_NEW_WEEK_STATS"
        }

        else {
            sending_obj.completed_task_action_type = "DELETE_COMPLETED_MONTH_TASK"
            sending_obj.task_action_type = "DELETE_MONTH_TASK"
            sending_obj.stats.action_type = "RETURN_NEW_MONTH_STATS"
        }

        sending_obj.stats.data = this.updateTaskDeletionOnStatsAllTime(this.edit_task.id, this.props.type)
        sending_obj.chart_stats = this.updateTaskDeletionOnChartStatsAllTime(this.edit_task.id, this.props.type)

        this.props.deleteTaskThunk(sending_obj)

        this.props.resetTaskData()
        this.toggleDelete()
        this.yes_delete_clicked = true
    }

    componentDidMount() {
        // this._handleTaskUpdate()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.task_data !== prevProps.task_data) {
            // this.edit_task = this.props.task_data

            // this._handleTaskUpdate()
        }

        if (this.state.toggle_delete !== prevProps.toggleDelete && this.yes_delete_clicked) {
            this.props.closeModal()
        }
    }

    render() {
        let task_data_map = Map(this.props.task_data),
            task_title = task_data_map.get("title"),
            task_description = task_data_map.get("description"),
            type = this.props.type,
            task_schedule = task_data_map.get("schedule"),
            task_schedule_text = "",
            categories_map = Map(this.props.categories),
            task_category = task_data_map.get("category"),
            task_category_name = categories_map.getIn([task_category, "name"]),
            task_category_color = categories_map.getIn([task_category, "color"]),
            priorities_map = Map(this.props.priorities),
            task_priority_value = task_data_map.getIn(["priority", "value"]),
            task_priority_color = priorities_map.getIn([task_priority_value, "color"]),
            task_priority_name = priorities_map.getIn([task_priority_value, "name"]),
            task_repeat = task_data_map.get("repeat"),
            task_repeat_type = task_data_map.getIn(["repeat", "type"]),
            task_repeat_value = task_data_map.getIn(["repeat", "interval", "value"]),
            task_repeat_text = "",
            task_end = task_data_map.get("end"),
            task_end_type = task_data_map.getIn(["end", "type"]),
            task_end_text = "",
            task_reward_text = Map(task_data_map).getIn(["reward", "value"]),
            task_goal_text = `${Map(task_data_map).getIn(["goal", "max"])} time per occurrence`

        if (type === "day") {
            let day = parseInt(Map(task_schedule).get("day")),
                month = parseInt(Map(task_schedule).get("month")),
                year = parseInt(Map(task_schedule).get("year")),
                date = new Date(year, month, day)

            task_schedule_text = `${this.daysInWeekText[date.getDay()]} ${date.getDate()} ${this.monthNames[date.getMonth()]} ${year}`

            if (task_repeat_type === "weekly") {
                let days_in_week = List(Map(task_repeat).getIn(["interval", "daysInWeek"])).toArray(),
                    string = ""

                days_in_week.forEach((value, index) => {
                    if (value) {
                        let day_index = index + 1 === 7 ? 0 : index + 1

                        string += this.short_daysInWeekText[day_index] + ", "
                    }
                })

                if (string !== "" || string.length > 0) {
                    string = "(" + string.substring(0, string.length - 2) + ")"
                }

                task_repeat_text = `every ${task_repeat_value} week ${string}`
            }

            else {
                task_repeat_text = task_repeat_type === "daily" ? `every ${task_repeat_value} day` : `every ${task_repeat_value} month`
            }
        }

        else if (type === "week") {
            let week = Map(task_schedule).get("week"),
                monday = Map(task_schedule).get("monday"),
                start_month = parseInt(Map(task_schedule).get("start_month")),
                sunday = Map(task_schedule).get("sunday"),
                end_month = parseInt(Map(task_schedule).get("end_month")),
                start_year = Map(task_schedule).get("start_year"),
                end_year = Map(task_schedule).get("end_year")

            task_schedule_text = `Week ${week} (${monday} ${this.month_names_in_short[start_month]} ${start_year} - ${sunday} ${this.month_names_in_short[end_month]} ${end_year})`

            if (task_repeat_type === "weekly-m") {
                let no_week_in_month = parseInt(Map(task_repeat).getIn(["interval", "noWeekInMonth"])),
                    nth_week_array = ["1st", "2nd", "3rd", "4th"]

                if (no_week_in_month > 4) {
                    no_week_in_month = 4
                }

                task_repeat_text = `${nth_week_array[no_week_in_month - 1]} week every ${task_repeat_value} month`
            }

            else {
                task_repeat_text = `every ${task_repeat_value} week`
            }
        }

        else {
            let month = Map(task_schedule).get("month"),
                year = Map(task_schedule).get("year")

            task_schedule_text = `${this.monthNames[month]} ${year}`

            task_repeat_text = `every ${task_repeat_value} month`
        }


        if (task_end_type === "never") {
            task_end_text = "Never"
        }

        else if (task_end_type === "on") {
            let end_date = new Date(parseInt(Map(task_end).get("endAt")))

            task_end_text = `${this.daysInWeekText[end_date.getDay()]} ${end_date.getDate()} ${this.monthNames[end_date.getMonth()]} ${end_date.getFullYear()}`
        }

        else {
            let occurrences = Map(task_end).get("occurrence")

            task_end_text = `${occurrences} occurrence`
        }

        return (
            <Modal
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        position: "relative"
                    }}
                >

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            width: window_width,
                            backgroundColor: "black",
                            opacity: 0.2,
                        }}

                        onPress={this._dismissModal}
                    >

                    </TouchableOpacity>

                    <View
                        style={{
                            position: "absolute",
                            top: 60,
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            width: Dimensions.get("window").width,
                            backgroundColor: "white",
                            bottom: 0,
                        }}
                    >
                        {/* minus sign - close modal */}
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 5,
                            }}
                        >
                            <View
                                style={styles.minus}
                            >

                            </View>
                        </TouchableOpacity>


                        <EditDeleteRow
                        />

                        <ScrollView>
                            <TitleDescriptionRow
                                title={task_title}
                                description={task_description}
                            />

                            <ScheduleRow
                                schedule_text={task_schedule_text}
                            />

                            <CategoryRow
                                category_name={task_category_name}
                                category_color={task_category_color}
                            />

                            <PriorityRow
                                priority_color={task_priority_color}
                                priority_name={task_priority_name}
                            />

                            <RepeatRow
                                repeat_text={task_repeat_text}
                            />

                            <EndRow
                                end_text={task_end_text}
                            />

                            <RewardRow
                                reward_text={task_reward_text}
                            />

                            <GoalRow
                                goal_text={task_goal_text}
                            />
                        </ScrollView>
                    </View>

                </View>
            </Modal>
        )
    }
}

class EditDetails extends React.PureComponent {
    daysInWeekText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    monthNames = ["January", "Febuary", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    month_names_in_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    edit_task = {}
    calendar_text = ""
    category = ""
    priority = ""
    priority_id = ""
    repeat = ""
    goal = ""

    category_key = ""

    priority_order = {
        pri_01: 0,
        pri_02: 1,
        pri_03: 2,
        pri_04: 3
    }

    state = {
        title_value: "",
        description_value: "",
        should_visible: false,

        edit_calendar: false,
        edit_category: false,
        edit_repeat: false,
        edit_priority: false,
        edit_goal: false,

        should_update: 0,

        agree_on_changing_priority_history: false
    }


    toggleAgreeOnChangingPriorityHistory = () => {
        this.setState(prevState => ({
            agree_on_changing_priority_history: !prevState.agree_on_changing_priority_history
        }))
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

    _onChangeTitle = (e) => {
        this.setState({
            title_value: e.nativeEvent.text
        })
    }

    _onChangeDescription = (e) => {
        this.setState({
            description_value: e.nativeEvent.text
        })
    }

    toggleShouldVisible = () => {
        this.setState(prevState => ({
            should_visible: !prevState.should_visible
        }))
    }

    disableAllTabBools = () => {
        this.setState({
            edit_calendar: false,
            edit_category: false,
            edit_repeat: false,
            edit_priority: false,
            edit_goal: false,
        })
    }

    toggleAction = (name) => {
        this.toggleShouldVisible()
        this.disableAllTabBools()

        if (name === "calendar") {
            this.setState({
                edit_calendar: true
            })
        }

        else if (name === "category") {
            this.setState({
                edit_category: true
            })
        }

        else if (name === "repeat") {
            this.setState({
                edit_repeat: true
            })
        }

        else if (name === "priority") {
            this.setState({
                edit_priority: true
            })
        }

        else {
            this.setState({
                edit_goal: true
            })
        }
    }

    setEditTask = (data) => {
        this.edit_task = { ... this.edit_task, ...data }

        this.renderData(this.edit_task)
    }

    updateOnStatsAndChartsDataAllTime = (task_id, type, new_priority_value) => {
        let completed_tasks_map = Map(this.props.completed_tasks),
            stats_map = Map(this.props.stats).asMutable(),
            week_chart_stats_map = Map(this.props.week_chart_stats).asMutable(),
            month_chart_stats_map = Map(this.props.month_chart_stats).asMutable(),
            year_chart_stats_map = Map(this.props.year_chart_stats).asMutable()

        if (completed_tasks_map.has(task_id)) {
            let completed_task_data = Map(completed_tasks_map.get(task_id))

            completed_task_data.keySeq().forEach((key) => {
                if (key !== "id" && key !== "category" && key !== "priority_value") {
                    let completed_timestamp = parseInt(key),
                        completed_data = Map(completed_task_data.get(key))

                    if (type === "day") {
                        let current_value = completed_data.get("current"),
                            old_priority_value = completed_data.get("priority_value"),
                            near_monday = this.getMonday(completed_timestamp),
                            day_in_week = new Date(completed_timestamp).getDay(),
                            year = new Date(completed_timestamp).getFullYear(),
                            month = new Date(completed_timestamp).getMonth(),
                            day = new Date(completed_timestamp).getDate(),
                            week_completed_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime(),
                            month_completed_timestamp = new Date(year, month).getTime()

                        if (stats_map.has(completed_timestamp)) {
                            stats_map.updateIn([completed_timestamp, "current"], (value) => {
                                return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                            })

                            stats_map.updateIn([completed_timestamp, "current"], (value) => {
                                return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }

                        if (week_chart_stats_map.hasIn([week_completed_timestamp, day_in_week.toString()])) {
                            week_chart_stats_map.updateIn([week_completed_timestamp, day_in_week.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                            })

                            week_chart_stats_map.updateIn([week_completed_timestamp, day_in_week.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }

                        if (month_chart_stats_map.hasIn([month_completed_timestamp, day.toString()])) {
                            month_chart_stats_map.updateIn([month_completed_timestamp, day.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                            })
                            month_chart_stats_map.updateIn([month_completed_timestamp, day.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }

                        if (year_chart_stats_map.hasIn([year, month.toString()])) {
                            year_chart_stats_map.updateIn([year, month.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                            })
                            year_chart_stats_map.updateIn([year, month.toString(), "current"], (value) => {
                                return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                            })
                        }
                    }

                    else if (type === "week") {
                        if (completed_task_data.hasIn([key, "day_completed_array"]) && completed_task_data.hasIn([key, "priority_value_array"])) {
                            let day_completed_array = List(completed_task_data.getIn([key, "day_completed_array"])),
                                priority_value_array = List(completed_task_data.getIn([key, "priority_value_array"]))

                            day_completed_array.forEach((completed_value, index) => {
                                let i = index
                                if (i === 0) i = 7

                                let date = new Date(completed_timestamp + (i - 1) * 86400 * 1000),
                                    day = date.getDate(),
                                    month = date.getMonth(),
                                    year = date.getFullYear(),
                                    month_timestamp = new Date(year, month).getTime(),
                                    old_priority_value = priority_value_array.get(index)

                                if (stats_map.has(completed_timestamp)) {

                                    stats_map.updateIn([completed_timestamp, "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    stats_map.updateIn([completed_timestamp, "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (week_chart_stats_map.hasIn([completed_timestamp, index.toString()])) {
                                    week_chart_stats_map.updateIn([completed_timestamp, index.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    week_chart_stats_map.updateIn([completed_timestamp, index.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (month_chart_stats_map.hasIn([month_timestamp, day.toString()])) {
                                    month_chart_stats_map.updateIn([month_timestamp, day.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    month_chart_stats_map.updateIn([month_timestamp, day.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (year_chart_stats_map.hasIn([year, month.toString()])) {
                                    year_chart_stats_map.updateIn([year, month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    year_chart_stats_map.updateIn([year, month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }
                            })
                        }
                    }

                    else {
                        let completed_month = new Date(completed_timestamp).getMonth(),
                            completed_year = new Date(completed_timestamp).getFullYear()

                        if (completed_task_data[key].hasOwnProperty("day_completed_array") && completed_task_data[key].hasOwnProperty("priority_value_array")) {
                            let day_completed_array = List(completed_task_data.getIn([key, "day_completed_array"])),
                                priority_value_array = List(completed_task_data.getIn([key, "priority_value_array"]))

                            day_completed_array.forEach((completed_value, index) => {
                                let day = index + 1,
                                    date = new Date(completed_year, completed_month, day),
                                    near_monday = this.getMonday(date),
                                    completed_week_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime(),
                                    day_in_week = date.getDay(),
                                    old_priority_value = priority_value_array.get(index)


                                if (stats_map.has(completed_timestamp)) {
                                    stats_map.updateIn([completed_timestamp, "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    stats_map.updateIn([completed_timestamp, "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (week_chart_stats_map.hasIn([completed_week_timestamp, day_in_week.toString()])) {
                                    week_chart_stats_map.updateIn([completed_week_timestamp, day_in_week.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    week_chart_stats_map.updateIn([completed_week_timestamp, day_in_week.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (month_chart_stats_map.hasIn([completed_timestamp, day.toString()])) {
                                    month_chart_stats_map.updateIn([completed_timestamp, day.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    month_chart_stats_map.updateIn([completed_timestamp, day.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }

                                if (year_chart_stats_map.hasIn([completed_year, completed_month.toString()])) {
                                    year_chart_stats_map.updateIn([completed_year, completed_month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[new_priority_value], (v) => v + completed_value)
                                    })

                                    year_chart_stats_map.updateIn([completed_year, completed_month.toString(), "current"], (value) => {
                                        return List(value).update(this.priority_order[old_priority_value], (v) => v - completed_value < 0 ? 0 : v - completed_value)
                                    })
                                }
                            })

                        }
                    }
                }
            })
        }

        return ({
            stats: stats_map,
            week_chart_stats: week_chart_stats_map,
            month_chart_stats: month_chart_stats_map,
            year_chart_stats: year_chart_stats_map,
        })
    }

    updateOnStatsAndChartDataFromToday = (task_id, type, new_priority_value, date) => {
        let completed_tasks_map = Map(this.props.completed_tasks),
            stats_map = Map(this.props.stats),
            week_chart_stats_map = Map(this.props.week_chart_stats),
            month_chart_stats_map = Map(this.props.month_chart_stats),
            year_chart_stats_map = Map(this.props.year_chart_stats),
            completed_timestamp,
            return_obj = {}

        if (completed_tasks_map.has(task_id)) {
            let completed_task = Map(completed_tasks_map.get(task_id))

            if (type === "day") {
                completed_timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

                if (completed_task.has(completed_timestamp.toString())) {
                    let current_value = completed_task.getIn([completed_timestamp.toString(), "current"]),
                        old_priority_value = completed_task.getIn([completed_timestamp.toString(), "priority_value"]),
                        near_monday = this.getMonday(date),
                        week_completed_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime(),
                        day_in_week = date.getDay(),
                        month_completed_timestamp = new Date(date.getFullYear(), date.getMonth()).getTime(),
                        completed_year = date.getFullYear(),
                        day_in_month = date.getDate(),
                        completed_month = date.getMonth()


                    if (stats_map.has(completed_timestamp)) {
                        let stats_data = Map(stats_map.get(completed_timestamp)).toMap().asMutable()

                        stats_data.update("current", (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v += current_value)
                        })

                        stats_data.update("current", (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_stats_data = {
                            data: stats_data,
                            timestamp: completed_timestamp
                        }
                    }

                    if (week_chart_stats_map.hasIn([week_completed_timestamp, day_in_week.toString()])) {
                        let chart_data = Map(week_chart_stats_map.get(week_completed_timestamp)).toMap().asMutable()

                        chart_data.updateIn([day_in_week.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                        })

                        chart_data.updateIn([day_in_week.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_week_chart_stats_data = {
                            timestamp: week_completed_timestamp,
                            data: chart_data
                        }
                    }

                    if (month_chart_stats_map.hasIn([month_completed_timestamp, day_in_month.toString()])) {
                        let chart_data = Map(month_chart_stats_map.get(month_completed_timestamp)).toMap().asMutable()

                        chart_data.updateIn([day_in_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                        })

                        chart_data.updateIn([day_in_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_month_chart_stats_data = {
                            timestamp: month_completed_timestamp,
                            data: chart_data
                        }
                    }

                    if (year_chart_stats_map.hasIn([completed_year, completed_month.toString()])) {
                        let chart_data = Map(year_chart_stats_map.get(completed_year)).toMap().asMutable()

                        chart_data.updateIn([completed_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                        })

                        chart_data.updateIn([completed_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_year_chart_stats_data = {
                            timestamp: completed_year,
                            data: chart_data
                        }
                    }
                }
            }

            else if (type === "week") {
                let near_monday = this.getMonday(date)
                completed_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime()

                if (completed_task.hasIn([completed_timestamp.toString(), "day_completed_array"]) && completed_task.hasIn([completed_timestamp.toString(), "priority_value_array"])) {
                    let day_completed_array = List(completed_task.getIn([completed_timestamp.toString(), "day_completed_array"])),
                        priority_value_array = List(completed_task.getIn([completed_timestamp.toString(), "priority_value_array"])),

                        day_in_week = date.getDay(),
                        day_in_month = date.getDate(),
                        completed_month = date.getMonth(),
                        completed_year = date.getFullYear(),
                        month_completed_timestamp = new Date(completed_year, completed_month).getTime(),
                        current_value = day_completed_array.get(day_in_week),
                        old_priority_value = priority_value_array.get(day_in_week)

                    if (stats_map.has(completed_timestamp)) {
                        let stats_data = Map(stats_map.get(completed_timestamp)).toMap().asMutable()

                        stats_data.update("current", (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v += current_value)
                        })

                        stats_data.update("current", (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_stats_data = {
                            data: stats_data,
                            timestamp: completed_timestamp
                        }
                    }

                    if (week_chart_stats_map.hasIn([completed_timestamp, day_in_week.toString()])) {
                        let chart_data = Map(week_chart_stats_map.get(completed_timestamp)).toMap().asMutable()

                        chart_data.updateIn([day_in_week.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                        })

                        chart_data.updateIn([day_in_week.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_week_chart_stats_data = {
                            data: chart_data,
                            timestamp: completed_timestamp
                        }
                    }

                    if (month_chart_stats_map.hasIn([month_completed_timestamp, day_in_month.toString()])) {
                        let chart_data = Map(month_chart_stats_map.get(month_completed_timestamp)).toMap().asMutable()

                        chart_data.updateIn([day_in_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                        })

                        chart_data.updateIn([day_in_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_month_chart_stats_data = {
                            data: chart_data,
                            timestamp: month_completed_timestamp
                        }
                    }

                    if (year_chart_stats_map.hasIn([completed_year, completed_month.toString()])) {
                        let chart_data = Map(year_chart_stats_map.get(completed_year)).toMap().asMutable()

                        chart_data.updateIn([completed_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                        })

                        chart_data.updateIn([completed_month.toString(), "current"], (value) => {
                            return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                        })

                        return_obj.return_year_chart_stats_data = {
                            data: chart_data,
                            timestamp: completed_year
                        }
                    }
                }
            }
        }

        else {
            completed_timestamp = new Date(date.getFullYear(), date.getMonth()).getTime()

            if (completed_task.hasIn([completed_timestamp.toString(), "day_completed_array"]) && completed_task.hasIn([completed_timestamp.toString(), "priority_value_array"])) {
                let day_completed_array = List(completed_task.getIn([completed_timestamp.toString(), "day_completed_array"])),
                    priority_value_array = List(completed_task.getIn([completed_timestamp.toString(), "priority_value_array"])),
                    day = date.getDate(),
                    completed_year = date.getFullYear(),
                    completed_month = date.getMonth(),
                    near_monday = this.getMonday(date),
                    week_completed_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime(),
                    day_in_week = date.getDay(),
                    old_priority_value = priority_value_array.get(day - 1),
                    current_value = day_completed_array.get(day - 1)

                if (stats_map.has(completed_timestamp)) {
                    let stats_data = Map(stats_map.get(completed_timestamp)).toMap().asMutable()

                    stats_data.update("current", (value) => {
                        return List(value).update(this.priority_order[new_priority_value], (v) => v += current_value)
                    })

                    stats_data.update("current", (value) => {
                        return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                    })

                    return_obj.return_stats_data = {
                        data: stats_data,
                        timestamp: completed_timestamp
                    }
                }

                if (week_chart_stats_map.hasIn([week_completed_timestamp, day_in_week.toString()])) {
                    let chart_data = Map(week_chart_stats_map.get(week_completed_timestamp)).toMap().asMutable()

                    chart_data.updateIn([day_in_week.toString(), "current"], (value) => {
                        return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                    })

                    chart_data.updateIn([day_in_week.toString(), "current"], (value) => {
                        return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                    })

                    return_obj.return_week_chart_stats_data = {
                        data: chart_data,
                        timestamp: week_completed_timestamp
                    }
                }

                if (month_chart_stats_map.hasIn([completed_timestamp, day_in_month.toString()])) {
                    let chart_data = Map(month_chart_stats_map.get(completed_timestamp)).toMap().asMutable()

                    chart_data.updateIn([day_in_month.toString(), "current"], (value) => {
                        return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                    })

                    chart_data.updateIn([day_in_month.toString(), "current"], (value) => {
                        return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                    })

                    return_obj.return_month_chart_stats_data = {
                        data: chart_data,
                        timestamp: completed_timestamp
                    }
                }

                if (year_chart_stats_map.hasIn([completed_year, completed_month.toString()])) {
                    let chart_data = Map(year_chart_stats_map.get(completed_year)).toMap().asMutable()

                    chart_data.updateIn([completed_month.toString(), "current"], (value) => {
                        return List(value).update(this.priority_order[new_priority_value], (v) => v + current_value)
                    })

                    chart_data.updateIn([completed_month.toString(), "current"], (value) => {
                        return List(value).update(this.priority_order[old_priority_value], (v) => v - current_value < 0 ? 0 : v - current_value)
                    })

                    return_obj.return_year_chart_stats_data = {
                        data: chart_data,
                        timestamp: completed_year
                    }
                }
            }


        }

        return return_obj
    }

    doChangesOnCompletedTaskFromToday = (task_id, type, new_priority_value, date) => {
        let completed_tasks_map = Map(this.props.completed_tasks),
            completed_timestamp,
            completed_data = {}

        if (type === "day") {
            completed_timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
            if (completed_tasks_map.hasIn([task_id, completed_timestamp.toString()])) {
                completed_data = Map(completed_tasks_map.get(task_id)).toMap().asMutable()

                completed_data.updateIn([completed_timestamp.toString(), "priority_value"], (value) => new_priority_value)
            }
        }

        else if (type === "week") {
            let near_monday = this.getMonday(date),
                day_in_week = date.getDay()

            completed_timestamp = new Date(near_monday.getFullYear(), near_monday.getMonth(), near_monday.getDate()).getTime()

            if (completed_tasks_map.hasIn([task_id, completed_timestamp.toString()])) {
                completed_data = Map(completed_tasks_map.get(task_id)).toMap().asMutable()

                completed_data.updateIn([completed_timestamp.toString(), "priority_value_array"], (value) => {
                    let priority_value_array = List(value).toList().asMutable()

                    if (day_in_week === 0) {
                        priority_value_array.update(day_in_week, (value) => new_priority_value)
                    }

                    else {
                        for (let i = day_in_week; i <= 7; i++) {
                            priority_value_array.update(i % 7, (value) => new_priority_value)
                        }
                    }

                    return priority_value_array
                })
            }
        }

        else {
            let day_in_month = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear(),
                last_day_in_month = new Date(year, month + 1, 0).getDate()

            completed_timestamp = new Date(year, month).getTime()

            if (completed_tasks_map.hasIn([task_id, completed_timestamp.toString()])) {
                completed_data = Map(completed_tasks_map.get(task_id)).toMap().asMutable()

                completed_data.updateIn([completed_timestamp.toString(), "priority_value_array"], (value) => {
                    let priority_value_array = List(value).toList().asMutable()

                    for (let i = day_in_month; i <= last_day_in_month; i++) {
                        priority_value_array.update(i, (value) => new_priority_value)
                    }

                    return priority_value_array
                })
            }
        }

        return completed_data
    }

    doChangesOnCompletedTaskAllTime = (task_id, type, new_priority_value) => {
        let completed_tasks_map = Map(this.props.completed_tasks).asMutable()

        if (completed_tasks_map.has(task_id)) {
            completed_tasks_map.update(task_id, (value) => {
                let completed_data = Map(value).toMap().asMutable()

                completed_data.keySeq().forEach((key) => {
                    if (key !== "id" && key !== "category" && key !== "priority_value") {
                        if (type === "day") {
                            completed_data.updateIn([key, "priority_value"], (v) => new_priority_value)
                        }

                        else {
                            if (completed_data.hasIn([key, "priority_value_array"])) {
                                completed_data.updateIn([key, "priority_value_array"], (v) => {
                                    return List(List(v).toArray().fill(new_priority_value))
                                })
                            }
                        }
                    }
                })

                return completed_data
            })
        }

        return completed_tasks_map
    }

    save = () => {
        let new_priority_id = this.edit_task.priority.value,
            new_category_key = this.edit_task.category,
            should_update_category = false,
            update_category_data = {},
            stats_action_type = "",
            completed_task_action_type = "",
            sending_obj = {
                edit_task: this.edit_task,
                should_update_category,
                update_category_data,
            },
            date = new Date()

        // Only do update if the category is changed
        if (this.category_key !== new_category_key) {
            should_update_category = true

            //Decrease old category's quantity
            let old_category_data = { ...Map(this.props.categories).get(this.category_key) }
            old_category_data.quantity -= 1

            //Increase new category's quantity
            let new_category_data = { ...Map(this.props.categories).get(new_category_key) }
            new_category_data.quantity += 1

            if (new_category_data.quantity < 0) {
                new_category_data.quantity = 0
            }

            update_category_data = {
                new_category_key,
                new_category_data,
                old_category_key: this.category_key,
                old_category_data
            }

            sending_obj.should_update_category = should_update_category
            sending_obj.update_category_data = update_category_data
        }

        // do update on stats and chart_stats when priority is changed
        if (this.priority_id !== new_priority_id) {
            // Apply all time
            if (this.state.agree_on_changing_priority_history) {
                sending_obj.should_update_from_now = false

                if (this.edit_task.type === "day") {
                    stats_action_type = "RETURN_NEW_DAY_STATS"
                    completed_task_action_type = "RETURN_NEW_COMPLETED_DAY_TASKS"
                }

                else if (this.edit_task.type === "week") {
                    stats_action_type = "RETURN_NEW_WEEK_STATS"
                    completed_task_action_type = "RETURN_NEW_COMPLETED_WEEK_TASKS"
                }

                else {
                    stats_action_type = "RETURN_NEW_MONTH_STATS"
                    completed_task_action_type = "RETURN_NEW_COMPLETED_MONTH_TASKS"
                }


                let result_obj = this.updateOnStatsAndChartsDataAllTime(this.edit_task.id, this.edit_task.type, new_priority_id),
                    completed_tasks = this.doChangesOnCompletedTaskAllTime(this.edit_task.id, this.edit_task.type, new_priority_id)

                sending_obj.stats_data = {
                    action_type: stats_action_type,
                    data: result_obj.stats
                }

                sending_obj.week_chart_stats_data = {
                    data: result_obj.week_chart_stats
                }

                sending_obj.month_chart_stats_data = {
                    data: result_obj.month_chart_stats
                }

                sending_obj.year_chart_stats_data = {
                    data: result_obj.year_chart_stats
                }

                sending_obj.completed_tasks_data = {
                    action_type: completed_task_action_type,
                    data: completed_tasks
                }
            }

            else {
                sending_obj.should_update_from_now = true

                if (this.edit_task.type === "day") {
                    stats_action_type = "UPDATE_DAY_STATS"
                    completed_task_action_type = "UPDATE_COMPLETED_DAY_TASK"
                }

                else if (this.edit_task.type === "week") {
                    stats_action_type = "UPDATE_WEEK_STATS"
                    completed_task_action_type = "UPDATE_COMPLETED_WEEK_TASK"
                }

                else {
                    stats_action_type = "UPDATE_MONTH_STATS"
                    completed_task_action_type = "UPDATE_COMPLETED_MONTH_TASK"
                }

                let result_obj = this.updateOnStatsAndChartDataFromToday(this.edit_task.id, this.edit_task.type, new_priority_id, date),
                    completed_tasks = this.doChangesOnCompletedTaskFromToday(this.edit_task.id, this.edit_task.type, new_priority_id, date)

                if (Object.keys(result_obj).length > 0 && Map.isMap(completed_tasks)) {
                    sending_obj.stats_data = {
                        action_type: stats_action_type,
                        timestamp: result_obj.return_stats_data.timestamp,
                        data: result_obj.return_stats_data.data
                    }

                    sending_obj.week_chart_stats_data = result_obj.return_week_chart_stats_data
                    sending_obj.month_chart_stats_data = result_obj.return_month_chart_stats_data
                    sending_obj.year_chart_stats_data = result_obj.return_year_chart_stats_data

                    sending_obj.completed_tasks_data = {
                        action_type: completed_task_action_type,
                        data: completed_tasks
                    }
                }
            }
        }

        this.props.editThunk(sending_obj)

        this.cancel()
    }

    cancel = () => {
        this.props.hideAction()
    }

    renderData = (edit_task) => {
        let { category, repeat, priority, goal, startTime, schedule } = edit_task

        let date = new Date(startTime)

        this.category = Map(this.props.categories).get(category).name
        this.priority = this.props.priorities[priority.value].name
        this.goal = `${goal.max} times`

        if (this.props.type === "day") {

            this.calendar_text = `${this.daysInWeekText[date.getDay()]} ${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`

            if (repeat.type === "daily") {
                this.repeat = `Every ${repeat.interval.value} day(s)`
            }

            else if (repeat.type === "weekly") {
                this.repeat = `Every ${repeat.interval.value} week(s)`
            }

            else {
                this.repeat = `Every ${repeat.interval.value} month(s)`
            }
        }

        else if (this.props.type === "week") {

            this.calendar_text = `Week ${schedule.week} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`

            if (repeat.type === "weekly-w") {
                this.repeat = `Every ${repeat.interval.value} week(s)`
            }

            else {
                this.repeat = `Every ${repeat.interval.value} month(s)`
            }

        }

        else {
            this.calendar_text = `${this.monthNames[schedule.month]} ${schedule.year}`

            this.repeat = `Every ${repeat.interval.value} month(s)`

        }

        this.setState(prevState => ({
            should_update: prevState.should_update + 1,
        }))
    }

    componentDidMount() {
        this.edit_task = this.props.task_data

        this.category_key = this.edit_task.category
        this.priority_id = this.edit_task.priority.value

        let { title, description } = this.edit_task

        this.setState({
            title_value: title,
            description_value: description ? description : "",
        })

        this.renderData(this.edit_task)
    }

    render() {
        return (
            <>
                <View
                    style={{
                        flex: 1,
                        paddingTop: 58,
                        paddingHorizontal: 30,
                        position: "relative",
                    }}
                >
                    <View
                        style={{
                            borderBottomColor: "gainsboro",
                            borderBottomWidth: 1,
                            height: 65,
                            marginBottom: 18,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 15,
                                color: "rgba(0, 0, 0, 0.25)",
                                marginBottom: 5,
                            }}
                        >
                            Task Title
                            </Text>

                        <TextInput
                            style={{
                                height: 30,
                            }}

                            value={this.state.title_value}
                            onChange={this._onChangeTitle}
                        />
                    </View>

                    <View
                        style={{
                            borderBottomColor: "gainsboro",
                            borderBottomWidth: 1,
                            height: 65,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 15,
                                color: "rgba(0, 0, 0, 0.25)",
                                marginBottom: 5,
                            }}
                        >
                            Task Description
                            </Text>

                        <TextInput
                            style={{
                                height: 30,
                            }}

                            value={this.state.description_value}
                            onChange={this._onChangeDescription}
                        />
                    </View>

                    <OptionButton
                        content={this.calendar_text}
                        text_color={"black"}
                        toggleAction={this.toggleAction}
                        name={"calendar"}
                    />
                    <OptionButton
                        content={this.category}
                        text_color={"red"}
                        toggleAction={this.toggleAction}
                        name={"category"}
                    />

                    <OptionButton
                        content={this.priority}
                        text_color={"red"}
                        toggleAction={this.toggleAction}
                        name={"priority"}
                    />

                    <OptionButton
                        content={this.repeat}
                        text_color={"black"}
                        toggleAction={this.toggleAction}
                        name={"repeat"}
                    />

                    <OptionButton
                        content={this.goal}
                        text_color={"black"}
                        toggleAction={this.toggleAction}
                        name={"goal"}
                    />

                    <View
                        style={{
                            position: "absolute",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            bottom: 100,
                            left: 30,
                            right: 30,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: 135,
                                height: 48,
                                borderRadius: 30,
                                backgroundColor: "gainsboro",
                                alignItems: "center",
                                justifyContent: "center",
                            }}

                            onPress={this.cancel}
                        >
                            <Text
                                style={{
                                    color: "white"
                                }}
                            >
                                Cancel
                                </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: 135,
                                height: 48,
                                borderRadius: 30,
                                backgroundColor: "black",
                                alignItems: "center",
                                justifyContent: "center",
                            }}

                            onPress={this.save}
                        >
                            <Text
                                style={{
                                    color: "white"
                                }}
                            >
                                Save
                                </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    visible={this.state.should_visible}
                    transparent={true}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                    >
                        <DismissArea
                            toggleShouldVisible={this.toggleShouldVisible}
                        />

                        <>
                            {
                                this.state.edit_calendar ?
                                    <CalendarEdit
                                        edit={true}
                                        task_data={this.edit_task}
                                        hideAction={this.toggleShouldVisible}
                                        setEditTask={this.setEditTask}
                                        type={this.props.type}
                                    />

                                    :

                                    <>
                                        {
                                            this.state.edit_category ?

                                                <Category
                                                    edit={true}
                                                    task_data={this.edit_task}
                                                    hideAction={this.toggleShouldVisible}
                                                    updateTask={this.setEditTask}
                                                />

                                                :

                                                <>
                                                    {
                                                        this.state.edit_priority ?

                                                            <Priority
                                                                agree_on_changing_priority_history={this.state.agree_on_changing_priority_history}
                                                                toggleAgreeOnChangingPriorityHistory={this.toggleAgreeOnChangingPriorityHistory}
                                                                edit={true}
                                                                task_data={this.edit_task}
                                                                hideAction={this.toggleShouldVisible}
                                                                updateTask={this.setEditTask}
                                                            />

                                                            :

                                                            <>
                                                                {
                                                                    this.state.edit_repeat ?

                                                                        <Repeat
                                                                            edit={true}
                                                                            task_data={this.edit_task}
                                                                            hideAction={this.toggleShouldVisible}
                                                                            updateTask={this.setEditTask}
                                                                            currentAnnotation={this.props.type}
                                                                        />

                                                                        :

                                                                        <>
                                                                            {
                                                                                this.state.edit_goal ?

                                                                                    <Goal
                                                                                        edit={true}
                                                                                        task_data={this.edit_task}
                                                                                        hideAction={this.toggleShouldVisible}
                                                                                        updateTask={this.setEditTask}
                                                                                        currentAnnotation={this.props.type}
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
                        </>
                    </View>
                </Modal>
            </>
        )
    }
}

class OptionButton extends React.PureComponent {

    _onPress = () => {
        this.props.toggleAction(this.props.name)
    }

    render() {
        return (
            <View
                style={{
                    borderBottomColor: "gainsboro",
                    borderBottomWidth: 1,
                    height: 65,
                    justifyContent: "center"
                }}
            >
                <TouchableOpacity
                    style={{
                        height: 30,
                    }}

                    onPress={this._onPress}
                >
                    <Text
                        style={{
                            color: this.props.text_color
                        }}
                    >
                        {this.props.content}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class CalendarEdit extends React.PureComponent {

    day_data = {}

    week_data = {}

    month_data = {}

    state = {
        toggle_clear: false
    }

    setDayData = (day, month, year) => {
        this.day_data = { day, month, year }
    }

    setWeekData = (day, week, month, year, noWeekInMonth) => {
        this.week_data = { day, week, month, year, noWeekInMonth }
    }

    setMonthData = (month, year) => {
        this.month_data = { month, year }
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

    save = () => {
        let data = {}

        if (this.props.type === "day") {
            if (this.day_data.day > 0 && this.day_data.month > 0 && this.day_data.year > 0) {
                let current = new Date()
                if (this.day_data.day < current.getDate() && this.day_data.month === current.getMonth() && this.day_data.year === current.getFullYear()) {
                    data.startTime = current.getTime()
                    data.trackingTime = data.startTime
                    data.schedule = {
                        day: current.getDate(),
                        month: this.day_data.month,
                        year: this.day_data.year
                    }
                }

                else {
                    data.startTime = new Date(new Date(new Date((new Date().setMonth(this.day_data.month))).setDate(this.day_data.day)).setFullYear(this.day_data.year)).getTime()
                    data.trackingTime = data.startTime
                    data.schedule = {
                        day: this.day_data.day,
                        month: this.day_data.month,
                        year: this.day_data.year
                    }
                }
            }
        }

        else if (this.props.type === "week") {
            if (this.week_data.day > 0 && this.week_data.week > 0 && this.week_data.month > 0 && this.week_data.year > 0) {
                let current = new Date()

                if (this.week_data.week < this.getWeek(current) && this.week_data.month === current.getMonth() && this.week_data.year === current.getFullYear()) {
                    data.startTime = this.getMonday(current).getTime()
                    data.trackingTime = data.startTime
                    data.schedule = {
                        week: this.getWeek(current),
                        day: this.getMonday(current).getDate(),
                        month: this.week_data.month,
                        year: this.week_data.year,
                        noWeekInMonth: this.getNoWeekInMonth(current)
                    }
                }

                else {
                    data.startTime = new Date(new Date(new Date((new Date().setMonth(this.week_data.month))).setDate(this.week_data.day)).setFullYear(this.week_data.year)).getTime()
                    data.trackingTime = data.startTime
                    data.schedule = {
                        week: this.week_data.week,
                        day: this.week_data.day,
                        month: this.week_data.month,
                        year: this.week_data.year,
                        noWeekInMonth: this.week_data.noWeekInMonth
                    }
                }
            }
        }

        else {
            if (this.month_data.month > 0 && this.month_data.year > 0) {
                let current = new Date()
                if (this.month_data.month < current.getMonth() && this.month_data.year === current.getFullYear()) {
                    data.startTime = new Date(new Date(new Date((new Date().setMonth(current.getMonth()))).setDate(1)).setFullYear(this.month_data.year)).getTime()
                    data.trackingTime = data.startTime
                    data.schedule = {
                        month: current.getMonth(),
                        year: this.month_data.year,
                    }
                }

                else {
                    data.startTime = new Date(new Date(new Date((new Date().setMonth(this.month_data.month))).setDate(1)).setFullYear(this.month_data.year)).getTime()
                    data.trackingTime = data.startTime
                    data.schedule = {
                        month: this.month_data.month,
                        year: this.month_data.year,
                    }
                }
            }
        }

        this.props.setEditTask(data)

        this.props.hideAction()
    }

    cancel = () => {
        this.props.hideAction()
    }

    clear = () => {
        this.setState(prevState => ({
            toggle_clear: !prevState.toggle_clear
        }))

        let date = new Date()
        this.setData(date.getDate(), date.getMonth(), date.getFullYear())
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    width: 338,
                    height: 346,
                    backgroundColor: 'white',
                    borderRadius: 10,
                }}
            >
                {this.props.type === "day" ?
                    < DayCalendar
                        {... this.props}
                        toggle_clear={this.state.toggle_clear}
                        setData={this.setDayData}
                    />
                    :
                    <>
                        {
                            this.props.type === "week" ?
                                <WeekCalendar
                                    {... this.props}
                                    toggle_clear={this.state.toggle_clear}
                                    setData={this.setWeekData}
                                />

                                :

                                <MonthCalendar
                                    {... this.props}
                                    toggle_clear={this.state.toggle_clear}
                                    setData={this.setMonthData}
                                />
                        }
                    </>
                }


                <View
                    style={{
                        height: 60,
                        backgroundColor: 'white',
                        flexDirection: "row",
                        marginBottom: 10,
                        justifyContent: "flex-end",
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
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
                    </TouchableOpacity>

                    <TouchableOpacity
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
                    </TouchableOpacity>

                    <TouchableOpacity
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
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

class DismissArea extends React.PureComponent {
    _onPress = () => {
        this.props.toggleShouldVisible()
    }
    render() {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    backgroundColor: "black",
                    width: Dimensions.get("window").width,
                    opacity: 0.5
                }}

                onPress={this._onPress}
            >

            </TouchableOpacity>
        )
    }
}

