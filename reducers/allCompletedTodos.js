export const allCompletedTodos = (state= [], action) => {
    switch(action.type){
        case 'ACTION_COMPLETE_ALL_TODO':
            return [...state,
                action
            ]
        
        case 'ACTION_UNCOMPLETE_ALL_TODO':
            state.forEach((todo, index, arr) => {
                if(todo.id === action.id)
                    arr.splice(index, 1)
            })

            let newState = state.map(todo => {return todo})

            return newState

        default:
            return state
    }
}