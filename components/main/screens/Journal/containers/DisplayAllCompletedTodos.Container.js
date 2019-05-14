import {connect} from 'react-redux'
import {actionToUncompleteAllTodoTask} from '../actions/actionToUncompleteAllTodoTask'
import DisplayAllCompletedTodos from '../components/DisplayAllCompletedTodos.Presesntational'


const mapStateToProps = (state) => ({
    allCompletedTodos: state.allCompletedTodos
})

const mapDispatchToProps = (dispatch) => ({
    ActionToUncompleteAllTodoTask: todo => dispatch(actionToUncompleteAllTodoTask(todo))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplayAllCompletedTodos)