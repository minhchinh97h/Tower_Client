import React from 'react'
import {
    View,
    Text,
    ScrollView,
    FlatList
} from 'react-native';

import TaskCard from '../layouts/TaskCard.Container'
import TaskDetailModal from '../layouts/TaskDetailModal.Container'

import DayFlatlist from './day-flatlist/DayFlatlist.Container'
import WeekFlatlist from './week-flatlist/WeekFlatlist.Container'
import MonthFlatlist from './month-flatlist/MonthFlatlist.Container'

import { styles } from './styles/styles'

import { Map, hasIn, getIn } from 'immutable'

export default class JournalTab extends React.PureComponent {
    static navigationOptions = {
        swipeEnabled: false,
        header: null
    }

    task_data = {}

    render_component_arr = []

    resetTaskData = () => {
        this.task_data = {}
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
        return new Date(new Date(date).getTime() - (diff * 86400 * 1000)).getDate()
    }

    getNoWeekInMonth = (date) => {
        let nearest_monday = this.getMonday(date)
        let first_moday_of_month = this.getMonday(new Date(date.getFullYear(), date.getMonth(), 7))

        return Math.floor((nearest_monday - first_moday_of_month) / 7) + 1
    }

    current_date = new Date()

    initChosenDateData = () => {
        if (this.props.type === "day") {
            return ({
                day: this.current_date.getDate(),
                month: this.current_date.getMonth(),
                year: this.current_date.getFullYear()
            })
        }

        else if (this.props.type === "week") {
            return ({
                week: this.getWeek(this.current_date),
                month: this.current_date.getMonth(),
                day: this.current_date.getDate(),
                year: this.current_date.getFullYear()
            })
        }

        return ({
            month: this.current_date.getMonth(),
            year: this.current_date.getFullYear()
        })
    }

    state = {
        isModalOpened: false,

        should_update: 0,

        chosen_date_data: this.initChosenDateData()
    }

    setChosenDateData = (data) => {
        this.setState({
            chosen_date_data: { ...{}, ...data }
        })
    }

    openModal = (task_data) => {
        this.task_data = task_data

        this.setState({ isModalOpened: true })
    }

    closeModal = () => {
        this.task_data = {}

        this.setState({ isModalOpened: false })
    }

    componentDidMount() {
        const didFocusScreen = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.props.changeRouteAction(payload.state.routeName)
            }
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.tasks !== prevProps.tasks) {
            if (this.task_data.id) {
                this.task_data = Map(this.props.tasks).get(this.task_data.id)
                this.setState(prevState => ({
                    should_update: prevState.should_update + 1,
                }))
            }
        }

        // if(this.props.completed_tasks !== prevProps.completed_tasks){
        //     console.log("\ncompleted_tasks", this.props.completed_tasks)
        // }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.type === "day" ?

                        <DayFlatlist
                            setChosenDateData={this.setChosenDateData}
                        />

                        :
                        <>
                            {
                                this.props.type === "week" ?
                                    <WeekFlatlist
                                        setChosenDateData={this.setChosenDateData}
                                    />

                                    :

                                    <MonthFlatlist
                                        setChosenDateData={this.setChosenDateData}
                                    />
                            }
                        </>
                }

                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <ScrollView style={styles.scrollViewTasks}>
                        {/* Uncompleted to-do tasks */}
                        <UncompletedTaskCardHolder
                            tasks={this.props.tasks}
                            completed_tasks={this.props.completed_tasks}
                            type={this.props.type}
                            chosen_date_data={this.state.chosen_date_data}
                            openModal={this.openModal}
                            current_chosen_category={this.props.current_chosen_category}
                        />
                        <View
                            style={{
                                marginVertical: 20,
                                marginLeft: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: "black",
                                    fontWeight: "800",
                                }}
                            >
                                Completed
                            </Text>
                        </View>
                        {/* Completed to-do tasks */}
                        <CompletedTaskCardHolder
                            tasks={this.props.tasks}
                            completed_tasks={this.props.completed_tasks}
                            type={this.props.type}
                            chosen_date_data={this.state.chosen_date_data}
                            openModal={this.openModal}
                            current_chosen_category={this.props.current_chosen_category}
                        />
                    </ScrollView>
                </View>

                {this.state.isModalOpened ?
                    <TaskDetailModal
                        // isOpened={this.state.isModalOpened}
                        closeModal={this.closeModal}
                        task_data={this.task_data}
                        categories={this.props.categories}
                        priorities={this.props.priorities}
                        action_type={this.props.action_type}
                        resetTaskData={this.resetTaskData}
                        type={this.props.type}
                    />

                    :

                    <></>
                }
            </View>
        )
    }
}

class UncompletedTaskCardHolder extends React.PureComponent {

    state = {
        should_flatlist_update: 0
    }

    _keyExtractor = (item, index) => `uncompleted-task-${item[0]}`

    _renderItem = ({ item, index }) => (
        <UncompletedTaskCard
            index={index}
            task_id={item[0]}
            task_data={item[1]}
            current_chosen_category={this.props.current_chosen_category}
            completed_task={Map(this.props.completed_tasks).get(item[1].id)}
            type={this.props.type}
            chosen_date_data={this.props.chosen_date_data}
            openModal={this.props.openModal}
        />
    )

    componentDidUpdate(prevProps, prevState) {
        if (this.props.completed_tasks !== prevProps.completed_tasks) {
            this.setState(prevState => ({
                should_flatlist_update: !prevState.should_flatlist_update + 1
            }))
        }
    }

    render() {
        return (
            <FlatList
                data={Map(this.props.tasks).toArray()}
                extraData={this.state.should_flatlist_update}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}

                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
            />
        )
    }
}

class UncompletedTaskCard extends React.PureComponent {

    update_obj = {
        should_render: false
    }

    compareDayTypeDaily = (repeat, schedule, day, month, year) => {
        let start_date_time = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)).getTime(),
            current_date_time = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)).getTime(),
            diff_day = Math.floor((current_date_time - start_date_time) / (86400 * 1000))

        if (diff_day > 0 && diff_day % repeat.interval.value === 0) {
            return true
        }

        return false
    }

    compareDayTypeWeekly = (repeat, schedule, day, month, year) => {
        let start_date_time = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)).getTime(),
            current_date_time = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)).getTime(),
            interval_value = repeat.interval.value,
            diff = (current_date_time - start_date_time) / (86400 * 1000)

        if (diff > 0 && diff % interval_value === 0) {
            return true
        }

        return false
    }

    compareDayTypeMonthly = (repeat, schedule, day, month, year) => {
        let start_date = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)),
            current_date = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)),
            interval_value = repeat.interval.value,
            diff_year = current_date.getFullYear() - start_date.getFullYear(),
            diff_month = (current_date.getMonth() + diff_year * 12) - start_date.getMonth()


        if (diff_month > 0 && diff_month % interval_value === 0) {
            if (current_date.getDate() === start_date.getDate()) {
                return true
            }
            else {
                if (current_date.getDate() === new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate()) {
                    return true
                }
            }
        }

        return false
    }

    compareWeekTypeWeekly = (repeat, schedule, day, month, year) => {
        let interval_value = repeat.interval.value,
            start_date = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)),
            current_date = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year))

        if (month >= schedule.month && year >= schedule.year && current_date.getTime() > start_date.getTime()) {
            if (Math.abs(this.getWeek(current_date) - schedule.week) % interval_value === 0) {
                return true
            }
        }

        return false
    }

    compareWeekTypeMonthly = (repeat, schedule, day, month, year) => {
        let interval_value = repeat.interval.value,
            current_date = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)),
            diff_year = year - schedule.year,
            diff_month = (month + diff_year * 12) - schedule.month,
            current_no_week_in_month = this.getNoWeekInMonth(current_date),
            last_no_week_in_month = this.getNoWeekInMonth(new Date(year, month + 1, 0))

        if (diff_month > 0 && diff_month % interval_value === 0) {
            if (current_no_week_in_month === schedule.noWeekInMonth) {
                return true
            }

            else if (current_no_week_in_month === last_no_week_in_month && schedule.noWeekInMonth === 5) {
                return true
            }
        }

        return false
    }

    compareMonthTypeMonthly = (repeat, schedule, month, year) => {
        let interval_value = repeat.interval.value,
            diff_year = year - schedule.year,
            diff_month = (month + diff_year * 12) - schedule.month

        if (diff_month > 0 && diff_month % interval_value === 0) {
            return true
        }

        return false
    }

    handleUpdate = (completed_task, task, type, current_chosen_category, chosen_date_data) => {
        let { schedule, repeat, title, goal, category } = task,
            current_goal_value = 0

        if (current_chosen_category === "general" || current_chosen_category === category) {
            if (type === "day") {
                let { day, month, year } = chosen_date_data,
                    chosen_day_timestamp = new Date(year, month, day).getTime(),
                    chosen_day_timestamp_to_string = chosen_day_timestamp.toString()

                if ((schedule.day === day && schedule.month === month && schedule.year === year)
                    || this.compareDayTypeDaily(repeat, schedule, day, month, year)
                    || this.compareDayTypeWeekly(repeat, schedule, day, month, year)
                    || this.compareDayTypeMonthly(repeat, schedule, day, month, year)
                ) {
                    current_goal_value = getIn(completed_task, [chosen_day_timestamp_to_string, "current"], 0)

                    if (current_goal_value < parseInt(goal.max)) {
                        this.update_obj = {
                            should_render: true,
                            current_goal_value,
                            action_type: "UPDATE_COMPLETED_DAY_TASK",
                            title,
                            goal,
                            task_data: task
                        }
                    }

                    else {
                        this.update_obj.should_render = false
                    }
                }

                else {
                    this.update_obj.should_render = false
                }
            }

            else if (type === "week") {
                let { day, month, week, year } = chosen_date_data,
                    chosen_week_date = new Date(year, month, day),
                    chosen_week_timestamp = new Date(year, month, this.getMonday(chosen_week_date).getDate()).getTime(),
                    chosen_week_timestamp_to_string = chosen_week_timestamp.toString()

                if ((schedule.week === week && schedule.year === year)
                    || this.compareWeekTypeWeekly(repeat, schedule, day, month, year)
                    || this.compareWeekTypeMonthly(repeat, schedule, day, month, year)
                ) {
                    current_goal_value = getIn(completed_task, [chosen_week_timestamp_to_string, "current"], 0)

                    if (current_goal_value < parseInt(goal.max)) {
                        this.update_obj = {
                            should_render: true,
                            current_goal_value,
                            action_type: "UPDATE_COMPLETED_WEEK_TASK",
                            title,
                            goal,
                            task_data: task
                        }
                    }

                    else {
                        this.update_obj.should_render = false
                    }
                }

                else {
                    this.update_obj.should_render = false
                }
            }

            else {
                let { month, year } = chosen_date_data,
                    chosen_month_timestamp = new Date(year, month).getTime(),
                    chosen_month_timestamp_to_string = chosen_month_timestamp.toString()

                if ((schedule.month === month && schedule.year === year)
                    || this.compareMonthTypeMonthly(repeat, schedule, month, year)
                ) {
                    current_goal_value = getIn(completed_task, [chosen_month_timestamp_to_string, "current"], 0)
                    if (current_goal_value < parseInt(goal.max)) {
                        this.update_obj = {
                            should_render: true,
                            current_goal_value,
                            action_type: "UPDATE_COMPLETED_MONTH_TASK",
                            title,
                            goal,
                            task_data: task
                        }
                    }

                    else {
                        this.update_obj.should_render = false
                    }
                }

                else {
                    this.update_obj.should_render = false
                }
            }
        }

        else {
            this.update_obj.should_render = false
        }
    }

    checkIfChosenDateIsToday = (chosen_date_data, type) => {
        let current = new Date(),
            is_chosen_date_today = false


        if (type === "day") {
            let { day, month, year } = chosen_date_data

            if (day === current.getDate() && month === current.getMonth() && year === current.getFullYear()) {
                is_chosen_date_today = true
            }

            else {
                is_chosen_date_today = false
            }
        }

        else if (type === "week") {
            let { week, year } = chosen_date_data

            if (week === this.getWeek(current) && year === current.getFullYear()) {
                is_chosen_date_today = true
            }

            else {
                is_chosen_date_today = false
            }
        }

        else {
            let { month, year } = chosen_date_data

            if (month === current.getMonth() && year === current.getFullYear()) {
                is_chosen_date_today = true
            }

            else {
                is_chosen_date_today = false
            }
        }

        return is_chosen_date_today
    }

    render() {
        let is_chosen_date_today = this.checkIfChosenDateIsToday(this.props.chosen_date_data, this.props.type)

        this.handleUpdate(
            this.props.completed_task,
            this.props.task_data,
            this.props.type,
            this.props.current_chosen_category,
            this.props.chosen_date_data
        )

        return (
            <>
                {this.update_obj.should_render ?
                    <TaskCard
                        action_type={this.update_obj.action_type}
                        type={this.props.type}
                        task_data={this.props.task_data}
                        index={this.props.index}
                        openModal={this.props.openModal}

                        is_chosen_date_today={is_chosen_date_today}
                        flag={"uncompleted"}

                        current_goal_value={this.update_obj.current_goal_value}
                        title={this.update_obj.title}
                        goal={this.update_obj.goal}
                    />

                    :

                    null
                }
            </>
        )
    }
}

class CompletedTaskCardHolder extends React.PureComponent {

    state = {
        should_flatlist_update: 0
    }

    _keyExtractor = (item, index) => `completed-task-${item[0]}`

    _renderItem = ({ item, index }) => (
        <CompletedTaskCard
            index={index}
            task_id={item[0]}
            completed_task={item[1]}
            current_chosen_category={this.props.current_chosen_category}
            task={Map(this.props.tasks).get(item[0])}
            type={this.props.type}
            chosen_date_data={this.props.chosen_date_data}
            openModal={this.props.openModal}
        />
    )

    componentDidUpdate(prevProps, prevState) {
        if (this.props.completed_tasks !== prevProps.completed_tasks) {
            this.setState(prevState => ({
                should_flatlist_update: !prevState.should_flatlist_update + 1
            }))
        }
    }

    render() {
        return (
            <FlatList
                data={Map(this.props.completed_tasks).toArray()}
                extraData={this.state.should_flatlist_update}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}

                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
            />
        )
    }
}

class CompletedTaskCard extends React.PureComponent {

    update_obj = {
        should_render: false
    }

    handleUpdate = (task, completed_task, type, current_chosen_category, chosen_date_data) => {
        if (task.id && task.id === completed_task.get("id")) {
            let { title, goal, category } = task,
                current_goal_value = 0

            if (current_chosen_category === "general" || current_chosen_category === category) {
                if (type === "day") {
                    let { day, month, year } = chosen_date_data,
                        chosen_day_timestamp = new Date(year, month, day).getTime(),
                        chosen_day_timestamp_to_string = chosen_day_timestamp.toString()

                    if (hasIn(completed_task, [chosen_day_timestamp_to_string, "current"]) &&
                        parseInt(getIn(completed_task, [chosen_day_timestamp_to_string, "current"], 0)) >= parseInt(goal.max)) {
                        current_goal_value = getIn(completed_task, [chosen_day_timestamp_to_string, "current"], 0)

                        this.update_obj = {
                            action_type: "UPDATE_COMPLETED_DAY_TASK",
                            current_goal_value,
                            should_render: true,
                            title,
                            goal,
                            task_data: task
                        }
                    }

                    else{
                        this.update_obj.should_render = false
                    }
                }

                else if (type === "week") {
                    let { day, month, year } = chosen_date_data,
                        chosen_week_date = new Date(year, month, day),
                        chosen_week_timestamp = new Date(year, month, this.getMonday(chosen_week_date).getDate()).getTime(),
                        chosen_week_timestamp_to_string = chosen_week_timestamp.toString()

                    if (hasIn(completed_task, [chosen_week_timestamp_to_string, "current"]) &&
                        parseInt(getIn(completed_task, [chosen_week_timestamp_to_string, "current"], 0)) >= parseInt(goal.max)) {
                        current_goal_value = getIn(completed_task, [chosen_week_timestamp_to_string, "current"], 0)

                        this.update_obj = {
                            action_type: "UPDATE_COMPLETED_WEEK_TASK",
                            current_goal_value,
                            should_render: true,
                            title,
                            goal,
                            task_data: task
                        }
                    }

                    else{
                        this.update_obj.should_render = false
                    }
                }

                else {
                    let { month, year } = chosen_date_data,
                        chosen_month_timestamp = new Date(year, month).getTime(),
                        chosen_month_timestamp_to_string = chosen_month_timestamp.toString()

                    if (hasIn(completed_task, [chosen_month_timestamp_to_string, "current"]) &&
                        parseInt(getIn(completed_task, [chosen_month_timestamp_to_string, "current"], 0)) >= parseInt(goal.max)) {
                        current_goal_value = getIn(completed_task, [chosen_month_timestamp_to_string, "current"], 0)

                        this.update_obj = {
                            action_type: "UPDATE_COMPLETED_MONTH_TASK",
                            current_goal_value,
                            should_render: true,
                            title,
                            goal,
                            task_data: task
                        }
                    }

                    else{
                        this.update_obj.should_render = false
                    }
                }
            }

            else {
                this.update_obj.should_render = false
            }
        }

        else {
            this.update_obj.should_render = false
        }
    }

    checkIfChosenDateIsToday = (chosen_date_data, type) => {
        let current = new Date(),
            is_chosen_date_today = false


        if (type === "day") {
            let { day, month, year } = chosen_date_data

            if (day === current.getDate() && month === current.getMonth() && year === current.getFullYear()) {
                is_chosen_date_today = true
            }

            else {
                is_chosen_date_today = false
            }
        }

        else if (type === "week") {
            let { week, year } = chosen_date_data

            if (week === this.getWeek(current) && year === current.getFullYear()) {
                is_chosen_date_today = true
            }

            else {
                is_chosen_date_today = false
            }
        }

        else {
            let { month, year } = chosen_date_data

            if (month === current.getMonth() && year === current.getFullYear()) {
                is_chosen_date_today = true
            }

            else {
                is_chosen_date_today = false
            }
        }

        return is_chosen_date_today
    }

    render() {
        this.handleUpdate(this.props.task, this.props.completed_task, this.props.type, this.props.current_chosen_category, this.props.chosen_date_data)

        let is_chosen_date_today = this.checkIfChosenDateIsToday(this.props.chosen_date_data, this.props.type)

        return (
            <>
                {this.update_obj.should_render ?
                    <TaskCard
                        action_type={this.update_obj.action_type}
                        type={this.props.type}
                        task_data={this.update_obj.task_data}
                        index={this.props.index}
                        openModal={this.props.openModal}

                        is_chosen_date_today={is_chosen_date_today}
                        flag={"completed"}

                        current_goal_value={this.update_obj.current_goal_value}
                        title={this.update_obj.title}
                        goal={this.update_obj.goal}
                    />

                    :

                    null
                }
            </>
        )
    }
}
