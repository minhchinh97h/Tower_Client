import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, Dimensions, Image, TextInput, Modal as RNModal } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import DayCalendar from '../calendar/day-calendar/DayCalendar.Container'
import WeekCalendar from '../calendar/week-calendar/WeekCalendar.Container'
import MonthCalendar from '../calendar/month-calendar/MonthCalendar.Container'
import Category from '../category/Category.Container'
import Priority from '../priority/Priority.Container'
import Repeat from '../repeat/Repeat.Container'
import Goal from '../goal/Goal.Container'

export default class TaskDetailModal extends Component {

    daysInWeekText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    monthNames = ["January", "Febuary", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    month_names_in_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    edit_task = this.props.task_data

    yes_delete_clicked = false

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

    toggleEdit = (visible) => {
        this.setState(() => ({ isEditing: visible }));
    }

    handleTaskUpdate = () => {
        let edit_task = this.edit_task,
            date = new Date(edit_task.startTime),
            category = edit_task.category ? this.props.categories[edit_task.category].name : "",
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

    componentDidMount() {
        this.handleTaskUpdate()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.task_data !== prevProps.task_data) {
            this.edit_task = this.props.task_data

            this.handleTaskUpdate()
        }

        if (this.state.toggle_delete !== prevProps.toggleDelete && this.yes_delete_clicked) {
            this.props.closeModal()
        }
    }


    dismissModal = () => {
        this.props.closeModal()
    }

    toggleDelete = () => {
        this.setState(prevState => ({
            toggle_delete: !prevState.toggle_delete
        }))
    }

    delete = () => {
        if (this.props.type === "day") {
            this.props.deleteCompletedTask("DELETE_COMPLETED_DAY_TASK", this.edit_task.id)
            this.props.deleteTask("DELETE_DAY_TASK", this.edit_task.id)
        }

        else if (this.props.type === "week") {
            this.props.deleteCompletedTask("DELETE_COMPLETED_WEEK_TASK", this.edit_task.id)
            this.props.deleteTask("DELETE_WEEK_TASK", this.edit_task.id)
        }

        else {
            this.props.deleteCompletedTask("DELETE_COMPLETED_MONTH_TASK", this.edit_task.id)
            this.props.deleteTask("DELETE_MONTH_TASK", this.edit_task.id)
        }

        this.props.resetTaskData()
        this.toggleDelete()
        this.yes_delete_clicked = true
    }


    render() {
        return (
            <RNModal
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
                            width: Dimensions.get("window").width,
                            backgroundColor: "black",
                            opacity: 0.5,
                        }}

                        onPress={this.dismissModal}
                    >

                    </TouchableOpacity>

                    <View
                        style={{
                            position: "absolute",
                            top: 50,
                            borderRadius: 10,
                            width: Dimensions.get("window").width,
                            backgroundColor: "white",
                            bottom: 0,
                        }}
                    >

                        {!this.state.isEditing ?
                            <>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                >
                                    <View style={{ alignSelf: 'stretch', flex: 1, justifyContent: 'flex-end' }}>
                                        <View style={{ alignSelf: 'stretch', flex: 1, zIndex: 10 }}>
                                            <View>
                                                <Text style={{ textAlign: 'center' }}><FontAwesome name="minus" style={{ fontSize: 26, color: "grey" }} /></Text>
                                            </View>
                                            <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start' }}>
                                                <TouchableOpacity onPress={this.toggleDelete}>
                                                    <FontAwesome name={'trash'} style={{ width: 50, height: 50, fontSize: 24, lineHeight: 50 }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.toggleEdit(true)}>
                                                    <FontAwesome name={'edit'} style={{ width: 50, height: 50, fontSize: 24, lineHeight: 50 }} />
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <CheckBox
                                                            center
                                                            checkedIcon='dot-circle-o'
                                                            uncheckedIcon='circle-o'
                                                            checked={this.props.checked}
                                                        />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>{this.edit_task.title}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    this.edit_task.description && this.edit_task.description.length > 0 ?
                                                        <View style={styles.container}>
                                                            <View style={styles.head}>
                                                                <CheckBox
                                                                    center
                                                                    checkedIcon='dot-circle-o'
                                                                    uncheckedIcon='circle-o'
                                                                    checked={this.props.checked}
                                                                />
                                                            </View>
                                                            <View style={styles.body}>
                                                                <Text style={styles.text}>{this.edit_task.description}</Text>
                                                            </View>
                                                        </View>

                                                        :

                                                        <></>
                                                }
                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <FontAwesome name={'calendar'} style={styles.icon} />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>{this.state.calendar_text}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <FontAwesome name={'circle'} style={styles.icon} />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>{this.state.category}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <FontAwesome name={'warning'} style={styles.icon} />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>{this.state.priority}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <FontAwesome name={'warning'} style={styles.icon} />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>{this.state.repeat}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <FontAwesome name={'warning'} style={styles.icon} />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>{this.state.goal}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.container}>
                                                    <View style={styles.head}>
                                                        <FontAwesome name={'link'} style={styles.icon} />
                                                    </View>
                                                    <View style={styles.body}>
                                                        <Text style={styles.text}>Link enabled</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {this.state.toggle_delete ?
                                    <RNModal
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
                                                    backgroundColor: "black",
                                                    width: Dimensions.get("window").width,
                                                    opacity: 0.5,
                                                }}

                                                onPress={this.toggleDelete}
                                            >
                                            </TouchableOpacity>

                                            <View
                                                style={{
                                                    borderRadius: 11,
                                                    height: 200,
                                                    width: 300,
                                                    backgroundColor: "white",
                                                    position: "absolute",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 10,
                                                }}
                                            >
                                                <Text>
                                                    Are you certain to delete this task?
                                        </Text>

                                                <View
                                                    style={{
                                                        marginTop: 20,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            width: 70,
                                                            height: 30,
                                                            borderRadius: 10,
                                                            backgroundColor: "gainsboro",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            marginHorizontal: 20,
                                                        }}

                                                        onPress={this.toggleDelete}
                                                    >
                                                        <Text>
                                                            No
                                                </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={{
                                                            width: 70,
                                                            height: 30,
                                                            borderRadius: 10,
                                                            backgroundColor: "black",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            marginHorizontal: 20,
                                                        }}

                                                        onPress={this.delete}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "white"
                                                            }}
                                                        >
                                                            Yes
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>

                                    </RNModal>

                                    :

                                    null
                                }
                            </>
                            :

                            <EditDetails
                                task_data={this.edit_task}
                                categories={this.props.categories}
                                priorities={this.props.priorities}
                                hideAction={this.toggleEdit}
                                updateEdittingTask={this.props.updateEdittingTask}
                                updateCategory={this.props.updateCategory}
                                type={this.props.type}
                            />
                        }

                    </View>

                </View>
            </RNModal>
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
    repeat = ""
    goal = ""

    category_key = ""

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

    save = () => {
        let new_category_key = this.edit_task.category

        this.props.updateEdittingTask(this.edit_task)

        //Decrease old category's quantity
        let old_category_data = { ...this.props.categories[this.category_key] }
        old_category_data.quantity -= 1

        //Increase new category's quantity
        let new_category_data = { ...this.props.categories[new_category_key] }
        new_category_data.quantity += 1

        this.props.updateCategory(this.category_key, old_category_data)
        this.props.updateCategory(new_category_key, new_category_data)

        this.cancel()
    }

    cancel = () => {
        this.props.hideAction()
    }

    renderData = (edit_task) => {
        let { category, repeat, priority, goal, startTime, schedule } = edit_task

        let date = new Date(startTime)

        this.category = this.props.categories[category].name
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

                <RNModal
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
                </RNModal>
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 50,
        borderWidth: 1,
        borderColor: 'grey',
        borderLeftWidth: 3,
        marginBottom: 4
    },
    containerEdit: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-around'
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
        lineHeight: 50
    },
    head: {
        width: 50,
        height: 50
    },
    body: {
        lineHeight: 50
    },
    text: {
        lineHeight: 45
    }
});


