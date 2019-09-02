import { connect } from 'react-redux'
import { updateTask } from '../actions/taskAction'
import TaskCard from './TaskCard'

const mapStateToProps = (state, ownProps) => {
    if (ownProps.type === "day") {
        return (
            {
                completed_tasks: state.completed_day_tasks
            }
        )
    }

    else if (ownProps.type === "week") {
        return (
            {
                completed_tasks: state.completed_week_tasks
            }
        )
    }


    return (
        {
            completed_tasks: state.completed_month_tasks
        }
    )
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateCompletedTask: (data) => dispatch(updateTask(ownProps.action_type, data)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskCard)