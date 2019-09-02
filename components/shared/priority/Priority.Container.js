import { connect } from 'react-redux'
import Priority from './Priority'
import { updateTask } from '../actions/taskAction'

let action_type = ""

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.edit) {
        if (ownProps.currentAnnotation === "day") {
            action_type = "UPDATE_NEW_DAY_TASK"
            return ({
                priorities: state.priorities,
                task_data: state.currentDayTask
            })
        }

        else if (ownProps.currentAnnotation === "week") {
            action_type = "UPDATE_NEW_WEEK_TASK"
            return ({
                priorities: state.priorities,
                task_data: state.currentWeekTask
            })
        }

        else {
            action_type = "UPDATE_NEW_MONTH_TASK"
            return ({
                priorities: state.priorities,
                task_data: state.currentMonthTask
            })
        }
    }

    return({
        priorities: state.priorities,
    })
}

const mapDispatchToProps = (dispatch, ownProps) => {
    if (!ownProps.edit) {
        return ({
            updateTask: (data) => dispatch(updateTask(action_type, data))
        })
    }

    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Priority)