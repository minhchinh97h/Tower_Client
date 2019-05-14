import {connect} from 'react-redux'
import {actionToCompleteAllTodoTask} from '../actions/actionToCompleteAllTodoTask'
import DisplayAllTodos from '../components/DisplayAllTodos.Presentational'

const mapStateToProps = (state) => ({
    allTodos : state.allTodos
})

const mapDispatchToProps = (dispatch) => ({
    ActionToCompleteAllTodoTask: (todo) => {
        dispatch(actionToCompleteAllTodoTask(todo))
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplayAllTodos)