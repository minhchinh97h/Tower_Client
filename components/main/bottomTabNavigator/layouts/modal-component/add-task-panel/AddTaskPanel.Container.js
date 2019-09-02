import { connect } from 'react-redux'
import {
    updateTitle,
    updateDescription,
    updateType
} from '../../../../../shared/actions/otherAction'
import { updateTask } from '../../../../../shared/actions/taskAction'
import { updateCategory } from '../../../../../shared/actions/categoryAction'
import AddTaskPanel from './AddTaskPanel'


const mapStateToProps = (state) => ({
    currentDayTask: state.currentDayTask,
    currentWeekTask: state.currentWeekTask,
    currentMonthTask: state.currentMonthTask,
    categories: state.categories,
    priorities: state.priorities,
    day_tasks: state.day_tasks,
    week_tasks: state.week_tasks,
    month_tasks: state.month_tasks,

    addTaskDescription: state.addTaskDescription,
    addTaskTitle: state.addTaskTitle
})


const mapDispatchToProps = (dispatch, ownProps) => ({
    updateTitle: (type, data) => {
        dispatch(updateTitle(type, data))
    },

    updateDescription: (type, data) => {
        dispatch(updateDescription(type, data))
    },

    updateType: (type, data) => {
        dispatch(updateType(type, data))
    },

    addTask: (type, data) => {
        dispatch(updateTask(type, data))
    },

    updateTask: (type, data) => {
        dispatch(updateTask(type, data))
    },

    updateCategory: (id, data) => {
        dispatch(updateCategory(id, data))
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddTaskPanel)