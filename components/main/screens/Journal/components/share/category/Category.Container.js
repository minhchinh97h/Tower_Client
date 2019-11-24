import { connect } from 'react-redux'
import { updateTaskCategory } from './actions/updateTaskCategory'
import Category from './Category'

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.edit) {
        if (ownProps.currentAnnotation === "day") {
            return ({
                task_data: state["currentDayTask"],
                categories: state["categories"]
            })
        }

        else if (ownProps.currentAnnotation === "week") {
            return ({
                task_data: state["currentWeekTask"],
                categories: state["categories"]
            })
        }

        return ({
            task_data: state["currentMonthTask"],
            categories: state["categories"]
        })
    }

    return {
        categories: state["categories"]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    if (ownProps.currentAnnotation === "day") {
        return ({
            updateTaskCategory: (data) => dispatch(updateTaskCategory("UPDATE_NEW_DAY_TASK", data))
        })
    }

    else if (ownProps.currentAnnotation === "week") {
        return ({
            updateTaskCategory: (data) => dispatch(updateTaskCategory("UPDATE_NEW_WEEK_TASK", data))
        })
    }

    else {
        return ({
            updateTaskCategory: (data) => dispatch(updateTaskCategory("UPDATE_NEW_MONTH_TASK", data))
        })
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category)