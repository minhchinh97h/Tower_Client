import { connect } from 'react-redux'
import TaskDetailModal from './TaskDetailModal'

import {
    updateTask,
    deleteTask
} from '../actions/taskAction'

import { updateCategory } from '../actions/categoryAction'

const mapStateToProps = (state) => ({
    categories: state.categories,
    priorities: state.priorities,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateEdittingTask: (data) => dispatch(updateTask(ownProps.action_type, data)),

    deleteTask: (type, data) => dispatch(deleteTask(type, data)),
    deleteCompletedTask: (type, data) => dispatch(deleteTask(type, data)),
    updateCategory: (id, data) => dispatch(updateCategory(id, data))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskDetailModal)