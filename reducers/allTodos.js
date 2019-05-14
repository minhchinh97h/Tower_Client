
export const allTodos = (state= [], action) => {
    switch (action.type) {
        case 'ADD_ALL_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    title: action.title,
                    completed: false
                }
            ]

        case 'ACTION_COMPLETE_ALL_TODO':
            state.forEach((todo, index, arr) => {
                if(todo.id === action.id)
                    arr.splice(index, 1)
            })

            var newState = state.map(todo => {return todo})

            return newState
        

        case 'ACTION_UNCOMPLETE_ALL_TODO':
            return [
                ...state,
                action
            ]
        default:
            return state
    }
}
