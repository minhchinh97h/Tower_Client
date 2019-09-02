import { connect } from 'react-redux'
import Repeat from './Repeat'
import { updateTask } from '../actions/taskAction'

let action_type = ""

const mapStateToProps = (state, ownProps) => {

    if (!ownProps.edit) {
        if (ownProps.currentAnnotation === "day") {
            action_type = "UPDATE_NEW_DAY_TASK"
            return ({
                task_data: state.currentDayTask
            })
        }

        else if (ownProps.currentAnnotation === "week") {
            action_type = "UPDATE_NEW_WEEK_TASK"
            return ({
                task_data: state.currentWeekTask
            })
        }

        else {
            action_type = "UPDATE_NEW_MONTH_TASK"
            return ({
                task_data: state.currentMonthTask
            })
        }
    }

    return {}
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
)(Repeat)