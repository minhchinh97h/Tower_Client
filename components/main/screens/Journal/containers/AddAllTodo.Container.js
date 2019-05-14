import {connect} from 'react-redux'
import {addTodoToAll} from '../actions/addAllTodo'
import AddAllTodo from '../components/AddAllTodo.Presentational'

const mapDispatchToProps = (dispatch, ownProps) => ({
    addTodoToAll: (title) => dispatch(addTodoToAll(title))
})

export default connect(
    null,
    mapDispatchToProps
)(AddAllTodo)