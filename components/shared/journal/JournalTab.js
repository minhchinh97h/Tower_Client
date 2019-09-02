import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Modal,
    Button,
    FlatList,
    Animated
} from 'react-native';

import TaskCard from '../layouts/TaskCard.Container'
import TaskDetailModal from '../layouts/TaskDetailModal.Container'

import DayFlatlist from './day-flatlist/DayFlatlist.Container'
import WeekFlatlist from './week-flatlist/WeekFlatlist.Container'
import MonthFlatlist from './month-flatlist/MonthFlatlist.Container'

import Swipeable from 'react-native-gesture-handler/Swipeable'

import { Map } from 'immutable'

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
                        <TaskCardHolder
                            tasks={this.props.tasks}
                            completed_tasks={this.props.completed_tasks}
                            type={this.props.type}
                            chosen_date_data={this.state.chosen_date_data}
                            openModal={this.openModal}
                            flag="uncompleted"
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
                        <TaskCardHolder
                            tasks={this.props.tasks}
                            completed_tasks={this.props.completed_tasks}
                            type={this.props.type}
                            chosen_date_data={this.state.chosen_date_data}
                            openModal={this.openModal}
                            flag="completed"
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

class TaskCardHolder extends React.PureComponent {

    state = {
        task_card_array: [],

        is_chosen_date_today: true
    }

    openModal = (task) => {
        this.props.openModal(task)
    }

    renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            // inputRange: [0, 50, 100, 101],
            // outputRange: [-20, 0, 0, 1],
            inputRange: [0, 150],
            outputRange: [-100, 1],
            extrapolate: 'clamp',
        });

        return <LeftPanelSwipe trans={trans} />
    }

    _onSwipeableLeftOpen = () => {

    }

    _renderRightActions = (progressAnimatedValue, dragAnimatedValue) => {

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

    handleUncompletedTaskUpdate = (task, index) => {
        let { schedule, repeat, title, goal, id, category } = task,
            completed_tasks = Map(this.props.completed_tasks).toJS()

        if (this.props.current_chosen_category === "general" || this.props.current_chosen_category === category) {
            if (this.props.type === "day") {
                let { day, month, year } = this.props.chosen_date_data,
                    chosen_day_timestamp = new Date(year, month, day).getTime()

                if (!completed_tasks.hasOwnProperty(id) ||
                    (completed_tasks.hasOwnProperty(id) && !completed_tasks[id].hasOwnProperty(chosen_day_timestamp)) ||
                    (completed_tasks.hasOwnProperty(id) && completed_tasks[id].hasOwnProperty(chosen_day_timestamp) && parseInt(completed_tasks[id][chosen_day_timestamp].current) < parseInt(goal.max))
                ) {
                    let current_goal_value = 0

                    if (completed_tasks.hasOwnProperty(id) && completed_tasks[id].hasOwnProperty(chosen_day_timestamp)) {
                        current_goal_value = completed_tasks[id][chosen_day_timestamp].current
                    }

                    if (schedule.day === day && schedule.month === month && schedule.year === year) {
                        return (
                            <Swipeable
                                key={`day-task-${index}`}
                                renderLeftActions={this.renderLeftActions}
                                overshootLeft={true}
                                leftThreshold={80}
                                rightThreshold={60}
                                onSwipeableLeftOpen={this._onSwipeableLeftOpen}
                            >
                                <TaskCard
                                    action_type="UPDATE_COMPLETED_DAY_TASK"
                                    type={this.props.type}
                                    task_data={task}
                                    index={index}
                                    onPress={this.openModal}
                                    current_goal_value={current_goal_value}
                                    title={title}
                                    goal={goal}
                                    is_chosen_date_today={this.state.is_chosen_date_today}
                                    flag={this.props.flag}
                                />
                            </Swipeable>
                        )
                    }

                    else if (repeat.type === "daily") {
                        let start_date_time = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)).getTime(),
                            current_date_time = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)).getTime(),
                            diff_day = Math.floor((current_date_time - start_date_time) / (86400 * 1000))

                        if (diff_day > 0 && diff_day % repeat.interval.value === 0) {
                            return (
                                <Swipeable
                                    key={`day-task-${index}`}
                                    renderLeftActions={this.renderLeftActions}
                                >
                                    <TaskCard
                                        action_type="UPDATE_COMPLETED_DAY_TASK"
                                        type={this.props.type}
                                        task_data={task}
                                        index={index}
                                        onPress={this.openModal}
                                        current_goal_value={current_goal_value}
                                        title={title}
                                        goal={goal}
                                        is_chosen_date_today={this.state.is_chosen_date_today}
                                        flag={this.props.flag}
                                    />
                                </Swipeable>
                            )
                        }
                    }

                    else if (repeat.type === "weekly") {
                        let start_date_time = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)).getTime(),
                            current_date_time = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)).getTime(),
                            interval_value = repeat.interval.value,
                            diff = (current_date_time - start_date_time) / (86400 * 1000 * 7)

                        if (diff > 0 && diff % interval_value === 0) {
                            return (
                                <Swipeable
                                    key={`day-task-${index}`}
                                    renderLeftActions={this.renderLeftActions}
                                >
                                    <TaskCard
                                        action_type="UPDATE_COMPLETED_DAY_TASK"
                                        type={this.props.type}
                                        task_data={task}
                                        index={index}
                                        onPress={this.openModal}
                                        current_goal_value={current_goal_value}
                                        title={title}
                                        goal={goal}
                                        is_chosen_date_today={this.state.is_chosen_date_today}
                                        flag={this.props.flag}
                                    />
                                </Swipeable>
                            )
                        }
                    }

                    else if (repeat.type === "monthly") {
                        let start_date = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)),
                            current_date = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)),
                            interval_value = repeat.interval.value,
                            diff_year = current_date.getFullYear() - start_date.getFullYear(),
                            diff_month = (current_date.getMonth() + diff_year * 12) - start_date.getMonth()


                        if (diff_month > 0 && diff_month % interval_value === 0) {
                            if (current_date.getDate() === start_date.getDate()) {
                                return (
                                    <Swipeable
                                        key={`day-task-${index}`}
                                        renderLeftActions={this.renderLeftActions}
                                    >
                                        <TaskCard
                                            action_type="UPDATE_COMPLETED_DAY_TASK"
                                            type={this.props.type}
                                            task_data={task}
                                            index={index}
                                            onPress={this.openModal}
                                            current_goal_value={current_goal_value}
                                            title={title}
                                            goal={goal}
                                            is_chosen_date_today={this.state.is_chosen_date_today}
                                            flag={this.props.flag}
                                        />
                                    </Swipeable>
                                )
                            }
                            else {
                                if (current_date.getDate() === new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate()) {
                                    return (
                                        <Swipeable
                                            key={`day-task-${index}`}
                                            renderLeftActions={this.renderLeftActions}
                                        >
                                            <TaskCard
                                                action_type="UPDATE_COMPLETED_DAY_TASK"
                                                type={this.props.type}
                                                task_data={task}
                                                index={index}
                                                onPress={this.openModal}
                                                current_goal_value={current_goal_value}
                                                title={title}
                                                goal={goal}
                                                is_chosen_date_today={this.state.is_chosen_date_today}
                                                flag={this.props.flag}
                                            />
                                        </Swipeable>
                                    )
                                }
                            }
                        }
                    }
                }
            }


            else if (this.props.type === "week") {
                let { day, month, week, year } = this.props.chosen_date_data,
                    chosen_week_date = new Date(year, month, day),
                    chosen_week_timestamp = new Date(year, month, this.getMonday(chosen_week_date).getDate()).getTime()

                if (!completed_tasks.hasOwnProperty(id) ||
                    (completed_tasks.hasOwnProperty(id) && !completed_tasks[id].hasOwnProperty(chosen_week_timestamp)) ||
                    (completed_tasks.hasOwnProperty(id) && completed_tasks[id].hasOwnProperty(chosen_week_timestamp) && parseInt(completed_tasks[id][chosen_week_timestamp].current) < parseInt(goal.max))
                ) {
                    let current_goal_value = 0

                    if (completed_tasks.hasOwnProperty(id) && completed_tasks[id].hasOwnProperty(chosen_week_timestamp)) {
                        current_goal_value = completed_tasks[id][chosen_week_timestamp].current
                    }

                    if (schedule.week === week && schedule.year === year) {
                        return (
                            <Swipeable
                                key={`week-task-${index}`}
                                renderLeftActions={this.renderLeftActions}
                            >
                                <TaskCard
                                    action_type="UPDATE_COMPLETED_WEEK_TASK"
                                    type={this.props.type} task_data={task}
                                    index={index}
                                    onPress={this.openModal}
                                    current_goal_value={current_goal_value}
                                    title={title}
                                    goal={goal}
                                    is_chosen_date_today={this.state.is_chosen_date_today}
                                    flag={this.props.flag}
                                />
                            </Swipeable>
                        )
                    }

                    else if (repeat.type === "weekly-w") {
                        let interval_value = repeat.interval.value,
                            start_date = new Date(new Date(new Date(new Date().setDate(schedule.day)).setMonth(schedule.month)).setFullYear(schedule.year)),
                            current_date = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year))

                        if (month >= schedule.month && year >= schedule.year && current_date.getTime() > start_date.getTime()) {
                            if (Math.abs(this.getWeek(current_date) - schedule.week) % interval_value === 0) {
                                return (
                                    <Swipeable
                                        key={`week-task-${index}`}
                                        renderLeftActions={this.renderLeftActions}
                                    >
                                        <TaskCard
                                            action_type="UPDATE_COMPLETED_WEEK_TASK"
                                            type={this.props.type}
                                            task_data={task}
                                            index={index}
                                            onPress={this.openModal}
                                            current_goal_value={current_goal_value}
                                            title={title}
                                            goal={goal}
                                            is_chosen_date_today={this.state.is_chosen_date_today}
                                            flag={this.props.flag}
                                        />
                                    </Swipeable>
                                )
                            }
                        }

                    }

                    else if (repeat.type === "monthly-w") {
                        let interval_value = repeat.interval.value,
                            current_date = new Date(new Date(new Date(new Date().setDate(day)).setMonth(month)).setFullYear(year)),
                            diff_year = year - schedule.year,
                            diff_month = (month + diff_year * 12) - schedule.month,
                            current_no_week_in_month = this.getNoWeekInMonth(current_date),
                            last_no_week_in_month = this.getNoWeekInMonth(new Date(year, month + 1, 0))

                        if (diff_month > 0 && diff_month % interval_value === 0) {
                            if (current_no_week_in_month === schedule.noWeekInMonth) {
                                return (
                                    <Swipeable
                                        key={`week-task-${index}`}
                                        renderLeftActions={this.renderLeftActions}
                                    >
                                        <TaskCard
                                            action_type="UPDATE_COMPLETED_WEEK_TASK"
                                            type={this.props.type}
                                            task_data={task}
                                            index={index}
                                            onPress={this.openModal}
                                            current_goal_value={current_goal_value}
                                            title={title}
                                            goal={goal}
                                            is_chosen_date_today={this.state.is_chosen_date_today}
                                            flag={this.props.flag}
                                        />
                                    </Swipeable>
                                )
                            }

                            else if (current_no_week_in_month === last_no_week_in_month && schedule.noWeekInMonth === 5) {
                                return (
                                    <Swipeable
                                        key={`week-task-${index}`}
                                        renderLeftActions={this.renderLeftActions}
                                    >
                                        <TaskCard
                                            action_type="UPDATE_COMPLETED_WEEK_TASK"
                                            type={this.props.type}
                                            task_data={task}
                                            index={index}
                                            onPress={this.openModal}
                                            current_goal_value={current_goal_value}
                                            title={title}
                                            goal={goal}
                                            is_chosen_date_today={this.state.is_chosen_date_today}
                                            flag={this.props.flag}
                                        />
                                    </Swipeable>
                                )
                            }
                        }
                    }
                }
            }

            else {
                let { month, year } = this.props.chosen_date_data,
                    chosen_month_timestamp = new Date(year, month).getTime()
                if (!completed_tasks.hasOwnProperty(id) ||
                    (completed_tasks.hasOwnProperty(id) && !completed_tasks[id].hasOwnProperty(chosen_month_timestamp)) ||
                    (completed_tasks.hasOwnProperty(id) && completed_tasks[id].hasOwnProperty(chosen_month_timestamp) && parseInt(completed_tasks[id][chosen_month_timestamp].current) < parseInt(goal.max))
                ) {
                    let current_goal_value = 0

                    if (completed_tasks.hasOwnProperty(id) && completed_tasks[id].hasOwnProperty(chosen_month_timestamp)) {
                        current_goal_value = completed_tasks[id][chosen_month_timestamp].current
                    }

                    if (schedule.month === month && schedule.year === year) {
                        return (
                            <Swipeable
                                key={`month-task-${index}`}
                                renderLeftActions={this.renderLeftActions}
                            >
                                <TaskCard
                                    action_type="UPDATE_COMPLETED_MONTH_TASK"
                                    type={this.props.type}
                                    task_data={task}
                                    index={index}
                                    onPress={this.openModal}
                                    current_goal_value={current_goal_value}
                                    title={title}
                                    goal={goal}
                                    is_chosen_date_today={this.state.is_chosen_date_today}
                                    flag={this.props.flag}
                                />
                            </Swipeable>
                        )
                    }

                    else if (repeat.type === "monthly-m") {
                        let interval_value = repeat.interval.value,
                            diff_year = year - schedule.year,
                            diff_month = (month + diff_year * 12) - schedule.month

                        if (diff_month > 0 && diff_month % interval_value === 0) {
                            return (
                                <Swipeable
                                    key={`month-task-${index}`}
                                    renderLeftActions={this.renderLeftActions}
                                >
                                    <TaskCard
                                        action_type="UPDATE_COMPLETED_MONTH_TASK"
                                        type={this.props.type}
                                        task_data={task}
                                        index={index}
                                        onPress={this.openModal}
                                        current_goal_value={current_goal_value}
                                        title={title}
                                        goal={goal}
                                        is_chosen_date_today={this.state.is_chosen_date_today}
                                        flag={this.props.flag}
                                    />
                                </Swipeable>
                            )
                        }
                    }
                }
            }
        }

        return null
    }

    handleCompletedTaskUpdate = (completed_task, index) => {
        if (Map(this.props.tasks).has(completed_task.id)) {
            let task = Map(this.props.tasks).get(completed_task.id),
                { title, goal, category } = task

            if (this.props.current_chosen_category === "general" || this.props.current_chosen_category === category) {
                if (this.props.type === "day") {
                    let { day, month, year } = this.props.chosen_date_data,
                        chosen_day_timestamp = new Date(year, month, day).getTime()

                    if (completed_task.hasOwnProperty(chosen_day_timestamp) &&
                        parseInt(completed_task[chosen_day_timestamp].current) >= parseInt(goal.max)
                    ) {
                        let current_goal_value = completed_task[chosen_day_timestamp].current
                        return (
                            <Swipeable
                                key={`day-task-${index}`}
                                renderLeftActions={this.renderLeftActions}
                                renderRightActions={this._renderRightActions}
                            >
                                <TaskCard
                                    action_type="UPDATE_COMPLETED_DAY_TASK"
                                    type={this.props.type}
                                    task_data={task}
                                    index={index}
                                    onPress={this.openModal}
                                    current_goal_value={current_goal_value}
                                    title={title}
                                    goal={goal}
                                    is_chosen_date_today={this.state.is_chosen_date_today}
                                    flag={this.props.flag}
                                />
                            </Swipeable>
                        )
                    }
                }

                else if (this.props.type === "week") {
                    let { day, month, week, year } = this.props.chosen_date_data,
                        chosen_week_date = new Date(year, month, day),
                        chosen_week_timestamp = new Date(year, month, this.getMonday(chosen_week_date).getDate()).getTime()

                    if (completed_task.hasOwnProperty(chosen_week_timestamp) &&
                        parseInt(completed_task[chosen_week_timestamp].current) >= parseInt(goal.max)
                    ) {
                        let current_goal_value = completed_task[chosen_week_timestamp].current
                        return (
                            <Swipeable
                                key={`week-task-${index}`}
                                renderLeftActions={this.renderLeftActions}
                            >
                                <TaskCard
                                    action_type="UPDATE_COMPLETED_WEEK_TASK"
                                    type={this.props.type} task_data={task}
                                    index={index}
                                    onPress={this.openModal}
                                    current_goal_value={current_goal_value}
                                    title={title}
                                    goal={goal}
                                    is_chosen_date_today={this.state.is_chosen_date_today}
                                    flag={this.props.flag}
                                />
                            </Swipeable>
                        )
                    }
                }

                else {
                    let { month, year } = this.props.chosen_date_data,
                        chosen_month_timestamp = new Date(year, month).getTime()

                    if (completed_task.hasOwnProperty(chosen_month_timestamp) &&
                        parseInt(completed_task[chosen_month_timestamp].current) >= parseInt(goal.max)
                    ) {
                        let current_goal_value = completed_task[chosen_month_timestamp].current
                        return (
                            <Swipeable
                                key={`month-task-${index}`}
                                renderLeftActions={this.renderLeftActions}
                            >
                                <TaskCard
                                    action_type="UPDATE_COMPLETED_MONTH_TASK"
                                    type={this.props.type}
                                    task_data={task}
                                    index={index}
                                    onPress={this.openModal}
                                    title={title}
                                    current_goal_value={current_goal_value}
                                    goal={goal}
                                    is_chosen_date_today={this.state.is_chosen_date_today}
                                    flag={this.props.flag}
                                />
                            </Swipeable>
                        )
                    }
                }
            }
        }

        return null
    }

    checkIfChosenDateIsToday = (chosen_date_data, type) => {
        let current = new Date()

        if (type === "day") {
            let { day, month, year } = chosen_date_data

            if (day === current.getDate() && month === current.getMonth() && year === current.getFullYear()) {
                this.setState({
                    is_chosen_date_today: true
                })
            }

            else {
                this.setState({
                    is_chosen_date_today: false
                })
            }
        }

        else if (type === "week") {
            let { week, year } = chosen_date_data

            if (week === this.getWeek(current) && year === current.getFullYear()) {
                this.setState({
                    is_chosen_date_today: true
                })
            }

            else {
                this.setState({
                    is_chosen_date_today: false
                })
            }
        }

        else {
            let { month, year } = chosen_date_data

            if (month === current.getMonth() && year === current.getFullYear()) {
                this.setState({
                    is_chosen_date_today: true
                })
            }

            else {
                this.setState({
                    is_chosen_date_today: false
                })
            }
        }
    }

    componentDidMount() {
        if (this.props.flag === "uncompleted") {
            this.setState({
                task_card_array: Map(this.props.tasks).valueSeq().map((task, index) => this.handleUncompletedTaskUpdate(task, index))
            })
        }

        else {
            this.setState({
                task_card_array: Map(this.props.completed_tasks).valueSeq().map((completed_task, index) => this.handleCompletedTaskUpdate(completed_task, index))
            })
        }

        this.checkIfChosenDateIsToday(this.props.chosen_date_data, this.props.type)
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props.flag === "uncompleted") && (this.props.tasks !== prevProps.tasks)) {
            this.setState({
                task_card_array: Map(this.props.tasks).valueSeq().map((task, index) => this.handleUncompletedTaskUpdate(task, index))
            })
        }
        else if ((this.props.flag === "completed") && (this.props.completed_tasks !== prevProps.completed_tasks)) {
            this.setState({
                task_card_array: Map(this.props.completed_tasks).valueSeq().map((completed_task, index) => this.handleCompletedTaskUpdate(completed_task, index))
            })
        }

        if (this.props.chosen_date_data !== prevProps.chosen_date_data) {
            this.checkIfChosenDateIsToday(this.props.chosen_date_data, this.props.type)
        }
    }

    render() {
        return (
            <>
                {this.state.task_card_array}
            </>
        )
    }
}

class LeftPanelSwipe extends React.PureComponent {

    render() {
        return (
            <Animated.View
                style={{
                    transform: [{ translateX: this.props.trans }],
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text>
                    Complete
                </Text>
            </Animated.View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    banner: {
        textAlign: 'left',
        paddingLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10
    },

    scrollViewTasks: {
        alignSelf: "stretch",
        height: 50
    },

    actionText: {
        height: 50
    },
})