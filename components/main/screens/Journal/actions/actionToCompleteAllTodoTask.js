
export const actionToCompleteAllTodoTask = ({id, title, completed}) => {
    
    return  {
        type: 'ACTION_COMPLETE_ALL_TODO',
        id,
        title,
        completed
    }
}