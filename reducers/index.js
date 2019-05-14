import {combineReducers} from 'redux'
import {allTodos} from './allTodos'
import {allCompletedTodos} from './allCompletedTodos'
import {currentRoute} from './currentRoute'

const rootReducer = combineReducers({
    allTodos,
    allCompletedTodos,
    currentRoute
})

export default rootReducer